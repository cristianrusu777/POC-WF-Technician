window.view = function(name) {
    localStorage.setItem("rname", name);
    localStorage.setItem("lstatus", `Replay ●`);
    window.location = "./camera.html";
}

if (localStorage.getItem("tier") !== "Researcher") {
    document.querySelector("#subscriptionError").style.display = "block";
    document.querySelector("main").style.filter = "blur(2px)";
}
else {
    document.querySelector("#subscriptionError").style.display = "none";
    document.querySelector("main").style.filter = "none";
}

const generateBtn = document.getElementById("generateBtn");
const dataTableBody = document.querySelector("#dataTable tbody");
const ctx = document.getElementById("activityChart").getContext("2d");
let chart;

document.querySelector("#filterError #understoodBtn").addEventListener("click", () => {
    document.querySelector("#filterError").style.display = "none";
    document.querySelector("main").style.filter = "none";
});

function generateRandomData(region, speciesList, from, to) {
    const data = [];
    const start = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = to ? new Date(to) : new Date();

    const daysBetween = Math.max(1, Math.floor((end - start) / (1000 * 3600 * 24)));
    const entriesCount = Math.min(300, daysBetween * 40);

    for (let i = 0; i < entriesCount; i++) {
        const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
        const timestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

        data.push({
            dateTime: timestamp.toISOString().slice(0, 16).replace("T", " "),
            species: randomSpecies,
            count: Math.floor(Math.random() * 5) + 1,
            region: region || "Unknown"
        });
    }

    return data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
}

function renderTable(data) {
    dataTableBody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.dateTime}</td>
            <td>${row.species}</td>
            <td>${row.count}</td>
            <td>${row.region}</td>
            <td><button class="toStyleTheButtonOnTheDataPage" onclick="view('Recorded on ${row.dateTime}')">View</button></td>
        `;
        dataTableBody.appendChild(tr);
    });
}

function renderChart(data) {
    const times = data.map(d => d.dateTime.split(" ")[1]);
    const counts = data.map(d => d.count);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: times,
            datasets: [{
                label: "Activity Count",
                data: counts,
                borderWidth: 2,
                borderColor: 'hsl(155, 40%, 50%)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Count" }, beginAtZero: true }
            }
        }
    });
}

generateBtn.addEventListener("click", () => {
    const region = document.getElementById("regionSelect").value;
    const species = Array.from(document.getElementById("speciesSelect").selectedOptions).map(o => o.value);
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;

    if (!region || species.length === 0) {
        document.querySelector("#filterError").style.display = "block";
        document.querySelector("main").style.filter = "blur(2px)";
        return;
    }

    const data = generateRandomData(region, species, from, to);
    renderTable(data);
    renderChart(data);
});
