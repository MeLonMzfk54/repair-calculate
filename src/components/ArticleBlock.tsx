import { type FormEvent, useState } from 'react'
import type { ExpenseArticle } from '../types/expense'
import { formatCurrency } from '../utils/format'
import { articleTotal } from '../utils/totals'

interface ArticleBlockProps {
  article: ExpenseArticle
  groupId: string
  articleColor: string
  onRemoveArticle: (groupId: string, articleId: string) => void
  onAddEntry: (
    groupId: string,
    articleId: string,
    note: string,
    amount: number,
  ) => boolean,
    onEditEntry: (
        groupId: string,
        articleId: string,
        entryId: string,
        note: string,
        amount: number,
    ) => void,
  onRemoveEntry: (groupId: string, articleId: string, entryId: string) => void
}

export function ArticleBlock({
  article,
  groupId,
  articleColor,
  onRemoveArticle,
  onAddEntry,
  onRemoveEntry,
    onEditEntry,
}: ArticleBlockProps) {
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')
    const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedNote, setEditedNote] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');


  const sum = articleTotal(article)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (onAddEntry(groupId, article.id, note, parsed)) {
      setNote('')
      setAmount('')
    }
  }

  return (
    <section
      className="article-block"
      style={{ '--article-color': articleColor } as React.CSSProperties}
    >
      <header className="article-header">
        <span className="article-marker" aria-hidden />
        <h4 className="article-name">{article.name}</h4>
        <span className="article-sum">{formatCurrency(sum)}</span>
        <button
          type="button"
          className="btn-icon btn-icon-sm"
          onClick={() => onRemoveArticle(groupId, article.id)}
          title="Удалить статью"
          aria-label={`Удалить статью ${article.name}`}
        >
          ×
        </button>
      </header>

      <ul className="expense-list expense-list-nested">
        {article.entries.length === 0 ? (
          <li className="expense-empty">Нет позиций расхода</li>
        ) : (
          article.entries.map((entry) => (
            <li key={entry.id} className="expense-item">
                {
                    isEditing ? (
                        <div>
                            <input type="text" value={editedNote} onChange={(e) => setEditedNote(e.target.value)}/>
                            <input type="text" value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)}/>
                            <div onClick={() => {
                                setIsEditing(false);
                                setEditedNote('');
                                setEditedAmount('');
                                onEditEntry(groupId, article.id, entry.id, editedNote, +editedAmount)
                            }}>сохранить</div>
                        </div>
                    ) : (
                        <>
                    <span className="expense-title">
                        {entry.note || 'Без комментария'}
                    </span>
                            <span className="expense-amount">{formatCurrency(entry.amount)}</span>
                        </>
                    )
                }
                <button
                    type="button"
                    className="btn-icon btn-icon-sm"
                    onClick={() => {
                        setIsEditing(!isEditing);
                        if (!isEditing) {
                            setEditedNote('');
                            setEditedAmount('');
                        }
                    }}
                    title="Редактировать"
                    aria-label="Редактировать позицию"
                >
                    🖊️
                </button>
              <button
                type="button"
                className="btn-icon btn-icon-sm"
                onClick={() => onRemoveEntry(groupId, article.id, entry.id)}
                title="Удалить"
                aria-label="Удалить позицию"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input input-sm"
          placeholder="Комментарий (необяз.)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={80}
        />
        <input
          type="text"
          inputMode="decimal"
          className="input input-sm input-amount"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-secondary btn-sm"
          disabled={!amount.trim()}
        >
          +
        </button>
      </form>
    </section>
  )
}
