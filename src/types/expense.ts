export interface ExpenseEntry {
  id: string
  note: string
  amount: number
  createdAt: string
}

export interface ExpenseArticle {
  id: string
  name: string
  entries: ExpenseEntry[]
}

export interface ExpenseGroup {
  id: string
  name: string
  color: string
  articles: ExpenseArticle[]
}

export interface ChartDatum {
  id: string
  name: string
  groupName: string
  label: string
  value: number
  color: string
}

export interface GroupChartDatum {
  id: string
  name: string
  value: number
  color: string
}

/** @deprecated legacy flat items — used only for migration */
export interface LegacyExpenseItem {
  id: string
  title: string
  amount: number
  createdAt: string
}
