// ===============================
// Personal Finance Tracker Script
// ===============================

// Get elements
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("money-plus");
const expenseEl = document.getElementById("money-minus");
const list = document.getElementById("list");

// Load transactions from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter both text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balanceEl.innerText = `₹${total}`;
  incomeEl.innerText = `₹${income}`;
  expenseEl.innerText = `₹${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init App
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
