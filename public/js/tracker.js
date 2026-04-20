function initTracker() {
    const sugarForm = document.getElementById('sugar-form');
    const readingsTable = document.querySelector('#readings-table tbody');
    let sugarChart = null;

    // Optional UI elements (check existence before use)
    const avgEl = document.getElementById('stat-avg');
    const a1cEl = document.getElementById('stat-a1c');
    const emptyState = document.getElementById('chart-empty-state');
    const chartCtx = document.getElementById('sugar-chart');

    function loadReadings() {
        let readings = JSON.parse(localStorage.getItem('sugarReadings')) || [];
        updateUI(readings);
        return readings;
    }

    function updateUI(readings) {
        updateTable(readings);
        updateStats(readings);
        updateChart(readings);
    }

    function updateStats(readings) {
        if (!avgEl || !a1cEl) return; // Skip if elements are missing
        if (readings.length === 0) {
            avgEl.textContent = '--';
            a1cEl.textContent = '--';
            return;
        }

        const sum = readings.reduce((acc, r) => acc + parseInt(r.level), 0);
        const avg = Math.round(sum / readings.length);
        avgEl.textContent = avg;

        const a1c = ((avg + 46.7) / 28.7).toFixed(1);
        a1cEl.textContent = a1c;
    }

    function updateTable(readings) {
        if (!readingsTable) return;
        readingsTable.innerHTML = '';
        
        const reversed = [...readings].reverse();
        reversed.forEach((r, index) => {
            const originalIndex = readings.length - 1 - index;
            const statusClass = r.level < 70 ? 'status-low' : (r.level > 180 ? 'status-high' : 'status-normal');
            const statusText = r.level < 70 ? 'Low' : (r.level > 180 ? 'High' : 'Normal');

            const row = document.createElement('tr');
            // Simplified row to match index.html headers: Date, Time, Reading, Status
            row.innerHTML = `
                <td>${r.date}</td>
                <td>${r.time}</td>
                <td>${r.level} mg/dL</td>
                <td class="${statusClass}">${statusText}</td>
            `;
            readingsTable.appendChild(row);
        });
    }

    function updateChart(readings) {
        if (!chartCtx) return;

        if (readings.length === 0) {
            chartCtx.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            chartCtx.style.display = 'block';
            if (emptyState) emptyState.style.display = 'none';
        }

        const labels = readings.slice(-10).map(r => r.time);
        const data = readings.slice(-10).map(r => r.level);

        if (sugarChart) sugarChart.destroy();

        sugarChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Glucose Level',
                    data: data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }

    if (sugarForm) {
        sugarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const levelEl = document.getElementById('sugar-level');
            const timeEl = document.getElementById('reading-time');
            
            if (!levelEl || !timeEl) return;

            const readings = JSON.parse(localStorage.getItem('sugarReadings')) || [];
            readings.push({
                level: parseInt(levelEl.value),
                time: timeEl.value,
                date: new Date().toLocaleDateString()
            });

            localStorage.setItem('sugarReadings', JSON.stringify(readings));
            sugarForm.reset();
            updateUI(readings);
        });
    }

    loadReadings();
}