'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Trip = {
    id: string
    title: string
    destination: string
    start_date: string
    end_date: string
    total_cost: number
    num_people: number
}

export default function DashboardPage() {
    const router = useRouter()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data: userData } = await supabase
                .from('users')
                .select('name')
                .eq('id', user.id)
                .single()

            if (userData) setUserName(userData.name)

            const { data: tripsData } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('start_date', { ascending: false })

            if (tripsData) setTrips(tripsData)
            setLoading(false)
        }

        init()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">{userName}さんの旅行記録</h1>
                    <button onClick={handleLogout} className="text-sm text-gray-500 underline">
                        ログアウト
                    </button>
                </div>

                <Link href="/trips/new">
                    <button className="mb-6 bg-black text-white px-4 py-2 rounded">
                        + 旅行を追加
                    </button>
                </Link>

                {trips.length === 0 ? (
                    <p className="text-gray-500">まだ旅行が登録されていません</p>
                ) : (
                    <div className="space-y-4">
                        {trips.map(trip => (
                            <Link key={trip.id} href={`/trips/${trip.id}`}>
                                <div className="border rounded p-4 hover:bg-gray-50 cursor-pointer">
                                    <h2 className="font-bold text-lg">{trip.title}</h2>
                                    <p className="text-gray-600">{trip.destination}</p>
                                    <p className="text-sm text-gray-400">{trip.start_date} 〜 {trip.end_date}</p>
                                    <p className="text-sm mt-1">合計: ¥{trip.total_cost.toLocaleString()} / {trip.num_people}人</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}