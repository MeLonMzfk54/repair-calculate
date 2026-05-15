import { type FormEvent, useState } from 'react'

interface AddGroupFormProps {
  onAdd: (name: string) => boolean
}

export function AddGroupForm({ onAdd }: AddGroupFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onAdd(name)) setName('')
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Новая группа</h2>
      <p className="form-hint">Например: материалы, работа, техника</p>
      <div className="form-row">
        <input
          type="text"
          className="input"
          placeholder="Название группы"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          Добавить
        </button>
      </div>
    </form>
  )
}
