import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChartDatum, ExpenseGroup, GroupChartDatum } from '../types/expense'
import { articleColor, pickGroupColor } from '../utils/colors'
import { generateId } from '../utils/format'
import { normalizeGroups } from '../utils/migrate'
import { articleTotal, groupTotal } from '../utils/totals'

const STORAGE_KEY = 'repair-expenses'

function loadGroups(): ExpenseGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return normalizeGroups(JSON.parse(raw))
  } catch {
    return []
  }
}

export function useExpenses() {
  const [groups, setGroups] = useState<ExpenseGroup[]>(loadGroups)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  }, [groups])

  const total = useMemo(
    () => groups.reduce((sum, group) => sum + groupTotal(group), 0),
    [groups],
  )

  const groupChartData = useMemo<GroupChartDatum[]>(
    () =>
      groups
        .map((group) => ({
          id: group.id,
          name: group.name,
          value: groupTotal(group),
          color: group.color,
        }))
        .filter((item) => item.value > 0),
    [groups],
  )

  const articleChartData = useMemo<ChartDatum[]>(() => {
    const data: ChartDatum[] = []
    for (const group of groups) {
      group.articles.forEach((article, index) => {
        const value = articleTotal(article)
        if (value <= 0) return
        data.push({
          id: article.id,
          name: article.name,
          groupName: group.name,
          label: `${group.name} · ${article.name}`,
          value,
          color: articleColor(group.color, index, group.articles.length),
        })
      })
    }
    return data
  }, [groups])

  const addGroup = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return false

    setGroups((prev) => [
      ...prev,
      {
        id: generateId(),
        name: trimmed,
        color: pickGroupColor(prev.length),
        articles: [],
      },
    ])
    return true
  }, [])

  const removeGroup = useCallback((groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }, [])

  const addArticle = useCallback((groupId: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return false

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              articles: [
                ...group.articles,
                { id: generateId(), name: trimmed, entries: [] },
              ],
            }
          : group,
      ),
    )
    return true
  }, [])

  const removeArticle = useCallback((groupId: string, articleId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              articles: group.articles.filter((a) => a.id !== articleId),
            }
          : group,
      ),
    )
  }, [])

  const addEntry = useCallback(
    (groupId: string, articleId: string, note: string, amount: number) => {
      if (amount <= 0) return false

      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                articles: group.articles.map((article) =>
                  article.id === articleId
                    ? {
                        ...article,
                        entries: [
                          ...article.entries,
                          {
                            id: generateId(),
                            note: note.trim(),
                            amount,
                            createdAt: new Date().toISOString(),
                          },
                        ],
                      }
                    : article,
                ),
              }
            : group,
        ),
      )
      return true
    },
    [],
  )

  const removeEntry = useCallback(
    (groupId: string, articleId: string, entryId: string) => {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                articles: group.articles.map((article) =>
                  article.id === articleId
                    ? {
                        ...article,
                        entries: article.entries.filter((e) => e.id !== entryId),
                      }
                    : article,
                ),
              }
            : group,
        ),
      )
    },
    [],
  )

  const clearAll = useCallback(() => {
    setGroups([])
  }, [])

  return {
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
  }
}
