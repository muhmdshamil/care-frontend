export default function Footer() {
  return (
    <footer className="footer section">
      <div className="footer-top muted"><span>Terms & Conditions • Privacy Policy</span></div>
      <div className="footer-grid">
        <div className="brand-col">
          <h3>MindCare Doc</h3>
          <div className="map">
            <iframe
              title="location"
              src="https://www.google.com/maps?q=MindCareDoc%20Therapy&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <h4 style={{marginTop:12}}>Locations</h4>
          <div className="locations muted">Kochi • Alappuzha • Trivandrum</div>
        </div>
        <div className="links-col">
          <h4>Treatments</h4>
          <ul className="links">
            <li>Self-Esteem Issues</li>
            <li>Relationship Problems</li>
            <li>Anxiety Disorder</li>
            <li>Depression</li>
            <li>Sleep Problems & Insomnia</li>
            <li>Pregnancy & Postpartum Stress</li>
            <li>Workplace Burnout & Stress</li>
            <li>Corporate Wellbeing & Mindfulness Workshops</li>
          </ul>
        </div>
        <div className="links-col">
          <h4>&nbsp;</h4>
          <ul className="links">
            <li>Chronic Stress</li>
            <li>Problems in Children</li>
            <li>Anger Issues</li>
            <li>Teen-Age Problems</li>
            <li>Child Developmental Problems</li>
            <li>Fear and Phobia</li>
            <li>Autism</li>
            <li>Professional Problems</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom muted">
        <span>Copyright © {new Date().getFullYear()} MindCareDoc, All rights reserved.</span>
        <span />
      </div>
    </footer>
  )
}
