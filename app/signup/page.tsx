'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import AuthButton from '@/components/AuthButton'

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '6px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    const { error: insertError } = await supabase.from('users').insert({ id: data.user.id, name })
    if (insertError) { setError(insertError.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <AuthLayout>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        backgroundColor: 'rgba(99,102,241,0.2)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '100px', padding: '4px 12px',
        fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 500,
        marginBottom: '16px',
      }}>
        ✨ 登録無料
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.03em' }}>
        アカウントを作成
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '28px' }}>
        TripLog で旅の記録をはじめよう
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={labelStyle}>ニックネーム</label>
          <input type="text" placeholder="例：たろう" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>メールアドレス</label>
          <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>パスワード</label>
          <input type="password" placeholder="8文字以上" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        </div>
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

      <AuthButton onClick={handleSignup} loading={loading} label="無料ではじめる →" loadingLabel="登録中..." />

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: 600 }}>
          ログイン
        </Link>
      </p>
    </AuthLayout>
  )
}
