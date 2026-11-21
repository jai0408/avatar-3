ASPIREALTY AVATAR 3 — CHANNEL PARTNER LANDING PAGE SETUP
========================================================

1) CONNECT LEAD DELIVERY (GOOGLE SHEET + EMAIL TO rahkrr2@gmail.com)
   a. Open your Google Sheet: "Aspirealty Avatar 3 - Leads Tracker"
   b. Click Extensions -> Apps Script.
   c. Delete the default code, copy/paste everything from `google-apps-script.gs`, and Save.
   d. Click Deploy -> New deployment -> Select type: Web app
      - Execute as: Me
      - Who has access: Anyone
   e. Click Deploy, authorize permissions, and copy the Web App URL (ends in /exec).
   f. Open `app.js` and paste that URL inside `const LEAD_WEBHOOK_URL = '...';` on line 3.

2) PUBLISH FREE ON GITHUB PAGES
   a. Create a new public GitHub repository (e.g., `avatar3-plots`).
   b. Upload all files in this folder (or push with git):
        git init
        git add .
        git commit -m "Launch Aspirealty Avatar 3 landing page"
        git branch -M main
        git remote add origin https://github.com/<YOUR_USERNAME>/avatar3-plots.git
        git push -u origin main
   c. In your GitHub repo, go to Settings -> Pages -> Source: Deploy from a branch -> Branch: `main` / `/ (root)` -> Save.
   d. Your live HTTPS link will be:
        https://<YOUR_USERNAME>.github.io/avatar3-plots/
   e. Optional (recommended for WhatsApp preview image):
      Update `<meta property="og:image" content="...">` in `index.html` to the full URL:
        https://<YOUR_USERNAME>.github.io/avatar3-plots/images/entrance.jpg

3) SHARE ON WHATSAPP WITH CAMPAIGN TRACKING
   Share your live URL with UTM tags so your Google Sheet logs which WhatsApp group or broadcast generated each lead:
     https://<YOUR_USERNAME>.github.io/avatar3-plots/?utm_source=whatsapp&utm_campaign=status_post
     https://<YOUR_USERNAME>.github.io/avatar3-plots/?utm_source=whatsapp&utm_campaign=investors_group
