/* ============================================================================
   JavaScript Assignment 3 — Promises, Event Loop, async/await
   Run with:  node assignment3_solutions.js
   (Q6 needs internet to hit the real Fake Store API; offline it demonstrates
    the error-handling path and falls back to a local mock.)
   ============================================================================ */

"use strict";

/* ============================================================================
   Q1 – THE STARTUP MORNING: ASYNC COFFEE MAKER
   ============================================================================ */
console.log("=".repeat(70));
console.log("Q1 – ASYNC COFFEE MAKER");
console.log("=".repeat(70));

// Helper: a promise that resolves after a random 1–2s delay
function step(name, failRate = 0) {
    return new Promise((resolve, reject) => {
        const delay = 1000 + Math.random() * 1000;          // 1–2 seconds
        setTimeout(() => {
            if (Math.random() < failRate) {                  // simulate random failure
                reject(new Error(`${name} failed!`));
            } else {
                console.log(`✔ ${name}`);
                resolve(name);
            }
        }, delay);
    });
}

const boilWater   = () => step("Water boiled");
const brewCoffee  = () => step("Coffee brewed");
const pourIntoCup = () => step("Poured into cup");

console.log("Morning routine started...");

boilWater()
    .then(brewCoffee)          // chained: runs only after water boils
    .then(pourIntoCup)         // then poured
    .then(() => console.log("Coffee ready for the team!"))
    .catch(err => console.error(`✘ Oops: ${err.message}`));

/* ============================================================================
   Q2 – TASK SCHEDULER: MICRO VS MACRO
   ============================================================================ */
// --- PREDICTION (before running) ---
// "Start"
// "Sync log inside script"
// "End"
// "Promise callback"     <- MICROTASK: runs right after the current script,
//                            before any macrotask
// "Timeout callback"     <- MACROTASK: waits for the next event-loop tick
console.log("\n" + "=".repeat(70));
console.log("Q2 – MICRO VS MACRO TASKS");
console.log("=".repeat(70));

console.log("Start");

setTimeout(() => console.log("Timeout callback (macrotask)"), 0);

Promise.resolve().then(() => console.log("Promise callback (microtask)"));

console.log("Sync log inside script");
console.log("End");

/* ============================================================================
   Q3 – BUG TRACKER: CALLBACK → PROMISE MIGRATION
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q3 – BUG TRACKER (PROMISE VERSION)");
console.log("=".repeat(70));

// Original callback version, kept for reference:
// function fetchBugs(callback) {
//     setTimeout(() => callback(["UI glitch", "API timeout", "Login failure"]), 1000);
// }

function getBugs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const apiFailed = Math.random() < 0.3;         // 30% random API failure
            if (apiFailed) {
                reject(new Error("Bug API returned 500"));
            } else {
                resolve(["UI glitch", "API timeout", "Login failure"]);
            }
        }, 1000);
    });
}

console.log("Fetching bugs from QA server...");
getBugs()
    .then(bugs => {
        console.log(`Fetched ${bugs.length} bugs:`);
        console.table(bugs.map((bug, i) => ({ "#": i + 1, "Bug description": bug })));
    })
    .catch(err => console.error("Failed to load bugs:", err.message));

/* ============================================================================
   Q4 – DEVOPS DELAY: ASYNC TIMEOUT RACE
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q4 – SERVER RACE: all vs race");
console.log("=".repeat(70));

function server(name, delay, failRate = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < failRate) {
                reject(new Error(`${name} crashed`));
            } else {
                console.log(`   ${name} responded after ${delay / 1000}s`);
                resolve(`${name} OK`);
            }
        }, delay);
    });
}

const serverA = server("Server A", 2000, 0.2);   // 2s, 20% failure chance
const serverB = server("Server B", 3000, 0.2);   // 3s, 20% failure chance

// Promise.all: waits for EVERY server (fails fast if any rejects)
Promise.all([serverA, serverB])
    .then(results => console.log("Deployment completed for all servers:", results))
    .catch(err => console.error("Deployment failed:", err.message));

// Promise.race: resolves/rejects with the FIRST one to finish
Promise.race([serverA, serverB])
    .then(winner => console.log("Fastest response:", winner))
    .catch(err => console.error("Fastest response was a failure:", err.message));

/* ============================================================================
   Q5 – FRONTEND RUSH: CALLBACK HELL → ASYNC/AWAIT
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q5 – BUILD PIPELINE: CALLBACK HELL VS ASYNC/AWAIT");
console.log("=".repeat(70));

const stage = name => new Promise(resolve =>
    setTimeout(() => { console.log(`   [stage] ${name}`); resolve(name); }, 1000));

// ---------- Version 1: nested callbacks (THE PYRAMID OF DOOM) ----------
console.log("--- Version 1: nested callbacks ---");
function runPipelineHell() {
    return stage("design").then(() => {
        stage("build").then(() => {
            stage("test").then(() => {
                stage("deploy").then(() => {
                    stage("celebrate").then(() => {
                        console.log("   Pipeline complete (but that nesting was painful)");
                    });
                });
            });
        });
    });
}

// ---------- Version 2: async/await (flat & readable) ----------
async function runPipelineClean() {
    console.log("--- Version 2: async/await ---");
    await stage("design");
    await stage("build");
    await stage("test");
    await stage("deploy");
    await stage("celebrate");
    console.log("   Pipeline complete (much cleaner!)");
}

// Why async/await wins:
//   • Reads top-to-bottom like synchronous code — no nesting pyramid.
//   • Error handling with one try/catch instead of .catch() at every level.
//   • Easier to insert, remove, or reorder stages.
runPipelineHell().then(() => runPipelineClean());   // chained so they don't overlap

/* ============================================================================
   Q6 – E-COMMERCE DASHBOARD: PRODUCT CARD FETCHER
   ============================================================================ */
// (runs at the end of the file via main(), since it is async)

const PRODUCTS_URL = "https://fakestoreapi.com/products";

async function fetchProducts() {
    // 8s timeout so a dead network doesn't hang the program forever
    const response = await fetch(PRODUCTS_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

function displayProduct(p) {
    console.log(`Product: ${p.title}`);
    console.log(`Price:   $${p.price}`);
    console.log(`Image:   ${p.image}`);
    console.log("-".repeat(50));
}

// Bonus: build HTML cards (works in a browser with a <div id="app">)
function renderProductCards(products) {
    const app = typeof document !== "undefined" ? document.getElementById("app") : null;
    if (!app) return;
    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h3>${p.title}</h3><p>$${p.price}</p><img src="${p.image}" width="100">`;
        app.appendChild(card);
    });
}

async function runProductDashboard() {
    console.log("=".repeat(70));
    console.log("Q6 – PRODUCT DASHBOARD (FAKE STORE API)");
    console.log("=".repeat(70));
    try {
        const products = await fetchProducts();
        products.slice(0, 5).forEach(displayProduct);   // show first 5 neatly
        renderProductCards(products);                    // browser bonus
        console.log(`Loaded ${products.length} products successfully.`);
    } catch (err) {
        console.error("Failed to load products. Please try again.");
        console.error(`(reason: ${err.message} — likely no internet in this sandbox)`);
        // Offline fallback so the display logic can still be verified:
        console.log("--- Offline mock demo of the same display logic ---");
        [
            { title: "Fjallraven Backpack", price: 109.95, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
            { title: "Mens Cotton Jacket",  price: 55.99,  image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" }
        ].forEach(displayProduct);
    }
}

/* ============================================================================
   Q7 – THE LAZY LOADER: Promise.allSettled()
   ============================================================================ */
console.log("=".repeat(70));
console.log("Q7 – LAZY LOADER (allSettled)");
console.log("=".repeat(70));

function loadProfile()  { return new Promise((res, rej) => setTimeout(() => Math.random() < 0.3 ? rej(new Error("Profile service down")) : res("Profile Loaded"), 2000)); }
function loadPosts()    { return new Promise(r => setTimeout(() => r("Posts Loaded"), 1500)); }
function loadMessages() { return new Promise(r => setTimeout(() => r("Messages Loaded"), 1000)); }

async function runDashboard() {
    const start = Date.now();
    const results = await Promise.allSettled([loadProfile(), loadPosts(), loadMessages()]);
    const elapsed = Date.now() - start;

    results.forEach((r, i) => {
        const module = ["profile", "posts", "messages"][i];
        if (r.status === "fulfilled") {
            console.log(`✔ ${module.padEnd(9)} succeeded: ${r.value}`);
        } else {
            console.log(`✘ ${module.padEnd(9)} failed:    ${r.reason.message}`);
        }
    });
    console.log(`Total time taken: ${elapsed}ms`);
}

runDashboard();

/* ============================================================================
   Q8 – ORDER PROCESSING: ASYNC RETRY MECHANISM
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q8 – ORDER RETRY MECHANISM");
console.log("=".repeat(70));

function submitOrder() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.5) reject(new Error("order API error"));   // fails 50%
            else resolve("Order confirmed");
        }, 300);
    });
}

async function processOrder() {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const msg = await submitOrder();
            console.log(`Attempt ${attempt}: Success (${msg})`);
            return msg;                                     // done — exit function
        } catch (err) {
            console.log(`Attempt ${attempt}: Failed (${err.message})`);
        }
    }
    throw new Error("Order could not be processed");          // all 3 failed
}

(async () => {
    try {
        await processOrder();
    } catch (err) {
        console.error("Final result:", err.message);
    }
})();

/* ============================================================================
   Q9 – DEBUGGING THE EVENT LOOP
   ============================================================================ */
// --- PREDICTED OUTPUT (before running) ---
//   Script start
//   Script end
//   Promise callback        <- microtask queue drains BEFORE the next macrotask
//   Timeout callback        <- macrotask, even though its delay is 0
//
// WHY: after the synchronous script finishes, the event loop first empties the
// MICROTASK queue (Promise.then/.catch, queueMicrotask), and only then moves to
// the next MACROtask (setTimeout, setInterval, I/O). So 0ms timeout still loses
// to an already-resolved promise.
console.log("\n" + "=".repeat(70));
console.log("Q9 – EVENT LOOP ORDER");
console.log("=".repeat(70));

console.log("Script start");
setTimeout(() => console.log("Timeout callback"), 0);
Promise.resolve().then(() => console.log("Promise callback"));
console.log("Script end");

/* ============================================================================
   Q10 – THE FINAL DELIVERY: ASYNC PIPELINE DEBUGGER
   ============================================================================ */
console.log("\n" + "=".repeat(70));
console.log("Q10 – FOOD DELIVERY PIPELINE");
console.log("=".repeat(70));

// Each step: Promise with random 1–2s delay, 20% failure chance.
// While `await` pauses THIS async function, the event loop stays free —
// that's why later timers (Q1 coffee, Q4 servers) can still fire meanwhile.
function deliveryStep(name, failRate = 0.2) {
    return new Promise((resolve, reject) => {
        const delay = 1000 + Math.random() * 1000;
        setTimeout(() => {
            if (Math.random() < failRate) reject(new Error(name));
            else resolve(name);
        }, delay);
    });
}

async function runPipeline() {
    console.log("Start Pipeline");
    try {
        await deliveryStep("Order taken");       console.log("Step 1: Order taken");
        await deliveryStep("Food prepared");     console.log("Step 2: Food prepared");
        await deliveryStep("Package ready");     console.log("Step 3: Package ready");
        await deliveryStep("Out for delivery");  console.log("Step 4: Out for delivery");
        console.log("Delivery completed!");
    } catch (failedStep) {
        console.error("Pipeline failed!");       // one failure stops the whole chain
    }
}

// ============================================================================
// MAIN: run Q6 (async fetch) at the end of the synchronous script, so all
// sections print in question order without overlapping timers.
// ============================================================================
runProductDashboard();
