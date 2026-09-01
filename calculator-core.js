export function monthlyAmount(amount, period) {
  return period === "annual" ? amount / 12 : amount;
}

export function periodAmount(monthlyValue, period) {
  return period === "annual" ? monthlyValue * 12 : monthlyValue;
}

export function convert(amount, fromCode, toCode, ratesInInr) {
  const fromRate = ratesInInr[fromCode];
  const toRate = ratesInInr[toCode];
  return (amount * fromRate) / toRate;
}

export function calculateScenario({
  destinationCode,
  currentCode,
  salary,
  salaryPeriod,
  destinationExpenses,
  benefits,
  currentSalary,
  currentExpenses,
  destinationTaxRate,
  currentTaxRate,
  ratesInInr
}) {
  const monthlySalary = monthlyAmount(salary, salaryPeriod);
  const destination = destinationExpenses;
  const rawHousing = monthlyAmount(destination.housing, salaryPeriod);
  const rawFood = monthlyAmount(destination.food, salaryPeriod);
  const rawTransport = monthlyAmount(destination.transport, salaryPeriod);
  const rawFamily = monthlyAmount(destination.family, salaryPeriod);
  const rawOther = monthlyAmount(destination.other, salaryPeriod);
  const destinationTax = monthlySalary * (destinationTaxRate / 100);
  const destinationNetSalary = monthlySalary - destinationTax;
  const housingCost = benefits.housingProvided ? 0 : rawHousing;
  const transportCost = benefits.transportProvided ? 0 : rawTransport;
  const familyCost = benefits.schoolingProvided ? Math.round(rawFamily * 0.45) : rawFamily;
  const otherCost = rawOther
    - (benefits.medicalProvided ? Math.round(rawOther * 0.2) : 0)
    - (benefits.flightsProvided ? Math.round(rawOther * 0.1) : 0);
  const expenses = housingCost + rawFood + transportCost + familyCost + Math.max(otherCost, 0);
  const expensesWithoutBenefits = rawHousing + rawFood + rawTransport + rawFamily + rawOther;
  const benefitSavings = Math.max(expensesWithoutBenefits - expenses, 0);
  const monthlySavings = destinationNetSalary - expenses;

  const monthlyCurrentSalary = monthlyAmount(currentSalary, salaryPeriod);
  const currentTax = monthlyCurrentSalary * (currentTaxRate / 100);
  const currentNetSalary = monthlyCurrentSalary - currentTax;
  const currentMonthlyExpenses = Object.values(currentExpenses)
    .reduce((total, value) => total + monthlyAmount(value, salaryPeriod), 0);
  const currentMonthlyHousing = monthlyAmount(currentExpenses.housing, salaryPeriod);
  const currentSavings = currentNetSalary - currentMonthlyExpenses;
  const savingsSentHome = convert(monthlySavings, destinationCode, currentCode, ratesInInr);
  const netImprovement = savingsSentHome - currentSavings;
  const currentMonthlyInDestination = convert(monthlyCurrentSalary, currentCode, destinationCode, ratesInInr);
  const usage = destinationNetSalary > 0 ? Math.min((expenses / destinationNetSalary) * 100, 100) : 0;
  const savingsRate = destinationNetSalary > 0 ? (monthlySavings / destinationNetSalary) * 100 : 0;
  const currentSavingsRate = currentNetSalary > 0 ? (currentSavings / currentNetSalary) * 100 : 0;
  const currentExpenseBurden = currentNetSalary > 0 ? (currentMonthlyExpenses / currentNetSalary) * 100 : 0;
  const destinationHousingBurden = destinationNetSalary > 0 ? (rawHousing / destinationNetSalary) * 100 : 0;
  const currentHousingBurden = currentNetSalary > 0 ? (currentMonthlyHousing / currentNetSalary) * 100 : 0;
  const uplift = currentMonthlyInDestination > 0
    ? ((monthlySalary - currentMonthlyInDestination) / currentMonthlyInDestination) * 100
    : 0;
  const breakEvenSalary = expenses / 0.65;
  const savingsDifference = savingsSentHome - currentSavings;
  const savingsDifferencePercent = currentSavings !== 0
    ? (savingsDifference / Math.abs(currentSavings)) * 100
    : null;

  return {
    monthlySalary,
    destinationTax,
    destinationNetSalary,
    expenses,
    benefitSavings,
    monthlySavings,
    monthlyCurrentSalary,
    currentTax,
    currentNetSalary,
    currentMonthlyExpenses,
    currentSavings,
    savingsSentHome,
    netImprovement,
    usage,
    savingsRate,
    currentSavingsRate,
    currentExpenseBurden,
    destinationHousingBurden,
    currentHousingBurden,
    uplift,
    breakEvenSalary,
    savingsDifference,
    savingsDifferencePercent
  };
}
