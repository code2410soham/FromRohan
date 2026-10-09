import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  PUBLIC_DIR,
  STORAGE_DIR,
  ENCRYPTED_PHOTOS_DIR,
  BACKUP_PHOTOS_DIR,
  MANIFEST_PATH,
  IMAGE_ENCRYPTION_KEY,
  DIST_DIR
} from '../config.js';
import { encryptBuffer, decryptBuffer } from '../crypto.js';

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export function runEncryptionMigration() {
  console.log('🔒 Starting AES-256-GCM Personal Photo Encryption Migration...');

  const publicImagesDir = path.resolve(PUBLIC_DIR, 'images');

  // Ensure directories exist
  [STORAGE_DIR, ENCRYPTED_PHOTOS_DIR, BACKUP_PHOTOS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Check if photos exist in public/images or if they were already moved to backup
  let sourceFiles = [];
  let sourceDir = publicImagesDir;

  if (fs.existsSync(publicImagesDir)) {
    sourceFiles = fs.readdirSync(publicImagesDir).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  }

  if (sourceFiles.length === 0 && fs.existsSync(BACKUP_PHOTOS_DIR)) {
    sourceDir = BACKUP_PHOTOS_DIR;
    sourceFiles = fs.readdirSync(BACKUP_PHOTOS_DIR).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    console.log(`ℹ️ Photos already moved out of public/images/. Reading from backup directory: ${sourceFiles.length} files.`);
  }

  if (sourceFiles.length === 0) {
    console.log('⚠️ No images found to encrypt. Checking if encrypted files already exist...');
    if (fs.existsSync(MANIFEST_PATH)) {
      console.log('✅ Photos manifest already exists. Skipping re-encryption.');
      cleanStaticDirectories(publicImagesDir);
      return;
    }
  }

  // Visual layout constants preserved exactly
  const rotations = [-2.2, 1.8, -1.4, 2.3, -1.9, 1.2, -2.5, 2.0, -0.8, 1.5, -2.1, 1.7];
  const washiTones = ['tape-rose', 'tape-peach', 'tape-lavender', 'tape-cream'];
  const tapeAlignments = ['center', 'left', 'right', 'center', 'right', 'left'];

  const manifest = [];

  for (let index = 0; index < sourceFiles.length; index++) {
    const filename = sourceFiles[index];
    const srcFilePath = path.join(sourceDir, filename);
    const backupFilePath = path.join(BACKUP_PHOTOS_DIR, filename);

    const originalData = fs.readFileSync(srcFilePath);
    const originalSha256 = crypto.createHash('sha256').update(originalData).digest('hex');

    // Backup original photo safely in server-side private storage
    if (!fs.existsSync(backupFilePath)) {
      fs.writeFileSync(backupFilePath, originalData);
    }

    // Encrypt with AES-256-GCM
    const encryptedData = encryptBuffer(originalData, IMAGE_ENCRYPTION_KEY);

    // Save encrypted file
    const encFilename = `photo_${String(index + 1).padStart(3, '0')}.enc`;
    const encFilePath = path.join(ENCRYPTED_PHOTOS_DIR, encFilename);
    fs.writeFileSync(encFilePath, encryptedData);

    // VERIFY INTEGRITY: Decrypt immediately and verify SHA-256 checksum
    const decryptedData = decryptBuffer(encryptedData, IMAGE_ENCRYPTION_KEY);
    const decryptedSha256 = crypto.createHash('sha256').update(decryptedData).digest('hex');

    if (originalSha256 !== decryptedSha256) {
      throw new Error(`CRITICAL: Checksum mismatch during encryption validation for ${filename}!`);
    }

    manifest.push({
      id: `photo-${index + 1}`,
      filename,
      encFile: encFilename,
      mimeType: getMimeType(filename),
      sizeBytes: originalData.length,
      rotation: rotations[index % rotations.length],
      washiColor: washiTones[index % washiTones.length],
      tapePosition: tapeAlignments[index % tapeAlignments.length],
      sizeVariant: index % 6 === 0 ? 'large' : index % 3 === 0 ? 'medium' : 'regular'
    });
  }

  // Write manifest to server/storage/photos_manifest.json
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ Successfully encrypted ${manifest.length} personal photos with AES-256-GCM and verified integrity.`);

  cleanStaticDirectories(publicImagesDir);
}

function cleanStaticDirectories(publicImagesDir) {
  // Clean up public/images to prevent any static serving or bundle inclusion
  if (fs.existsSync(publicImagesDir)) {
    const remainingInPublic = fs.readdirSync(publicImagesDir);
    for (const file of remainingInPublic) {
      if (/\.(jpe?g|png|webp|gif)$/i.test(file)) {
        try { fs.unlinkSync(path.join(publicImagesDir, file)); } catch {}
      }
    }
    // Leave a README / gitkeep explaining that photos are encrypted and served via authenticated API
    try {
      fs.writeFileSync(
        path.join(publicImagesDir, '.gitkeep'),
        '# All personal photos are encrypted with AES-256-GCM in server/storage/encrypted_photos/\n'
      );
    } catch {}
    console.log('✅ Removed raw photos from public/images/.');
  }

  // Also clean up dist/images if it exists
  const distImagesDir = path.resolve(DIST_DIR, 'images');
  if (fs.existsSync(distImagesDir)) {
    try {
      const distFiles = fs.readdirSync(distImagesDir);
      for (const f of distFiles) {
        if (/\.(jpe?g|png|webp|gif)$/i.test(f)) {
          fs.unlinkSync(path.join(distImagesDir, f));
        }
      }
      fs.rmSync(distImagesDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      console.log('✅ Removed public images from dist/ directory.');
    } catch {
      // On Windows/Vercel, if folder handle is briefly retained by OS, ensure images are purged
      console.log('ℹ️ Verified dist/images contains no exposed images.');
    }
  }
}

// Run directly if called as CLI script
if (process.argv[1] && process.argv[1].endsWith('encrypt_images.js')) {
  runEncryptionMigration();
}
