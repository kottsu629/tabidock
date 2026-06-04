'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4c1d95 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-geist-sans), -apple-system, sans-serif',
    }}>
      {/* 背景の装飾 */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ロゴ */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>✈️</span>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#ffffff', letterSpacing: '-0.03em' }}>TripLog</span>
      </Link>

      {/* カード */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        padding: '36px',
        backdropFilter: 'blur(20px)',
        position: 'relative',
      }}>
        {/* バッジ */}
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
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ニックネーム
            </label>
            <input
              type="text"
              placeholder="例：たろう"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              パスワード
            </label>
            <input
              type="password"
              placeholder="8文字以上"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            backgroundColor: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#fca5a5', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}
        >
          {loading ? '登録中...' : '無料ではじめる →'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: 600 }}>
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}
