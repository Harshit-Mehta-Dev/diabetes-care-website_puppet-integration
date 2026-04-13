// Sugar Tracker functionality
function initTracker() {
    const sugarForm = document.getElementById('sugar-form');
    const readingsTable = document.querySelector('#readings-table tbody');
    let sugarChart = null;
    
    // Load saved readings safely
    function loadReadings() {
        let readings = [];
        try {
            const savedReadings = localStorage.getItem('sugarReadings');
            readings = savedReadings ? JSON.parse(savedReadings) : [];
            // Remove corrupted entries
            readings = readings.filter(r => r && r.level !== undefined && !isNaN(r.level));
        } catch (e) {
            console.error("Error parsing readings:", e);
            readings = [];
        }
        
        updateReadingsTable(readings);
        updateChart(readings);
        updateStats(readings);
        return readings;
    }

    function updateStats(readings) {
        const avgEl = document.getElementById('stat-avg');
        const a1cEl = document.getElementById('stat-a1c');
        if (!avgEl || !a1cEl) return;

        if (readings.length === 0) {
            avgEl.textContent = '--';
            a1cEl.textContent = '--';
            return;
        }

        const sum = readings.reduce((acc, r) => acc + parseInt(r.level), 0);
        const avg = Math.round(sum / readings.length);
        avgEl.textContent = avg;

        // Estimated A1C formula: (Avg + 46.7) / 28.7
        const a1c = ((avg + 46.7) / 28.7).toFixed(1);
        a1cEl.textContent = a1c;
    }
    
    // Add new reading
    if (sugarForm) {
        sugarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const time = document.getElementById('reading-time').value;
            const mealContext = document.getElementById('reading-meal').value;
            const level = parseInt(document.getElementById('sugar-level').value);
            
            if (!time || !mealContext || isNaN(level)) {
                alert('Please fill all fields including Meal Context.');
                return;
            }
            
            const newReading = {
                date: new Date().toLocaleDateString(),
                time: time,
                context: mealContext,
                level: level,
                status: getSugarStatus(level)
            };
            
            // Get clean list, save, and reload UI
            let readings = [];
            try {
                readings = JSON.parse(localStorage.getItem('sugarReadings')) || [];
            } catch(e) {}
            
            readings.push(newReading);
            localStorage.setItem('sugarReadings', JSON.stringify(readings));
            
            // Render everything with the new data
            loadReadings();
            
            // Provide UX feedback and reset form
            const submitBtn = sugarForm.querySelector('button');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
                submitBtn.style.backgroundColor = 'var(--secondary-color)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            }
            sugarForm.reset();
        });
    }
    
    // Determine sugar status
    function getSugarStatus(level) {
        if (level < 70) return 'Low';
        if (level > 180) return 'High';
        return 'Normal';
    }
    
    // Update readings table
    function updateReadingsTable(readings) {
        if (!readingsTable) return;
        readingsTable.innerHTML = '';
        
        // Show latest readings first
        const reversedReadings = [...readings].reverse();
        
        reversedReadings.forEach((reading, index) => {
            const row = document.createElement('tr');
            
            // Map reversed index back to actual storage index
            const originalIndex = readings.length - 1 - index;
            
            const dateTimeCell = document.createElement('td');
            dateTimeCell.innerHTML = `<strong>${reading.date}</strong><br><span style="font-size:0.85em;color:var(--text-light)">${(reading.time || '').charAt(0).toUpperCase() + (reading.time || '').slice(1)}</span>`;
            
            const contextCell = document.createElement('td');
            contextCell.textContent = reading.context || 'Unknown';
            
            const levelCell = document.createElement('td');
            levelCell.innerHTML = `<strong>${reading.level}</strong> mg/dL`;
            
            const statusCell = document.createElement('td');
            statusCell.textContent = reading.status;
            statusCell.classList.add(`status-${(reading.status || '').toLowerCase()}`);
            
            const actionCell = document.createElement('td');
            actionCell.innerHTML = `<button class="delete-btn" data-index="${originalIndex}" style="background:var(--danger-color); color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; transition:transform 0.2s;"><i class="fas fa-trash"></i></button>`;
            
            row.appendChild(dateTimeCell);
            row.appendChild(contextCell);
            row.appendChild(levelCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);
            
            readingsTable.appendChild(row);
        });

        // Attach event listeners to all dynamically created delete buttons
        document.querySelectorAll('#readings-table .delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                let saved = [];
                try {
                    saved = JSON.parse(localStorage.getItem('sugarReadings')) || [];
                } catch(e) {}
                
                // Remove that specific reading
                saved.splice(idx, 1);
                localStorage.setItem('sugarReadings', JSON.stringify(saved));
                
                // Force a full UI cycle reload (Table, Chart, and Stats reset)
                loadReadings();
            });
        });
    }
    
    // Update chart layers and animation
    function updateChart(readings) {
        const ctx = document.getElementById('sugar-chart');
        const emptyState = document.getElementById('chart-empty-state');
        
        if (!ctx || !emptyState) return;

        if (readings.length === 0) {
            ctx.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        } else {
            ctx.style.display = 'block';
            emptyState.style.display = 'none';
        }
        
        const ctx2d = ctx.getContext('2d');
        
        // Prepare data for chart
        const labels = readings.map((r, i) => `Reading ${i + 1}`);
        const data = readings.map(r => parseInt(r.level));
        const pointColors = readings.map(r => {
            if (r.status === 'High') return '#e74c3c';
            if (r.status === 'Low') return '#f39c12';
            return '#2ecc71';
        });
        
        // Destroy previous chart if exists
        if (sugarChart) {
            sugarChart.destroy();
        }
        
        // Create new interactive, animated, layered chart
        sugarChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Blood Sugar Level (mg/dL)',
                    data: data,
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(52, 152, 219, 0.05)');
                        gradient.addColorStop(1, 'rgba(52, 152, 219, 0.6)');
                        return gradient;
                    },
                    borderColor: '#3498db',
                    borderWidth: 3,
                    pointBackgroundColor: pointColors,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.4, // Smooth curvy lines for elegance
                    fill: true // Interactive layered area!
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allows container to determine size
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 50,
                        suggestedMax: 250,
                        ticks: {
                            callback: function(value) {
                                return value + ' mg/dL';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 14 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return ` Sugar: ${context.parsed.y} mg/dL`;
                            },
                            afterLabel: function(context) {
                                const reading = readings[context.dataIndex];
                                return ` Context: ${reading.context || 'Unknown'}\n Status: ${reading.status}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initialize
    loadReadings();
}