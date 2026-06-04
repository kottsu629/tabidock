'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import NewTripModal from '@/components/NewTripModal'

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
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <p style={{ color: '#6b7280' }}>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>{userName}さんの旅行記録</h1>
          <button
            onClick={handleLogout}
            className="text-sm transition hover:opacity-70"
            style={{ color: '#6b7280' }}
          >
            ログアウト
          </button>
        </div>

        {/* 追加ボタン */}
        <button
          onClick={() => setShowNewModal(true)}
          className="mb-6 px-5 py-2.5 text-sm font-semibold rounded-xl transition hover:opacity-90"
          style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
        >
          + 旅行を追加
        </button>

        {/* 旅行一覧 */}
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base mb-1" style={{ color: '#6b7280' }}>まだ旅行が登録されていません</p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>「旅行を追加」から最初の旅行を記録しましょう</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map(trip => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <div
                  className="rounded-2xl p-5 shadow-sm cursor-pointer transition hover:shadow-md"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-bold text-base mb-0.5" style={{ color: '#111827' }}>{trip.title}</h2>
                      <p className="text-sm" style={{ color: '#6b7280' }}>{trip.destination}（{trip.area}）</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{trip.start_date} 〜 {trip.end_date}　{trip.num_people}人</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>合計</p>
                      <p className="font-bold text-lg" style={{ color: '#111827' }}>¥{trip.total_cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewTripModal
          userId={userId}
          onClose={() => setShowNewModal(false)}
          onCreated={() => fetchTrips(userId)}
        />
      )}
    </div>
  )
}
