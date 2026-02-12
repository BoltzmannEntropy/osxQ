/**
 * GDPR Privacy Consent Banner
 * Displays cookie consent popup with Accept/Reject options
 */
(function() {
  'use strict';

  const CONSENT_KEY = 'osxq_privacy_consent';
  const CONSENT_DATE_KEY = 'osxq_consent_date';

  // Check if consent already given
  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) !== null;
  }

  // Get current consent status
  function getConsentStatus() {
    return localStorage.getItem(CONSENT_KEY);
  }

  // Save consent choice
  function saveConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
  }

  // Inject CSS styles
  function injectStyles() {
    const styles = `
      .privacy-overlay {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 0;
        transform: translateY(100%);
        transition: transform 0.4s ease;
      }

      .privacy-overlay.visible {
        transform: translateY(0);
      }

      .privacy-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
      }

      .privacy-content {
        flex: 1;
        min-width: 280px;
      }

      .privacy-title {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .privacy-title svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .privacy-text {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #94a3b8;
        margin: 0;
      }

      .privacy-text a {
        color: #60a5fa;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .privacy-text a:hover {
        color: #93c5fd;
      }

      .privacy-actions {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }

      .privacy-btn {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 100px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .privacy-btn-accept {
        background: #ffffff;
        color: #0f172a;
      }

      .privacy-btn-accept:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
      }

      .privacy-btn-reject {
        background: transparent;
        color: #ffffff;
        border: 1px solid #475569;
      }

      .privacy-btn-reject:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: #64748b;
      }

      @media (max-width: 640px) {
        .privacy-container {
          flex-direction: column;
          align-items: stretch;
          text-align: center;
        }

        .privacy-actions {
          justify-content: center;
        }

        .privacy-title {
          justify-content: center;
        }
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  // Create and inject the banner HTML
  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'privacy-overlay';
    banner.id = 'privacyBanner';
    banner.innerHTML = `
      <div class="privacy-container">
        <div class="privacy-content">
          <h3 class="privacy-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Your Privacy Matters
          </h3>
          <p class="privacy-text">
            We use cookies to enhance your browsing experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies in accordance with GDPR.
            You can reject non-essential cookies by clicking "Reject".
          </p>
        </div>
        <div class="privacy-actions">
          <button class="privacy-btn privacy-btn-reject" id="privacyReject">Reject</button>
          <button class="privacy-btn privacy-btn-accept" id="privacyAccept">Accept</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    return banner;
  }

  // Show the banner with animation
  function showBanner(banner) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.add('visible');
      });
    });
  }

  // Hide the banner with animation
  function hideBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(() => {
      banner.remove();
    }, 400);
  }

  // Initialize analytics if consent given
  function initAnalytics() {
    // Placeholder: Add your analytics initialization here
    // Example: Google Analytics, Plausible, etc.
    // window.dataLayer = window.dataLayer || [];
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
  }

  // Main initialization
  function init() {
    // Don't show banner if consent already given
    if (hasConsent()) {
      if (getConsentStatus() === 'accepted') {
        initAnalytics();
      }
      return;
    }

    injectStyles();
    const banner = createBanner();

    // Show banner after a short delay
    setTimeout(() => showBanner(banner), 500);

    // Handle Accept
    document.getElementById('privacyAccept').addEventListener('click', function() {
      saveConsent(true);
      hideBanner(banner);
      initAnalytics();
    });

    // Handle Reject
    document.getElementById('privacyReject').addEventListener('click', function() {
      saveConsent(false);
      hideBanner(banner);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
