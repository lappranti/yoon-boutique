import { motion } from 'framer-motion'
import { ease, fcfa, type Product } from '../data'

type Props = {
  p: Product
  index: number
  variant: string
  setVariant: (v: string) => void
  size: string
  setSize: (s: string) => void
  onAdd: () => void
  onClose: () => void
  md: boolean
}

export function Detail({ p, index, variant, setVariant, size, setSize, onAdd, onClose, md }: Props) {
  const vi = p.variants.findIndex((v) => v.id === variant)
  const v = p.variants[vi]
  const step = (d: number) => setVariant(p.variants[(vi + d + p.variants.length) % p.variants.length].id)

  return (
    <motion.section
      role="dialog"
      aria-label={`Fiche produit ${p.name}`}
      initial={md ? { opacity: 0, x: 40 } : { y: '100%' }}
      animate={md ? { opacity: 1, x: 0 } : { y: 0 }}
      exit={md ? { opacity: 0, x: 30 } : { y: '100%' }}
      transition={{ duration: 0.6, ease, delay: md ? 0.15 : 0 }}
      className={
        md
          ? 'absolute left-[53vw] top-[17vh] z-30 w-[min(400px,38vw)]'
          : 'fixed inset-x-0 bottom-0 z-30 max-h-[56svh] overflow-y-auto rounded-t-[26px] bg-white/85 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-20px_60px_rgba(0,0,0,.08)] backdrop-blur-xl'
      }
    >
      <div className="flex items-center justify-between">
        <div className={`mono flex items-center gap-2 text-[10.5px] text-mute ${p.variants.length < 2 ? 'invisible' : ''}`}>
          <button type="button" onClick={() => step(-1)} aria-label="Couleur précédente" className="grid size-7 place-items-center rounded-full hover:bg-black/5">‹</button>
          <span aria-live="polite">{vi + 1} / {p.variants.length}</span>
          <button type="button" onClick={() => step(1)} aria-label="Couleur suivante" className="grid size-7 place-items-center rounded-full hover:bg-black/5">›</button>
        </div>
        <button type="button" onClick={onClose} aria-label="Fermer la fiche" className="grid size-9 place-items-center rounded-full text-[18px] hover:bg-black/5">×</button>
      </div>

      <p className="mono mt-3 text-[10px] text-mute">Collection Hiver · {String(index + 1).padStart(2, '0')}</p>
      <h2 className="mt-1 font-serif text-[40px] italic leading-[1.02] md:text-[52px]">{p.name}</h2>
      <p className="mt-2 flex items-baseline gap-3 text-[15px] font-medium">
        {fcfa(p.price)} <span className="text-[12.5px] font-normal text-mute">Livraison 24 h à Dakar</span>
      </p>

      <div className="mt-6">
        <p className="mono text-[10px] text-mute">Couleur · <b className="text-ink">{v.label}</b></p>
        <div className="mt-2.5 flex gap-2.5" role="radiogroup" aria-label="Couleur">
          {p.variants.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === variant}
              aria-label={c.label}
              onClick={() => setVariant(c.id)}
              className={`size-8 rounded-full border border-black/10 transition ${c.id === variant ? 'ring-[1.5px] ring-ink ring-offset-[3px] ring-offset-[#eeece8]' : 'hover:scale-110'}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mono text-[10px] text-mute">Taille · <b className="text-ink">{size}</b></p>
        <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label="Taille">
          {p.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={s === size}
              onClick={() => setSize(s)}
              className={`mono h-9 min-w-11 rounded-full border px-3 text-[11px] transition ${s === size ? 'border-ink bg-ink text-white' : 'border-black/15 hover:border-ink'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[12.5px] text-mute">{p.fit}</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onAdd}
        className="mono mt-6 flex h-12 w-full items-center justify-between rounded-full bg-ink px-5 text-[11px] text-white transition hover:bg-black"
      >
        <span>Ajouter au panier · {size}</span>
        <span>{fcfa(p.price)}</span>
      </motion.button>
      <p className="mt-4 text-[13px] leading-relaxed text-mute">{p.desc}</p>
    </motion.section>
  )
}
