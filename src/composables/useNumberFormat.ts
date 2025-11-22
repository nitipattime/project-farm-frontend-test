// src/composables/useNumberFormat.ts
export function useNumberFormat() {
  // 👉 ใส่ลูกน้ำ: 10000 → "10,000"
  const formatNumber = (value: number | string): string => {
    if (value === null || value === undefined) return ''
    const num = Number(String(value).replace(/,/g, ''))
    if (isNaN(num)) return ''

    return num.toLocaleString('en-US')
  }

  // 👉 เอาลูกน้ำออก: "10,000" → 10000
  const unformatNumber = (value: string | number): number => {
    if (value === null || value === undefined) return 0

    return Number(String(value).replace(/,/g, '')) || 0
  }

  return {
    formatNumber,
    unformatNumber,
  }
}
