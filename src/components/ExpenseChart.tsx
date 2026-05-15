import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartDatum, GroupChartDatum } from '../types/expense'
import { formatCurrency } from '../utils/format'

interface ExpenseChartProps {
  groupData: GroupChartDatum[]
  articleData: ChartDatum[]
}

function GroupTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-name">{item.name}</span>
      <span className="chart-tooltip-value">{formatCurrency(item.value)}</span>
    </div>
  )
}

function ArticleTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { value: number; payload: ChartDatum }[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-name">{item.groupName}</span>
      <span className="chart-tooltip-article">{item.name}</span>
      <span className="chart-tooltip-value">{formatCurrency(item.value)}</span>
    </div>
  )
}

export function ExpenseChart({ groupData, articleData }: ExpenseChartProps) {
  const hasData = groupData.length > 0 || articleData.length > 0

  if (!hasData) {
    return (
      <div className="chart-card chart-empty">
        <h2 className="form-title">График расходов</h2>
        <p>
          Добавьте статьи и позиции расходов, чтобы увидеть распределение
        </p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h2 className="form-title">График расходов</h2>
        <div className={'charts charts-grid'}>
            <div className="chart-block">
                <p className="chart-subtitle">По группам</p>
                {groupData.length === 0 ? (
                    <p className="chart-placeholder">Нет данных по группам</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={groupData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={82}
                                paddingAngle={3}
                            >
                                {groupData.map((entry) => (
                                    <Cell key={entry.id} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<GroupTooltip />} />
                            <Legend
                                formatter={(value) => (
                                    <span className="chart-legend-label">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="chart-block">
                <p className="chart-subtitle">Доля статей</p>
                {articleData.length === 0 ? (
                    <p className="chart-placeholder">Нет данных по статьям</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={articleData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={82}
                                paddingAngle={2}
                            >
                                {articleData.map((entry) => (
                                    <Cell key={entry.id} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<ArticleTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>

        <div className="chart-block chart-block-wide">
          <p className="chart-subtitle">По статьям внутри групп</p>
          {articleData.length === 0 ? (
            <p className="chart-placeholder">Добавьте статьи с суммами</p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(240, articleData.length * 36)}
            >
              <BarChart
                data={articleData}
                layout="vertical"
                margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatCurrency(Number(v))}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: 'var(--text)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ArticleTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {articleData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
  )
}
