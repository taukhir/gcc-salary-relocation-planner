# GCC Salary & Relocation Planner

A static salary planning calculator for Gulf job conversations. It helps compare expected salary, living expenses, estimated savings, live currency conversion, and current salary context for Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain.

Built by **Tauqeer Ahmed | taukhir** as a portfolio project.

## Why this project exists

This project supports relocation discussions for GCC roles by turning salary expectations into a clear monthly planning view:

- destination market: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain
- expected salary as monthly or annual
- housing, food, transport, family, and other costs
- monthly savings
- annual savings in the selected current-country currency
- equivalent annual package in the selected current-country currency
- current salary country and monthly/annual period

## Tech Stack

- HTML
- CSS
- JavaScript
- Live browser-side exchange-rate fetch with fallback planning rates
- Static configuration inside `script.js`
- GitHub Pages deployment

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

```bash
npx serve .
```

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

1. Push the repository to GitHub.
2. Open repository **Settings**.
3. Go to **Pages**.
4. Set source to **GitHub Actions**.
5. Run the workflow or push to `master`.
6. The app will be available at:

```text
https://taukhir.github.io/gcc-salary-relocation-planner/
```

## Notes

Exchange rates are fetched from a public JSON exchange-rate API when available. Built-in fallback rates keep the app usable when the API is unavailable. Expenses are planning assumptions and should be reviewed before using the calculator for a final compensation decision.

## Author Links

- Portfolio: https://taukhir.github.io/portfolio/
- GitHub: https://github.com/taukhir
- LinkedIn: https://www.linkedin.com/in/tauqeer-ahmed
