import fs from 'fs';
import path from 'path';

try {
  const srcDir = '/home/chakresh/.gemini/antigravity/brain/4693964e-8d13-4ccc-ae36-cb0877ec441b';
  const destDir = '/home/chakresh/The-Paddle-Club/apps/public-website/public';
  
  const filesToCopy = [
    { src: 'cafe_interior_1784264434746.png', dest: 'cafe_interior.png' },
    { src: 'cafe_dish_1784264447984.png', dest: 'cafe_dish.png' }
  ];

  filesToCopy.forEach(file => {
    const srcPath = path.join(srcDir, file.src);
    const destPath = path.join(destDir, file.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Asset Setup] Copied ${file.src} to ${file.dest}`);
    }
  });
} catch (err) {
  console.error('[Asset Setup] Error:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paddle-club/ui", "@paddle-club/feature-flags"],
  reactStrictMode: true
};

export default nextConfig;
