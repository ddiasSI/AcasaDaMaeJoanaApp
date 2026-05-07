import React, { useState, useEffect, useRef } from 'react';
import { BrandPot, BrandHeart, BranchDeco, WhatsAppIcon } from './brand.jsx';
// Interactive cake-customization flow on iPhone frame.
// Realistic state: choose cake → flavor → size → message → photo → review → WhatsApp handoff.



const CAKES = [
  { id: 'maria', name: 'Bolo da Maria', sub: 'abóbora & laranja', price: 28, accent: 'var(--rose)' },
  { id: 'chiffon', name: 'Chiffon de Chocolate', sub: 'cacau & chantilly', price: 32, accent: '#6B4A3F' },
  { id: 'morangos', name: 'Torta de Morangos', sub: 'morangos frescos', price: 26, accent: '#E84A3F' },
  { id: 'limao', name: 'Bolo de Limão', sub: 'limão siciliano', price: 24, accent: '#E8C76B' },
];

const FLAVORS_FROSTING = [
  { id: 'natas', name: 'Chantilly', desc: 'tradicional' },
  { id: 'queijo', name: 'Cream cheese', desc: 'levemente ácido' },
  { id: 'choco', name: 'Ganache de chocolate', desc: 'intenso' },
  { id: 'fruta', name: 'Cobertura de fruta', desc: 'morango ou frutos vermelhos' },
];

const SIZES = [
  { id: 'p', label: 'Pequeno', sub: '6 fatias', mult: 0.7 },
  { id: 'm', label: 'Médio', sub: '10 fatias', mult: 1.0 },
  { id: 'g', label: 'Grande', sub: '16 fatias', mult: 1.5 },
];

// Decorated cake illustration (CSS — original, abstract).
const CakeViz = ({ cake, size, decoration, message }) => {
  const sizeFactor = size?.mult ?? 1;
  const baseW = 160 * Math.min(1.2, 0.7 + sizeFactor * 0.3);
  return (
    <div style={{ position: 'relative', width: 240, height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* plate */}
      <div style={{ position: 'absolute', bottom: 6, width: baseW + 60, height: 14, borderRadius: '50%', background: 'rgba(74,58,55,0.08)' }} />
      {/* cake stack */}
      <div style={{ position: 'relative', width: baseW, height: 130 }}>
        {/* bottom tier */}
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, height: 80,
          background: cake?.accent ?? 'var(--rose-soft)',
          borderRadius: '12px 12px 18px 18px',
          boxShadow: 'inset 0 -8px 0 rgba(0,0,0,0.06)',
        }} />
        {/* frosting drip */}
        <div style={{
          position: 'absolute', bottom: 78, left: -4, right: -4, height: 28,
          background: 'var(--cream-soft)',
          borderRadius: '10px 10px 30% 30% / 10px 10px 70% 70%',
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 96% 100%, 90% 65%, 82% 95%, 74% 60%, 64% 100%, 56% 65%, 48% 95%, 40% 60%, 30% 100%, 22% 65%, 14% 95%, 6% 65%, 0 100%)',
        }} />
        {/* top tier */}
        <div style={{
          position: 'absolute', bottom: 90, left: '18%', right: '18%', height: 38,
          background: 'var(--cream-soft)',
          borderRadius: '8px 8px 12px 12px',
          boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.04)',
        }} />
        {/* decoration: dots */}
        {decoration === 'dots' && (
          <>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                position: 'absolute', bottom: 36, left: `${10 + i*20}%`,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--rose-deep)',
              }} />
            ))}
          </>
        )}
        {decoration === 'flowers' && (
          <>
            {[0,1,2].map(i => (
              <div key={i} style={{
                position: 'absolute', bottom: 100 + (i%2)*8, left: `${22 + i*22}%`,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--rose)', boxShadow: '0 0 0 3px var(--rose-soft)',
              }} />
            ))}
          </>
        )}
        {decoration === 'fruits' && (
          <>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                position: 'absolute', bottom: 96 + (i%2)*4, left: `${20 + i*16}%`,
                width: 12, height: 14, borderRadius: '50% 50% 60% 60%',
                background: '#E84A3F',
              }} />
            ))}
          </>
        )}
        {/* candle */}
        <div style={{ position: 'absolute', bottom: 128, left: '50%', transform: 'translateX(-50%)', width: 6, height: 18, background: 'var(--rose)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', bottom: 144, left: '50%', transform: 'translateX(-50%)', width: 6, height: 8, background: '#E8C76B', borderRadius: '50% 50% 40% 40%' }} />
        {/* message plate */}
        {message && (
          <div className="handwritten" style={{
            position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center',
            color: 'var(--rose-deep)', fontSize: 16, padding: '0 12px',
            textShadow: '0 1px 0 var(--cream-soft)',
            lineHeight: 1.0,
          }}>
            {message.length > 22 ? message.slice(0, 22) + '…' : message}
          </div>
        )}
      </div>
    </div>
  );
};

const Step = ({ n, total, title, sub, children, onBack, onNext, nextLabel = 'Continuar', nextDisabled }) => (
  <div style={{
    height: '100%', display: 'flex', flexDirection: 'column',
    background: 'var(--paper)', position: 'relative',
  }}>
    <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginLeft: -6,
          color: 'var(--ink)', fontSize: 18,
        }}>‹</button>
      ) : <div style={{ width: 24 }} />}
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
        {n} / {total}
      </div>
      <BrandHeart size={16} color="var(--rose-soft)" />
    </div>

    <div style={{ padding: '14px 24px 0' }}>
      <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, color: 'var(--ink)' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>{sub}</div>}
    </div>

    <div style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
      {children}
    </div>

    {onNext && (
      <div style={{ padding: '12px 24px 28px', background: 'linear-gradient(to top, var(--paper) 70%, rgba(251,247,242,0))' }}>
        <button
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
          style={{
            width: '100%', padding: '16px', borderRadius: 28,
            background: nextDisabled ? 'var(--rose-pale)' : 'var(--rose)',
            color: 'white', border: 'none', fontSize: 15, fontWeight: 600,
            letterSpacing: '0.06em', cursor: nextDisabled ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s, background 0.2s',
            boxShadow: nextDisabled ? 'none' : '0 6px 18px rgba(232,132,124,0.4)',
          }}
        >
          {nextLabel}
        </button>
      </div>
    )}
  </div>
);

const CakeOrderApp = () => {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState({
    cake: null,
    size: SIZES[1],
    frosting: null,
    decoration: null, // 'dots' | 'flowers' | 'fruits' | 'plain'
    message: '',
    photoName: null,
    deliveryDate: '',
    name: '',
  });

  const update = (k, v) => setOrder(o => ({ ...o, [k]: v }));

  // Home
  if (step === 0) {
    return (
      <div style={{ height: '100%', background: 'var(--cream)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -30 }}>
          <BranchDeco width={260} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', bottom: -20, left: -30, transform: 'rotate(180deg)' }}>
          <BranchDeco width={220} opacity={0.4} />
        </div>

        <div style={{ padding: '60px 28px 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <BrandPot size={64} color="var(--rose)" stroke={2.4} />
          <div className="serif-bold" style={{ marginTop: 10, fontSize: 16, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rose)' }}>
            Casa da Mãe Joana
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px 28px 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div className="serif" style={{ fontSize: 38, lineHeight: 1.05, color: 'var(--ink)' }}>
            Que bolo
            <br/>
            <em style={{ color: 'var(--rose)' }}>vamos fazer</em>
            <br/>
            para si?
          </div>
          <div style={{ marginTop: 18, fontSize: 14, color: 'var(--ink-soft)', maxWidth: 260, margin: '18px auto 0', lineHeight: 1.5 }}>
            Bolos artesanais, decorados à mão e entregues em Lisboa.
          </div>
        </div>

        <div style={{ padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
          <button onClick={() => setStep(1)} style={{
            width: '100%', padding: '16px', borderRadius: 28,
            background: 'var(--rose)', color: 'white', border: 'none',
            fontSize: 15, fontWeight: 600, letterSpacing: '0.04em',
            cursor: 'pointer', boxShadow: '0 6px 18px rgba(232,132,124,0.4)',
          }}>
            Encomendar bolo
          </button>
          <button style={{
            width: '100%', padding: '14px', borderRadius: 28,
            background: 'transparent', color: 'var(--rose)',
            border: '1.5px solid var(--rose)',
            fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer',
          }}>
            Ver menu da semana
          </button>
        </div>
      </div>
    );
  }

  // Step 1 — choose cake
  if (step === 1) {
    return (
      <Step n={1} total={5} title="Escolha o bolo" sub="o ponto de partida"
        onBack={() => setStep(0)} onNext={() => setStep(2)}
        nextDisabled={!order.cake}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CAKES.map(c => {
            const sel = order.cake?.id === c.id;
            return (
              <button key={c.id} onClick={() => update('cake', c)} style={{
                padding: 14, borderRadius: 16,
                background: sel ? 'var(--cream)' : 'white',
                border: sel ? '2px solid var(--rose)' : '1px solid var(--line)',
                textAlign: 'left', cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '100%', aspectRatio: 1, borderRadius: 10,
                  background: 'var(--cream-soft)', marginBottom: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    width: 50, height: 38, borderRadius: '6px 6px 10px 10px',
                    background: c.accent,
                    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.08), 0 -8px 0 var(--cream)',
                    position: 'relative', top: 6,
                  }} />
                  {sel && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--rose)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}>✓</div>
                  )}
                </div>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.1 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{c.sub}</div>
                <div style={{ fontSize: 12, color: 'var(--rose-deep)', marginTop: 6, fontWeight: 600 }}>desde {c.price} €</div>
              </button>
            );
          })}
        </div>
      </Step>
    );
  }

  // Step 2 — size & frosting
  if (step === 2) {
    return (
      <Step n={2} total={5} title="Tamanho e cobertura" sub={order.cake?.name}
        onBack={() => setStep(1)} onNext={() => setStep(3)}
        nextDisabled={!order.frosting}>

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          tamanho
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {SIZES.map(s => {
            const sel = order.size?.id === s.id;
            return (
              <button key={s.id} onClick={() => update('size', s)} style={{
                flex: 1, padding: '12px 8px', borderRadius: 14,
                background: sel ? 'var(--rose)' : 'white',
                color: sel ? 'white' : 'var(--ink)',
                border: sel ? 'none' : '1px solid var(--line)',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s',
              }}>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{s.sub}</div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          cobertura
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FLAVORS_FROSTING.map(f => {
            const sel = order.frosting?.id === f.id;
            return (
              <button key={f.id} onClick={() => update('frosting', f)} style={{
                padding: '14px 16px', borderRadius: 14,
                background: sel ? 'var(--cream)' : 'white',
                border: sel ? '2px solid var(--rose)' : '1px solid var(--line)',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div className="serif" style={{ fontSize: 15, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 1 }}>{f.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '1.5px solid ' + (sel ? 'var(--rose)' : 'var(--line)'),
                  background: sel ? 'var(--rose)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 11,
                }}>{sel && '✓'}</div>
              </button>
            );
          })}
        </div>
      </Step>
    );
  }

  // Step 3 — decoration & message
  if (step === 3) {
    const deco = [
      { id: 'plain', label: 'Simples', desc: 'sem decoração' },
      { id: 'dots', label: 'Pintinhas', desc: 'rosa coral' },
      { id: 'flowers', label: 'Flores', desc: 'comestíveis' },
      { id: 'fruits', label: 'Fruta fresca', desc: 'da estação' },
    ];
    return (
      <Step n={3} total={5} title="Decoração e mensagem"
        onBack={() => setStep(2)} onNext={() => setStep(4)}
        nextDisabled={!order.decoration}>

        <div style={{
          background: 'var(--cream)', borderRadius: 16, padding: '14px 0',
          marginBottom: 20, display: 'flex', justifyContent: 'center',
        }}>
          <CakeViz cake={order.cake} size={order.size} decoration={order.decoration} message={order.message} />
        </div>

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          decoração
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
          {deco.map(d => {
            const sel = order.decoration === d.id;
            return (
              <button key={d.id} onClick={() => update('decoration', d.id)} style={{
                padding: 12, borderRadius: 14,
                background: sel ? 'var(--rose)' : 'white',
                color: sel ? 'white' : 'var(--ink)',
                border: sel ? 'none' : '1px solid var(--line)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div className="serif" style={{ fontSize: 14, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{d.desc}</div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          mensagem (opcional)
        </div>
        <input
          type="text"
          value={order.message}
          onChange={e => update('message', e.target.value)}
          placeholder="ex. Parabéns Maria!"
          maxLength={28}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            border: '1px solid var(--line)', background: 'white',
            fontSize: 15, fontFamily: 'Caveat, cursive',
            color: 'var(--rose-deep)',
          }}
        />
        <div style={{ fontSize: 10, color: 'var(--ink-soft)', textAlign: 'right', marginTop: 4 }}>
          {order.message.length}/28
        </div>
      </Step>
    );
  }

  // Step 4 — photo upload + delivery
  if (step === 4) {
    return (
      <Step n={4} total={5} title="Inspiração e entrega"
        sub="anexe uma foto de referência se quiser"
        onBack={() => setStep(3)} onNext={() => setStep(5)}
        nextDisabled={!order.deliveryDate || !order.name}>

        <label style={{
          display: 'block', width: '100%', height: 120,
          border: '2px dashed var(--rose-soft)', borderRadius: 14,
          background: order.photoName ? 'var(--cream)' : 'transparent',
          padding: 16, textAlign: 'center', cursor: 'pointer',
          marginBottom: 22,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {order.photoName ? (
            <>
              <div style={{ fontSize: 24, color: 'var(--rose)' }}>✓</div>
              <div className="serif" style={{ fontSize: 15, marginTop: 4, fontWeight: 600 }}>{order.photoName}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>toque para mudar</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 22, color: 'var(--rose)', marginBottom: 4 }}>+</div>
              <div className="serif" style={{ fontSize: 15, fontWeight: 600 }}>anexar foto de inspiração</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>jpg, png — opcional</div>
            </>
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) update('photoName', f.name);
              else update('photoName', 'inspiracao.jpg');
            }}
            onClick={e => {
              // graceful fallback when no file picked in iframe
              setTimeout(() => {
                if (!order.photoName) update('photoName', 'inspiracao_aniversario.jpg');
              }, 100);
            }}
          />
        </label>

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          data de entrega
        </div>
        <input
          type="date"
          value={order.deliveryDate}
          onChange={e => update('deliveryDate', e.target.value)}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            border: '1px solid var(--line)', background: 'white',
            fontSize: 15, marginBottom: 18, fontFamily: 'inherit', color: 'var(--ink)',
          }}
        />

        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
          o seu nome
        </div>
        <input
          type="text"
          value={order.name}
          onChange={e => update('name', e.target.value)}
          placeholder="ex. Maria Silva"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            border: '1px solid var(--line)', background: 'white',
            fontSize: 15, fontFamily: 'inherit',
          }}
        />

        <div style={{
          marginTop: 22, padding: 14, borderRadius: 14,
          background: 'var(--cream-soft)', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ✱ pedidos com pelo menos 48h de antecedência. confirmação por WhatsApp.
        </div>
      </Step>
    );
  }

  // Step 5 — review & WhatsApp
  if (step === 5) {
    const basePrice = order.cake?.price ?? 0;
    const total = Math.round(basePrice * (order.size?.mult ?? 1));
    const summary = `Olá Joana! Gostaria de encomendar:
🍰 ${order.cake?.name} (${order.size?.label}, ${order.size?.sub})
🍦 Cobertura: ${order.frosting?.name}
✨ Decoração: ${order.decoration}${order.message ? `
💌 Mensagem: "${order.message}"` : ''}${order.photoName ? `
📎 Foto: ${order.photoName}` : ''}
📅 Entrega: ${order.deliveryDate}
👤 ${order.name}
Total estimado: ${total} €`;

    return (
      <Step n={5} total={5} title="A sua encomenda" sub="confirme antes de enviar"
        onBack={() => setStep(4)} onNext={() => setStep(6)}
        nextLabel="Enviar via WhatsApp">

        <div style={{
          background: 'var(--cream)', borderRadius: 16, padding: '12px 0 4px',
          marginBottom: 16, display: 'flex', justifyContent: 'center',
        }}>
          <CakeViz cake={order.cake} size={order.size} decoration={order.decoration} message={order.message} />
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid var(--line)' }}>
          {[
            ['Bolo', order.cake?.name],
            ['Tamanho', `${order.size?.label} · ${order.size?.sub}`],
            ['Cobertura', order.frosting?.name],
            ['Decoração', order.decoration],
            order.message && ['Mensagem', `"${order.message}"`],
            order.photoName && ['Foto', order.photoName],
            ['Entrega', order.deliveryDate],
            ['Para', order.name],
          ].filter(Boolean).map(([k, v], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '8px 0', borderBottom: i < 7 ? '1px dotted var(--line)' : 'none',
              gap: 12,
            }}>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>{k}</span>
              <span className="serif" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '0 4px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>total estimado</span>
          <span className="serif" style={{ fontSize: 28, color: 'var(--rose-deep)', fontWeight: 600 }}>{total} €</span>
        </div>
      </Step>
    );
  }

  // Step 6 — success / WhatsApp confirmation
  return (
    <div style={{ height: '100%', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -10, left: -10 }}>
        <BranchDeco width={260} opacity={0.5} />
      </div>
      <div style={{ position: 'absolute', bottom: -20, right: -20, transform: 'rotate(180deg)' }}>
        <BranchDeco width={220} opacity={0.4} />
      </div>

      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2,
      }}>
        <WhatsAppIcon size={40} color="white" />
      </div>

      <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, marginTop: 24, position: 'relative', zIndex: 2 }}>
        Pedido <em style={{ color: 'var(--rose)' }}>enviado</em>
      </div>
      <div className="handwritten" style={{ fontSize: 22, color: 'var(--rose-deep)', marginTop: 6, position: 'relative', zIndex: 2 }}>
        com carinho ♡
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 16, maxWidth: 260, lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
        A Joana vai responder pelo WhatsApp em breve para confirmar os detalhes do seu bolo.
      </div>

      <button onClick={() => { setStep(0); setOrder({ ...order, cake: null, frosting: null, decoration: null, message: '', photoName: null, deliveryDate: '', name: '' }); }} style={{
        marginTop: 32, padding: '14px 28px', borderRadius: 28,
        background: 'transparent', color: 'var(--rose)',
        border: '1.5px solid var(--rose)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        position: 'relative', zIndex: 2,
      }}>
        Nova encomenda
      </button>
    </div>
  );
};



export { CakeOrderApp };
