'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm space-y-4 p-8">
                <h1 className="text-2xl font-bold">ログイン</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded"
                >
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>

                <p className="text-sm text-center">
                    アカウントをお持ちでない方は
                    <Link href="/signup" className="underline ml-1">サインアップ</Link>
                </p>
            </div>
        </div>
    )
}