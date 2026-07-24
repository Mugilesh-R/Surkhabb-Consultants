const loanAmount = document.getElementById("loanAmount");
const interestRate = document.getElementById("interestRate");
const loanTenure = document.getElementById("loanTenure");

const loanAmountValue = document.getElementById("loanAmountValue");
const interestValue = document.getElementById("interestValue");
const tenureValue = document.getElementById("tenureValue");

const emiValue = document.getElementById("emiValue");
const principal = document.getElementById("principal");
const totalInterest = document.getElementById("totalInterest");

function calculateEMI() {
  let P = loanAmount.value;
  let R = interestRate.value / 12 / 100;
  let N = loanTenure.value;

  let EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  EMI = Math.round(EMI);

  let totalPayable = EMI * N;
  let interest = totalPayable - P;

  emiValue.innerText = `₹${EMI.toLocaleString("en-IN")}`;
  principal.innerText = `₹${Number(P).toLocaleString("en-IN")}`;
  totalInterest.innerText = `₹${Math.round(interest).toLocaleString("en-IN")}`;

  loanAmountValue.innerText = `₹${Number(P).toLocaleString("en-IN")}`;
  interestValue.innerText = `${interestRate.value}%`;
  tenureValue.innerText = `${N} months`;
}

loanAmount.addEventListener("input", calculateEMI);
interestRate.addEventListener("input", calculateEMI);
loanTenure.addEventListener("input", calculateEMI);

calculateEMI();
