// JavaScript Assignment Solutions (Q1 - Q10)
// Run with:  node JavaScript_Assignment_Solutions.js
// Each solution is wrapped in its own { } block so variable names don't clash.

// ============================================================
// Q1. Personalized Login Greeting
// ============================================================
{
  console.log("\n===== Q1. Personalized Login Greeting =====");
  const userName = "Madhav";
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = `Good Morning ${userName}!`;
  } else if (hour >= 12 && hour <= 17) {
    greeting = `Good Afternoon ${userName}!`;
  } else {
    greeting = `Good Evening ${userName}!`;
  }

  console.log(`Current hour: ${hour}`);
  console.log(greeting);
}

// ============================================================
// Q2. Multi-Type Data Summary
// ============================================================
{
  console.log("\n===== Q2. Multi-Type Data Summary =====");
  const userName = "Madhav";            // string
  const age = 21;                       // number
  const isStudent = true;               // boolean
  const skills = ["HTML", "CSS", "JS"]; // array
  const profile = { city: "Mathura", year: 3 }; // object
  const middleName = null;              // null
  let phone;                            // undefined

  function getType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  const entries = [
    ["userName", userName],
    ["age", age],
    ["isStudent", isStudent],
    ["skills", skills],
    ["profile", profile],
    ["middleName", middleName],
    ["phone", phone],
  ];

  console.table(
    entries.map(([label, value]) => ({
      Label: label,
      Value: typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value),
      Type: getType(value),
    }))
  );
}

// ============================================================
// Q3. Monthly Expense Tracker
// ============================================================
{
  console.log("\n===== Q3. Monthly Expense Tracker =====");
  const categories = ["Food", "Travel", "Rent", "Bills", "Leisure"];
  const expenses = [4500, 1800, 12000, 2500, 1500];

  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i];
    console.log(`${categories[i]}: ${expenses[i].toFixed(2)}`);
  }

  const average = total / expenses.length;

  let finalAmount = total;
  finalAmount += total * 0.10;          // add 10% tax

  console.log("-----------------------------");
  console.log(`Total expenses : ${total.toFixed(2)}`);
  console.log(`Average expense: ${average.toFixed(2)}`);
  console.log(`Final (with 10% tax): ${finalAmount.toFixed(2)}`);
}

// ============================================================
// Q4. Academic Performance Evaluator
// ============================================================
{
  console.log("\n===== Q4. Academic Performance Evaluator =====");
  const marks = [88, 76, 92, 81, 69];
  const subjects = marks.length;
  const maxPerSubject = 100;

  let total = 0;
  for (const m of marks) total += m;

  const average = total / subjects;
  const percentage = (total / (subjects * maxPerSubject)) * 100;
  const failedAny = marks.some((m) => m < 35);

  console.log(`Marks     : ${marks.join(", ")}`);
  console.log(`Average   : ${average.toFixed(2)}`);
  console.log(`Percentage: ${percentage.toFixed(2)}%`);

  if (failedAny) {
    console.log("Detained (scored below 35 in a subject)");
  } else if (percentage >= 85) {
    console.log("Promoted with Distinction");
  } else if (percentage >= 50 && percentage < 85) {
    console.log("Promoted");
  } else {
    console.log("Detained");
  }
}

// ============================================================
// Q5. Weather Activity Planner
// ============================================================
{
  console.log("\n===== Q5. Weather Activity Planner =====");
  const temperature = 12;   // degrees Celsius
  const isRaining = false;
  const windSpeed = 25;     // km/h

  if (isRaining) {
    console.log("Stay indoors with hot coffee.");
  } else if (temperature > 35) {
    console.log("Go swimming.");
  } else if (temperature < 15 && windSpeed > 20) {
    console.log("Too cold and windy - stay home.");
  } else {
    console.log("Perfect day for a walk.");
  }

  // Extra: || condition for extreme weather
  if (temperature > 45 || temperature < 0) {
    console.log("Warning: extreme temperature, be careful!");
  }
}

// ============================================================
// Q6. Progressive Discount System
// ============================================================
{
  console.log("\n===== Q6. Progressive Discount System =====");
  const total = 6200;
  let discount;

  if (total >= 10000) {
    discount = 25;
  } else if (total >= 5000) {
    discount = 15;
  } else if (total >= 2000) {
    discount = 5;
  } else {
    discount = 0;
  }

  const finalPrice = Math.round(total - (total * discount) / 100);

  console.log(`Original total  : Rs. ${total}`);
  console.log(`Discount        : ${discount}%`);
  console.log(`Final price     : Rs. ${finalPrice}`);
}

// ============================================================
// Q7. Smart Guessing Game (Number Range)
// ============================================================
{
  console.log("\n===== Q7. Smart Guessing Game (Number Range) =====");
  const secret = Math.floor(Math.random() * 50) + 1;
  const userGuess = 25;   // test value

  console.log(`Secret number (for testing): ${secret}`);
  console.log(`Your guess: ${userGuess}`);

  if (userGuess >= 1 && userGuess <= 50) {
    if (userGuess === secret) {
      console.log("Correct guess!");
    } else {
      const diff = Math.abs(userGuess - secret);
      if (diff <= 3) {
        console.log("Very close!");
      } else if (userGuess > secret) {
        console.log("Too high");
      } else {
        console.log("Too low");
      }
    }
  } else {
    console.log("Please guess a number between 1 and 50.");
  }
}

// ============================================================
// Q8. Employee Salary Projection
// ============================================================
{
  console.log("\n===== Q8. Employee Salary Projection =====");
  let salary = 500000;      // current yearly salary
  const incrementRate = 8;  // percent per year

  const projection = [];

  for (let year = 1; year <= 5; year++) {
    const increment = (salary * incrementRate) / 100;
    salary += increment;                 // assignment operator
    projection.push({
      Year: year,
      "Increment": Math.round(increment * 100) / 100,
      "Salary": Math.round(salary * 100) / 100,
    });
  }

  console.table(projection);
}

// ============================================================
// Q9. Random Math Quiz Generator
// ============================================================
{
  console.log("\n===== Q9. Random Math Quiz Generator =====");
  const operators = ["+", "-", "*", "/"];
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const op = operators[Math.floor(Math.random() * operators.length)];

  let correctAnswer;
  switch (op) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = (num1 / num2).toFixed(2);
      break;
  }

  console.log(`Question: ${num1} ${op} ${num2} = ?`);
  console.log(`Correct answer: ${correctAnswer}`);

  // Evaluate a (test) user answer automatically
  const userAnswer = 10;
  if (Number(userAnswer) === Number(correctAnswer)) {
    console.log("Your answer is correct!");
  } else {
    console.log("Your answer is wrong.");
  }
}

// ============================================================
// Q10. Citizen Eligibility Validator
// ============================================================
{
  console.log("\n===== Q10. Citizen Eligibility Validator =====");
  const age = 19;
  const isCitizen = true;

  if (isCitizen) {
    if (age >= 21) {
      console.log("Eligible for all services.");
    } else if (age >= 18 && age <= 20) {
      console.log("Eligible to vote only.");
    } else {
      console.log("Not eligible yet.");
    }
  } else {
    if (age >= 18) {
      console.log("Only age criteria met.");
    } else {
      console.log("Not eligible yet.");
    }
  }
}

