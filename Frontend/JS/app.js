const labArea = document.getElementById("labArea");
const explanation = document.getElementById("explanationPanel");
const tabs = document.querySelectorAll(".tab");
const leftPanel = document.getElementById("leftPanel");

/* ---------- Utilities ---------- */
function setActiveTab(tabClass) {
    tabs.forEach(tab => tab.classList.remove("active"));
    document.querySelector(tabClass).classList.add("active");
}

async function analyzePayload(payload) {
    if (!payload) {
        explanation.innerText = "Enter a payload to analyze.";
        return;
    }

    try {
        const lab = document.querySelector(".tab.active .label").textContent.toLowerCase();
        
        console.log("Sending:", { payload, lab });  // Debug log
        
        const res = await fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                payload: payload,
                lab: lab
            })
        });

        console.log("Response status:", res.status);
        
        const text = await res.text();
        console.log("Raw response:", text);
        
        if (!text) throw new Error("Empty response");

        const data = JSON.parse(text);
        console.log("Parsed data:", data);  // See the actual structure
        
        // Use the correct field names
        const attackType = data.attack_type || "Unknown";
        
        // Update attack type badge
        const badgeElement = document.getElementById("attackType");
        badgeElement.innerText = attackType;
        
        // Create CSS class name
        let badgeClass = attackType.toLowerCase()
            .replace(/\s+/g, '')  // Remove spaces
            .replace('cross-sitescripting(xss)', 'xss')
            .replace('sqlinjection', 'sqli')
            .replace('commandinjection', 'command')
            .replace('benign/nodetected', 'benign');
            
        badgeElement.className = `badge ${badgeClass}`;
        
        // Update explanation
        explanation.innerHTML = data.explanation || "No explanation provided.";

    } catch (err) {
        console.error("Full error:", err);
        explanation.innerText = `⚠️ Analyzer error: ${err.message}`;
    }
}


/* ---------- LOGIN LAB ---------- */
function loadLoginLab() {
    setActiveTab(".login-tab");
    leftPanel.className = "left-panel login-theme";

    labArea.innerHTML = `
        <h2>Login Lab</h2>
        <input type="text" placeholder="Username">
        <input 
            type="password" 
            id="password"
            placeholder="Password"
        >
        <button onclick="submitLogin()">Login</button>

        <div id="attackType" class="badge">—</div>
    `;

    explanation.innerHTML =
        "Try SQL injection payloads like <code>' OR '1'='1</code>";

    document
        .getElementById("password")
        .addEventListener("keydown", e => {
            if (e.key === "Enter") submitLogin();
        });
}

function submitLogin() {
    const payload = document.getElementById("password").value;
    analyzePayload(payload);
}


/* ---------- COMMENT LAB ---------- */
function loadCommentLab() {
    setActiveTab(".comment-tab");
    leftPanel.className = "left-panel comment-theme";

    labArea.innerHTML = `
        <h2>Comment Lab</h2>
        <textarea 
            id="comment"
            placeholder="Write a comment..."
        ></textarea>
        <button onclick="submitComment()">Post</button>

        <div id="attackType" class="badge">—</div>
    `;

    explanation.innerHTML =
        "Try XSS payloads like <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>";

    document
        .getElementById("comment")
        .addEventListener("keydown", e => {
            if (e.key === "Enter" && e.ctrlKey) {
                submitComment();
            }
        });
}

function submitComment() {
    const payload = document.getElementById("comment").value;
    analyzePayload(payload);
}


/* ---------- DEFAULT ---------- */
loadLoginLab();

