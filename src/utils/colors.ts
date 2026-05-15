export const GROUP_COLORS = [
  '#f59e0b',
  '#14b8a6',
  '#6366f1',
  '#ec4899',
  '#22c55e',
  '#3b82f6',
  '#ef4444',
  '#a855f7',
] as const

export function pickGroupColor(index: number): string {
  return GROUP_COLORS[index % GROUP_COLORS.length]
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`
}

/** Lighten (factor > 1) or darken (factor < 1) a hex color */
export function shadeColor(hex: string, factor: number): string {
  const [r, g, b] = parseHex(hex)
  return toHex(r * factor, g * factor, b * factor)
}

export function articleColor(
  groupColor: string,
  articleIndex: number,
  articleCount: number,
): string {
  if (articleCount <= 1) return groupColor
  const t = 0.72 + (articleIndex / Math.max(articleCount - 1, 1)) * 0.45
  return shadeColor(groupColor, t)
}
