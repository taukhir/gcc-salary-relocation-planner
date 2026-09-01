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

const currentExpenseDefaults = {
  INR: {
    housing: 45000,
    food: 22000,
    transport: 12000,
    other: 28000
  },
  SAR: {
    housing: 5500,
    food: 1800,
    transport: 900,
    other: 2200
  },
  AED: {
    housing: 7500,
    food: 2200,
    transport: 1200,
    other: 3000
  },
  QAR: {
    housing: 6500,
    food: 1900,
    transport: 900,
    other: 2500
  },
  KWD: {
    housing: 450,
    food: 160,
    transport: 80,
    other: 250
  },
  OMR: {
    housing: 520,
    food: 170,
    transport: 90,
    other: 270
  },
  BHD: {
    housing: 500,
    food: 170,
    transport: 80,
    other: 260
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
  SAR: "Saudi Arabia: employment income is generally modeled at 0% personal income tax. Check housing allowance, family visa costs, transport, medical coverage, and whether the offer is base-only or includes benefits.",
  AED: "UAE: employment income is generally modeled at 0% personal income tax. Rent can dominate the budget, so compare Dubai, Abu Dhabi, and Sharjah assumptions and confirm benefits.",
  QAR: "Qatar: employment salary is generally modeled at 0% personal income tax. Packages vary by housing and family benefits; confirm accommodation, transport, schooling, and annual travel support.",
  KWD: "Kuwait: employment salary is generally modeled at 0% personal income tax. Confirm dependent visa rules, housing quality, schooling, and insurance coverage.",
  OMR: "Oman: this planner models 0% personal income tax today. Oman has announced 5% PIT above OMR 42,000 from 2028; review the effective date and deductions before relying on this estimate.",
  BHD: "Bahrain: employment salary is generally modeled at 0% personal income tax. Compare housing and commute costs carefully and verify medical coverage, family benefits, and contract type."
};

const defaultTaxRates = {
  INR: 20,
  SAR: 0,
  AED: 0,
  QAR: 0,
  KWD: 0,
  OMR: 0,
  BHD: 0
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
  taxRate: document.querySelector("#taxRate"),
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
  currentSalary: document.querySelector("#currentSalary"),
  currentTaxRate: document.querySelector("#currentTaxRate"),
  currentHousing: document.querySelector("#currentHousing"),
  currentFood: document.querySelector("#currentFood"),
  currentTransport: document.querySelector("#currentTransport"),
  currentOther: document.querySelector("#currentOther")
};

const inputLabels = {
  housing: document.querySelector("#housingLabel"),
  food: document.querySelector("#foodLabel"),
  transport: document.querySelector("#transportLabel"),
  family: document.querySelector("#familyLabel"),
  other: document.querySelector("#otherLabel"),
  currentHeading: document.querySelector("#currentExpenseHeading"),
  currentHelp: document.querySelector("#currentExpenseHelp"),
  currentHousing: document.querySelector("#currentHousingLabel"),
  currentFood: document.querySelector("#currentFoodLabel"),
  currentTransport: document.querySelector("#currentTransportLabel"),
  currentOther: document.querySelector("#currentOtherLabel")
};

const output = {
  monthlySavings: document.querySelector("#monthlySavings"),
  monthlyExpenses: document.querySelector("#monthlyExpenses"),
  homeExpenses: document.querySelector("#homeExpenses"),
  homeSavings: document.querySelector("#homeSavings"),
  destinationTax: document.querySelector("#destinationTax"),
  homeTax: document.querySelector("#homeTax"),
  destinationNetIncome: document.querySelector("#destinationNetIncome"),
  homeNetIncome: document.querySelector("#homeNetIncome"),
  destinationExpenseBurden: document.querySelector("#destinationExpenseBurden"),
  homeExpenseBurden: document.querySelector("#homeExpenseBurden"),
  destinationHousingBurden: document.querySelector("#destinationHousingBurden"),
  homeHousingBurden: document.querySelector("#homeHousingBurden"),
  destinationSavingsRate: document.querySelector("#destinationSavingsRate"),
  homeSavingsRate: document.querySelector("#homeSavingsRate"),
  betterCountry: document.querySelector("#betterCountry"),
  betterCountryLabel: document.querySelector("#betterCountryLabel"),
  savingsDifference: document.querySelector("#savingsDifference"),
  savingsDifferenceLabel: document.querySelector("#savingsDifferenceLabel"),
  savingsDifferencePercent: document.querySelector("#savingsDifferencePercent"),
  savingsDifferencePercentLabel: document.querySelector("#savingsDifferencePercentLabel"),
  calculationPeriod: document.querySelector("#calculationPeriod"),
  comparisonDestination: document.querySelector("#comparisonDestination"),
  comparisonCurrent: document.querySelector("#comparisonCurrent"),
  currentMonthlyLabel: document.querySelector("#currentMonthlyLabel"),
  offerMonthlyLabel: document.querySelector("#offerMonthlyLabel"),
  salaryUpliftLabel: document.querySelector("#salaryUpliftLabel"),
  salaryUplift: document.querySelector("#salaryUplift"),
  compareCurrent: document.querySelector("#compareCurrent"),
  compareOffer: document.querySelector("#compareOffer"),
  expensePressure: document.querySelector("#expensePressure"),
  expensePressureText: document.querySelector("#expensePressureText"),
  benefitImpact: document.querySelector("#benefitImpact"),
  benefitImpactText: document.querySelector("#benefitImpactText"),
  breakEvenSalary: document.querySelector("#breakEvenSalary"),
  breakEvenText: document.querySelector("#breakEvenText"),
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

function periodAmount(monthlyValue, period) {
  return period === "annual" ? monthlyValue * 12 : monthlyValue;
}

function periodLabel(period) {
  return period === "annual" ? "Annual" : "Monthly";
}

function changePeriodValue(input, fromPeriod, toPeriod) {
  const monthlyValue = monthlyAmount(numberValue(input), fromPeriod);
  input.value = Math.round(periodAmount(monthlyValue, toPeriod));
}

function convertInputGroup(periodField, linkedFields) {
  const nextPeriod = periodField.value;
  const previousPeriod = periodField.dataset.previousPeriod || nextPeriod;
  if (previousPeriod !== nextPeriod) {
    linkedFields.forEach((input) => changePeriodValue(input, previousPeriod, nextPeriod));
  }
  periodField.dataset.previousPeriod = nextPeriod;
}

function updateInputLabels() {
  const destinationPeriod = periodLabel(fields.salaryPeriod.value).toLowerCase();
  const currentPeriod = destinationPeriod;
  const destinationLabel = marketDefaults[fields.country.value].label;
  const currentLabel = currencies[fields.currentCountry.value].label;
  const destinationLabels = {
    housing: `${destinationLabel} ${destinationPeriod} housing`,
    food: `${destinationLabel} ${destinationPeriod} food and groceries`,
    transport: `${destinationLabel} ${destinationPeriod} transport`,
    family: `${destinationLabel} ${destinationPeriod} family / dependents`,
    other: `${destinationLabel} ${destinationPeriod} other expenses`
  };
  Object.entries(destinationLabels).forEach(([key, label]) => {
    inputLabels[key].textContent = label;
  });
  inputLabels.currentHeading.textContent = `${currentLabel} ${currentPeriod} expenses`;
  inputLabels.currentHelp.textContent = `Enter ${currentPeriod} costs. Both countries follow the shared calculation period.`;
  inputLabels.currentHousing.textContent = `${currentLabel} ${currentPeriod} housing`;
  inputLabels.currentFood.textContent = `${currentLabel} ${currentPeriod} food and groceries`;
  inputLabels.currentTransport.textContent = `${currentLabel} ${currentPeriod} transport`;
  inputLabels.currentOther.textContent = `${currentLabel} ${currentPeriod} family / other`;
}

function convert(amount, fromCode, toCode) {
  const fromRate = ratesInInr[fromCode] || fallbackRatesInInr[fromCode];
  const toRate = ratesInInr[toCode] || fallbackRatesInInr[toCode];
  return (amount * fromRate) / toRate;
}

function applyMarketDefaults() {
  const selected = marketDefaults[fields.country.value];
  fields.salaryPeriod.value = "monthly";
  fields.salaryPeriod.dataset.previousPeriod = "monthly";
  fields.salary.value = selected.salary;
  fields.taxRate.value = defaultTaxRates[selected.code];
  applyFamilyDefaults();
  updateInputLabels();
}

function applyCurrentExpenseDefaults() {
  const selected = currentExpenseDefaults[fields.currentCountry.value];
  fields.currentHousing.value = selected.housing;
  fields.currentFood.value = selected.food;
  fields.currentTransport.value = selected.transport;
  fields.currentOther.value = selected.other;
  fields.currentTaxRate.value = defaultTaxRates[fields.currentCountry.value];
  [fields.currentHousing, fields.currentFood, fields.currentTransport, fields.currentOther]
    .forEach((input) => changePeriodValue(input, "monthly", fields.salaryPeriod.value));
  updateInputLabels();
  calculate();
}

function applyFamilyDefaults() {
  const selected = marketDefaults[fields.country.value];
  const profile = familyMultipliers[fields.familyProfile.value];
  const period = fields.salaryPeriod.value;
  fields.housing.value = Math.round(periodAmount(selected.housing * profile.housing, period));
  fields.food.value = Math.round(periodAmount(selected.food * profile.food, period));
  fields.transport.value = Math.round(periodAmount(selected.transport * profile.transport, period));
  fields.family.value = Math.round(periodAmount(selected.family * profile.family, period));
  fields.other.value = Math.round(periodAmount(selected.other, period));
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
  const resultPeriod = fields.salaryPeriod.value;
  const periodName = periodLabel(resultPeriod);
  const salary = monthlyAmount(numberValue(fields.salary), fields.salaryPeriod.value);
  const destinationInputPeriod = fields.salaryPeriod.value;
  const rawHousing = monthlyAmount(numberValue(fields.housing), destinationInputPeriod);
  const rawFood = monthlyAmount(numberValue(fields.food), destinationInputPeriod);
  const rawTransport = monthlyAmount(numberValue(fields.transport), destinationInputPeriod);
  const rawFamily = monthlyAmount(numberValue(fields.family), destinationInputPeriod);
  const rawOther = monthlyAmount(numberValue(fields.other), destinationInputPeriod);
  const destinationTaxRate = Math.max(0, Math.min(numberValue(fields.taxRate), 100));
  const destinationTax = salary * (destinationTaxRate / 100);
  const destinationNetSalary = salary - destinationTax;
  const housingCost = fields.housingProvided.checked ? 0 : rawHousing;
  const transportCost = fields.transportProvided.checked ? 0 : rawTransport;
  const familyCost = fields.schoolingProvided.checked ? Math.round(rawFamily * 0.45) : rawFamily;
  const otherCost = rawOther
    - (fields.medicalProvided.checked ? Math.round(rawOther * 0.2) : 0)
    - (fields.flightsProvided.checked ? Math.round(rawOther * 0.1) : 0);
  const expenses = housingCost
    + rawFood
    + transportCost
    + familyCost
    + Math.max(otherCost, 0);
  const expensesWithoutBenefits = rawHousing + rawFood + rawTransport + rawFamily + rawOther;
  const benefitSavings = Math.max(expensesWithoutBenefits - expenses, 0);

  const monthlySavings = destinationNetSalary - expenses;
  const currentMonthly = monthlyAmount(numberValue(fields.currentSalary), fields.salaryPeriod.value);
  const currentTaxRate = Math.max(0, Math.min(numberValue(fields.currentTaxRate), 100));
  const currentTax = currentMonthly * (currentTaxRate / 100);
  const currentNetSalary = currentMonthly - currentTax;
  const currentExpensePeriod = fields.salaryPeriod.value;
  const currentExpenses = monthlyAmount(numberValue(fields.currentHousing), currentExpensePeriod)
    + monthlyAmount(numberValue(fields.currentFood), currentExpensePeriod)
    + monthlyAmount(numberValue(fields.currentTransport), currentExpensePeriod)
    + monthlyAmount(numberValue(fields.currentOther), currentExpensePeriod);
  const currentSavings = currentNetSalary - currentExpenses;
  const currentHousing = monthlyAmount(numberValue(fields.currentHousing), currentExpensePeriod);
  const savingsSentHome = convert(monthlySavings, destinationCode, currentCode);
  const netImprovement = savingsSentHome - currentSavings;
  const currentMonthlyInDestination = convert(currentMonthly, currentCode, destinationCode);
  const usage = destinationNetSalary > 0 ? Math.min((expenses / destinationNetSalary) * 100, 100) : 0;
  const savingsRate = destinationNetSalary > 0 ? (monthlySavings / destinationNetSalary) * 100 : 0;
  const currentSavingsRate = currentNetSalary > 0 ? (currentSavings / currentNetSalary) * 100 : 0;
  const currentExpenseBurden = currentNetSalary > 0 ? (currentExpenses / currentNetSalary) * 100 : 0;
  const destinationHousingBurden = destinationNetSalary > 0 ? (rawHousing / destinationNetSalary) * 100 : 0;
  const currentHousingBurden = currentNetSalary > 0 ? (currentHousing / currentNetSalary) * 100 : 0;
  const uplift = currentMonthlyInDestination > 0
    ? ((salary - currentMonthlyInDestination) / currentMonthlyInDestination) * 100
    : 0;
  const breakEvenSalary = expenses / 0.65;
  const savingsDifference = savingsSentHome - currentSavings;
  const savingsDifferencePercent = currentSavings !== 0
    ? (savingsDifference / Math.abs(currentSavings)) * 100
    : null;
  const destinationLabel = selected.label;
  const currentLabel = currencies[currentCode].label;
  const betterCountry = savingsDifference > 0 ? destinationLabel : savingsDifference < 0 ? currentLabel : "Same outcome";

  output.calculationPeriod.textContent = periodName;
  output.comparisonDestination.textContent = `${destinationLabel} · ${destinationCode}`;
  output.comparisonCurrent.textContent = `${currentLabel} · ${currentCode}`;
  output.betterCountryLabel.textContent = `Better savings outcome: ${destinationLabel} vs ${currentLabel}`;
  output.savingsDifferenceLabel.textContent = savingsDifference === 0
    ? "Savings difference"
    : `More saved in ${betterCountry} vs ${betterCountry === destinationLabel ? currentLabel : destinationLabel}`;
  output.savingsDifferencePercentLabel.textContent = `Savings difference: ${destinationLabel} vs ${currentLabel}`;
  output.monthlySavings.textContent = formatCurrency(periodAmount(monthlySavings, resultPeriod), destinationCode);
  output.monthlyExpenses.textContent = formatCurrency(periodAmount(expenses, resultPeriod), destinationCode);
  output.homeExpenses.textContent = formatCurrency(periodAmount(currentExpenses, resultPeriod), currentCode);
  output.homeSavings.textContent = formatCurrency(periodAmount(currentSavings, resultPeriod), currentCode);
  output.destinationTax.textContent = formatCurrency(periodAmount(destinationTax, resultPeriod), destinationCode);
  output.homeTax.textContent = formatCurrency(periodAmount(currentTax, resultPeriod), currentCode);
  output.destinationNetIncome.textContent = formatCurrency(periodAmount(destinationNetSalary, resultPeriod), destinationCode);
  output.homeNetIncome.textContent = formatCurrency(periodAmount(currentNetSalary, resultPeriod), currentCode);
  output.destinationExpenseBurden.textContent = `${Math.round(usage)}%`;
  output.homeExpenseBurden.textContent = `${Math.round(currentExpenseBurden)}%`;
  output.destinationHousingBurden.textContent = `${Math.round(destinationHousingBurden)}%`;
  output.homeHousingBurden.textContent = `${Math.round(currentHousingBurden)}%`;
  output.destinationSavingsRate.textContent = `${Math.round(savingsRate)}%`;
  output.homeSavingsRate.textContent = `${Math.round(currentSavingsRate)}%`;
  output.betterCountry.textContent = betterCountry;
  output.savingsDifference.textContent = formatCurrency(periodAmount(Math.abs(savingsDifference), resultPeriod), currentCode);
  output.savingsDifferencePercent.textContent = savingsDifferencePercent === null
    ? "New baseline"
    : `${savingsDifferencePercent >= 0 ? "+" : ""}${Math.round(savingsDifferencePercent)}%`;
  output.currentMonthlyLabel.textContent = `${currentLabel} ${periodName.toLowerCase()} gross`;
  output.offerMonthlyLabel.textContent = `${destinationLabel} ${periodName.toLowerCase()} gross converted to ${currentCode}`;
  output.salaryUpliftLabel.textContent = `Gross offer uplift`;
  output.salaryUplift.textContent = `${Math.round(uplift)}%`;
  output.compareCurrent.textContent = formatCurrency(periodAmount(currentMonthly, resultPeriod), currentCode);
  output.compareOffer.textContent = formatCurrency(periodAmount(convert(salary, destinationCode, currentCode), resultPeriod), currentCode);
  output.expensePressure.textContent = `${Math.round(usage)}%`;
  output.expensePressureText.textContent = usage > 70
    ? `Destination expenses use ${Math.round(usage)}% of income; benefits matter.`
    : `Destination savings rate is ${Math.round(savingsRate)}%. Current savings rate is ${Math.round(currentSavingsRate)}%.`;
  output.benefitImpact.textContent = formatCurrency(periodAmount(benefitSavings, resultPeriod), destinationCode);
  output.benefitImpactText.textContent = benefitSavings > 0
    ? `Estimated ${periodName.toLowerCase()} cost removed by selected employer benefits.`
    : "No employer benefits selected yet.";
  output.breakEvenSalary.textContent = formatCurrency(periodAmount(breakEvenSalary, resultPeriod), destinationCode);
  output.breakEvenText.textContent = `Approximate ${periodName.toLowerCase()} salary needed to keep expenses near 65%.`;
  output.usagePercent.textContent = `${Math.round(usage)}% expenses`;
  output.expenseBar.style.width = `${usage}%`;
  output.countryNoteTitle.textContent = `${selected.label} note`;
  output.countryNote.textContent = `${countryNotes[destinationCode]} Current-country tax is modeled at ${currentTaxRate}% effective tax for comparison; adjust it for your actual tax regime and deductions.`;

  output.decisionCard.classList.remove("accept", "negotiate", "risk");
  if (monthlySavings <= 0 || savingsRate < 20) {
    output.decisionLabel.textContent = "High-risk";
    output.decisionReason.textContent = `Savings are weak for ${selected.label}. Rework base pay or benefits before accepting.`;
    output.decisionCard.classList.add("risk");
  } else if (usage > 70 || savingsRate < 35 || uplift < 15 || netImprovement <= 0) {
    output.decisionLabel.textContent = "Negotiate";
    output.decisionReason.textContent = "The scenario is workable, but compare net savings against your current country before accepting.";
    output.decisionCard.classList.add("negotiate");
  } else if (uplift > 0) {
    output.decisionLabel.textContent = "Strong";
    output.decisionReason.textContent = `This scenario gives about ${Math.round(uplift)}% higher gross and improves take-home savings after expenses.`;
    output.decisionCard.classList.add("accept");
  } else {
    output.decisionLabel.textContent = "Review";
    output.decisionReason.textContent = "Savings are positive, but the gross salary does not clearly beat your current converted monthly salary.";
    output.decisionCard.classList.add("negotiate");
  }
}

fields.country.addEventListener("change", applyMarketDefaults);
fields.familyProfile.addEventListener("change", applyFamilyDefaults);
fields.currentCountry.addEventListener("change", applyCurrentExpenseDefaults);
fields.salaryPeriod.addEventListener("change", () => {
  convertInputGroup(fields.salaryPeriod, [
    fields.salary,
    fields.housing,
    fields.food,
    fields.transport,
    fields.family,
    fields.other,
    fields.currentSalary,
    fields.currentHousing,
    fields.currentFood,
    fields.currentTransport,
    fields.currentOther
  ]);
  updateInputLabels();
  calculate();
});

[
  fields.salary,
  fields.housing,
  fields.food,
  fields.transport,
  fields.family,
  fields.other,
  fields.taxRate,
  fields.housingProvided,
  fields.medicalProvided,
  fields.flightsProvided,
  fields.transportProvided,
  fields.schoolingProvided,
  fields.currentSalary,
  fields.currentTaxRate,
  fields.currentHousing,
  fields.currentFood,
  fields.currentTransport,
  fields.currentOther
].forEach((field) => {
  field.addEventListener("input", calculate);
  field.addEventListener("change", calculate);
});

applyMarketDefaults();
applyCurrentExpenseDefaults();
fields.salaryPeriod.dataset.previousPeriod = fields.salaryPeriod.value;
updateInputLabels();
loadExchangeRates();
