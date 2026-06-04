'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Trip = {
  id: string
  title: string
  destination: string
  area: string
  start_date: string
  end_date: string
  num_people: number
  total_cost: number
  is_public: boolean
}

type Expense = {
  id: string
  category: string
  title: string
  amount: number
}

type ExpenseCategory = '交通費' | '宿泊' | '食費' | '観光' | 'その他'

const CATEGORIES: ExpenseCategory[] = ['交通費', '宿泊', '食費', '観光', 'その他']

const CATEGORY_COLOR: Record<ExpenseCategory, string> = {
  '交通費': '#3b82f6',
  '宿泊':   '#8b5cf6',
  '食費':   '#f59e0b',
  '観光':   '#10b981',
  'その他': '#6b7280',
}

const inputClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: '交通費', title: '', amount: '' })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', id)
      .order('category')
    setExpenses(data ?? [])
  }

  const fetchTrip = async () => {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single()
    return data as Trip | null
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()])
      if (!tripData) { router.push('/dashboard'); return }
      setTrip(tripData)
      setLoading(false)
    }
    init()
  }, [id])

  const refresh = async () => {
    const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()])
    if (tripData) setTrip(tripData)
  }

  const handleAddExpense = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!form.title || !form.amount) return
    setAdding(true)
    const { error } = await supabase.from('expenses').insert({
      trip_id: id,
      category: form.category,
      title: form.title,
      amount: Number(form.amount),
    })
    setAdding(false)
    if (error) { setError(error.message); return }
    setForm(prev => ({ ...prev, title: '', amount: '' }))
    await refresh()
  }

  const handleDelete = async (expenseId: string) => {
    await supabase.from('expenses').delete().eq('id', expenseId)
    await refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <p style={{ color: '#6b7280' }}>読み込み中...</p>
      </div>
    )
  }

  if (!trip) return null

  const perPerson = Math.round(trip.total_cost / trip.num_people)
  const grouped = CATEGORIES.reduce<Record<string, Expense[]>>((acc, cat) => {
    acc[cat] = expenses.filter(e => e.category === cat)
    return acc
  }, {} as Record<string, Expense[]>)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* 戻るリンク */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition"
          style={{ color: '#6b7280' }}
        >
          ← ダッシュボードへ戻る
        </Link>

        {/* 旅行ヘッダー */}
        <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#111827' }}>{trip.title}</h1>
          <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
            {trip.destination}（{trip.area}）　{trip.start_date} 〜 {trip.end_date}
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#9ca3af' }}>合計金額</p>
              <p className="text-2xl font-bold" style={{ color: '#111827' }}>¥{trip.total_cost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#9ca3af' }}>{trip.num_people}人 / 1人あたり</p>
              <p className="text-2xl font-bold" style={{ color: '#111827' }}>¥{perPerson.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 費用追加フォーム */}
        <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#111827' }}>費用を追加</h2>
          <form onSubmit={handleAddExpense} className="flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>カテゴリ</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inputClass}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-32">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>内容</label>
              <input
                type="text"
                placeholder="例：航空券"
                required
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className={inputClass + ' w-full'}
              />
            </div>
            <div className="flex flex-col gap-1 w-28">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>金額（円）</label>
              <input
                type="number"
                placeholder="0"
                required
                min={0}
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className={inputClass + ' w-full'}
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 text-sm font-semibold rounded-xl transition disabled:opacity-50"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            >
              {adding ? '追加中...' : '+ 追加'}
            </button>
          </form>
          {error && <p className="text-sm mt-2" style={{ color: '#dc2626' }}>{error}</p>}
        </div>

        {/* 費用一覧 */}
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
            <h2 className="text-base font-bold" style={{ color: '#111827' }}>費用一覧</h2>
          </div>

          {expenses.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p style={{ color: '#9ca3af' }}>費用がまだ登録されていません</p>
            </div>
          ) : (
            <div>
              {CATEGORIES.filter(cat => grouped[cat].length > 0).map((cat, i, arr) => (
                <div key={cat}>
                  {/* カテゴリヘッダー */}
                  <div
                    className="px-6 py-2 flex items-center gap-2"
                    style={{ backgroundColor: '#f9fafb' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLOR[cat as ExpenseCategory] }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>{cat}</span>
                    <span className="ml-auto text-xs" style={{ color: '#6b7280' }}>
                      ¥{grouped[cat].reduce((s, e) => s + e.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  {/* 明細行 */}
                  {grouped[cat].map(exp => (
                    <div
                      key={exp.id}
                      className="px-6 py-3 flex items-center justify-between border-b"
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <span className="text-sm" style={{ color: '#374151' }}>{exp.title}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium" style={{ color: '#111827' }}>
                          ¥{exp.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-xs px-2 py-1 rounded-lg transition hover:opacity-80"
                          style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* カテゴリ間のスペーサー */}
                  {i < arr.length - 1 && <div className="h-px" style={{ backgroundColor: '#e5e7eb' }} />}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
