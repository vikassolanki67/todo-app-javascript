// ================================
// DOM SELECTION
// ================================

const taskInput  = document.querySelector("#taskInput");
const expireDate = document.querySelector("#expireDate");
const addBtn     = document.querySelector("#addBtn");
const Container  = document.querySelector(".task-list");

// Set today as minimum date
(function setMinDate() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    expireDate.min = `${y}-${m}-${d}`;
})();


// ================================
// MAIN DATA
// ================================

let AllTasks = [];
try {
    const stored = JSON.parse(localStorage.getItem("Alltask")) || [];
    AllTasks = stored.filter(t => t && t.id && t.taskname && t.ExpiredDate && t.StartDate);
} catch (e) {
    AllTasks = [];
    localStorage.removeItem("Alltask");
}


// ================================
// SAVE TO LOCALSTORAGE
// ================================

function saveTasks() {
    localStorage.setItem("Alltask", JSON.stringify(AllTasks));
}


// ================================
// TOAST NOTIFICATION
// ================================

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}


// ================================
// DATE FORMAT
// ================================

function formatDate(dateString) {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
}


// ================================
// RENDER FUNCTION
// ================================

function renderTasks() {
    Container.innerHTML = "";

    if (AllTasks.length === 0) {
        Container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>Koi task nahi hai. Upar se task add karo!</p>
            </div>`;
        return;
    }

    AllTasks.forEach(function(element) {

        // ---------- Card ----------
        const card = document.createElement("div");
        card.className = "task-card" + (element.complated ? " completed" : "");

        // ---------- Card Content wrapper ----------
        const cardContent = document.createElement("div");
        cardContent.className = "task-content";

        // ---------- Complete Button ----------
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = element.complated ? "✔" : "○";
        completeBtn.setAttribute("data-id", String(element.id));

        // ---------- Task Info ----------
        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        // Task Header row
        const taskHeader = document.createElement("div");
        taskHeader.className = "task-header";

        const taskName = document.createElement("h3");
        taskName.className = "task-name";
        taskName.textContent = element.taskname;   // ← textContent, no XSS

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "❌";
        deleteBtn.setAttribute("data-id", String(element.id));

        taskHeader.appendChild(taskName);
        taskHeader.appendChild(deleteBtn);

        // Dates
        const startDateEl = document.createElement("p");
        startDateEl.className = "start-date";
        startDateEl.textContent = "📅 Created : " + formatDate(element.StartDate);

        const endDateEl = document.createElement("p");
        endDateEl.className = "end-date";
        endDateEl.textContent = "⏳ Due : " + formatDate(element.ExpiredDate);

        // Assemble
        taskInfo.appendChild(taskHeader);
        taskInfo.appendChild(startDateEl);
        taskInfo.appendChild(endDateEl);

        cardContent.appendChild(completeBtn);
        cardContent.appendChild(taskInfo);
        card.appendChild(cardContent);
        Container.appendChild(card);

        // ---------- Events ----------
        completeBtn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const task = AllTasks.find(t => String(t.id) === id);
            if (task) {
                task.complated = !task.complated;
                saveTasks();
                renderTasks();
                showToast(task.complated ? "✅ Task complete!" : "🔄 Task incomplete kiya");
            }
        });

        deleteBtn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            AllTasks = AllTasks.filter(t => String(t.id) !== id);
            saveTasks();
            renderTasks();
            showToast("🗑️ Task delete ho gaya");
        });
    });
}


// ================================
// ADD TASK
// ================================

addBtn.addEventListener("click", function() {
    const inputName        = taskInput.value.trim();
    const inputExpiredDate = expireDate.value;

    if (!inputName && !inputExpiredDate) { showToast("⚠️ Task aur date dono likhein!"); return; }
    if (!inputName)        { showToast("⚠️ Task ka naam likhein..."); return; }
    if (!inputExpiredDate) { showToast("⚠️ Due date choose karein..."); return; }

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    AllTasks.push({
        id: Date.now(),
        taskname: inputName,
        ExpiredDate: inputExpiredDate,
        StartDate: `${y}-${m}-${d}`,
        complated: false
    });

    saveTasks();
    renderTasks();
    showToast("✨ Task add ho gaya!");

    taskInput.value  = "";
    expireDate.value = "";
    taskInput.focus();
});

// Enter key support
taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") addBtn.click();
});


// ================================
// PAGE LOAD — sirf ek baar
// ================================

renderTasks();
