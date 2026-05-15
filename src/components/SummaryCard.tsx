import { formatCurrency } from '../utils/format'

interface SummaryCardProps {
  total: number
  groupCount: number
  articleCount: number
  entryCount: number
}

export function SummaryCard({
  total,
  groupCount,
  articleCount,
  entryCount,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <p className="summary-label">Общая сумма расходов</p>
      <p className="summary-total">{formatCurrency(total)}</p>
      <div className="summary-meta">
        <span>{groupCount} групп</span>
        <span className="summary-dot" aria-hidden />
        <span>{articleCount} статей</span>
        <span className="summary-dot" aria-hidden />
        <span>{entryCount} позиций</span>
      </div>
    </div>
  )
}
