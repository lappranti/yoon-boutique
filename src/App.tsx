import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease, fcfa, products, src } from './data'
import { useMd } from './useMd'
import { Detail } from './components/Detail'
import { Cart, lineKey, type Line } from './components/Cart'

const n = products.length
const rel = (k: number, i: number) => {
  let d = (((k - i) % n) + n) % n
  if (d > n / 2) d -= n
  return d
}
const pad = (x: number) => String(x).padStart(2, '0')

export default function App() {
  const md = useMd()
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const [variants, setVariants] = useState<Record<string, string>>(() => Object.fromEntries(products.map((p) => [p.id, p.variants[0].id])))
  const [sizes, setSizes] = useState<Record<string, string>>(() => Object.fromEntries(products.map((p) => [p.id, p.sizes[2]])))
  const [lines, setLines] = useState<Line[]>([])
  const [cart, setCart] = useState(false)
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const tRef = useRef(0)
  const panned = useRef(false)
  const p = products[i]

  const go = (d: number) => setI((x) => (x + d + n) % n)

  useEffect(() => {
    products.forEach((q) => q.variants.forEach((v) => { const im = new Image(); im.src = src(q, v.id) }))
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setCart(false); setMenu(false) }
      if (cart || menu) return
      if (e.key === 'ArrowRight' && !open) go(1)
      if (e.key === 'ArrowLeft' && !open) go(-1)
      if (e.key === 'Enter' && !open && document.activeElement === document.body) setOpen(true)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [open, cart, menu])
  useEffect(() => { document.querySelector('meta[name=theme-color]')?.setAttribute('content', p.bg) }, [p])

  const add = () => {
    const l = { pid: p.id, vid: variants[p.id], size: sizes[p.id], qty: 1 }
    setLines((ls) => (ls.some((x) => lineKey(x) === lineKey(l)) ? ls.map((x) => (lineKey(x) === lineKey(l) ? { ...x, qty: x.qty + 1 } : x)) : [...ls, l]))
    setToast(`${p.name} · ${p.variants.find((v) => v.id === l.vid)!.label} · ${l.size}`)
    clearTimeout(tRef.current)
    tRef.current = window.setTimeout(() => setToast(null), 2400)
  }
  const setQty = (k: string, q: number) => setLines((ls) => (q <= 0 ? ls.filter((l) => lineKey(l) !== k) : ls.map((l) => (lineKey(l) === k ? { ...l, qty: q } : l))))
  const count = lines.reduce((a, l) => a + l.qty, 0)

  // Position de chaque vêtement selon son écart avec le produit actif
  const pose = (d: number) => {
    if (open) {
      if (d === 0) return md ? { x: '-17vw', y: '2vh', scale: 1.04, opacity: 1 } : { x: '0vw', y: '-18svh', scale: 0.5, opacity: 1 }
      return { x: `${d * 50}vw`, y: '0vh', scale: 0.7, opacity: 0 }
    }
    const off = md ? 21 : 60
    if (d === 0) return { x: '0vw', y: '0vh', scale: 1, opacity: 1 }
    if (Math.abs(d) === 1) return { x: `${d * off}vw`, y: md ? '3vh' : '4vh', scale: md ? 0.8 : 0.62, opacity: 1 }
    return { x: `${Math.sign(d) * off * 2}vw`, y: '4vh', scale: 0.6, opacity: 0 }
  }

  return (
    <motion.div className="relative h-[100svh] overflow-hidden" animate={{ backgroundColor: p.bg }} transition={{ duration: 0.9 }}>
      {/* En-tête */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="grid h-16 grid-cols-3 items-center px-4 md:px-8">
          <button type="button" onClick={() => setMenu(true)} aria-label="Ouvrir le menu" className="grid size-10 place-items-center rounded-full hover:bg-black/5">
            <span className="grid grid-cols-2 gap-[3px]">{[0, 1, 2, 3].map((k) => <span key={k} className="size-[4px] rounded-[1px] bg-ink" />)}</span>
          </button>
          <p className="justify-self-center text-[19px] font-extrabold italic tracking-[-0.04em]">YOON<sup className="ml-0.5 text-[9px] font-normal not-italic">®</sup></p>
          <button type="button" onClick={() => setCart(true)} className="mono justify-self-end rounded-full px-3 py-2 text-[10.5px] hover:bg-black/5" aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
            Panier ({count})
          </button>
        </div>
        <motion.p animate={{ opacity: open ? 0 : 1 }} className="mono text-center text-[9.5px] text-mute">Collection Hiver · Drop 03</motion.p>
      </header>

      {/* Titre géant derrière les vêtements */}
      <div className="pointer-events-none absolute inset-x-0 top-[15vh] z-0 flex justify-center md:top-[13vh]" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={p.id}
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: open ? 0.35 : 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease }}
            className="whitespace-nowrap font-serif text-[10vw] italic leading-none text-black/25 md:text-[10.5vw]"
          >
            {p.name}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Index à gauche (desktop) */}
      <motion.nav animate={{ opacity: open ? 0 : 1, x: open ? -20 : 0 }} className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 md:block" aria-label="Produits">
        <ol className="space-y-2">
          {products.map((q, k) => (
            <li key={q.id}>
              <button type="button" onClick={() => setI(k)} tabIndex={open ? -1 : 0} className={`mono block text-left text-[9.5px] transition ${k === i ? 'font-bold text-ink' : 'text-mute hover:text-ink'}`} aria-current={k === i ? 'true' : undefined}>
                {pad(k + 1)} {k === i ? '—' : ' '} {q.name}
              </button>
            </li>
          ))}
        </ol>
      </motion.nav>

      {/* Scène des vêtements */}
      <motion.div
        className="absolute inset-x-0 bottom-[29svh] top-[20svh] z-10 touch-pan-y md:bottom-[max(19vh,150px)] md:top-[17vh]"
        onPanStart={() => { panned.current = true }}
        onPanEnd={(_, info) => {
          if (!open && Math.abs(info.offset.x) > 50) go(info.offset.x < 0 ? 1 : -1)
          setTimeout(() => { panned.current = false }, 50)
        }}
      >
        {products.map((q, k) => {
          const d = rel(k, i)
          const vis = Math.abs(d) <= 1
          return (
            <motion.div
              key={q.id}
              className="absolute inset-0 flex items-end justify-center"
              style={{ zIndex: d === 0 ? 3 : vis ? 2 : 1, pointerEvents: vis && !(open && d !== 0) ? 'auto' : 'none' }}
              initial={false}
              animate={pose(d)}
              transition={{ duration: 0.85, ease }}
            >
              <button
                type="button"
                tabIndex={vis && !open ? 0 : -1}
                aria-label={d === 0 ? `Voir la fiche ${q.name}` : `Aller à ${q.name}`}
                onClick={() => {
                  if (panned.current) return
                  if (d === 0) setOpen(true)
                  else go(d)
                }}
                className={`relative h-full ${d === 0 && !open ? 'cursor-zoom-in' : open ? 'cursor-default' : ''}`}
              >
                <motion.span className="absolute inset-x-[12%] -bottom-[3%] h-[7%] rounded-[50%] bg-black/25 blur-xl" aria-hidden="true" animate={{ scaleX: [1, 0.86, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 4.2 + k * 0.35, repeat: Infinity, ease: 'easeInOut', delay: k * 0.4 }} />
                <motion.span className="relative flex h-full items-end" animate={{ y: [0, -14, 0] }} transition={{ duration: 4.2 + k * 0.35, repeat: Infinity, ease: 'easeInOut', delay: k * 0.4 }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={variants[q.id]}
                    src={src(q, variants[q.id])}
                    alt={`${q.name} ${q.variants.find((v) => v.id === variants[q.id])!.label}`}
                    draggable={false}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="relative h-full w-auto max-w-[80vw] select-none object-contain object-bottom md:max-w-[36vw]"
                  />
                </AnimatePresence>
                </motion.span>
              </button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Nom + contrôles en bas */}
      <motion.div animate={{ opacity: open ? 0 : 1, y: open ? 20 : 0 }} className="absolute inset-x-0 bottom-0 z-20 pb-[max(18px,env(safe-area-inset-bottom))]" style={{ pointerEvents: open ? 'none' : 'auto' }}>
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="text-center">
              <p className="font-serif text-[26px] italic leading-none md:text-[28px]">{p.name}</p>
              <p className="mono mt-1.5 text-[10px] text-mute">{fcfa(p.price)} · {p.variants.length > 1 ? `${p.variants.length} couleurs` : p.variants[0].label}</p>
            </motion.div>
          </AnimatePresence>
          <button type="button" onClick={() => setOpen(true)} className="mono mt-3 rounded-full bg-ink px-5 py-2.5 text-[10px] text-white md:hidden">Voir la pièce</button>
          <div className="mt-4 flex items-center gap-3 md:mt-6">
            <button type="button" onClick={() => go(-1)} aria-label="Produit précédent" className="grid size-10 place-items-center rounded-full transition hover:bg-ink hover:text-white">‹</button>
            <span className="mono w-6 text-[10px]">{pad(i + 1)}</span>
            <span className="relative h-px w-28 bg-black/15 md:w-40" aria-hidden="true">
              <motion.span className="absolute top-[-1px] h-[3px] rounded-full bg-ink" animate={{ left: `${(i / n) * 100}%` }} style={{ width: `${100 / n}%` }} transition={{ duration: 0.6, ease }} />
            </span>
            <span className="mono w-6 text-right text-[10px] text-mute">{pad(n)}</span>
            <button type="button" onClick={() => go(1)} aria-label="Produit suivant" className="grid size-10 place-items-center rounded-full transition hover:bg-ink hover:text-white">›</button>
          </div>
        </div>
      </motion.div>


      {/* Fiche produit */}
      <AnimatePresence>
        {open && (
          <>
            {!md && <motion.button type="button" aria-label="Fermer la fiche" className="fixed inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
            <Detail
              key={p.id}
              p={p}
              index={i}
              md={md}
              variant={variants[p.id]}
              setVariant={(v) => setVariants((s) => ({ ...s, [p.id]: v }))}
              size={sizes[p.id]}
              setSize={(z) => setSizes((s) => ({ ...s, [p.id]: z }))}
              onAdd={add}
              onClose={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Menu */}
      <AnimatePresence>
        {menu && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[95] flex flex-col bg-ink px-6 pb-8 pt-5 text-white md:px-10" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease }}>
            <div className="flex items-center justify-between">
              <p className="mono text-[10px] text-white/50">Collection Hiver · Drop 03</p>
              <button type="button" onClick={() => setMenu(false)} aria-label="Fermer le menu" className="grid size-10 place-items-center rounded-full text-[22px] hover:bg-white/10">×</button>
            </div>
            <ol className="mt-auto space-y-1">
              {products.map((q, k) => (
                <motion.li key={q.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + k * 0.05, duration: 0.5, ease }}>
                  <button type="button" onClick={() => { setI(k); setOpen(false); setMenu(false) }} className="group flex w-full items-baseline gap-4 text-left">
                    <span className="mono text-[10px] text-white/40">{pad(k + 1)}</span>
                    <span className="font-serif text-[44px] italic leading-[1.1] transition group-hover:translate-x-2 md:text-[72px]">{q.name}</span>
                    <span className="mono ml-auto text-[10px] text-white/50">{fcfa(q.price)}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation d'ajout */}
      <AnimatePresence>
        {toast && (
          <motion.button type="button" onClick={() => { setCart(true); setToast(null) }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="mono fixed left-1/2 top-16 z-[80] w-max max-w-[92vw] -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-[10px] text-white shadow-xl">
            Ajouté : {toast} · voir le panier
          </motion.button>
        )}
      </AnimatePresence>

      <Cart open={cart} lines={lines} onClose={() => setCart(false)} onQty={setQty} />
    </motion.div>
  )
}
