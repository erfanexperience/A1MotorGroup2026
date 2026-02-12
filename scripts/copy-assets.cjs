const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const source = path.join(root, 'Assests')
const dest = path.join(root, 'public', 'Assests')

if (!fs.existsSync(source)) {
  console.warn('Assests folder not found at project root. Create it and add logo.webp, Hero.webp, Sell.webp, and Cars/2021 Toyota 4Runner/ images.')
  process.exit(0)
}

fs.mkdirSync(path.join(root, 'public'), { recursive: true })
copyRecursive(source, dest)
console.log('Assets copied to public/Assests')

function copyRecursive(src, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name)
    const destPath = path.join(destDir, name)
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
