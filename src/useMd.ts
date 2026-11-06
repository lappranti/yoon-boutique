import { useEffect, useState } from 'react'
export function useMd() {
  const q = '(min-width: 768px)'
  const [md, setMd] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const f = () => setMd(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return md
}
