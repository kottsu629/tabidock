import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'var(--font-geist-sans), -apple-system, sans-serif' }}>

      {/* ナビゲーション */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>✈️</span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.03em' }}>TripLog</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link href="/login" style={{
              fontSize: '0.875rem', fontWeight: 500, color: '#374151',
              textDecoration: 'none', padding: '8px 18px',
              border: '1px solid #e2e8f0', borderRadius: '9px',
              backgroundColor: '#ffffff',
            }}>
              ログイン
            </Link>
            <Link href="/signup" style={{
              fontSize: '0.875rem', fontWeight: 600, color: '#ffffff',
              textDecoration: 'none', padding: '8px 18px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4c1d95 100%)',
        padding: '100px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景の装飾円 */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
          {/* バッジ */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '100px', padding: '6px 16px',
            fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500,
            marginBottom: '28px',
          }}>
            <span>✨</span> 旅行費用の管理をもっとシンプルに
          </div>

          {/* メインコピー */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
          }}>
            旅の思い出を、<br />
            <span style={{
              background: 'linear-gradient(90deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              もっとスマートに。
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.75,
            marginBottom: '44px',
            maxWidth: '560px',
            margin: '0 auto 44px',
          }}>
            行き先・日程・費用をまとめて記録。<br />
            カテゴリ別の内訳から1人あたりの金額まで、<br />
            旅のお金を一目で把握できます。
          </p>

          {/* CTAボタン */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff', fontWeight: 700, fontSize: '1rem',
              borderRadius: '12px', textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}>
              無料ではじめる →
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#e2e8f0', fontWeight: 600, fontSize: '1rem',
              borderRadius: '12px', textDecoration: 'none',
            }}>
              ログイン
            </Link>
          </div>

          {/* 小さな補足 */}
          <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#475569' }}>
            登録無料・クレジットカード不要
          </p>
        </div>

        {/* ダッシュボードのプレビューイメージ（カード模倣） */}
        <div style={{ maxWidth: '680px', margin: '64px auto 0', perspective: '1000px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '24px',
            transform: 'rotateX(4deg)',
            backdropFilter: 'blur(10px)',
          }}>
            {/* フェイクUI */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {[
                { title: '沖縄旅行', dest: '那覇市・沖縄県', amount: '¥148,000', color: '#6366f1' },
                { title: '京都旅行', dest: '京都市・京都府', amount: '¥62,500', color: '#8b5cf6' },
                { title: '北海道旅行', dest: '札幌市・北海道', amount: '¥210,000', color: '#06b6d4' },
              ].map(card => (
                <div key={card.title} style={{
                  flex: 1, backgroundColor: 'rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '14px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ height: '3px', backgroundColor: card.color, borderRadius: '2px', marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{card.title}</p>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px' }}>📍 {card.dest}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{card.amount}</p>
                </div>
              ))}
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Features
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              旅のお金管理に必要な機能が<br />全部そろってる
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              複雑な設定は不要。旅行を登録して、費用を追加するだけ。
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {[
              {
                emoji: '✈️',
                title: '旅行を一元管理',
                desc: '行き先・日程・人数をまとめて記録。複数の旅行もすっきり整理できます。',
                color: '#eff6ff', accent: '#3b82f6',
              },
              {
                emoji: '💰',
                title: 'カテゴリ別に記録',
                desc: '交通費・宿泊・食費・観光など、費用をカテゴリ別に分類して把握。',
                color: '#fefce8', accent: '#eab308',
              },
              {
                emoji: '👥',
                title: '1人あたりを自動計算',
                desc: '人数を入力するだけで1人あたりの金額を自動計算。割り勘もすぐわかる。',
                color: '#f0fdf4', accent: '#22c55e',
              },
              {
                emoji: '📋',
                title: '旅行履歴を振り返り',
                desc: '過去の旅行費用がいつでも確認できます。次の旅の予算計画にも役立てて。',
                color: '#fdf4ff', accent: '#a855f7',
              },
            ].map(feature => (
              <div key={feature.title} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  backgroundColor: feature.color,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', marginBottom: '18px',
                }}>
                  {feature.emoji}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section style={{ padding: '96px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '56px' }}>
            3ステップではじめられる
          </h2>

          <div style={{ display: 'flex', gap: '0', flexDirection: 'column', maxWidth: '480px', margin: '0 auto' }}>
            {[
              { step: '01', title: 'アカウントを作成', desc: 'メールアドレスとパスワードで無料登録。30秒で完了します。', emoji: '📝' },
              { step: '02', title: '旅行を登録する', desc: 'タイトル・行き先・日程・人数を入力して旅行を作成。', emoji: '🗺️' },
              { step: '03', title: '費用を記録する', desc: 'カテゴリを選んで金額を追加するだけ。合計は自動で計算されます。', emoji: '💳' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', textAlign: 'left', marginBottom: i < 2 ? '0' : '0' }}>
                {/* ライン */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: '#ffffff',
                  }}>
                    {item.step}
                  </div>
                  {i < 2 && <div style={{ width: '2px', height: '48px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />}
                </div>

                <div style={{ paddingTop: '10px', paddingBottom: i < 2 ? '40px' : '0' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{item.emoji}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section style={{
        padding: '96px 24px',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌏</div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.04em', marginBottom: '16px',
          }}>
            さあ、次の旅の準備を<br />はじめよう。
          </h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.7 }}>
            TripLogで旅行費用の管理をシンプルに。<br />
            無料で使えるので、まずは試してみてください。
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#ffffff', fontWeight: 700, fontSize: '1.05rem',
            borderRadius: '14px', textDecoration: 'none',
            boxShadow: '0 12px 40px rgba(99,102,241,0.5)',
          }}>
            無料ではじめる →
          </Link>
          <p style={{ marginTop: '16px', fontSize: '0.8rem', color: '#475569' }}>
            登録無料・クレジットカード不要
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '32px 24px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>✈️</span>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>TripLog</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
          © 2026 TripLog. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
