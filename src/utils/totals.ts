import type { ExpenseArticle, ExpenseGroup } from '../types/expense'

export function articleTotal(article: ExpenseArticle): number {
  return article.entries.reduce((sum, e) => sum + e.amount, 0)
}

export function groupTotal(group: ExpenseGroup): number {
  return group.articles.reduce((sum, a) => sum + articleTotal(a), 0)
}
