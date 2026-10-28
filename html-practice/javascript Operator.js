/*
 * JavaScript Assignment - Solutions Q1 to Q10
 * Run in the terminal:  node javascript_assignment_solutions.js
 * Or paste into the browser console (F12).
 * Each solution is wrapped in its own function so variable names never clash.
 */

const line = (title) => console.log(`\n==================== ${title} ====================`);

/* ---------------------------------------------------------------
 Q1. Scope Conflict Resolver
---------------------------------------------------------------- */
var bonus = 5000; // global variable

function calculateSalary(isPermanent) {
  let salary = 40000; // local variable (only exists inside this function)
  let total = salary;

  if (isPermanent === true) {
    total = salary + bonus; // bonus is read from global scope
  }
  console.log(`isPermanent = ${isPermanent} -> Total salary: ${total}`);
}

function q1() {
  line("Q1. Scope Conflict Resolver");
  calculateSalary(true);   // salary + bonus
  calculateSalary(false);  // salary only
  console.log("Global bonus after both calls:", bonus); // still 5000: isPermanent only changes the result, not the global
  console.log("Is local 'salary' visible outside the function?", typeof salary); // "undefined"
}

/* ---------------------------------------------------------------
 Q2. String Manipulation Report
---------------------------------------------------------------- */
function q2() {
  line("Q2. String Manipulation Report");
  const productName = "  wireless headphones PRO  ";

  const cleaned = productName
    .trim()                                                     // remove extra spaces
    .toLowerCase()                                              // all lowercase
    .split(" ")                                                 // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // capitalise each word
    .join(" ")                                                  // join back
    .replace(/\bpro\b/i, "Pro Edition");                        // "Pro" -> "Pro Edition"

  console.log("Original :", `"${productName}"`);
  console.log("Cleaned  :", `"${cleaned}"`);
  console.log("Length   :", cleaned.length);
}

/* ---------------------------------------------------------------
 Q3. Math Utility Dashboard
---------------------------------------------------------------- */
function q3() {
  line("Q3. Math Utility Dashboard");
  const x = 16.75;

  const rounded = Math.round(x);
  const root = Math.sqrt(x);
  const power = Math.pow(x, 3);
  const random = Math.floor(Math.random() * 41) + 10; // 10 to 50

  console.log(`
  --- Result Summary ---
  Number         : ${x}
  Rounded        : ${rounded}
  Square root    : ${root.toFixed(2)}
  Power (x^3)    : ${power.toFixed(2)}
  Random (10-50) : ${random}
  `);
}

/* ---------------------------------------------------------------
 Q4. Array Performance Analyzer
---------------------------------------------------------------- */
function q4() {
  line("Q4. Array Performance Analyzer");

  // 8 random scores between 30 and 100
  const scores = Array.from({ length: 8 }, () => Math.floor(Math.random() * 71) + 30);

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const passed = scores.filter(s => s >= 50);
  const labelled = scores.map((s, i) => `Student ${i + 1}: ${s} (${s >= 50 ? "Pass" : "Fail"})`);

  console.log(labelled.join("\n"));
  console.log(`
  --- Summary ---
  Scores         : [${scores.join(", ")}]
  Highest        : ${highest}
  Lowest         : ${lowest}
  Average        : ${average.toFixed(2)}
  Passed (>=50)  : ${passed.length} of ${scores.length}
  `);
}

/* ---------------------------------------------------------------
 Q5. Boolean Logic Access System
---------------------------------------------------------------- */
function checkSecurity(isDoorLocked, isWindowClosed, isAlarmOn, isOwnerInside) {
  const isSecure = isAlarmOn && isDoorLocked && isWindowClosed && isOwnerInside;
  // same condition written using ! and ||
  const isUnsafe = !isAlarmOn || !isDoorLocked || !isWindowClosed || !isOwnerInside;

  console.log(
    `Door locked: ${isDoorLocked}, Window closed: ${isWindowClosed}, Alarm: ${isAlarmOn}, Owner inside: ${isOwnerInside}` +
    ` -> ${isSecure ? "Secure" : "Unsafe"} (unsafe check: ${isUnsafe})`
  );
}

function q5() {
  line("Q5. Boolean Logic Access System");
  checkSecurity(true, true, true, true);    // Secure
  checkSecurity(false, true, true, true);   // Unsafe - door not locked
  checkSecurity(true, false, true, true);   // Unsafe - window open
  checkSecurity(true, true, false, true);   // Unsafe - alarm off
  checkSecurity(true, true, true, false);   // Unsafe - owner not inside
}

/* ---------------------------------------------------------------
 Q6. Event-Based Counter Simulation
---------------------------------------------------------------- */
let count = 0;

function increment() {
  // nested function: it can read and update 'count' from the outer scope
  function applyChange(step) {
    count += step;
    console.log(`Current count: ${count}`);
  }
  applyChange(1);
}

function decrement() {
  function applyChange(step) {
    count += step;
    console.log(`Current count: ${count}`);
  }
  applyChange(-1);
}

function q6() {
  line("Q6. Event-Based Counter Simulation");
  console.log("Simulating clicks...");
  increment();  // click "+"  -> 1
  increment();  // click "+"  -> 2
  increment();  // click "+"  -> 3
  decrement();  // click "-"  -> 2
  console.log("Final count:", count);
}

/* ---------------------------------------------------------------
 Q7. Customer Feedback Processor
---------------------------------------------------------------- */
function processFeedback(feedback) {
  const wordCount = feedback.trim().split(/\s+/).length;
  const lower = feedback.toLowerCase();
  const isNegative = lower.includes("bad") || lower.includes("poor");

  console.log(`Feedback   : "${feedback}"`);
  console.log(`Word count : ${wordCount}`);
  console.log(isNegative ? "Needs Improvement" : "Positive Feedback");
}

function q7() {
  line("Q7. Customer Feedback Processor");
  processFeedback("Great product! Fast delivery and amazing sound quality!");
  console.log("");
  processFeedback("Poor packaging and bad customer support.");
}

/* ---------------------------------------------------------------
 Q8. Dynamic Discount Evaluator
---------------------------------------------------------------- */
function calculateCartTotal(cart) {
  const originalTotal = cart.reduce((sum, p) => sum + p.price, 0);

  // Loop through items and apply the category discount
  const discounted = [];
  for (const product of cart) {
    let finalPrice = product.price;
    if (product.category === "electronics") {
      finalPrice = product.price * 0.90;   // 10% off
    } else if (product.category === "fashion") {
      finalPrice = product.price * 0.95;   // 5% off
    }
    discounted.push({ ...product, finalPrice });
    console.log(`${product.item.padEnd(8)} ${product.category.padEnd(12)} ${product.price} -> ${finalPrice}`);
  }

  let finalTotal = discounted.reduce((sum, p) => sum + p.finalPrice, 0);

  // Extra 5% overall discount if the original cart value is above 50000
  if (originalTotal > 50000) {
    finalTotal *= 0.95;
    console.log("Extra 5% overall discount applied (cart value > 50000)");
  }

  console.log(`Original total: ${originalTotal}`);
  console.log(`Final total   : ${finalTotal.toFixed(2)}`);
}

function q8() {
  line("Q8. Dynamic Discount Evaluator");
  const cart = [
    { item: "Laptop", category: "electronics", price: 45000 },
    { item: "Shoes", category: "fashion", price: 2500 },
    { item: "Book", category: "education", price: 600 }
  ];
  calculateCartTotal(cart);

  console.log("\n--- Bigger cart (to show the extra 5%) ---");
  const bigCart = [
    { item: "Laptop", category: "electronics", price: 45000 },
    { item: "Phone", category: "electronics", price: 20000 },
    { item: "Shoes", category: "fashion", price: 2500 }
  ];
  calculateCartTotal(bigCart);
}

/* ---------------------------------------------------------------
 Q9. Odd-Even Number Analyzer
---------------------------------------------------------------- */
function q9() {
  line("Q9. Odd-Even Number Analyzer");
  const numbers = [];
  for (let i = 1; i <= 30; i++) {
    numbers.push(i);
  }

  const results = [];
  for (const n of numbers) {
    if (n % 3 === 0 && n % 5 === 0) {
      results.push("FizzBuzz");
    } else if (n % 2 === 0) {
      results.push("Even");
    } else {
      results.push("Odd");
    }
  }

  console.log("Results array:", results);
  numbers.forEach((n, i) => console.log(`${n} -> ${results[i]}`));
}

/* ---------------------------------------------------------------
 Q10. Departmental Employee Evaluator
---------------------------------------------------------------- */
function q10() {
  line("Q10. Departmental Employee Evaluator");
  const departments = [
    ["HR", 72],
    ["Finance", 88],
    ["Tech", 95],
    ["Support", 63]
  ];

  for (const [name, score] of departments) {
    let rating;
    if (score >= 90) {
      rating = "Excellent";
    } else {
      if (score >= 75) {
        rating = "Good";
      } else {
        if (score >= 60) {
          rating = "Average";
        } else {
          rating = "Needs Improvement";
        }
      }
    }
    console.log(`${name.padEnd(8)} Score: ${score} -> ${rating}`);
  }
}

/* ---------------------------------------------------------------
 Run all solutions
---------------------------------------------------------------- */
q1();
q2();
q3();
q4();
q5();
q6();
q7();
q8();
q9();
q10();
