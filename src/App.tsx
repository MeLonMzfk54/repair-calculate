import { useMemo } from 'react'
import { AddGroupForm } from './components/AddGroupForm'
import { ExpenseChart } from './components/ExpenseChart'
import { GroupCard } from './components/GroupCard'
import { SummaryCard } from './components/SummaryCard'
import { useExpenses } from './hooks/useExpenses'
import './App.css'

function App() {
  const {
    groups,
    total,
    groupChartData,
    articleChartData,
    addGroup,
    removeGroup,
    addArticle,
    removeArticle,
    addEntry,
    removeEntry,
    clearAll,
      editEntry,
  } = useExpenses()

  const { articleCount, entryCount } = useMemo(() => {
    let articles = 0
    let entries = 0
    for (const group of groups) {
      articles += group.articles.length
      for (const article of group.articles) {
        entries += article.entries.length
      }
    }
    return { articleCount: articles, entryCount: entries }
  }, [groups])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo" aria-hidden>
            🏗
          </span>
          <div>
            <h1 className="app-title">Учёт строительных расходов</h1>
            <p className="app-subtitle">
              Группы → статьи → позиции расходов с наглядной аналитикой
            </p>
          </div>
        </div>
        {groups.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={clearAll}>
            Очистить всё
          </button>
        )}
      </header>

      <main className="app-main">
        <section className="dashboard-top">
          <SummaryCard
            total={total}
            groupCount={groups.length}
            articleCount={articleCount}
            entryCount={entryCount}
          />
          <ExpenseChart
            groupData={groupChartData}
            articleData={articleChartData}
          />
        </section>

        <section className="dashboard-forms">
          <AddGroupForm onAdd={addGroup} />
        </section>

        <section className="groups-section">
          <h2 className="section-title">
            Группы расходов
            {groups.length > 0 && (
              <span className="section-badge">{groups.length}</span>
            )}
          </h2>

          {groups.length === 0 ? (
            <div className="empty-state">
              <p>
                Создайте первую группу — например «Материалы» или «Отделочные
                работы», затем добавьте статьи внутри неё
              </p>
            </div>
          ) : (
            <div className="groups-grid">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  grandTotal={total}
                  onAddArticle={addArticle}
                  onRemoveGroup={removeGroup}
                  onRemoveArticle={removeArticle}
                  onAddEntry={addEntry}
                  onRemoveEntry={removeEntry}
                  onEditEntry={editEntry}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        Данные сохраняются в браузере
      </footer>
    </div>
  )
}

export default App
