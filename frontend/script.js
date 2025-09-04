// ------------------- Expense Tracker Frontend -------------------

// Get stored expenses from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ------------------- Add Expense -------------------
const addExpenseForm = document.querySelector("form");
if (addExpenseForm && addExpenseForm.querySelector("#amount")) {
  addExpenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.querySelector("#date").value;
    const category = document.querySelector("#category").value;
    const description = document.querySelector("#description").value;
    const amount = document.querySelector("#amount").value;

    if (!date || !category || !description || !amount) {
      alert("Please fill all fields!");
      return;
    }

    const newExpense = { date, category, description, amount };
    expenses.push(newExpense);

    // Save to localStorage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Expense added successfully ✅");
    addExpenseForm.reset();
  });
}

// ------------------- Display Expenses (Dashboard) -------------------
const expensesTable = document.querySelector("tbody");
if (expensesTable) {
  function loadExpenses() {
    expensesTable.innerHTML = "";
    expenses.forEach((exp, index) => {
      const row = `
        <tr>
          <td>${exp.date}</td>
          <td>${exp.category}</td>
          <td>${exp.description}</td>
          <td>₹${exp.amount}</td>
        </tr>
      `;
      expensesTable.innerHTML += row;
    });
  }
  loadExpenses();
}

// ------------------- Login Validation -------------------
const loginForm = document.querySelector("form");
if (loginForm && loginForm.querySelector("#password")) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (email === "" || password === "") {
      alert("Please enter email and password!");
    } else {
      alert("Login successful (dummy check ✅)");
      loginForm.reset();
    }
  });
}
