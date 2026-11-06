import { AnimatePresence, motion } from 'framer-motion'
import { fcfa, PHONE, products, src } from '../data'

export type Line = { pid: string; vid: string; size: string; qty: number }
const key = (l: Line) => `${l.pid}-${l.vid}-${l.size}`

export function Cart({ open, lines, onClose, onQty }: { open: boolean; lines: Line[]; onClose: () => void; onQty: (k: string, q: number) => void }) {
  const rows = lines.map((l) => {
    const p = products.find((x) => x.id === l.pid)!
    return { l, p, v: p.variants.find((v) => v.id === l.vid)! }
  })
  const total = rows.reduce((t, r) => t + r.p.price * r.l.qty, 0)
  const msg = ['Bonjour YOON, je voudrais commander :', ...rows.map((r) => `• ${r.l.qty} × ${r.p.name} ${r.v.label}, taille ${r.l.size}`), `Total : ${fcfa(total)}`].join('\n')
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside role="dialog" aria-modal="true" aria-label="Panier" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 280 }} onClick={(e) => e.stopPropagation()} className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-[#f3f2ee]">
            <header className="flex items-center justify-between px-6 py-5">
              <p className="font-serif text-[32px] italic">Panier</p>
              <button type="button" onClick={onClose} aria-label="Fermer le panier" className="grid size-10 place-items-center rounded-full text-[20px] hover:bg-black/5">×</button>
            </header>
            {rows.length === 0 ? (
              <p className="px-6 py-20 text-center text-[14px] text-mute">Ton panier est vide.</p>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6">
                  {rows.map(({ l, p, v }) => (
                    <li key={key(l)} className="flex items-center gap-4 rounded-2xl bg-white p-3">
                      <div className="grid size-20 shrink-0 place-items-center rounded-xl" style={{ background: p.bg }}>
                        <img src={src(p, v.id)} alt="" className="max-h-16 max-w-16 object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-[19px] italic leading-tight">{p.name}</p>
                        <p className="mono mt-1 text-[9.5px] text-mute">{v.label} · {l.size}</p>
                        <p className="mt-1 text-[13px] font-medium">{fcfa(p.price * l.qty)}</p>
                      </div>
                      <div className="flex items-center rounded-full border border-black/10">
                        <button type="button" onClick={() => onQty(key(l), l.qty - 1)} aria-label={`Retirer un ${p.name}`} className="grid size-8 place-items-center">−</button>
                        <span className="w-4 text-center text-[13px]">{l.qty}</span>
                        <button type="button" onClick={() => onQty(key(l), l.qty + 1)} aria-label={`Ajouter un ${p.name}`} className="grid size-8 place-items-center">+</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="border-t border-black/10 px-6 py-5">
                  <div className="flex items-baseline justify-between"><span className="mono text-[10.5px]">Total</span><span className="font-serif text-[30px] italic">{fcfa(total)}</span></div>
                  <a href={`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="mono mt-4 flex h-12 items-center justify-center rounded-full bg-ink text-[11px] text-white">Commander sur WhatsApp</a>
                  <p className="mt-2 text-center text-[11px] text-mute">Paiement Wave, Orange Money ou à la livraison · démo</p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export { key as lineKey }
