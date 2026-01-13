import { useEffect, useState } from 'react'

export default function Carousel({ images = [], interval = 3000 }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setIdx(i => (i + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  if (!images.length) return null

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt="slide"
          className={i === idx ? 'slide active' : 'slide'}
          loading="lazy"
        />
      ))}
      <div className="dots">
        {images.map((_, i) => (
          <button key={i} className={i === idx ? 'dot active' : 'dot'} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}
