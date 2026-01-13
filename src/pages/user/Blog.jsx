import React from 'react';
import Footer from '../../components/Footer';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "MindCare Hub: Your Path to Holistic Well-being",
      category: "MindCare Support",
      date: "Oct 20, 2025",
      summary: "Explore how MindCare Hub's integrated approach to therapy and community support provides a clinical yet compassionate path to recovery.",
      videoUrl: "https://www.youtube.com/embed/a2w-9i3B_a0", // What is Mental Health (Headspace)
      image: "/images/banner/2.webp",
      content: "At MindCare Hub, we believe that mental health is a fundamental human right. Our platform bridges the gap between those in need and professional care through clinical tools, community forums, and expert consultations. We provide a sanctuary where technology meets empathy, ensuring you never have to navigate your mental health journey alone."
    },
    {
      id: 2,
      title: "Decoding Stress: Moving from Pressure to Resilience",
      category: "Mental Health",
      date: "Oct 12, 2025",
      summary: "Stress is inevitable, but how we respond to it determines our health. Learn the professional techniques to turn stress into a tool for growth.",
      videoUrl: "https://www.youtube.com/embed/RC45j1x68F8", // TED: How to make stress your friend
      image: "/images/banner/3.jpg",
      content: "Stress isn't just an emotional response—it's a biological process that affects your entire physical being. By understanding the mind-body connection, you can learn to regulate your cortisol levels and maintain focus even under extreme pressure. We explore clinical strategies for stress management that high-performers use daily."
    },
    {
      id: 3,
      title: "Navigating Anxiety: From Panic to Peace",
      category: "Therapy",
      date: "Oct 25, 2025",
      summary: "Anxiety can feel paralyzing, but specialized therapeutic tools can help you regain control. Explore the science behind anxiety and how to manage it.",
      videoUrl: "https://www.youtube.com/embed/Xh0mFk7Cj-k", // Psych2Go: What is Anxiety?
      image: "/images/banner/5.jpg",
      content: "Anxiety is more than just feeling worried; it's a persistent state of the nervous system. Understanding clinical triggers and cognitive behavioral patterns is essential for recovery. In this guide, we break down the symptoms of various anxiety disorders and provide evidence-based techniques to quiet the mind."
    },
    {
      id: 4,
      title: "Mastering Self-Care: Clinical Strategies for Longevity",
      category: "Mindfulness",
      date: "Oct 15, 2025",
      summary: "Self-care is more than just relaxation—it's a proactive health strategy. Discover how to build a routine that supports your long-term mental clarity.",
      videoUrl: "https://www.youtube.com/embed/WjB1rJd6N6I", // Self care for mental health
      image: "/images/banner/7.jpg",
      content: "True self-care involves setting professional boundaries, maintaining cognitive alignment, and practicing mindfulness. It's the daily maintenance required to prevent burnout and ensure emotional stability. We provide a framework for building a personalized self-care protocol that integrates into your busy life."
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Blog Hero Section */}
      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #2a1763 0%, #1e1250 100%), url("/images/banner/7.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '160px 0', 
        color: '#fff',
        textAlign: 'center',
        borderRadius: '0 0 80px 80px',
        overflow: 'hidden',
        marginBottom: '80px'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '0 5vw' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em', lineHeight: 1 }}>MindCare Insights</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
            Your companion for mental wellness, expert biological advice, and therapeutic clinical resources.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 5vw' }}>
        <div style={{ display: 'grid', gap: '80px' }}>
          {blogPosts.map((post) => (
            <article key={post.id} className="premium-card fade-in" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '60px', 
              padding: '60px', 
              background: '#fff', 
              borderRadius: '40px',
              alignItems: 'start',
              boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
              border: '1px solid #f1f5f9'
            }}>
              {/* Left Column: Media */}
              <div>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  borderRadius: '24px', 
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  marginBottom: '24px'
                }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={post.videoUrl} 
                    title={post.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: '#f8fafc', color: '#64748b', padding: '8px 16px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800 }}>{post.category}</span>
                  <span style={{ background: '#f5f3ff', color: '#6366f1', padding: '8px 16px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800 }}>{post.date}</span>
                </div>
              </div>

              {/* Right Column: Content */}
              <div>
                <h2 style={{ fontSize: '2.25rem', color: '#111827', marginBottom: '24px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{post.title}</h2>
                <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '32px', fontWeight: 500 }}>
                  {post.summary}
                </p>
                <div style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                  {post.content}
                </div>
                <button 
                  className="btn pill purple" 
                  style={{ marginTop: '40px', padding: '16px 32px' }}
                >
                  Continue Reading
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
