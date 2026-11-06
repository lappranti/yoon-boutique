export const img = (n: string) => `${import.meta.env.BASE_URL}img/${n}.webp`
export const ease = [0.22, 1, 0.36, 1] as const
export const PHONE = '221770000000'
export const fcfa = (n: number) => n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' F'

export type Variant = { id: string; label: string; hex: string }
export type Product = {
  id: string
  name: string
  price: number
  bg: string
  desc: string
  fit: string
  sizes: string[]
  variants: Variant[]
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export const products: Product[] = [
  {
    id: 'b56', name: 'Doudoune Capuche', price: 42000, bg: '#ebe8e4',
    desc: 'Garnissage synthétique léger, capuche doublée en fausse fourrure, zip doré.',
    fit: 'Coupe ajustée · prends ta taille habituelle.', sizes: SIZES,
    variants: [{ id: 'sable', label: 'Sable', hex: '#cbbfae' }],
  },
  {
    id: 'w51', name: 'Doudoune Légère', price: 32000, bg: '#e7e8ea',
    desc: 'Matelassage fin, se range dans sa poche. Idéale pour voyager.',
    fit: 'Coupe droite · confortable sur un pull.', sizes: SIZES,
    variants: [{ id: 'noir', label: 'Noir', hex: '#2a2828' }, { id: 'marine', label: 'Marine', hex: '#2b3650' }, { id: 'olive', label: 'Olive', hex: '#5e6644' }, { id: 'bordeaux', label: 'Bordeaux', hex: '#5e1f2a' }],
  },
  {
    id: 'w30', name: 'Doudoune Bicolore', price: 45000, bg: '#e8eaec',
    desc: 'Empiècements contrastés, col montant, cordon de serrage à la taille.',
    fit: 'Coupe courte et ample · épaules tombantes.', sizes: SIZES,
    variants: [{ id: 'noir', label: 'Noir & écru', hex: '#1d1d1f' }, { id: 'marine', label: 'Marine & écru', hex: '#26344f' }, { id: 'foret', label: 'Forêt & écru', hex: '#2f4a3a' }, { id: 'brique', label: 'Brique & écru', hex: '#8a3b2a' }],
  },
  {
    id: 'g158', name: 'Gilet Matelassé', price: 25000, bg: '#ebe9e6',
    desc: 'Sans manches, gros matelassage, deux poches zippées.',
    fit: 'Coupe classique · se porte sur un sweat.', sizes: SIZES,
    variants: [{ id: 'noir', label: 'Noir', hex: '#232327' }, { id: 'camel', label: 'Camel', hex: '#a47848' }, { id: 'kaki', label: 'Kaki', hex: '#5c6343' }],
  },
  {
    id: 'w23', name: 'Doudoune Courte', price: 38000, bg: '#e6e9ec',
    desc: 'Volume généreux, col cheminée, finition déperlante.',
    fit: 'Coupe courte · tombe à la taille.', sizes: SIZES,
    variants: [{ id: 'azur', label: 'Azur', hex: '#3c78c8' }, { id: 'bissap', label: 'Bissap', hex: '#7d2337' }, { id: 'sable', label: 'Sable', hex: '#cdb68f' }],
  },
  {
    id: 'b57', name: 'Parka Fourrure', price: 65000, bg: '#e4e8e8',
    desc: 'Capuche en fausse fourrure, poignets en sherpa, longueur mi-cuisse.',
    fit: 'Coupe ample · prends une taille en dessous si tu es entre deux.', sizes: SIZES,
    variants: [{ id: 'sapin', label: 'Sapin', hex: '#1f3332' }, { id: 'noir', label: 'Noir', hex: '#232325' }],
  },
]

export const src = (p: Product, v: string) => img(`${p.id}-${v}`)
