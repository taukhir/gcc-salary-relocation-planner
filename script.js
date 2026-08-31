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

const familyMultipliers = {
  single: {
    label: "Single",
    housing: 1,
    food: 1,
    transport: 1,
    family: 0
  },
  couple: {
    label: "Couple",
    housing: 1.2,
    food: 1.55,
    transport: 1.25,
    family: 0.35
  },
  family1: {
    label: "Family with 1 child",
    housing: 1.45,
    food: 1.9,
    transport: 1.45,
    family: 1
  },
  family2: {
    label: "Family with 2 children",
    housing: 1.65,
    food: 2.25,
    transport: 1.6,
    family: 1.55
  }
};

const countryNotes = {
  SAR: "Saudi Arabia: check housing allowance, family visa costs, transport, medical coverage, and whether the offer is base-only or includes benefits.",
  AED: "UAE: rent can dominate the budget. Compare Dubai, Abu Dhabi, and Sharjah assumptions and confirm medical insurance and schooling support.",
  QAR: "Qatar: packages vary by housing and family benefits. Confirm accommodation, transport, schooling, and annual travel support.",
  KWD: "Kuwait: salary can look strong after conversion, but confirm dependent visa rules, housing quality, schooling, and insurance coverage.",
  OMR: "Oman: review rent, schooling, healthcare, and long-term savings because packages can be more stable but less inflated than larger markets.",
  BHD: "Bahrain: compare housing and commute costs carefully and verify medical coverage, family benefits, and contract type."
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
  familyProfile: document.querySelector("#familyProfile"),
  salaryPeriod: document.querySelector("#salaryPeriod"),
  salary: document.querySelector("#salary"),
  housing: document.querySelector("#housing"),
  food: document.querySelector("#food"),
  transport: document.querySelector("#transport"),
  family: document.querySelector("#family"),
  other: document.querySelector("#other"),
  housingProvided: document.querySelector("#housingProvided"),
  medicalProvided: document.querySelector("#medicalProvided"),
  flightsProvided: document.querySelector("#flightsProvided"),
  transportProvided: document.querySelector("#transportProvided"),
  schoolingProvided: document.querySelector("#schoolingProvided"),
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
  salaryUplift: document.querySelector("#salaryUplift"),
  savingsRate: document.querySelector("#savingsRate"),
  compareCurrent: document.querySelector("#compareCurrent"),
  compareOffer: document.querySelector("#compareOffer"),
  decisionCard: document.querySelector("#decisionCard"),
  decisionLabel: document.querySelector("#decisionLabel"),
  decisionReason: document.querySelector("#decisionReason"),
  countryNoteTitle: document.querySelector("#countryNoteTitle"),
  countryNote: document.querySelector("#countryNote"),
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
  applyFamilyDefaults();
}

function applyFamilyDefaults() {
  const selected = marketDefaults[fields.country.value];
  const profile = familyMultipliers[fields.familyProfile.value];
  fields.housing.value = Math.round(selected.housing * profile.housing);
  fields.food.value = Math.round(selected.food * profile.food);
  fields.transport.value = Math.round(selected.transport * profile.transport);
  fields.family.value = Math.round(selected.family * profile.family);
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
  const housingCost = fields.housingProvided.checked ? 0 : numberValue(fields.housing);
  const transportCost = fields.transportProvided.checked ? 0 : numberValue(fields.transport);
  const familyCost = fields.schoolingProvided.checked ? Math.round(numberValue(fields.family) * 0.45) : numberValue(fields.family);
  const otherCost = numberValue(fields.other)
    - (fields.medicalProvided.checked ? Math.round(numberValue(fields.other) * 0.2) : 0)
    - (fields.flightsProvided.checked ? Math.round(numberValue(fields.other) * 0.1) : 0);
  const expenses = housingCost
    + numberValue(fields.food)
    + transportCost
    + familyCost
    + Math.max(otherCost, 0);

  const monthlySavings = salary - expenses;
  const annualSavings = convert(monthlySavings * 12, destinationCode, currentCode);
  const annualPackage = convert(salary * 12, destinationCode, currentCode);
  const currentMonthly = monthlyAmount(numberValue(fields.currentSalary), fields.currentSalaryPeriod.value);
  const currentMonthlyInDestination = convert(currentMonthly, currentCode, destinationCode);
  const usage = salary > 0 ? Math.min((expenses / salary) * 100, 100) : 0;
  const savingsRate = salary > 0 ? (monthlySavings / salary) * 100 : 0;
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
  output.salaryUplift.textContent = `${Math.round(uplift)}%`;
  output.savingsRate.textContent = `${Math.round(savingsRate)}%`;
  output.compareCurrent.textContent = formatCurrency(currentMonthly, currentCode);
  output.compareOffer.textContent = formatCurrency(convert(salary, destinationCode, currentCode), currentCode);
  output.usagePercent.textContent = `${Math.round(usage)}% expenses`;
  output.expenseBar.style.width = `${usage}%`;
  output.countryNoteTitle.textContent = `${selected.label} note`;
  output.countryNote.textContent = countryNotes[destinationCode];

  output.decisionCard.classList.remove("accept", "negotiate", "risk");
  if (monthlySavings <= 0 || savingsRate < 20) {
    output.decisionLabel.textContent = "High-risk";
    output.decisionReason.textContent = `Savings are weak for ${selected.label}. Rework base pay or benefits before accepting.`;
    output.decisionCard.classList.add("risk");
  } else if (usage > 70 || savingsRate < 35 || uplift < 15) {
    output.decisionLabel.textContent = "Negotiate";
    output.decisionReason.textContent = "The scenario is workable, but housing, schooling, transport, or base salary should be negotiated.";
    output.decisionCard.classList.add("negotiate");
  } else if (uplift > 0) {
    output.decisionLabel.textContent = "Strong";
    output.decisionReason.textContent = `This scenario gives about ${Math.round(uplift)}% higher monthly gross and a healthy savings rate.`;
    output.decisionCard.classList.add("accept");
  } else {
    output.decisionLabel.textContent = "Review";
    output.decisionReason.textContent = "Savings are positive, but the gross salary does not clearly beat your current converted monthly salary.";
    output.decisionCard.classList.add("negotiate");
  }
}

fields.country.addEventListener("change", applyMarketDefaults);
fields.familyProfile.addEventListener("change", applyFamilyDefaults);

[
  fields.salaryPeriod,
  fields.salary,
  fields.housing,
  fields.food,
  fields.transport,
  fields.family,
  fields.other,
  fields.housingProvided,
  fields.medicalProvided,
  fields.flightsProvided,
  fields.transportProvided,
  fields.schoolingProvided,
  fields.currentCountry,
  fields.currentSalaryPeriod,
  fields.currentSalary
].forEach((field) => {
  field.addEventListener("input", calculate);
  field.addEventListener("change", calculate);
});

applyMarketDefaults();
loadExchangeRates();
