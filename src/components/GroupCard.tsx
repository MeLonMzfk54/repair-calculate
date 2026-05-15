import { type FormEvent, useState } from 'react'
import type { ExpenseGroup } from '../types/expense'
import { articleColor as getArticleColor } from '../utils/colors'
import { formatCurrency } from '../utils/format'
import { groupTotal } from '../utils/totals'
import { ArticleBlock } from './ArticleBlock'

interface GroupCardProps {
  group: ExpenseGroup
  grandTotal: number
  onAddArticle: (groupId: string, name: string) => boolean
  onRemoveGroup: (groupId: string) => void
  onRemoveArticle: (groupId: string, articleId: string) => void
  onAddEntry: (
    groupId: string,
    articleId: string,
    note: string,
    amount: number,
  ) => boolean
  onRemoveEntry: (groupId: string, articleId: string, entryId: string) => void
}

export function GroupCard({
  group,
  grandTotal,
  onAddArticle,
  onRemoveGroup,
  onRemoveArticle,
  onAddEntry,
  onRemoveEntry,
}: GroupCardProps) {
  const [articleName, setArticleName] = useState('')

  const groupSum = groupTotal(group)
  const percent = grandTotal > 0 ? Math.round((groupSum / grandTotal) * 100) : 0

  const handleAddArticle = (e: FormEvent) => {
    e.preventDefault()
    if (onAddArticle(group.id, articleName)) setArticleName('')
  }

  return (
    <article
      className="group-card"
      style={{ '--group-color': group.color } as React.CSSProperties}
    >
      <header className="group-header">
        <div className="group-title-row">
          <span className="group-dot" aria-hidden />
          <h3 className="group-name">{group.name}</h3>
        </div>
        <div className="group-actions">
          <span className="group-sum">{formatCurrency(groupSum)}</span>
          {grandTotal > 0 && <span className="group-percent">{percent}%</span>}
          <button
            type="button"
            className="btn-icon"
            onClick={() => onRemoveGroup(group.id)}
            title="Удалить группу"
            aria-label={`Удалить группу ${group.name}`}
          >
            ×
          </button>
        </div>
      </header>

      <div className="articles-list">
        {group.articles.length === 0 ? (
          <p className="articles-empty">Добавьте статью расхода в этой группе</p>
        ) : (
          group.articles.map((article, index) => (
            <ArticleBlock
              key={article.id}
              groupId={group.id}
              article={article}
              articleColor={getArticleColor(
                group.color,
                index,
                group.articles.length,
              )}
              onRemoveArticle={onRemoveArticle}
              onAddEntry={onAddEntry}
              onRemoveEntry={onRemoveEntry}
            />
          ))
        )}
      </div>

      <form className="add-article-form" onSubmit={handleAddArticle}>
        <input
          type="text"
          className="input input-sm"
          placeholder="Новая статья (напр. Плитка)"
          value={articleName}
          onChange={(e) => setArticleName(e.target.value)}
          maxLength={60}
        />
        <button
          type="submit"
          className="btn btn-secondary btn-sm"
          disabled={!articleName.trim()}
        >
          Добавить статью
        </button>
      </form>
    </article>
  )
}
