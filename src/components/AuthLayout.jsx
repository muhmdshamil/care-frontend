import React from 'react'

export default function AuthLayout({ image, heading, subheading, children, ctaLabel, onCta, pageBg }) {
  const fallback = import.meta.env.VITE_AUTH_IMAGE_URL || 'https://images.unsplash.com/photo-1505483531331-4076d1c3c04c?q=80&w=1400&auto=format&fit=crop'
  const bg = image || fallback
  return (
    <div
      className="auth"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        position: 'relative'
      }}
    >
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: 1040,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.7)',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'saturate(180%) blur(12px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          className="auth-left"
          style={{
            position: 'relative',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-hidden
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)'
            }}
          />
          <div
            className="auth-left-inner"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              padding: '40px'
            }}
          >
            <h2 style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: '700', lineHeight: 1.2 }}>{heading}</h2>
            {subheading && (
              <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 16, marginBottom: 24, fontSize: '16px', lineHeight: 1.5 }}>{subheading}</p>
            )}
            {ctaLabel && (
              <button
                className="btn pill"
                onClick={onCta}
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  padding: '12px 28px',
                  fontWeight: '600',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
        <div
          className="auth-right"
          style={{
            background: '#ffffff',
            padding: '48px 40px'
          }}
        >
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

