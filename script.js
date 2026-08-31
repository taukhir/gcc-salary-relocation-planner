const marketDefaults = {
  saudi: {
    code: "SAR",
    rate: 22.2,
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
    rate: 22.7,
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
    rate: 22.8,
    salary: 23000,
    housing: 6500,
    food: 1900,
    transport: 900,
    family: 2800,
    other: 1300,
    label: "Qatar"
  }
};

const fields = {
  country: document.querySelector("#country"),
  salary: document.querySelector("#salary"),
  housing: document.querySelector("#housing"),
  food: document.querySelector("#food"),
  transport: document.querySelector("#transport"),
  family: document.querySelector("#family"),
  other: document.querySelector("#other"),
  indiaSalary: document.querySelector("#indiaSalary")
};

const output = {
  monthlySavings: document.querySelector("#monthlySavings"),
  monthlyExpenses: document.querySelector("#monthlyExpenses"),
  annualSavingsInr: document.querySelector("#annualSavingsInr"),
  annualPackageInr: document.querySelector("#annualPackageInr"),
  indiaMonthly: document.querySelector("#indiaMonthly"),
  savingsTone: document.querySelector("#savingsTone"),
  usagePercent: document.querySelector("#usagePercent"),
  expenseBar: document.querySelector("#expenseBar")
};

function numberValue(input) {
  return Number(input.value || 0);
}

function formatCurrency(value, code) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: code
  }).format(value);
}

function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR"
  }).format(value);
}

function applyMarketDefaults() {
  const selected = marketDefaults[fields.country.value];
  fields.salary.value = selected.salary;
  fields.housing.value = selected.housing;
  fields.food.value = selected.food;
  fields.transport.value = selected.transport;
  fields.family.value = selected.family;
  fields.other.value = selected.other;
  calculate();
}

function calculate() {
  const selected = marketDefaults[fields.country.value];
  const salary = numberValue(fields.salary);
  const expenses = numberValue(fields.housing)
    + numberValue(fields.food)
    + numberValue(fields.transport)
    + numberValue(fields.family)
    + numberValue(fields.other);

  const monthlySavings = salary - expenses;
  const annualSavingsInr = monthlySavings * 12 * selected.rate;
  const annualPackageInr = salary * 12 * selected.rate;
  const indiaMonthly = (numberValue(fields.indiaSalary) * 100000) / 12;
  const usage = salary > 0 ? Math.min((expenses / salary) * 100, 100) : 0;

  output.monthlySavings.textContent = formatCurrency(monthlySavings, selected.code);
  output.monthlyExpenses.textContent = formatCurrency(expenses, selected.code);
  output.annualSavingsInr.textContent = formatInr(annualSavingsInr);
  output.annualPackageInr.textContent = formatInr(annualPackageInr);
  output.indiaMonthly.textContent = formatInr(indiaMonthly);
  output.usagePercent.textContent = `${Math.round(usage)}% expenses`;
  output.expenseBar.style.width = `${usage}%`;

  if (monthlySavings <= 0) {
    output.savingsTone.textContent = `This ${selected.label} scenario needs review because expenses consume the full salary.`;
  } else if (usage > 70) {
    output.savingsTone.textContent = `Savings are positive, but costs are high. Negotiate housing, schooling, or relocation support.`;
  } else {
    output.savingsTone.textContent = `This looks like a healthy planning scenario with visible monthly savings after core expenses.`;
  }
}

fields.country.addEventListener("change", applyMarketDefaults);

Object.values(fields)
  .filter((field) => field !== fields.country)
  .forEach((field) => field.addEventListener("input", calculate));

applyMarketDefaults();
