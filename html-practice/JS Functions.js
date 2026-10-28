/* ============================================================================
   JavaScript Assignment 2 — Callbacks, `this`, Prototypes, Closures, Classes
   Run with:  node assignment2_solutions.js
   ============================================================================ */

"use strict";

/* ============================================================================
   Q1 – greetUser with Callback
   ============================================================================ */
console.log("=".repeat(70));
console.log("Q1 – GREET USER WITH CALLBACK");
console.log("=".repeat(70));

function showEndMessage() {
    console.log("Welcome to the course!");
}

function greetUser(name, callback) {
    console.log(`Hello ${name}`);   // step 1: main work
    callback();                     // step 2: execute the callback AFTER
}

console.log("1. Calling greetUser('Aisha', showEndMessage)...");
greetUser("Aisha", showEndMessage);
// Callback flow: greetUser runs first, prints the greeting, and only THEN
// hands control to showEndMessage — the callback decides what happens "after".

/* ============================================================================
   Q2 – applyOperation (double / square)
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q2 – APPLY OPERATION");
console.log("=".repeat(70));

function applyOperation(numbers, operation) {
    const result = [];
    for (const n of numbers) {
        result.push(operation(n));  // delegate the math to the callback
    }
    return result;
}

const nums = [1, 2, 3, 4];
console.log("Original      :", nums);
console.log("Doubled (x2)  :", applyOperation(nums, n => n * 2));
console.log("Squared (n^2) :", applyOperation(nums, n => n * n));

/* ============================================================================
   Q3 – Arrow vs Normal Function: why `this.name` is undefined
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q3 – ARROW FUNCTION `this` PROBLEM");
console.log("=".repeat(70));

const userArrow = {
    name: "Ravi",
    showName: () => {
        // Arrow functions do NOT have their own `this`.
        // They capture `this` from where they were DEFINED (the outer scope —
        // here, the top-level module, where `this` is undefined / global object,
        // but NOT the `user` object).
        console.log("Arrow showName -> this.name =", this.name);   // undefined
    }
};

console.log("--- Broken version (arrow method) ---");
userArrow.showName();   // undefined — arrow ignored the call object!

const userFixed = {
    name: "Ravi",
    showName: function () {
        // Normal functions get `this` from WHO CALLS them (the call site),
        // so `userFixed.showName()` binds `this` to `userFixed`.
        console.log("Normal showName -> this.name =", this.name);  // Ravi
    }
};

console.log("--- Fixed version (normal method) ---");
userFixed.showName();   // Ravi

/* ============================================================================
   Q4 – Car Constructor + Prototype Method
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q4 – CAR CONSTRUCTOR + PROTOTYPE METHOD");
console.log("=".repeat(70));

function Car(brand, model) {
    this.brand = brand;
    this.model = model;
}

// ONE method shared by ALL Car instances (lives on Car.prototype)
Car.prototype.getDetails = function () {
    console.log(`Car: ${this.brand} ${this.model}`);
};

const car1 = new Car("Toyota", "Corolla");
const car2 = new Car("Honda", "Civic");

car1.getDetails();   // Car: Toyota Corolla
car2.getDetails();   // Car: Honda Civic

console.log("Both cars share ONE function object?",
    car1.getDetails === car2.getDetails);   // true — proof of method sharing

/* ============================================================================
   Q5 – Person → Student Inheritance (prototypes)
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q5 – PERSON → STUDENT (PROTOTYPE INHERITANCE)");
console.log("=".repeat(70));

function Person(name) {
    this.name = name;
}
Person.prototype.showName = function () {
    console.log(`Name: ${this.name}`);
};

function Student(name, branch) {
    Person.call(this, name);   // inherit the parent constructor's work (like super())
    this.branch = branch;
}

// Set up the chain: Student.prototype -> Person.prototype
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;   // fix the constructor pointer

Student.prototype.showBranch = function () {
    console.log(`Branch: ${this.branch}`);
};
Student.prototype.showAll = function () {
    this.showName();      // inherited method
    this.showBranch();  // own method
};

const student1 = new Student("Meera", "Computer Science");
student1.showName();    // from Person.prototype
student1.showBranch();  // from Student.prototype
student1.showAll();     // uses both
console.log("student1 instanceof Person  :", student1 instanceof Person);    // true
console.log("student1 instanceof Student :", student1 instanceof Student);   // true

/* ============================================================================
   Q6 – Prototype Chain: Person → Faculty → Professor
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q6 – PERSON → FACULTY → PROFESSOR CHAIN");
console.log("=".repeat(70));

function Person6(name) {
    this.name = name;
}
Person6.prototype.introduce = function () {
    console.log(`Hi, I am ${this.name}.`);
};

function Faculty(name, department) {
    Person6.call(this, name);
    this.department = department;
}
Faculty.prototype = Object.create(Person6.prototype);
Faculty.prototype.constructor = Faculty;
Faculty.prototype.teach = function () {
    console.log(`${this.name} teaches in the ${this.department} department.`);
};

function Professor(name, department, subject) {
    Faculty.call(this, name, department);
    this.subject = subject;
}
Professor.prototype = Object.create(Faculty.prototype);
Professor.prototype.constructor = Professor;
Professor.prototype.research = function () {
    console.log(`${this.name} researches ${this.subject}.`);
};

const prof = new Professor("Dr. Rao", "Physics", "Quantum Mechanics");
console.log("--- Professor object calling methods up the whole chain ---");
prof.research();    // own method (Professor.prototype)
prof.teach();       // parent method (Faculty.prototype)
prof.introduce();   // grandparent method (Person6.prototype)

console.log("prof instanceof Professor :", prof instanceof Professor);  // true
console.log("prof instanceof Faculty   :", prof instanceof Faculty);      // true
console.log("prof instanceof Person6   :", prof instanceof Person6);      // true
console.log("Method lookup path: professor -> Professor.prototype -> Faculty.prototype -> Person6.prototype");

/* ============================================================================
   Q7 – makeMultiplier (Closure)
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q7 – MAKE MULTIPLIER (CLOSURE)");
console.log("=".repeat(70));

function makeMultiplier(multiplier) {
    // `multiplier` is a LOCAL variable of makeMultiplier...
    return function (number) {
        // ...but this inner function still "remembers" it after the outer
        // function has finished. That memory = a CLOSURE.
        return number * multiplier;
    };
}

const triple  = makeMultiplier(3);
const double  = makeMultiplier(2);
const tenfold = makeMultiplier(10);

console.log("triple(5)  =", triple(5));    // 15
console.log("double(5)  =", double(5));    // 10
console.log("tenfold(5) =", tenfold(5));   // 50

// Each returned function keeps its OWN private copy of `multiplier` —
// they don't interfere with each other.
console.log("triple still uses 3 after others were made:", triple(7));   // 21

/* ============================================================================
   Q8 – Custom Array Prototype Method myMap()
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q8 – CUSTOM myMap() ON ARRAY.PROTOTYPE");
console.log("=".repeat(70));

Array.prototype.myMap = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        // mimic real map(): pass (element, index, array) and skip empty slots
        if (i in this) result.push(callback(this[i], i, this));
    }
    return result;
};

console.log("[1,2,3].myMap(n => n * 2)       :", [1, 2, 3].myMap(n => n * 2));           // [2,4,6]
console.log("[1,2,3].map(n => n * 2)         :", [1, 2, 3].map(n => n * 2));             // same!
console.log("with index                     :", [10, 20].myMap((n, i) => n + i));         // [10,21]
console.log("matches built-in map()?        :",
    JSON.stringify([5, 6, 7].myMap(n => n * 3)) === JSON.stringify([5, 6, 7].map(n => n * 3))); // true

/* ============================================================================
   Q9 – ES6 Classes: Person → Student (same behavior as Q5)
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q9 – ES6 CLASSES (extends + super)");
console.log("=".repeat(70));

class PersonClass {
    constructor(name) {
        this.name = name;
    }
    showName() {
        console.log(`Name: ${this.name}`);
    }
}

class StudentClass extends PersonClass {
    constructor(name, branch) {
        super(name);        // calls PersonClass constructor (replaces Person.call(this, name))
        this.branch = branch;
    }
    showBranch() {
        console.log(`Branch: ${this.branch}`);
    }
    showAll() {
        this.showName();
        this.showBranch();
    }
}

const studentClass1 = new StudentClass("Meera", "Computer Science");
studentClass1.showName();
studentClass1.showBranch();
studentClass1.showAll();
console.log("studentClass1 instanceof PersonClass   :", studentClass1 instanceof PersonClass);   // true
console.log("studentClass1 instanceof StudentClass  :", studentClass1 instanceof StudentClass);  // true

console.log("--- Proof: class & prototype versions behave the same ---");
console.log("Prototype version showName === Class version behavior:",
    JSON.stringify(Object.getOwnPropertyNames(Student.prototype)) ===
    JSON.stringify(Object.getOwnPropertyNames(StudentClass.prototype)));
// Behind the scenes, ES6 classes ARE prototypes — `extends` wires up the
// exact same prototype chain we built manually in Q5.
