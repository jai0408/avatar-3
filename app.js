(function () {
  // Paste your deployed Google Apps Script Web App URL here (see README.txt):
  const LEAD_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz-MyUTAttnl2iYssMVHt6P-__tOR6bZDE4VvQHOPV4kKuK3Rrwghbvxj_g4Ki2XpsI/exec';

  const RATE = 15599;
  const INTEREST_ANNUAL = 9.25;
  let selectedSize = 165;
  let selectedSqm = '137.96';

  const chips = document.querySelectorAll('.size-chip');
  const loanPctInput = document.getElementById('loanPct');
  const tenureInput = document.getElementById('tenure');
  const loanPctLabel = document.getElementById('loanPctLabel');
  const tenureLabel = document.getElementById('tenureLabel');
  const totalPriceEl = document.getElementById('totalPrice');
  const exactPriceEl = document.getElementById('exactPrice');
  const areaSqftEl = document.getElementById('areaSqft');
  const downPaymentEl = document.getElementById('downPayment');
  const loanAmountEl = document.getElementById('loanAmount');
  const monthlyEmiEl = document.getElementById('monthlyEmi');

  function formatINR(num) {
    return '\u20B9' + Math.round(num).toLocaleString('en-IN');
  }

  function formatLakhs(num) {
    return '\u20B9' + (num / 100000).toFixed(2) + ' Lakhs';
  }

  function updateCalc() {
    const baseCost = selectedSize * RATE;
    const loanPct = Number(loanPctInput.value);
    const years = Number(tenureInput.value);
    const loanAmt = baseCost * (loanPct / 100);
    const downPay = baseCost - loanAmt;

    let emi = 0;
    if (loanAmt > 0) {
      const r = INTEREST_ANNUAL / 12 / 100;
      const n = years * 12;
      emi = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    loanPctLabel.textContent = loanPct + '%';
    tenureLabel.textContent = years + ' Years';
    totalPriceEl.textContent = formatLakhs(baseCost);
    exactPriceEl.textContent = `${formatINR(baseCost)} \u2022 ${selectedSize} Sq. Yds. (${selectedSqm} sq. m.)`;
    areaSqftEl.textContent = (selectedSize * 9).toLocaleString('en-IN') + ' Sq. Ft.';
    downPaymentEl.textContent = formatINR(downPay);
    loanAmountEl.textContent = formatINR(loanAmt);
    monthlyEmiEl.textContent = loanAmt > 0 ? formatINR(emi) + ' / mo' : '\u20B90 (No Loan)';
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedSize = Number(chip.dataset.size);
      selectedSqm = chip.dataset.sqm;
      updateCalc();
    });
  });

  loanPctInput.addEventListener('input', updateCalc);
  tenureInput.addEventListener('input', updateCalc);
  updateCalc();

  // Capture UTM campaign parameters from WhatsApp share links
  const urlParams = new URLSearchParams(window.location.search);
  const utmSourceInput = document.getElementById('utmSource');
  const utmMediumInput = document.getElementById('utmMedium');
  const utmCampaignInput = document.getElementById('utmCampaign');
  if (utmSourceInput) utmSourceInput.value = urlParams.get('utm_source') || 'whatsapp_or_direct';
  if (utmMediumInput) utmMediumInput.value = urlParams.get('utm_medium') || '';
  if (utmCampaignInput) utmCampaignInput.value = urlParams.get('utm_campaign') || '';

  // Lead submission -> Google Sheet + Email Alert + Unlock Brochure PDF
  const leadForm = document.getElementById('leadForm');
  const formStatus = document.getElementById('formStatus');
  const brochureUnlock = document.getElementById('brochureUnlock');
  const submitBtn = document.getElementById('submitBtn');

  if (leadForm && formStatus) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('buyerName').value.trim();
      const phone = document.getElementById('buyerPhone').value.trim();
      const size = document.getElementById('buyerSize').value;
      const type = document.getElementById('visitType').value;

      if (!name || !phone) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const payload = new URLSearchParams();
      payload.append('buyerName', name);
      payload.append('buyerPhone', phone);
      payload.append('buyerSize', size);
      payload.append('visitType', type);
      payload.append('utm_source', utmSourceInput ? utmSourceInput.value : 'whatsapp_or_direct');
      payload.append('utm_medium', utmMediumInput ? utmMediumInput.value : '');
      payload.append('utm_campaign', utmCampaignInput ? utmCampaignInput.value : '');
      payload.append('page_url', window.location.href);

      if (LEAD_WEBHOOK_URL) {
        try {
          await fetch(LEAD_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: payload
          });
        } catch (err) {
          // Keep UX smooth even if offline; still unlock brochure & show contact
        }
      }

      formStatus.style.display = 'block';
      formStatus.textContent = `Thank you, ${name}! Your enquiry (${size} — ${type}) has been received. Jai Keerthan Bonam will reach out shortly, or call +91 95028 81117.`;

      if (brochureUnlock) {
        brochureUnlock.style.display = 'block';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submitted — Brochure Unlocked Below';
      }
    });
  }

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
    }
  });
})();
