function highlightSelectedTier(buttons, tier) {
    buttons.forEach(btn => btn.classList.remove("selected"));
    buttons.forEach(btn => {
        if (btn.dataset.tier === tier) btn.classList.add("selected");
    });
}

function setupSubscriptionButtons() {
    const buttons = document.querySelectorAll(".subscriptionBtn");
    const popup = document.getElementById("confirmPopup");
    let selectedTier = localStorage.getItem("tier") || "Basic";
    let pendingTier = null;

    popup.style.display = "none";
    highlightSelectedTier(buttons, selectedTier);

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            pendingTier = btn.dataset.tier;
            if (pendingTier === "Custom") {
                popup.innerHTML = `
                    <p>Contact us to get a custom formula:</p>
                    <form id="customForm">
                        <input type="text" placeholder="First Name" required><br>
                        <input type="text" placeholder="Last Name" required><br>
                        <input type="email" placeholder="Email" required><br>
                        <button type="button" id="sendBtn">Send</button>
                        <button type="button" id="cancelBtn">Cancel</button>
                    </form>
                `;
                popup.style.display = "block";
                document.querySelector("main").style.filter = "blur(2px)";

                document.getElementById("sendBtn").addEventListener("click", () => {
                    popup.style.display = "none";
                });

                document.getElementById("cancelBtn").addEventListener("click", () => {
                    popup.style.display = "none";
                });
            } else {
                popup.innerHTML = `
                    <p>Are you sure you want to purchase the selected subscription?</p>
                    <button id="cancelBtn">Cancel</button>
                    <button id="acceptBtn">Accept</button>
                `;
                popup.style.display = "block";
                document.querySelector("main").style.filter = "blur(2px)";

                document.getElementById("cancelBtn").addEventListener("click", () => {
                    pendingTier = null;
                    popup.style.display = "none";
                    document.querySelector("main").style.filter = "none";
                });

                document.getElementById("acceptBtn").addEventListener("click", () => {
                    selectedTier = pendingTier;
                    localStorage.setItem("tier", selectedTier);
                    highlightSelectedTier(buttons, selectedTier);
                    pendingTier = null;
                    popup.style.display = "none";
                    document.querySelector("main").style.filter = "none";
                });
            }
        });
    });
}

setupSubscriptionButtons();
