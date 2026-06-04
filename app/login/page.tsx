'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
}

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
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <AuthLayout>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.03em' }}>
        おかえりなさい
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '28px' }}>
        TripLog にログインする
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={inputStyle}
        />
      </div>

      {error && (
        <div style={{
          marginTop: '12px', padding: '10px 14px',
          backgroundColor: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#fca5a5', margin: 0 }}>{error}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: '100%', marginTop: '20px', padding: '13px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', borderRadius: '12px',
          color: '#ffffff', fontSize: '0.95rem', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        }}
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
        アカウントをお持ちでない方は{' '}
        <Link href="/signup" style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: 600 }}>
          新規登録
        </Link>
      </p>
    </AuthLayout>
  )
}
