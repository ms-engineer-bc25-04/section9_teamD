'use client';

import { useState } from 'react';

// シンプルな警告アイコンSVG（react-icons不要）
function WarningIcon() {
  return (
    <svg height="40" width="40" viewBox="0 0 40 40" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="20" cy="20" r="19" stroke="#ffcf40" strokeWidth="2" fill="none" />
      <rect x="18.2" y="10" width="3.6" height="13" rx="1.5" fill="#ffcf40" />
      <circle cx="20" cy="28.5" r="2" fill="#ffcf40" />
    </svg>
  );
}

export default function CardRegisterPage() {
  const [showForm, setShowForm] = useState(false);
  const [registered, setRegistered] = useState(false);

  // 入力state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [cardName, setCardName] = useState('');

  // 登録ボタン押下
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setRegistered(true);
    // 入力値リセットしたい場合は下記を有効化
    // setCardNumber(''); setExpiryMonth(''); setExpiryYear(''); setSecurityCode(''); setCardName('');
  };

  // キャンセル
  const handleCancel = () => setShowForm(false);

  return (
    <div style={{ background: '#fcf6ea', minHeight: '100vh', padding: 24 }}>
      {/* ページタイトルとパンくず */}
      <div style={{ fontSize: 14, color: '#a79e86', marginBottom: 10 }}>
        <h1 className="text-xl font-bold mb-4 text-black">決済管理</h1>
      </div>
      {/* アプリ利用料金 */}
      <section
        style={{
          background: '#f5f5f5',
          borderRadius: 18,
          padding: '24px 0 12px',
          marginBottom: 32,
          border: '1.5px solid #f3ead2',
          maxWidth: 700,
          width: '100%',
          margin: '0 auto 32px',
          boxShadow: '0 2px 6px 0 #f2e8d8b8',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, marginLeft: 32, marginBottom: 10, color: '#6d6653' }}>アプリ利用料金</div>
        <div
          style={{
            background: '#f1f0ee',
            borderRadius: 12,
            padding: '24px 0',
            margin: '0 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, color: '#3b6bd4', fontWeight: 700, marginBottom: 4 }}>3,000円</div>
          <div style={{ color: '#958c79', fontSize: 15 }}>税込/月額料金</div>
          <div style={{ fontSize: 13, color: '#bba970', marginTop: 6 }}>
            ※決済時に消費税・初期登録費が加算
          </div>
        </div>
      </section>

      {/* クレジットカード登録（未登録時） */}
      <section
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 8px 0 #efe2c73c',
          maxWidth: 700,
          width: '100%',
          margin: '0 auto',
          padding: showForm ? '40px 30px 36px' : '40px 30px',
          border: '1.5px solid #f3ead2',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: '#6d6653', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, color: '#d4ac6e' }}>＝</span>
          クレジットカード登録
        </div>

        {/* ポップアップメッセージ */}
        {registered && !showForm && (
          <div style={{
            margin: '0 auto 28px', maxWidth: 400, textAlign: 'center',
            background: '#fffde7', border: '1.5px solid #ffecb3', borderRadius: 14, padding: '18px 8px', boxShadow: '0 2px 8px 0 #ffe7937c',
            position: 'relative',
          }}>
            <WarningIcon />
            <div style={{ fontWeight: 700, fontSize: 20, marginTop: 10, color: '#777230', letterSpacing: 1 }}>
              カードが登録されました！
            </div>
          </div>
        )}

        {/* 登録フォーム表示 */}
        {showForm ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#7a6a50', fontSize: 15 }}>カード番号</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                required
                style={{
                  width: '100%', marginTop: 6, marginBottom: 16, borderRadius: 8, border: '1.3px solid #e9dac3', padding: 12, fontSize: 16, background: '#fcf8ef'
                }}
                inputMode="numeric"
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, color: '#7a6a50', fontSize: 15 }}>有効期限(月/年)</label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <input
                      type="text"
                      placeholder="月"
                      value={expiryMonth}
                      onChange={e => setExpiryMonth(e.target.value)}
                      required
                      style={{
                        width: '60px', borderRadius: 8, border: '1.3px solid #e9dac3', padding: 10, fontSize: 15, background: '#fcf8ef'
                      }}
                      inputMode="numeric"
                      maxLength={2}
                    />
                    <span style={{ margin: '0 2px', color: '#c4b37e', fontWeight: 700, fontSize: 16 }}>/</span>
                    <input
                      type="text"
                      placeholder="年"
                      value={expiryYear}
                      onChange={e => setExpiryYear(e.target.value)}
                      required
                      style={{
                        width: '80px', borderRadius: 8, border: '1.3px solid #e9dac3', padding: 10, fontSize: 15, background: '#fcf8ef'
                      }}
                      inputMode="numeric"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, color: '#7a6a50', fontSize: 15 }}>セキュリティコード</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={securityCode}
                    onChange={e => setSecurityCode(e.target.value)}
                    required
                    style={{
                      width: '100%', borderRadius: 8, border: '1.3px solid #e9dac3', padding: 10, fontSize: 15, background: '#fcf8ef', marginTop: 4
                    }}
                    inputMode="numeric"
                    maxLength={4}
                  />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontWeight: 600, color: '#7a6a50', fontSize: 15 }}>カード名義人</label>
                <input
                  type="text"
                  placeholder="山田 太郎"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  required
                  style={{
                    width: '100%', marginTop: 6, borderRadius: 8, border: '1.3px solid #e9dac3', padding: 12, fontSize: 16, background: '#fcf8ef'
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#b39a7a', marginBottom: 18 }}>
              <span style={{ color: '#e76a6a', fontSize: 16, marginRight: 2 }}>●</span>
              入力情報のカード情報は登録ボタンを押すまでサーバには送信されません
            </div>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '8px 18px',
                  border: '1px solid #cfcfcf',
                  borderRadius: 8,
                  background: '#fff',
                  color: '#766c63',
                  fontWeight: 600,
                  fontSize: 15,
                  marginRight: 10,
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 22px',
                  border: 'none',
                  borderRadius: 8,
                  background: '#4167c2',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                カードを登録
              </button>
            </div>
          </form>
        ) : (
          // 登録済みの場合は「登録されました」ポップが最初に出る
          <>
            {!registered && (
              <div style={{ margin: '36px 0 26px', textAlign: 'center' }}>
                <WarningIcon />
                <div style={{ fontWeight: 600, marginTop: 10, color: '#7a6a50' }}>
                  クレジットカードが登録されていません。
                </div>
                <div style={{ color: '#d0c295', fontSize: 15, margin: '8px 0 18px' }}>
                  アプリの利用には、クレジットカード登録が必要です
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: '10px 26px',
                    border: 'none',
                    borderRadius: 8,
                    background: '#4167c2',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: '0 2px 6px #e2e7f8c2',
                    cursor: 'pointer',
                  }}
                >
                  クレジットカードの登録
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
