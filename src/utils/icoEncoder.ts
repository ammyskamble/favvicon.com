/**
 * Pure client-side binary ICO encoder.
 * Packs multiple PNG buffers (e.g. 16x16, 32x32, 48x48) into a valid multi-resolution
 * Windows/Web ICO container compliant with modern browser and OS standards.
 */

export interface IcoImageEntry {
  width: number;
  height: number;
  data: Uint8Array;
}

export function encodeIco(images: IcoImageEntry[]): Blob {
  const count = images.length;
  // Header: 6 bytes
  // Directory entries: 16 bytes per image
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalDirSize = headerSize + count * dirEntrySize;

  let totalDataSize = 0;
  for (const img of images) {
    totalDataSize += img.data.length;
  }

  const totalSize = totalDirSize + totalDataSize;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // 1. ICONDIR Header
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Image type (1 = ICO, 2 = CUR)
  view.setUint16(4, count, true); // Number of images

  // 2. Directory Entries & 3. Image Data
  let currentOffset = totalDirSize;

  for (let i = 0; i < count; i++) {
    const img = images[i];
    const entryOffset = headerSize + i * dirEntrySize;

    // Width (1 byte, 0 = 256)
    const w = img.width >= 256 ? 0 : img.width;
    // Height (1 byte, 0 = 256)
    const h = img.height >= 256 ? 0 : img.height;

    buffer[entryOffset] = w;
    buffer[entryOffset + 1] = h;
    buffer[entryOffset + 2] = 0; // Number of colors in color palette (0 = no palette)
    buffer[entryOffset + 3] = 0; // Reserved (must be 0)

    view.setUint16(entryOffset + 4, 1, true); // Color planes (1)
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel (32 bpp for RGBA PNG)
    view.setUint32(entryOffset + 8, img.data.length, true); // Image size in bytes
    view.setUint32(entryOffset + 12, currentOffset, true); // Offset of image data from beginning of file

    // Copy PNG bytes into data section
    buffer.set(img.data, currentOffset);
    currentOffset += img.data.length;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}

/**
 * Resizes a source image onto a canvas of specific dimensions and extracts PNG Uint8Array
 */
export async function canvasToPngBuffer(
  source: CanvasImageSource,
  size: number
): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, size, size);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas toBlob failed'));
      blob.arrayBuffer().then((ab) => resolve(new Uint8Array(ab))).catch(reject);
    }, 'image/png');
  });
}
