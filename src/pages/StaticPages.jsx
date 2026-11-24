import React from 'react';
import { Link } from 'react-router-dom';

export const AffiliateDisclosurePage = () => (
  <main className="static-page">
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Affiliate Disclosure</span>
      </div>
      <h1>Affiliate Disclosure</h1>
      <p className="static-page__date">Last updated: November 2024</p>

      <div className="static-page__content">
        <section>
          <h2>Our Relationship with AliExpress</h2>
          <p>
            EKE is an independent affiliate marketing website. We participate in the AliExpress Portals Affiliate Programme 
            (and related programmes operated by Alibaba Group). This means that when you click on a "Buy Now" button 
            on EKE and subsequently make a qualifying purchase on AliExpress, we may receive a commission.
          </p>
          <p>
            <strong>This commission comes at no additional cost to you.</strong> The price you pay on AliExpress is exactly 
            the same whether you arrived there via EKE or directly.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li>You browse products on EKE and find something you like.</li>
            <li>You click the "Buy Now" button — this takes you to AliExpress via our tracked affiliate link.</li>
            <li>You purchase the product on AliExpress. AliExpress handles everything: payment, fulfilment, shipping, and customer service.</li>
            <li>EKE may earn a small commission on qualifying purchases.</li>
          </ol>
        </section>

        <section>
          <h2>Our Commitment to You</h2>
          <p>
            Our recommendations are based on product quality, ratings, and value — not commission rates. 
            We only feature products we believe offer genuine value to our users. The affiliate relationship 
            does not influence our editorial decisions.
          </p>
        </section>

        <section>
          <h2>Pricing Disclaimer</h2>
          <p>
            Prices displayed on EKE are indicative and sourced from AliExpress at the time of listing. 
            Prices on AliExpress may change at any time. Always verify the current price before purchasing.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about our affiliate relationships, please note that EKE is an independent operator 
            and not affiliated with or endorsed by Alibaba Group or AliExpress.
          </p>
        </section>
      </div>
    </div>
  </main>
);

export const PrivacyPage = () => (
  <main className="static-page">
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Privacy Policy</span>
      </div>
      <h1>Privacy Policy</h1>
      <p className="static-page__date">Last updated: November 2024</p>

      <div className="static-page__content">
        <section>
          <h2>Information We Collect</h2>
          <p>
            EKE is a client-side affiliate marketplace. We do not collect personal information through registration or accounts.
            Your wishlist is stored locally in your browser only.
          </p>
          <p>When you click affiliate links, you are directed to AliExpress. AliExpress has its own privacy policy 
            which governs data collected during the purchase process.</p>
        </section>

        <section>
          <h2>Local Storage</h2>
          <p>
            We use browser localStorage to save your wishlist and product preferences. This data never leaves your device 
            and is not sent to any server.
          </p>
        </section>

        <section>
          <h2>Affiliate Tracking</h2>
          <p>
            When you click a "Buy Now" link, affiliate tracking cookies may be set by AliExpress on their domain. 
            These are used solely to attribute sales for commission purposes.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            Product images may be loaded from Unsplash (unsplash.com). Please refer to their respective privacy 
            policies for information on data handling.
          </p>
        </section>
      </div>
    </div>
  </main>
);

export const AboutPage = () => (
  <main className="static-page">
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>About EKE</span>
      </div>
      <h1>About EKE</h1>
      <div className="static-page__content">
        <section>
          <h2>Discover More. Shop Smarter.</h2>
          <p>
            EKE is a premium international affiliate shopping marketplace designed to help you discover 
            the world's best products from AliExpress. We curate thousands of top-rated products across 
            electronics, fashion, shoes, watches, home goods, and beauty — all in one elegant destination.
          </p>
        </section>
        <section>
          <h2>How We're Different</h2>
          <p>
            Rather than sifting through millions of listings, EKE does the hard work for you. 
            Our curated collection focuses on quality, value, and customer satisfaction — 
            featuring only products with strong ratings and verified reviews.
          </p>
        </section>
        <section>
          <h2>Our Business Model</h2>
          <p>
            EKE is an affiliate marketplace. We earn a small commission when you purchase through our links, 
            at no extra cost to you. This allows us to keep EKE free, ad-light, and focused on quality curation.
          </p>
          <Link to="/affiliate-disclosure" className="btn btn--outline" style={{ marginTop: '12px', display: 'inline-flex' }}>
            Read our Affiliate Disclosure →
          </Link>
        </section>
      </div>
    </div>
  </main>
);

const NotFoundPage = () => (
  <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="empty-state">
      <span className="empty-state__icon">🌐</span>
      <h2>404 — Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn--primary">Back to Home</Link>
    </div>
  </main>
);

export default NotFoundPage;
