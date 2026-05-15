import type { ExpenseGroup, LegacyExpenseItem } from '../types/expense'
import { generateId } from './format'

type RawGroup = ExpenseGroup & { items?: LegacyExpenseItem[] }

export function normalizeGroups(raw: unknown): ExpenseGroup[] {
  if (!Array.isArray(raw)) return []

  return raw.map((group): ExpenseGroup => {
    const g = group as RawGroup
    if (Array.isArray(g.articles)) {
      return {
        id: g.id,
        name: g.name,
        color: g.color,
        articles: g.articles.map((a) => ({
          id: a.id,
          name: a.name,
          entries: Array.isArray(a.entries) ? a.entries : [],
        })),
      }
    }

    const legacyItems = g.items ?? []
    return {
      id: g.id,
      name: g.name,
      color: g.color,
      articles: legacyItems.map((item) => ({
        id: item.id,
        name: item.title,
        entries: [
          {
            id: generateId(),
            note: '',
            amount: item.amount,
            createdAt: item.createdAt,
          },
        ],
      })),
    }
  })
}
