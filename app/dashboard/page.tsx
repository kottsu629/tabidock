'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AppHeader from '@/components/AppHeader'
import NewTripModal from '@/components/NewTripModal'
import Modal from '@/components/Modal'

type Trip = {
  id: string
  title: string
  destination: string
  area: string
  start_date: string
  end_date: string
  total_cost: number
  num_people: number
  is_public: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTrips = async (uid: string) => {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', uid)
      .order('start_date', { ascending: false })
    if (data) setTrips(data)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data: userData } = await supabase
        .from('users').select('name').eq('id', user.id).single()
      if (userData) setUserName(userData.name)
      await fetchTrips(user.id)
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('trips').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    await fetchTrips(userId)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppHeader userName={userName} onLogout={handleLogout} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ページタイトル + 追加ボタン */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>旅行記録</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
              {trips.length > 0 ? `${trips.length}件の旅行` : '旅行を追加してみましょう'}
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '1rem' }}>+</span> 旅行を追加
          </button>
        </div>

        {/* 旅行一覧 */}
        {trips.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✈️</div>
            <p style={{ fontSize: '1rem', color: '#334155', fontWeight: 600, marginBottom: '6px' }}>
              旅行がまだ登録されていません
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              「旅行を追加」から最初の旅行を記録しましょう
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {trips.map(trip => (
              <div
                key={trip.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
              >
                <Link href={`/trips/${trip.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  {/* カードカラーバー */}
                  <div style={{ height: '4px', backgroundColor: '#6366f1' }} />

                  <div style={{ padding: '20px' }}>
                    {/* タイトル */}
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      {trip.title}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                      📍 {trip.destination}・{trip.area}
                    </p>

                    {/* 日付 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      marginBottom: '16px',
                    }}>
                      <span>📅</span>
                      <span>{trip.start_date} 〜 {trip.end_date}</span>
                      <span style={{
                        marginLeft: 'auto',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        color: '#64748b',
                      }}>
                        👥 {trip.num_people}人
                      </span>
                    </div>

                    {/* 金額 */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>合計金額</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                        ¥{trip.total_cost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* 削除ボタン（カード外・リンクの外） */}
                <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDeleteTarget(trip)}
                    style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fef2f2'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                    }}
                  >
                    🗑 削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 旅行追加モーダル */}
      {showNewModal && (
        <NewTripModal
          userId={userId}
          onClose={() => setShowNewModal(false)}
          onCreated={() => fetchTrips(userId)}
        />
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div style={{ padding: '32px' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>
              旅行を削除しますか？
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginBottom: '6px' }}>
              「{deleteTarget.title}」
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginBottom: '28px' }}>
              費用データも含めてすべて削除されます。この操作は取り消せません。
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
