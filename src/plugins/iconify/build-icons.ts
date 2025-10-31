import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'url'

// สร้าง __dirname สำหรับ ES module
const __dirname = dirname(fileURLToPath(import.meta.url))

// ไฟล์ CSS ที่จะบันทึก
const target = join(__dirname, 'icons.css')

// ตัวอย่างไอคอน manual (ชื่อเป็น string[])
const allIcons = [
  {
    prefix: 'custom',
    icons: ['home', 'user', 'settings', 'search'],
  },
]

;(async function buildIcons() {
  try {
    // สร้าง directory ถ้ายังไม่มี
    await fs.mkdir(dirname(target), { recursive: true })

    // สร้าง CSS แบบง่าย ๆ
    const cssContent = allIcons
      .map(set => set.icons.map(name => `.${set.prefix}-${name}::before { content: "${name}"; }`).join('\n'))
      .join('\n')

    // เขียนไฟล์
    await fs.writeFile(target, cssContent, 'utf8')

    console.log(`Saved CSS to ${target}!`)
  } catch (err) {
    console.error(err)
  }
})()
