const currencies = {
  INR: { label: "India", locale: "en-IN" },
  SAR: { label: "Saudi Arabia", locale: "en-SA" },
  AED: { label: "United Arab Emirates", locale: "en-AE" },
  QAR: { label: "Qatar", locale: "en-QA" },
  KWD: { label: "Kuwait", locale: "en-KW" },
  OMR: { label: "Oman", locale: "en-OM" },
  BHD: { label: "Bahrain", locale: "en-BH" }
};

const marketDefaults = {
  saudi: {
    code: "SAR",
    salary: 22000,
    housing: 5500,
    food: 1800,
    transport: 900,
    family: 2500,
    other: 1200,
    label: "Saudi Arabia"
  },
  uae: {
    code: "AED",
    salary: 24000,
    housing: 7500,
    food: 2200,
    transport: 1200,
    family: 3200,
    other: 1600,
    label: "United Arab Emirates"
  },
  qatar: {
    code: "QAR",
    salary: 23000,
    housing: 6500,
    food: 1900,
    transport: 900,
    family: 2800,
    other: 1300,
    label: "Qatar"
  },
  kuwait: {
    code: "KWD",
    salary: 1800,
    housing: 450,
    food: 160,
    transport: 80,
    family: 260,
    other: 120,
    label: "Kuwait"
  },
  oman: {
    code: "OMR",
    salary: 2200,
    housing: 520,
    food: 170,
    transport: 90,
    family: 280,
    other: 130,
    label: "Oman"
  },
  bahrain: {
    code: "BHD",
    salary: 2200,
    housing: 500,
    food: 170,
    transport: 80,
    family: 270,
    other: 130,
    label: "Bahrain"
  }
};

const fallbackRatesInInr = {
  INR: 1,
  SAR: 22.2,
  AED: 22.7,
  QAR: 22.8,
  KWD: 272,
  OMR: 216,
  BHD: 221
};

let ratesInInr = { ...fallbackRatesInInr };
let liveRatesLoaded = false;

const fields = {
  country: document.querySelector("#country"),
  salaryPeriod: document.querySelector("#salaryPeriod"),
  salary: document.querySelector("#salary"),
  housing: document.querySelector("#housing"),
  food: document.querySelector("#food"),
  transport: document.querySelector("#transport"),
  family: document.querySelector("#family"),
  other: document.querySelector("#other"),
  currentCountry: document.querySelector("#currentCountry"),
  currentSalaryPeriod: document.querySelector("#currentSalaryPeriod"),
  currentSalary: document.querySelector("#currentSalary")
};

const output = {
  monthlySavings: document.querySelector("#monthlySavings"),
  monthlyExpenses: document.querySelector("#monthlyExpenses"),
  annualSavings: document.querySelector("#annualSavings"),
  annualSavingsLabel: document.querySelector("#annualSavingsLabel"),
  annualPackage: document.querySelector("#annualPackage"),
  annualPackageLabel: document.querySelector("#annualPackageLabel"),
  currentMonthly: document.querySelector("#currentMonthly"),
  savingsTone: document.querySelector("#savingsTone"),
  usagePercent: document.querySelector("#usagePercent"),
  expenseBar: document.querySelector("#expenseBar"),
  rateStatus: document.querySelector("#rateStatus")
};

function numberValue(input) {
  return Number(input.value || 0);
}

function formatCurrency(value, code) {
  const locale = currencies[code]?.locale || "en-IN";
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: code === "KWD" || code === "OMR" || code === "BHD" ? 3 : 0,
    style: "currency",
    currency: code
  }).format(value);
}

function monthlyAmount(amount, period) {
  return period === "annual" ? amount / 12 : amount;
}

function convert(amount, fromCode, toCode) {
  const fromRate = ratesInInr[fromCode] || fallbackRatesInInr[fromCode];
  const toRate = ratesInInr[toCode] || fallbackRatesInInr[toCode];
  return (amount * fromRate) / toRate;
}

function applyMarketDefaults() {
  const selected = marketDefaults[fields.country.value];
  fields.salaryPeriod.value = "monthly";
  fields.salary.value = selected.salary;
  fields.housing.value = selected.housing;
  fields.food.value = selected.food;
  fields.transport.value = selected.transport;
  fields.family.value = selected.family;
  fields.other.value = selected.other;
  calculate();
}

function updateRateStatus() {
  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  output.rateStatus.textContent = liveRatesLoaded
    ? `Live exchange rates loaded. Last checked: ${timestamp}.`
    : "Using fallback planning exchange rates. Live rates could not be loaded.";
}

async function loadExchangeRates() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/INR", {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`Exchange API returned ${response.status}`);
    }
    const data = await response.json();
    if (!data.rates) {
      throw new Error("Exchange API response did not include rates");
    }

    ratesInInr = Object.keys(fallbackRatesInInr).reduce((rates, code) => {
      if (code === "INR") {
        rates[code] = 1;
      } else if (data.rates[code]) {
        rates[code] = 1 / data.rates[code];
      } else {
        rates[code] = fallbackRatesInInr[code];
      }
      return rates;
    }, {});
    liveRatesLoaded = true;
  } catch (error) {
    console.warn("Falling back to built-in exchange rates.", error);
    ratesInInr = { ...fallbackRatesInInr };
    liveRatesLoaded = false;
  }

  updateRateStatus();
  calculate();
}

function calculate() {
  const selected = marketDefaults[fields.country.value];
  const destinationCode = selected.code;
  const currentCode = fields.currentCountry.value;
  const salary = monthlyAmount(numberValue(fields.salary), fields.salaryPeriod.value);
  const expenses = numberValue(fields.housing)
    + numberValue(fields.food)
    + numberValue(fields.transport)
    + numberValue(fields.family)
    + numberValue(fields.other);

  const monthlySavings = salary - expenses;
  const annualSavings = convert(monthlySavings * 12, destinationCode, currentCode);
  const annualPackage = convert(salary * 12, destinationCode, currentCode);
  const currentMonthly = monthlyAmount(numberValue(fields.currentSalary), fields.currentSalaryPeriod.value);
  const currentMonthlyInDestination = convert(currentMonthly, currentCode, destinationCode);
  const usage = salary > 0 ? Math.min((expenses / salary) * 100, 100) : 0;
  const uplift = currentMonthlyInDestination > 0
    ? ((salary - currentMonthlyInDestination) / currentMonthlyInDestination) * 100
    : 0;

  output.monthlySavings.textContent = formatCurrency(monthlySavings, destinationCode);
  output.monthlyExpenses.textContent = formatCurrency(expenses, destinationCode);
  output.annualSavings.textContent = formatCurrency(annualSavings, currentCode);
  output.annualSavingsLabel.textContent = `Annual savings in ${currentCode}`;
  output.annualPackage.textContent = formatCurrency(annualPackage, currentCode);
  output.annualPackageLabel.textContent = `Equivalent annual package in ${currentCode}`;
  output.currentMonthly.textContent = formatCurrency(currentMonthly, currentCode);
  output.usagePercent.textContent = `${Math.round(usage)}% expenses`;
  output.expenseBar.style.width = `${usage}%`;

  if (monthlySavings <= 0) {
    output.savingsTone.textContent = `This ${selected.label} scenario needs review because expenses consume the full salary.`;
  } else if (usage > 70) {
    output.savingsTone.textContent = "Savings are positive, but costs are high. Negotiate housing, schooling, or relocation support.";
  } else if (uplift > 0) {
    output.savingsTone.textContent = `This scenario gives roughly ${Math.round(uplift)}% higher monthly gross than your current salary after currency conversion.`;
  } else {
    output.savingsTone.textContent = "This scenario has positive savings, but the gross salary is not higher than your current converted monthly salary.";
  }
}

fields.country.addEventListener("change", applyMarketDefaults);

[
  fields.salaryPeriod,
  fields.salary,
  fields.housing,
  fields.food,
  fields.transport,
  fields.family,
  fields.other,
  fields.currentCountry,
  fields.currentSalaryPeriod,
  fields.currentSalary
].forEach((field) => field.addEventListener("input", calculate));

applyMarketDefaults();
loadExchangeRates();
