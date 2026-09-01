# GCC Salary & Relocation Planner

A static salary planning calculator for Gulf job conversations. It helps compare expected salary, living expenses, estimated savings, live currency conversion, and current salary context for Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain.

Built by **Tauqeer Ahmed | taukhir** as a portfolio project.

## Why this project exists

This project supports relocation discussions for GCC roles by turning salary expectations into a clear monthly planning view:

- destination market: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain
- family profile presets: single, couple, family with 1 child, family with 2 children
- expected salary as monthly or annual
- housing, food, transport, family, and other costs
- employer benefits: housing, medical insurance, flights, transport, schooling
- monthly savings
- monthly savings rate
- current salary vs GCC offer comparison
- destination-currency monthly expense and savings view
- home/current-country converted monthly and annual savings
- expense pressure, benefit impact, and break-even salary factors
- decision summary: strong, negotiate, review, or high-risk
- country-specific negotiation notes
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

Exchange rates are fetched from a public JSON exchange-rate API when available. Built-in fallback rates keep the app usable when the API is unavailable.

This planner is guidance only, not financial advice. Verify latest exchange rates, taxes, visa rules, schooling, rent, insurance, contract type, and employer benefits before making a relocation decision.

## Author Links

- Portfolio: https://taukhir.github.io/portfolio/
- GitHub: https://github.com/taukhir
- LinkedIn: https://www.linkedin.com/in/tauqeer-ahmed
