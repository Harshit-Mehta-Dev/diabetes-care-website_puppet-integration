async function initTracker() {
    const sugarForm = document.getElementById('sugar-form');
    const readingsTable = document.querySelector('#readings-table tbody');
    const exportBtn = document.getElementById('export-btn');
    const chartCtx = document.getElementById('sugar-chart');
    let sugarChart = null;

    // Load Data from Triage Engine API
    async function loadReadings() {
        try {
            const res = await fetch('/api/v1/logs/analytics/tir?window=7d');
            const data = await res.json();
            
            if (data.logs) {
                updateUI(data.logs);
                // Also could update TIR stats in the UI here if we add those elements
            }
        } catch (error) {
            console.error("Failed to load analytics from Engine:", error);
            // Fallback for visual testing without server
            loadMockData();
        }
    }

    function loadMockData() {
        const mockLogs = [
            { timestamp: new Date(Date.now() - 86400000*2).toISOString(), contextTags: ['Fasting'], glucoseValue: 110, triageStatus: 'Normal', triageLevel: 'success' },
            { timestamp: new Date(Date.now() - 86400000).toISOString(), contextTags: ['Post-Meal'], glucoseValue: 145, triageStatus: 'Normal', triageLevel: 'success' },
            { timestamp: new Date().toISOString(), contextTags: ['Pre-Meal'], glucoseValue: 65, triageStatus: 'Hypoglycemia', triageLevel: 'danger' }
        ];
        updateUI(mockLogs);
    }

    function updateUI(logs) {
        updateTable(logs);
        updateChart(logs);
    }

    function updateTable(logs) {
        if (!readingsTable) return;
        readingsTable.innerHTML = '';
        
        // Reverse to show newest first
        const reversed = [...logs].reverse();
        reversed.forEach((r) => {
            const dateObj = new Date(r.timestamp);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="status-badge" style="background: rgba(255,255,255,0.1); border:none; color: var(--text-light);">${r.contextTags.join(', ')}</span></td>
                <td style="font-weight: 700;">${r.glucoseValue} mg/dL</td>
                <td><span class="status-badge status-${r.triageLevel === 'danger' ? 'high' : (r.triageLevel === 'warning' ? 'low' : 'normal')}">${r.triageStatus}</span></td>
            `;
            readingsTable.appendChild(row);
        });
    }

    function updateChart(logs) {
        if (!chartCtx) return;

        const labels = logs.map(r => {
            const d = new Date(r.timestamp);
            return d.toLocaleDateString([], {month:'short', day:'numeric'}) + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
        });
        const data = logs.map(r => r.glucoseValue);

        if (sugarChart) sugarChart.destroy();

        // Create Gradient
        const ctx = chartCtx.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)'); // Neon Blue
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        sugarChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Glucose Level (mg/dL)',
                    data: data,
                    borderColor: '#38bdf8',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#38bdf8',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#38bdf8',
                        bodyColor: '#f8fafc',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: false,
                        suggestedMin: 50,
                        suggestedMax: 250,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', maxTicksLimit: 7 }
                    }
                }
            },
            plugins: [{
                id: 'targetZoneBackground',
                beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    const yAxis = chart.scales.y;
                    const xAxis = chart.scales.x;
                    
                    const yTop = yAxis.getPixelForValue(180);
                    const yBottom = yAxis.getPixelForValue(70);
                    
                    // Draw target zone (70-180 mg/dL)
                    if (yBottom > yTop) { // Ensure validity
                        ctx.save();
                        ctx.fillStyle = 'rgba(52, 211, 153, 0.05)'; // Subtle green zone
                        ctx.fillRect(xAxis.left, yTop, xAxis.width, yBottom - yTop);
                        
                        // Add target zone labels subtly
                        ctx.fillStyle = 'rgba(52, 211, 153, 0.5)';
                        ctx.font = '10px Inter';
                        ctx.fillText('Target Zone (70-180)', xAxis.left + 5, yTop + 15);
                        ctx.restore();
                    }
                }
            }]
        });
    }

    if (sugarForm) {
        sugarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const levelEl = document.getElementById('sugar-level');
            const contextEl = document.getElementById('context-tag');
            
            if (!levelEl || !contextEl) return;

            const payload = {
                glucoseValue: levelEl.value,
                contextTags: [contextEl.value],
                timestamp: new Date().toISOString()
            };

            try {
                const response = await fetch('/api/v1/logs/glucose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const result = await response.json();
                
                if (result.alert) {
                    // Trigger proactive banner or alert
                    alert(result.alert);
                }

                sugarForm.reset();
                loadReadings(); // Reload full data
            } catch (error) {
                console.error("Error submitting log:", error);
                alert("Failed to submit reading to the Triage Engine. Server might be down.");
            }
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.open('/api/v1/reports/export', '_blank');
        });
    }

    loadReadings();
}