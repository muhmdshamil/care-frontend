import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

export default function OnlineCounsellingInfo() {
  return (
    <div style={{ background: '#fcfcfd', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #2a1763 0%,   #1e1250 100%), url("/images/banner/6.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 5vw', 
        color: '#fff',
        textAlign: 'center',
        borderRadius: '0 0 50px 50px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)'
      }}>
        {/* Subtle decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', blur: '80px' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '2%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', blur: '40px' }} />

        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Online Counselling</h1>
        <p style={{ fontSize: '1.35rem', maxWidth: '850px', margin: '0 auto', opacity: 0.95, lineHeight: 1.6, fontWeight: 500 }}>
          Professional, safe, and deeply compassionate therapy sessions <br style={{ display: 'none' }} /> delivered through our encrypted MindCare platform.
        </p>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 0', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '32px', padding: '60px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', marginBottom: '80px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '24px' }}>What is Online Counselling?</h2>
              <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '20px' }}>
                Online counselling, also known as tele-therapy or e-therapy, allows you to connect with licensed mental health professionals via secure video conferencing, phone calls, or messaging.
              </p>
              <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                At MindCare Hub, we utilize state-of-the-art encrypted platforms to ensure that every session remains 100% confidential and safe, providing a sanctuary for your mental well-being.
              </p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '32px' }}>
              <h3 style={{ color: '#4f46e5', marginBottom: '20px' }}>Why Choose MindCare?</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '16px' }}>
                {[
                  'Accredited Licensed Therapists',
                  'Secure & Encrypted Conversations',
                  'Flexible Scheduling Options',
                  'Evidence-Based Approaches (CBT, DBT)',
                  'Compassionate & Judgment-Free Support'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151', fontWeight: 500 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '80px' }}>
            {[
              { title: '1. Book a Session', desc: 'Choose a professional from our verified list and pick a time that suits you.' },
              { title: '2. Connect Securely', desc: 'Join your session via our encrypted link from your phone or computer.' },
              { title: '3. Personalized Care', desc: 'Work through your challenges with dedicated support tailored to your journey.' }
            ].map((step, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '32px', borderRadius: '24px' }}>
                <h3 style={{ color: '#111827', fontSize: '1.25rem', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', background: '#f5f3ff', padding: '48px', borderRadius: '32px' }}>
            <h2 style={{ marginBottom: '16px' }}>Ready to start your journey?</h2>
            <p style={{ color: '#6d28d9', fontWeight: 600, marginBottom: '32px' }}>Take the first step towards a healthier, happier you.</p>
            <Link to="/user/appointment" className="btn pill purple" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
              Book an Appointment Now
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
