import test from "node:test";
import assert from "node:assert/strict";
import { calculateScenario, convert, monthlyAmount, periodAmount } from "../calculator-core.js";

const rates = { INR: 1, SAR: 20 };

const baseScenario = (overrides = {}) => ({
  destinationCode: "SAR",
  currentCode: "INR",
  salary: 20000,
  salaryPeriod: "monthly",
  destinationExpenses: { housing: 5000, food: 2000, transport: 1000, family: 1000, other: 1000 },
  benefits: { housingProvided: false, transportProvided: false, schoolingProvided: false, medicalProvided: false, flightsProvided: false },
  currentSalary: 200000,
  currentExpenses: { housing: 50000, food: 20000, transport: 10000, other: 20000 },
  destinationTaxRate: 0,
  currentTaxRate: 0,
  ratesInInr: rates,
  ...overrides
});

test("converts monthly and annual values consistently", () => {
  assert.equal(monthlyAmount(120000, "annual"), 10000);
  assert.equal(periodAmount(10000, "annual"), 120000);
  const monthly = calculateScenario(baseScenario());
  const annual = calculateScenario(baseScenario({
    salary: 240000,
    salaryPeriod: "annual",
    destinationExpenses: { housing: 60000, food: 24000, transport: 12000, family: 12000, other: 12000 },
    currentSalary: 2400000,
    currentExpenses: { housing: 600000, food: 240000, transport: 120000, other: 240000 }
  }));
  assert.equal(annual.monthlySavings, monthly.monthlySavings);
  assert.equal(annual.currentSavings, monthly.currentSavings);
});

test("converts between currencies using the supplied rates", () => {
  assert.equal(convert(1000, "SAR", "INR", rates), 20000);
  assert.equal(convert(20000, "INR", "SAR", rates), 1000);
});

test("deducts destination and current-country taxes before savings", () => {
  const result = calculateScenario(baseScenario({ destinationTaxRate: 10, currentTaxRate: 20 }));
  assert.equal(result.destinationTax, 2000);
  assert.equal(result.destinationNetSalary, 18000);
  assert.equal(result.currentTax, 40000);
  assert.equal(result.currentNetSalary, 160000);
});

test("applies employer benefits and rounds benefit reductions", () => {
  const withoutBenefits = calculateScenario(baseScenario());
  const withBenefits = calculateScenario(baseScenario({
    benefits: { housingProvided: true, transportProvided: true, schoolingProvided: true, medicalProvided: true, flightsProvided: true }
  }));
  assert.equal(withBenefits.expenses, 3150);
  assert.ok(withBenefits.expenses < withoutBenefits.expenses);
  assert.equal(withBenefits.benefitSavings, withoutBenefits.expenses - withBenefits.expenses);
});

test("preserves negative savings as a decision signal", () => {
  const result = calculateScenario(baseScenario({
    salary: 5000,
    destinationExpenses: { housing: 5000, food: 2000, transport: 1000, family: 1000, other: 1000 }
  }));
  assert.equal(result.monthlySavings, -5000);
  assert.equal(result.savingsDifference, -200000);
});

test("keeps annual result amounts precise before display rounding", () => {
  const result = calculateScenario(baseScenario({ salary: 10000, destinationTaxRate: 7.5 }));
  assert.equal(result.destinationTax, 750);
  assert.equal(Math.round(periodAmount(result.destinationTax, "annual")), 9000);
});
