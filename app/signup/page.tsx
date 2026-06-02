'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSignup = async () => {
        setLoading(true)
        setError(null)

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

        if (signUpError || !data.user) {
            setError(signUpError?.message ?? 'エラーが発生しました')
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert({ id: data.user.id, name })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm space-y-4 p-8">
                <h1 className="text-2xl font-bold">サインアップ</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="text"
                    placeholder="名前"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
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
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded"
                >
                    {loading ? '登録中...' : 'アカウント作成'}
                </button>

                <p className="text-sm text-center">
                    すでにアカウントをお持ちの方は
                    <Link href="/login" className="underline ml-1">ログイン</Link>
                </p>
            </div>
        </div>
    )
}