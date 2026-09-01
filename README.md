# GCC Salary & Relocation Planner

A static salary planning calculator for Gulf job conversations. It helps compare expected salary, living expenses, estimated savings, live currency conversion, and current salary context for Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain.

Built by **Tauqeer Ahmed | taukhir** as a portfolio project.

## Why this project exists

This project supports relocation discussions for GCC roles by turning salary expectations into a clear monthly planning view:

- destination market: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain
- family profile presets: single, couple, family with 1 child, family with 2 children
- expected salary as monthly or annual
- destination housing, food, transport, family, and other cost assumptions entered as monthly or annual values
- employer benefits: housing, medical insurance, flights, transport, schooling
- editable estimated effective tax rate for both scenarios, with country defaults
- monthly savings
- monthly savings rate
- current salary vs GCC offer comparison
- destination-currency monthly expense and savings view
- current-country monthly expense presets and editable home expense assumptions
- home-country savings today after current expenses
- destination-country savings after GCC expenses
- GCC savings converted back to the selected home/current-country currency
- net savings improvement compared with staying in the current country
- linked monthly/annual input periods: changing the GCC salary period updates destination expense labels and values while preserving the same monthly economics
- current-country salary and expense inputs can also be entered monthly or annually
- separate result view for monthly or annual totals
- dynamic country-specific comparison labels instead of generic home/destination wording
- side-by-side tax, net savings rate, better-country, additional savings, and percentage-difference metrics
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

This planner is decision support, not tax or financial advice. Tax defaults are simplified effective-rate estimates: most GCC employment scenarios are modeled at 0%, while India defaults to an editable 20% planning estimate. Verify residency, deductions, social insurance, visa rules, schooling, rent, insurance, contract type, and employer benefits before making a relocation decision.

## Author Links

- Portfolio: https://taukhir.github.io/portfolio/
- GitHub: https://github.com/taukhir
- LinkedIn: https://www.linkedin.com/in/tauqeer-ahmed
