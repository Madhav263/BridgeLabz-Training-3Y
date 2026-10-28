/* ============================================================================
   JavaScript Assignment — All 10 Questions in One File
   Run with:  node assignment_solutions.js
   ============================================================================ */

"use strict";   // Q2/Q3/Q6/Q8 also demonstrate module-level strict mode

/* ============================================================================
   Q1 – DYNAMIC DATA PARSER
   ============================================================================ */
console.log("=".repeat(70));
console.log("Q1 – DYNAMIC DATA PARSER");
console.log("=".repeat(70));

const apiData = ["25", "true", "false", "NaN", " ", "100px", "3.14", null, undefined];

const validNumbers = [];
const invalidEntries = [];

apiData.forEach((value, index) => {
    // 1. Convert to Number form
    let num;
    if (value === "true")       num = 1;   // boolean-strings -> numeric truth
    else if (value === "false") num = 0;
    else                        num = Number(value);

    // 2. Validate: skip invalid numbers (NaN, " ", "100px", undefined...)
    //    NOTE: Number(" ") is 0 in JS, so whitespace-only strings must be rejected explicitly.
    const isBlankString = typeof value === "string" && value.trim() === "";
    if (Number.isNaN(num) || isBlankString) {
        invalidEntries.push({ index, original: String(value), reason: "Cannot convert to a valid Number" });
        console.log(`[INVALID] index ${index}: ${JSON.stringify(value)} -> not a usable number`);
        return; // skip pushing to valid array
    }

    // 3. Push valid numeric data
    validNumbers.push(num);

    // 1. Convert to Boolean and String forms
    const boolForm = Boolean(value);
    const strForm  = String(value);

    // 4. Detailed report
    console.log(
        `[VALID]   index ${index}: Number=${num} | Boolean=${boolForm} | String=${JSON.stringify(strForm)}`
    );
});

console.log("\n--- Q1 SUMMARY ---");
console.log(`Valid numeric data   : [${validNumbers.join(", ")}]`);
console.log(`Invalid entries      : ${invalidEntries.length} ->`,
    invalidEntries.map(e => JSON.stringify(e.original)).join(", "));

/* ============================================================================
   Q2 – EMPLOYEE BONUS CALCULATOR
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q2 – EMPLOYEE BONUS CALCULATOR");
console.log("=".repeat(70));

const employees = [
    { name: "Amit",  salary: "45000", years: "5" },
    { name: "Sara",  salary: "38000", years: "2" },
    { name: "Kiran", salary: "52000", years: "7" }
];

function processEmployee(emp) {
    try {
        // 5. Validation: required properties must exist
        if (!emp || typeof emp !== "object") throw new TypeError("Employee record is missing or not an object");
        if (emp.name === undefined)     throw new Error(`Missing property: name`);
        if (emp.salary === undefined)   throw new Error(`Missing property: salary`);
        if (emp.years === undefined)    throw new Error(`Missing property: years`);

        // 1. Convert to numbers (strict: throws on bad conversion)
        const salary = Number(emp.salary);
        const years  = Number(emp.years);
        if (Number.isNaN(salary)) throw new Error(`Salary "${emp.salary}" is not a valid number`);
        if (Number.isNaN(years))  throw new Error(`Years "${emp.years}" is not a valid number`);

        // 2. Bonus rule
        const bonus = years > 3 ? salary * 0.10 : salary * 0.05;

        // 4. Template-string report
        console.log(
            `Employee: ${emp.name.padEnd(6)} | Salary: ₹${salary.toLocaleString("en-IN")} | ` +
            `Years: ${years} | Bonus: ₹${bonus.toLocaleString("en-IN")} | Total: ₹${(salary + bonus).toLocaleString("en-IN")}`
        );
    } catch (err) {
        console.error(`[ERROR] Employee ${emp && emp.name ? emp.name : "(unknown)"}: ${err.message}`);
    }
}

employees.forEach(processEmployee);
// demonstrate error handling:
processEmployee({ name: "Broken", salary: "abc", years: "3" });   // bad number
processEmployee({ name: "NoSalary" });                              // missing property

/* ============================================================================
   Q3 – TRANSACTION VALIDATOR
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q3 – TRANSACTION VALIDATOR");
console.log("=".repeat(70));

const transactions = [
    { id: 1, amount: 2000 },
    { id: 2, amount: -500 },
    { id: 3 },
    null
];

// Custom error classes (so we can categorize by type)
class NegativeAmountError extends Error {
    constructor(id) { super(`Transaction ${id}: negative amount not allowed`); this.name = "NegativeAmountError"; }
}
class MissingFieldError extends Error {
    constructor(id, field) { super(`Transaction ${id}: missing ${field}`); this.name = "MissingFieldError"; }
}
class NullEntryError extends Error {
    constructor() { super("Transaction entry is null/undefined"); this.name = "NullEntryError"; }
}

const validTransactions   = [];
const invalidTransactions = [];

function validateTransaction(tx) {
    if (tx === null || tx === undefined) throw new NullEntryError();
    if (tx.id === undefined)     throw new MissingFieldError("(no id)", "id");
    if (tx.amount === undefined) throw new MissingFieldError(tx.id, "amount");
    if (typeof tx.amount !== "number" || Number.isNaN(tx.amount)) throw new MissingFieldError(tx.id, "numeric amount");
    if (tx.amount < 0)           throw new NegativeAmountError(tx.id);
    return true;
}

transactions.forEach((tx, i) => {
    try {
        validateTransaction(tx);                 // 1 & 2: loop + throw custom errors
        validTransactions.push(tx);              // 3: categorize valid
        console.log(`[VALID]   #${i}: ${JSON.stringify(tx)}`);
        // Set a BREAKPOINT here in VS Code to inspect tx, validTransactions, invalidTransactions
    } catch (err) {
        invalidTransactions.push({ index: i, error: err.name, message: err.message });  // 3: categorize invalid
        console.log(`[INVALID] #${i}: ${err.name} — ${err.message}`);
    }
});

// 4. Final report with counts
console.log("\n--- Q3 REPORT ---");
console.log(`Successful transactions : ${validTransactions.length}`);
console.log(`Failed transactions     : ${invalidTransactions.length}`);
invalidTransactions.forEach(f => console.log(`  • line ${f.index}: ${f.message}`));
console.log("NOTE (Task 5): place a breakpoint on the push lines and watch 'tx' / the two arrays in VS Code debugger.");

/* ============================================================================
   Q4 – DEBUGGING MYSTERY
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q4 – DEBUGGING MYSTERY");
console.log("=".repeat(70));

// 1. WHY the original throws under "use strict":
//    `greeting = "Welcome"` assigns to an UNDECLARED variable.
//    In strict mode, assigning to an undeclared identifier throws
//    ReferenceError: greeting is not defined.
//    (In sloppy mode it would silently create a GLOBAL variable — a bug farm.)

// 2. FIXED version — declare the variable so it has scope:
function showMessage() {
    let greeting = "Welcome";   // proper block-scoped declaration
    console.log("Fixed output:", greeting);
}
showMessage();

// 3. Debugging notes:
//    - Add `greeting` to WATCH in VS Code debugger → see value appear after stepping past the assignment.
//    - CALL STACK shows: (anonymous) -> showMessage — each function call adds a frame.
console.log("Debug: watch 'greeting', step (F11) into showMessage, watch the call stack grow.");

/* ============================================================================
   Q5 – HOISTING LAB: THE SEQUENCE TRAP
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q5 – HOISTING LAB");
console.log("=".repeat(70));

// --- PREDICTION (then run) ---
// console.log(score);        -> undefined        (var is hoisted & initialized to undefined)
// announce();                -> "Game started"   (function declaration is fully hoisted)
// var score = 50;            -> assignment happens HERE, not at the top
// let status = "ready";
// startGame();               -> THROWS: ReferenceError: Cannot access 'status' before initialization
//                              (let is hoisted but lives in the TEMPORAL DEAD ZONE until its line runs)
// Because startGame() throws, the script stops — score's console.log worked but execution dies at startGame().

// Predicted sequence WITHOUT the crash line:
console.log("Prediction demo (crash line removed):");
console.log("var score before assignment =", undefined); // shows what hoisting does
announceDemo();
var hoistedScoreDemo = 50;
function announceDemo() { console.log("Game started"); }

// --- 2. FIXED CODE (declarations & initialization before use) ---
console.log("\nFixed version:");
var score = 50;                    // initialize BEFORE using
function announce() { console.log("Game started"); }
let status = "ready";
function startGame() { console.log(status); }

console.log(score);                // 50
announce();                        // Game started
startGame();                       // ready

// --- 3. ARROW-FUNCTION VERSION (compare hoisting) ---
try {
    arrowStart();                  // -> ReferenceError! Arrow functions assigned to const/let are NOT callable before definition
} catch (e) {
    console.log("Arrow before definition throws:", e.constructor.name, "—", e.message);
}
const arrowStart = () => console.log("Arrow game started");
arrowStart();                      // works now

/* ============================================================================
   Q6 – PYRAMID PATTERN GENERATOR
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q6 – PYRAMID PATTERN GENERATOR");
console.log("=".repeat(70));

// Task 3: outer loop limit from user input, default = 5
// (In Node we read from process.argv; in a browser use: const limit = Number(prompt("Rows?", 5)) || 5;)
const userInput = process.argv[2];               // e.g. `node assignment_solutions.js 6`
const limit = (userInput !== undefined && !Number.isNaN(Number(userInput))) ? Number(userInput) : 5;

function generatePyramid(rows) {
    // NOTE: with "use strict" at top of file, forgetting `let`/`var`/`const`
    // on i/j throws "ReferenceError: i is not defined" — undeclared loop vars are caught.
    for (let i = 1; i <= rows; i++) {
        let line = "";
        for (let j = 1; j <= i; j++) {
            line += "* ";
        }
        console.log(line.trimEnd());
    }
}
console.log(`Pyramid with default/user limit = ${limit}:`);
generatePyramid(limit);

// 1. `let` vs `var` observation (if you swap `let i` -> `var i` inside a function,
//    output is IDENTICAL here because var/let behave the same inside one function scope
//    for this simple loop. The real difference appears with closures or block scope:
for (var k = 0; k < 3; k++) { /* var leaks out of the loop block */ }
console.log("After loop with var k: k =", k);      // 3 — var is visible outside
for (let m = 0; m < 3; m++) { /* let stays block-scoped */ }
// console.log(m);                                 // ReferenceError — let is NOT visible outside
console.log("let is block-scoped (m is not accessible outside its loop — good).");
// 2. Debug tip: step through (F10) and watch `line` being rebuilt each outer iteration.

/* ============================================================================
   Q7 – SMART CALCULATOR
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q7 – SMART CALCULATOR");
console.log("=".repeat(70));

class InvalidOperationError extends Error {
    constructor(op) { super(`"${op}" is not a recognized operation`); this.name = "InvalidOperationError"; }
}

function calculate(operation, a, b) {
    switch (operation) {
        case "add":
            return a + b;
        case "subtract":
            return a - b;
        case "divide":
            if (b === 0) throw new Error("Divide by zero is not allowed");
            return a / b;
        case "power":
            return Math.pow(a, b);
        case "root":
            if (a < 0) throw new Error("Cannot take root of a negative number");
            return Math.sqrt(a);
        default:
            throw new InvalidOperationError(operation);   // 3. unknown operation
    }
}

const operations = ["add", "divide", "power", "root", "subtract", "modulo"];
const num1 = 25, num2 = 0;
const results = [];

operations.forEach(op => {
    try {                                            // 4. wrap in try...catch
        const result = calculate(op, num1, num2);
        results.push({ op, status: "SUCCESS", result });
        console.log(`  ${op.padEnd(9)}(${num1}, ${num2}) = ${result}`);
    } catch (err) {
        results.push({ op, status: "FAILED", error: err.message });
        console.error(`  ${op.padEnd(9)}(${num1}, ${num2}) -> ${err.name}: ${err.message}`);
    }
});

// 4. formatted summary
console.log("\n--- Q7 SUMMARY ---");
const ok = results.filter(r => r.status === "SUCCESS").length;
console.log(`Successful: ${ok} | Failed: ${results.length - ok}`);
results.forEach(r => console.log(`  • ${r.op}: ${r.status}${r.error ? " (" + r.error + ")" : " = " + r.result}`));

/* ============================================================================
   Q8 – STRICT MODE SHOWDOWN
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q8 – STRICT MODE SHOWDOWN");
console.log("=".repeat(70));

// Original (ILLEGAL in strict mode):
//   function demo(a, a) { total = 10; delete total; }
//   demo(5, 10);
// 1 & 2. Behavior comparison:
//   WITHOUT "use strict"  : runs silently! `a` = 10 (second wins), `total` becomes an
//                           accidental GLOBAL, and `delete total` removes it. Silent bugs.
//   WITH    "use strict"  : throws SyntaxError at parse time for `function demo(a, a)`
//                           (duplicate parameters are illegal). Even if that were fixed,
//                           `total = 10` would throw ReferenceError (undeclared assignment),
//                           and `delete total` on a variable is a SyntaxError.

// 3. WHY strict mode forbids these:
//   • Duplicate params (a, a) -> ambiguity about which argument is meant; ES6 forbids.
//   • Implicit globals      -> accidental pollution of global scope; classic bug source.
//   • delete on variables   -> delete is only for object properties, not variables.

// 4. CORRECT ES6 version:
const demo = (a, b) => {
    const total = a + b;      // declared, block-scoped
    console.log(`ES6 demo(${a}, ${b}) -> total = ${total}`);
    // `delete total` still illegal — and unnecessary since const cleans up via scope
    return total;
};
demo(5, 10);                  // ES6 demo(5, 10) -> total = 15

/* ============================================================================
   Q9 – JSON AUDIT
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q9 – JSON AUDIT");
console.log("=".repeat(70));

const rawData = [
    '{"user":"Alex","age":25}',
    '{"id":2}',
    '{invalid}',
    '{"user":"Mina","age":"22"}'
];

const cleanData = [];
const auditLog  = [];

rawData.forEach((entry, line) => {
    try {                                            // 1. try...catch per entry
        const obj = JSON.parse(entry);               // throws on '{invalid}'

        // 2. Detect missing keys
        if (obj.user === undefined) throw new Error(`Missing key: user`);
        if (obj.age  === undefined) throw new Error(`Missing key: age`);

        // Bonus: normalize age to Number, filter under-18
        const age = Number(obj.age);
        if (Number.isNaN(age)) throw new Error(`age "${obj.age}" is not numeric`);

        if (age < 18) {
            auditLog.push({ line: line + 1, status: "FILTERED", reason: `under-18 user (${age})` });
            console.log(`  line ${line + 1}: FILTERED (under 18, age=${age})`);
        } else {
            cleanData.push({ user: obj.user, age }); // 3. valid entries -> clean array
            auditLog.push({ line: line + 1, status: "OK", user: obj.user, age });
            console.log(`  line ${line + 1}: OK ->`, { user: obj.user, age });
        }
    } catch (err) {
        // 3. log errors with line numbers (1-based)
        const isSyntax = err instanceof SyntaxError;
        const reason = isSyntax ? "Invalid JSON syntax" : err.message;
        auditLog.push({ line: line + 1, status: "ERROR", reason });
        console.error(`  line ${line + 1}: ERROR -> ${reason}`);
    }
    // 4. Debug tip: breakpoint on catch → step (F10) to watch control jump here on '{invalid}'
});

console.log("\nClean data array:", JSON.stringify(cleanData, null, 2));
console.log(`Audit: ${auditLog.length} lines processed, ${cleanData.length} clean records.`);

/* ============================================================================
   Q10 – NESTED HOISTING AND CLOSURES
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q10 – NESTED HOISTING AND CLOSURES");
console.log("=".repeat(70));

// 1 & 2. PREDICTION: output is
//   undefined      <- outer's `count` is hoisted & initialized to undefined, log runs before `var count = 5`
//   undefined      <- inner has its OWN hoisted `count` (shadows outer's), also undefined before assignment
// Each function call creates its own execution context (activation record) on the call stack.
// Inside that context, every `var` is hoisted to the top of ITS OWN function and set to undefined;
// `inner`'s `var count = 10` never leaks into outer. Hence both logs print undefined.
function outer() {
    console.log("outer sees count =", count);   // undefined (TDZ-free but unassigned)
    var count = 5;
    function inner() {
        console.log("inner sees count =", count);   // undefined (inner's own hoisted count, NOT 5!)
        var count = 10;
    }
    inner();
    console.log("outer count after init =", count); // 5
}
outer();
console.log("NOTE: inner's undefined comes from its OWN hoisted `count` shadowing outer's — separate memory contexts.");

// 3. ARROW version — arrows have no own `arguments`/this and same hoisting rules for var,
//    but written with let/const they become block-scoped (no hoisting-to-undefined trap):
const outerArrow = () => {
    let count = 5;                               // initialized first — no undefined log
    const innerArrow = () => {
        let count = 10;                          // separate block-scoped binding (shadowing)
        console.log("arrow inner count =", count);
    };
    console.log("arrow outer count =", count);
    innerArrow();
    console.log("arrow outer still =", count);  // still 5 — inner's let did not touch it
};
outerArrow();

// 4. Debug session explanation:
console.log("Debug: set breakpoint at outer()'s first line -> step in (F11) -> inner() adds a stack frame;");
console.log("watch 'count' flip between <undefined>, then 5 in outer, while inner has its own separate binding.");
