// Main Application Entry Point
// Ties together all modules and initializes the application

// Global variables (shared across modules)
let params = {
    beta: 2.00,     // infection rate
    gamma: 1.0,   // I outflow rate
    alpha: 1.0,    // H outflow rate
    p_SI: 0.5,     // S->I probability
    p_II: 0.1,     // I->I (remains infected)
    p_IH: 0.5,     // I->H
    p_IR: 0.4,     // I->R
    p_HR: 0.8,     // H->R
    p_HH: 0.2,     // H->H (remains hospitalized)
    tmax: 30,      // simulation end time
    s0: 0.8,       // initial susceptible proportion
    i0: 0.1,       // initial infected proportion
    h0: 0.1,       // initial hospitalized proportion
    r0: 0.0,       // initial recovered proportion
    N: 300,
    R_0_value: 0    // Add R₀ value to params
};

// Population size
let N = 300;
let totalRuns = 50;

// Store results
const results = [];
let detResult = null;
let chart = null;

// Check if Chart.js is loaded
function checkChartJS() {
    if (typeof Chart === 'undefined') {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = 
            'Error: Chart.js failed to load. Please check your internet connection and refresh the page.';
        return false;
    }
    return true;
}

// Initialize everything
async function initialize() {
    try {
        // Initialize audio context on first user interaction
        document.addEventListener('click', function initAudioOnClick() {
            if (!audioContext) {
                initAudio();
            }
            document.removeEventListener('click', initAudioOnClick);
        }, { once: true });

        // Check if Chart.js is loaded
        if (!checkChartJS()) return;
        
        validateParameters(params);
        
        // Run all simulations
        updateStatus('Running simulations...', 'running');
        for (let i = 0; i < totalRuns; i++) {
            results.push(sirAgentModel(N, params, i + 1));
            if (i % 10 === 0) {
                updateStatus(`Running simulations... ${i + 1}/${totalRuns}`, 'running');
                await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update
            }
        }
        
        detResult = solveDeterministicSIR(params);
        
        // Set up Chart.js
        updateStatus('Setting up visualization...', 'running');
        const ctx = document.getElementById('chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (chart) {
            chart.destroy();
        }

        const icolor = getComputedStyle(document.documentElement)
            .getPropertyValue('--deterministic_i-color')
            .trim();
        
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Deterministic i',
                        data: detResult.T.map((t, i) => ({ x: t, y: detResult.I_prop[i] })),
                        borderColor: icolor,
                        backgroundColor: 'rgba(128, 90, 213, 0.1)',
                        borderDash: [8, 4],
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Stochastic i',
                        data: results[0].T.map((t, i) => ({ x: t, y: results[0].I_prop[i] })),
                        borderColor: icolor,
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.2
                    },
                    {
                        label: 'Deterministic h',
                        data: detResult.T.map((t, i) => ({ x: t, y: detResult.H_prop[i] })),
                        borderColor: 'var(--deterministic-color)',
                        backgroundColor: 'rgba(128, 90, 213, 0.1)',
                        borderDash: [8, 4],
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Stochastic h',
                        data: results[0].T.map((t, i) => ({ x: t, y: results[0].H_prop[i] })),
                        borderColor: 'var(--stochastic-color)',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Infected/Hospitalized Proportion Over Time - Run 1/' + totalRuns + ' (N=' + N + ')',
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 18,
                            weight: 'bold'
                        },
                        color: 'var(--primary-color)'
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'var(--primary-color)',
                            font: {
                                family: "'Press Start 2P', cursive",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#fff',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Time (days)',
                            font: {
                                family: "'Press Start 2P', cursive",
                                size: 14,
                                weight: 'bold'
                            },
                            color: 'var(--primary-color)'
                        },
                        min: 0, 
                        max: params.tmax,
                        ticks: { 
                            color: 'var(--secondary-color)',
                            font: {
                                family: 'Inter'
                            }
                        },
                        grid: { 
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: { 
                        title: {
                            display: true,
                            text: 'Proportion',
                            font: {
                                family: "'Press Start 2P', cursive",
                                size: 14,
                                weight: 'bold'
                            },
                            color: 'var(--primary-color)'
                        },
                        min: 0,
                        max: 0.5,
                        ticks: { 
                            color: 'var(--secondary-color)',
                            font: {
                                family: 'Inter'
                            }
                        },
                        grid: { 
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });

        // Setup control buttons
        document.getElementById('playBtn').addEventListener('click', toggleAnimation);
        document.getElementById('resetBtn').addEventListener('click', resetAnimation);
        document.getElementById('speedBtn').addEventListener('click', changeSpeed);

        // Start animation
        updateStatus(`Animation ready - Run 1/${totalRuns}`, 'running');
        setTimeout(() => animate(), 1000); // Start after 1 second
        
        console.log('✅ Initialization complete');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        updateStatus(`Error: ${error.message}`, 'stopped');
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = `Error: ${error.message}`;
    }
}

// Set up event listeners for all parameters
['s0','i0','r0','h0','beta', 'gamma', 'alpha', 'p_SI'].forEach(param => {
    const rangeInput = document.getElementById(param);
    const numberInput = document.getElementById(`${param}-number`);
    if (!rangeInput || !numberInput) return;
    rangeInput.addEventListener('input', (e) => {
        playCoinSound();
        updateParameter(param, e.target.value);
    });
    numberInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value === '' || value === '.' || value === '-.') return;
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            const min = parseFloat(rangeInput.min);
            const max = parseFloat(rangeInput.max);
            if (numValue >= min && numValue <= max) {
                playCoinSound();
                updateParameter(param, numValue);
            }
        }
    });
    numberInput.addEventListener('blur', (e) => {
        let value = e.target.value;
        if (value === '' || value === '.' || value === '-.') {
            value = rangeInput.value;
            e.target.value = value;
        }
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            const min = parseFloat(rangeInput.min);
            const max = parseFloat(rangeInput.max);
            if (numValue >= min && numValue <= max) {
                updateParameter(param, numValue);
            }
        }
    });
});

// Auto-update logic for I outflow group (p_II, p_IH, p_IR)
function updateIOutflow(changed) {
    let p_II = parseFloat(document.getElementById('p_II-number').value);
    let p_IH = parseFloat(document.getElementById('p_IH-number').value);
    let p_IR = parseFloat(document.getElementById('p_IR-number').value);
    if (changed === 'p_II') {
        p_IH = Math.max(0, Math.min(1, 1 - p_II - p_IR));
        document.getElementById('p_IH-number').value = p_IH.toFixed(3);
    } else if (changed === 'p_IH') {
        p_IR = Math.max(0, Math.min(1, 1 - p_II - p_IH));
        document.getElementById('p_IR-number').value = p_IR.toFixed(3);
    } else if (changed === 'p_IR') {
        p_II = Math.max(0, Math.min(1, 1 - p_IH - p_IR));
        document.getElementById('p_II-number').value = p_II.toFixed(3);
    }
    params.p_II = parseFloat(document.getElementById('p_II-number').value);
    params.p_IH = parseFloat(document.getElementById('p_IH-number').value);
    params.p_IR = parseFloat(document.getElementById('p_IR-number').value);
}
['p_II', 'p_IH', 'p_IR'].forEach(param => {
    document.getElementById(`${param}-number`).addEventListener('input', (e) => {
        updateIOutflow(param);
    });
});

// Auto-update logic for H outflow group (p_HR, p_HH)
function updateHOutflow(changed) {
    let p_HR = parseFloat(document.getElementById('p_HR-number').value);
    let p_HH = parseFloat(document.getElementById('p_HH-number').value);
    if (changed === 'p_HR') {
        p_HH = Math.max(0, Math.min(1, 1 - p_HR));
        document.getElementById('p_HH-number').value = p_HH.toFixed(3);
    } else if (changed === 'p_HH') {
        p_HR = Math.max(0, Math.min(1, 1 - p_HH));
        document.getElementById('p_HR-number').value = p_HR.toFixed(3);
    }
    params.p_HR = parseFloat(document.getElementById('p_HR-number').value);
    params.p_HH = parseFloat(document.getElementById('p_HH-number').value);
}
['p_HR', 'p_HH'].forEach(param => {
    document.getElementById(`${param}-number`).addEventListener('input', (e) => {
        updateHOutflow(param);
    });
});

// Population size input handling
const populationInput = document.getElementById('population');
const populationNumberInput = document.getElementById('population-number');
const populationValue = document.getElementById('population-value');

function updatePopulation(value) {
    value = Math.max(1, Math.min(10000, value));
    populationInput.value = value;
    populationNumberInput.value = value;
    populationValue.textContent = value;
    params.N = value;
}

populationInput.addEventListener('input', (e) => {
    playCoinSound(); // Play coin sound for slider movement
    updatePopulation(parseInt(e.target.value));
});

populationNumberInput.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (!isNaN(value)) {
        playCoinSound(); // Play coin sound for number input
        updatePopulation(value);
    }
});

// Number of runs input handling
const runsInput = document.getElementById('runs');
const runsNumberInput = document.getElementById('runs-number');
const runsValue = document.getElementById('runs-value');

function updateRuns(value) {
    value = Math.max(1, Math.min(1000, value));
    runsInput.value = value;
    runsNumberInput.value = value;
    runsValue.textContent = value;
    totalRuns = value;
}

runsInput.addEventListener('input', (e) => {
    playCoinSound(); // Play coin sound for slider movement
    updateRuns(parseInt(e.target.value));
});

runsNumberInput.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (!isNaN(value)) {
        playCoinSound(); // Play coin sound for number input
        updateRuns(value);
    }
});

// Setup apply button
document.getElementById('applyParams').addEventListener('click', () => {
    playPowerUpSound();
    if (isRunning) {
        toggleAnimation();
    }
    params.beta = parseFloat(document.getElementById('beta').value);
    params.gamma = parseFloat(document.getElementById('gamma').value);
    params.alpha = parseFloat(document.getElementById('alpha').value);
    params.p_SI = parseFloat(document.getElementById('p_SI').value);
    params.p_II = parseFloat(document.getElementById('p_II-number').value);
    params.p_IH = parseFloat(document.getElementById('p_IH-number').value);
    params.p_IR = parseFloat(document.getElementById('p_IR-number').value);
    params.p_HR = parseFloat(document.getElementById('p_HR-number').value);
    params.p_HH = parseFloat(document.getElementById('p_HH-number').value);
    params.s0 = parseFloat(document.getElementById('s0').value);
    params.i0 = parseFloat(document.getElementById('i0').value);
    params.r0 = parseFloat(document.getElementById('r0').value);
    params.h0 = parseFloat(document.getElementById('h0').value);
    N = parseInt(document.getElementById('population').value);
    totalRuns = parseInt(document.getElementById('runs').value);

    // Validate parameters
    try {
        validateParameters(params);
        
        // Calculate R₀ once when parameters are applied
        params.R_0_value = calculateR0(params);
        
        // Clear existing results
        results.length = 0;
        currentRun = 0;

        // Run new simulations
        updateStatus('Running new simulations...', 'running');
        for (let i = 0; i < totalRuns; i++) {
            results.push(sirAgentModel(N, params, i + 1));
            if (i % 10 === 0) {
                updateStatus(`Running simulations... ${i + 1}/${totalRuns}`, 'running');
            }
        }

        // Update deterministic solution
        detResult = solveDeterministicSIR(params);

        // Update both curves in the chart
        chart.data.datasets[0].data = detResult.T.map((t, i) => ({ 
            x: t, 
            y: detResult.I_prop[i] 
        }));
        chart.data.datasets[1].data = results[currentRun].T.map((t, i) => ({ 
            x: t, 
            y: results[currentRun].I_prop[i] 
        }));
        chart.data.datasets[2].data = detResult.T.map((t, i) => ({ 
            x: t, 
            y: detResult.H_prop[i] 
        }));
        chart.data.datasets[3].data = results[currentRun].T.map((t, i) => ({ 
            x: t, 
            y: results[currentRun].H_prop[i] 
        }));
      
        // Update chart title and properties
        chart.options.plugins.title.text = 'Infected/Hospitalized Proportion Over Time - Run 1/' + totalRuns + ' (N=' + N + ')';
        chart.options.scales.x.max = params.tmax;
        
        // Update chart and statistics
        chart.update('none');
        updateStatistics();

        updateStatus('Parameters applied successfully', 'running');
    } catch (error) {
        updateStatus(`Error: ${error.message}`, 'stopped');
    }
});

// Add click handler for analyze button
document.getElementById('analyzeBtn').addEventListener('click', function() {
    playPowerUpSound(); // Play power-up sound for analyze
    const patternSection = document.getElementById('patternAnalysis');
    if (patternSection.style.display === 'none') {
        updatePatternAnalysis(results);
    } else {
        patternSection.style.display = 'none';
    }
});

// Function to show pattern details in modal
function showPatternDetails(patternIndex, runIndices) {
    const modal = document.getElementById('patternModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = `Pattern ${patternIndex + 1} - ${runIndices.length} Runs`;
    
    // Create content for modal
    let content = `
        <div class="pattern-runs-grid">
    `;
    
    runIndices.forEach((runIndex, i) => {
        const run = results[runIndex];
        const maxH = Math.max(...run.H_prop);
        const peakTime = run.T[run.H_prop.indexOf(maxH)];
        
        content += `
            <div class="run-card">
                <div class="run-header">
                    <div class="run-selector">
                        <input type="radio" id="run${runIndex}" name="selectedRun" value="${runIndex}" class="run-radio" ${i === 0 ? 'checked' : ''}>
                        <label for="run${runIndex}" class="run-number">Run ${runIndex + 1}</label>
                    </div>
                    <span class="run-stats">Peak: ${maxH.toFixed(4)} at ${peakTime.toFixed(1)}d</span>
                </div>
                <div class="run-chart">
                    <canvas id="modalRun${runIndex}Chart"></canvas>
                </div>
            </div>
        `;
    });
    
    content += `
        </div>
        <div class="download-section">
            <h3>Download Options</h3>
            <button class="download-btn mario-btn" onclick="downloadPatternAsPNG(${patternIndex}, ${JSON.stringify(runIndices)}, results, params)">
                Download All Runs as PNG
            </button>
            <button class="download-btn mario-btn" onclick="downloadSelectedIndividualRun(${JSON.stringify(runIndices)}, results, params)">
                Download Selected Individual Run
            </button>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    
    // Create charts for each run with both deterministic and stochastic
    runIndices.forEach((runIndex, i) => {
        setTimeout(() => {
            const run = results[runIndex];
            const ctx = document.getElementById(`modalRun${runIndex}Chart`).getContext('2d');
            
            // Get deterministic solution for comparison
            const detResult = solveDeterministicSIR(params);
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'Deterministic i',
                            data: detResult.T.map((t, j) => ({ x: t, y: detResult.I_prop[j] })),
                            borderColor: 'var(--deterministic_i-color)',
                            backgroundColor: 'rgba(128, 90, 213, 0.1)',
                            borderDash: [8, 4],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Stochastic i',
                            data: run.T.map((t, j) => ({ x: t, y: run.I_prop[j] })),
                            borderColor: 'var(--deterministic_i-color)',
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.2
                        },
                        {
                            label: 'Deterministic h',
                            data: detResult.T.map((t, j) => ({ x: t, y: detResult.H_prop[j] })),
                            borderColor: 'var(--deterministic-color)',
                            backgroundColor: 'rgba(128, 90, 213, 0.1)',
                            borderDash: [8, 4],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Stochastic h',
                            data: run.T.map((t, j) => ({ x: t, y: run.H_prop[j] })),
                            borderColor: 'var(--stochastic-color)',
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            bottom: 25,
                            left: 15,
                            right: 15
                        }
                    },
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: { 
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 12,
                                font: { size: 11 }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            title: { 
                                display: true, 
                                text: 'Time (days)',
                                font: { size: 13, weight: 'bold' }
                            },
                            ticks: { 
                                maxTicksLimit: 8,
                                font: { size: 11 }
                            },
                            grid: { 
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        y: {
                            title: { 
                                display: true, 
                                text: 'Proportion',
                                font: { size: 13, weight: 'bold' }
                            },
                            beginAtZero: true,
                            ticks: { font: { size: 11 } },
                            grid: { 
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    }
                }
            });
        }, i * 100); // Stagger chart creation
    });
}

// Function to close modal
function closePatternModal() {
    document.getElementById('patternModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('patternModal');
    if (event.target === modal) {
        closePatternModal();
    }
}

// Modal logic for ODE info
const odeModal = document.getElementById('odeModal');
const closeOdeModal = document.getElementById('closeOdeModal');

// Attach click event only to the 1-star Dragon Ball
const dragonBall1 = document.querySelector('.dragon-ball-1');
if (odeModal && closeOdeModal && dragonBall1) {
    dragonBall1.addEventListener('click', () => {
        odeModal.style.display = 'flex';
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    });
    closeOdeModal.addEventListener('click', () => {
        odeModal.style.display = 'none';
    });
    // Close modal when clicking outside modal-content
    odeModal.addEventListener('click', (e) => {
        if (e.target === odeModal) {
            odeModal.style.display = 'none';
        }
    });
}

// Modal logic for Hospitalization Pattern Classification (2-star ball)
const patternClassModal = document.getElementById('patternClassModal');
const closePatternClassModal = document.getElementById('closePatternClassModal');
const dragonBall2 = document.querySelector('.dragon-ball-2');
if (patternClassModal && closePatternClassModal && dragonBall2) {
    dragonBall2.addEventListener('click', () => {
        patternClassModal.style.display = 'flex';
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    });
    closePatternClassModal.addEventListener('click', () => {
        patternClassModal.style.display = 'none';
    });
    patternClassModal.addEventListener('click', (e) => {
        if (e.target === patternClassModal) {
            patternClassModal.style.display = 'none';
        }
    });
}

// Modal logic for SIHR Flowchart (3-star ball)
const sihrFlowModal = document.getElementById('sihrFlowModal');
const closeSihrFlowModal = document.getElementById('closeSihrFlowModal');
const dragonBall3 = document.querySelector('.dragon-ball-3');
if (sihrFlowModal && closeSihrFlowModal && dragonBall3) {
    dragonBall3.addEventListener('click', () => {
        sihrFlowModal.style.display = 'flex';
    });
    closeSihrFlowModal.addEventListener('click', () => {
        sihrFlowModal.style.display = 'none';
    });
    sihrFlowModal.addEventListener('click', (e) => {
        if (e.target === sihrFlowModal) {
            sihrFlowModal.style.display = 'none';
        }
    });
}

// Start when page loads
window.addEventListener('load', async () => {
    // Hide pattern details modal on load
    const patternModal = document.getElementById('patternModal');
    if (patternModal) patternModal.style.display = 'none';

    console.log('🔄 Page loaded, initializing...');
    initMatrixBackground(); // Initialize Matrix background
    await initialize();
    initDraggableCoins(); // Initialize draggable coins
    if (window.initDraggableDragonBalls) {
        window.initDraggableDragonBalls();
    } else if (typeof initDraggableDragonBalls === 'function') {
        initDraggableDragonBalls();
    }
}); 