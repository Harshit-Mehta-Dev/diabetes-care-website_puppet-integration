// Sugar Tracker functionality
function initTracker() {
    const sugarForm = document.getElementById('sugar-form');
    const readingsTable = document.querySelector('#readings-table tbody');
    let sugarChart = null;
    
    // Load saved readings
    function loadReadings() {
        const savedReadings = localStorage.getItem('sugarReadings');
        const readings = savedReadings ? JSON.parse(savedReadings) : [];
        
        updateReadingsTable(readings);
        updateChart(readings);
        return readings;
    }
    
    // Add new reading
    sugarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const time = document.getElementById('reading-time').value;
        const level = parseInt(document.getElementById('sugar-level').value);
        
        if (!time || isNaN(level)) {
            alert('Please fill all fields correctly');
            return;
        }
        
        const newReading = {
            date: new Date().toLocaleDateString(),
            time: time,
            level: level,
            status: getSugarStatus(level)
        };
        
        let readings = loadReadings();
        readings.push(newReading);
        localStorage.setItem('sugarReadings', JSON.stringify(readings));
        
        updateReadingsTable(readings);
        updateChart(readings);
        
        // Reset form
        sugarForm.reset();
    });
    
    // Determine sugar status
    function getSugarStatus(level) {
        if (level < 70) return 'Low';
        if (level > 180) return 'High';
        return 'Normal';
    }
    
    // Update readings table
    function updateReadingsTable(readings) {
        readingsTable.innerHTML = '';
        
        // Show latest readings first
        const reversedReadings = [...readings].reverse();
        
        reversedReadings.forEach(reading => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.textContent = reading.date;
            
            const timeCell = document.createElement('td');
            timeCell.textContent = reading.time.charAt(0).toUpperCase() + reading.time.slice(1);
            
            const levelCell = document.createElement('td');
            levelCell.textContent = reading.level;
            
            const statusCell = document.createElement('td');
            statusCell.textContent = reading.status;
            statusCell.classList.add(`status-${reading.status.toLowerCase()}`);
            
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(levelCell);
            row.appendChild(statusCell);
            
            readingsTable.appendChild(row);
        });
    }
    
    // Update chart
    function updateChart(readings) {
        const ctx = document.getElementById('sugar-chart').getContext('2d');
        
        // Prepare data for chart
        const labels = readings.map((r, i) => `Reading ${i + 1}`);
        const data = readings.map(r => r.level);
        const backgroundColors = readings.map(r => {
            if (r.status === 'High') return '#e74c3c';
            if (r.status === 'Low') return '#f39c12';
            return '#2ecc71';
        });
        
        // Destroy previous chart if exists
        if (sugarChart) {
            sugarChart.destroy();
        }
        
        // Create new chart
        sugarChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Blood Sugar Level (mg/dL)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#3498db',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
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
                        callbacks: {
                            label: function(context) {
                                return `Sugar: ${context.parsed.y} mg/dL`;
                            },
                            afterLabel: function(context) {
                                const reading = readings[context.dataIndex];
                                return `Time: ${reading.time}\nStatus: ${reading.status}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            highLine: {
                                type: 'line',
                                yMin: 180,
                                yMax: 180,
                                borderColor: '#e74c3c',
                                borderWidth: 1,
                                borderDash: [6, 6],
                                label: {
                                    content: 'High (180+)',
                                    enabled: true,
                                    position: 'left'
                                }
                            },
                            lowLine: {
                                type: 'line',
                                yMin: 70,
                                yMax: 70,
                                borderColor: '#f39c12',
                                borderWidth: 1,
                                borderDash: [6, 6],
                                label: {
                                    content: 'Low (<70)',
                                    enabled: true,
                                    position: 'left'
                                }
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