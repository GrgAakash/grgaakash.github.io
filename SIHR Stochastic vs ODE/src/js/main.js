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
let charts = {
    I: null,
    H: null
};

// Function to calculate dynamic y-axis range based on peak values
function calculateDynamicYRange(detResult, results) {
    try {
        // Get all values for I and H compartments
        const allIValues = [];
        const allHValues = [];
        
        // Add deterministic values
        if (detResult && detResult.I_prop && Array.isArray(detResult.I_prop)) {
            allIValues.push(...detResult.I_prop);
        }
        if (detResult && detResult.H_prop && Array.isArray(detResult.H_prop)) {
            allHValues.push(...detResult.H_prop);
        }
        
        // Add stochastic values from current run only
        if (results && results.length > 0 && results[0]) {
            if (results[0].I_prop && Array.isArray(results[0].I_prop)) {
                allIValues.push(...results[0].I_prop);
            }
            if (results[0].H_prop && Array.isArray(results[0].H_prop)) {
                allHValues.push(...results[0].H_prop);
            }
        }
        
        if (allIValues.length === 0 && allHValues.length === 0) return { min: 0, max: 1 };
        
        // Find peak and min values for both compartments
        const maxI = allIValues.length > 0 ? Math.max(...allIValues) : 0;
        const minI = allIValues.length > 0 ? Math.min(...allIValues) : 0;
        const maxH = allHValues.length > 0 ? Math.max(...allHValues) : 0;
        const minH = allHValues.length > 0 ? Math.min(...allHValues) : 0;
        
        // Use the overall max and min across both compartments
        const maxValue = Math.max(maxI, maxH);
        const minValue = Math.min(minI, minH);
        
        // Set y-axis range with 1.1 multiplier for both min and max
        const finalMax = maxValue * 1.1;
        const finalMin = Math.max(0, minValue * 1.1);
        
        return {
            min: finalMin,
            max: finalMax
        };
    } catch (error) {
        console.warn('Error calculating dynamic range:', error);
        return { min: 0, max: 1 };
    }
}

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
        
        // Destroy existing charts if they exist
        Object.values(charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });

        // Create separate chart for each compartment
        const compartments = [
            { id: 'I', color: '#4ECDC4', name: 'Infected' },
            { id: 'H', color: '#45B7D1', name: 'Hospitalized' }
        ];

        compartments.forEach(comp => {
            const ctx = document.getElementById(`chart${comp.id}`).getContext('2d');
            
            // Calculate dynamic y-axis range for this compartment
            const yRange = calculateDynamicYRange(detResult, results);
            
            charts[comp.id] = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'Deterministic',
                            data: detResult.T.map((t, i) => ({ x: t, y: detResult[`${comp.id}_prop`][i] })),
                            borderColor: comp.color,
                            backgroundColor: `${comp.color}20`,
                            borderDash: [8, 4],
                            borderWidth: 3,
                            pointRadius: 0,
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Stochastic',
                            data: results[0].T.map((t, i) => ({ x: t, y: results[0][`${comp.id}_prop`][i] })),
                            borderColor: comp.color,
                            backgroundColor: `${comp.color}20`,
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
                            text: `${comp.name} Proportion Over Time - Run 1/${totalRuns} (N=${N})`,
                            font: {
                                family: "'Press Start 2P', cursive",
                                size: 16,
                                weight: 'bold'
                            },
                            color: '#000'
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#000',
                                font: {
                                    family: "'Press Start 2P', cursive",
                                    size: 10
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#fff',
                            borderWidth: 1,
                            padding: 8,
                            boxPadding: 4,
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
                                    size: 10,
                                    weight: 'bold'
                                },
                                color: '#000'
                            },
                            min: 0, 
                            max: params.tmax,
                            ticks: { 
                                color: '#000',
                                font: {
                                    family: 'Inter',
                                    size: 10
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
                                    size: 10,
                                    weight: 'bold'
                                },
                                color: '#000'
                            },
                            min: yRange.min,
                            max: yRange.max,
                            ticks: { 
                                color: '#000',
                                font: {
                                    family: 'Inter',
                                    size: 10
                                },
                                maxTicksLimit: 6, // Limit ticks to prevent duplicates
                                callback: function(value) {
                                    // Show more decimal places for small values
                                    if (value < 0.01) {
                                        return value.toFixed(4); // Show 4 decimal places for small values
                                    } else if (value < 0.1) {
                                        return value.toFixed(3); // Show 3 decimal places for medium values
                                    } else {
                                        return value.toFixed(2); // Show 2 decimal places for larger values
                                    }
                                }
                            },
                            grid: { 
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    }
                }
            });
        });

        // Setup compartment buttons
        document.querySelectorAll('.comp-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedComp = this.getAttribute('data-comp');
                showCompartment(selectedComp);
            });
        });

        // Setup control buttons
        document.getElementById('playBtn').addEventListener('click', toggleAnimation);
        document.getElementById('resetBtn').addEventListener('click', resetAnimation);
        document.getElementById('speedBtn').addEventListener('click', changeSpeed);
        
        // Function to show selected compartment chart
        function showCompartment(compartment) {
            // Update button states
            document.querySelectorAll('.comp-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-comp="${compartment}"]`).classList.add('active');
            
            // Hide all chart containers
            document.querySelectorAll('.chart-container').forEach(container => {
                container.style.display = 'none';
            });
            
            // Show selected chart container
            document.getElementById(`chartContainer${compartment}`).style.display = 'block';
            
            // Play sound effect
            if (typeof playCoinSound === 'function') {
                playCoinSound();
            }
        }


        
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
        document.getElementById('p_IH-number').value = p_IH.toFixed(9);
    } else if (changed === 'p_IH') {
        p_IR = Math.max(0, Math.min(1, 1 - p_II - p_IH));
        document.getElementById('p_IR-number').value = p_IR.toFixed(9);
    } else if (changed === 'p_IR') {
        p_II = Math.max(0, Math.min(1, 1 - p_IH - p_IR));
        document.getElementById('p_II-number').value = p_II.toFixed(9);
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
        document.getElementById('p_HH-number').value = p_HH.toFixed(9);
    } else if (changed === 'p_HH') {
        p_HR = Math.max(0, Math.min(1, 1 - p_HH));
        document.getElementById('p_HR-number').value = p_HR.toFixed(9);
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

// --- Dynamic initial conditions logic ---
function updateInitialConditions(changed) {
    let s0 = parseFloat(document.getElementById('s0-number').value);
    let i0 = parseFloat(document.getElementById('i0-number').value);
    let h0 = parseFloat(document.getElementById('h0-number').value);
    let r0 = 1 - (s0 + i0 + h0);
    // If sum > 1, cap the changed value
    if (r0 < 0) {
        if (changed === 's0') {
            s0 = Math.max(0, 1 - i0 - h0);
            document.getElementById('s0').value = s0.toFixed(9);
            document.getElementById('s0-number').value = s0.toFixed(9);
        } else if (changed === 'i0') {
            i0 = Math.max(0, 1 - s0 - h0);
            document.getElementById('i0').value = i0.toFixed(9);
            document.getElementById('i0-number').value = i0.toFixed(9);
        } else if (changed === 'h0') {
            h0 = Math.max(0, 1 - s0 - i0);
            document.getElementById('h0').value = h0.toFixed(9);
            document.getElementById('h0-number').value = h0.toFixed(9);
        }
        r0 = 0;
    }
    document.getElementById('r0-number').value = r0.toFixed(9);
    document.getElementById('r0-value').textContent = r0.toFixed(6);
    document.getElementById('s0-value').textContent = s0.toFixed(6);
    document.getElementById('i0-value').textContent = i0.toFixed(6);
    document.getElementById('h0-value').textContent = h0.toFixed(6);
    // Update params
    params.s0 = s0;
    params.i0 = i0;
    params.h0 = h0;
    params.r0 = r0;
    // Update thresholds and chart if needed
    params.R_0_value = calculateR0(params);
    const [sigma0, sigma1, sigma2] = calculate_thresholds(params);
    const tpi = compute_T(params.gamma * (1 - params.p_II) / (params.beta * params.p_SI));
    const h_tpi = compute_h_tpi();
    document.getElementById('R_0-value').textContent = params.R_0_value.toFixed(2);
    document.getElementById('sigma0-value').textContent = sigma0.toFixed(2);
    document.getElementById('sigma1-value').textContent = sigma1.toFixed(2);
    document.getElementById('sigma2-value').textContent = sigma2.toFixed(2);
    document.getElementById('tpi-value').textContent = isNaN(tpi) ? '--' : tpi.toFixed(2);
    document.getElementById('h_tpi-value').textContent = isNaN(h_tpi) ? '--' : h_tpi.toFixed(2);
}
['s0', 'i0', 'h0'].forEach(param => {
    document.getElementById(param).addEventListener('input', (e) => {
        updateInitialConditions(param);
    });
    document.getElementById(param + '-number').addEventListener('input', (e) => {
        updateInitialConditions(param);
    });
});

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

function safeUpdateThresholds() {
    const sum = params.s0 + params.i0 + params.h0 + params.r0;
    if (Math.abs(sum - 1) > 1e-8 || params.s0 <= 0) {
        document.getElementById('tpi-value').textContent = '--';
        document.getElementById('sigma0-value').textContent = '--';
        document.getElementById('sigma1-value').textContent = '--';
        document.getElementById('sigma2-value').textContent = '--';
        document.getElementById('h_tpi-value').textContent = '--';
        document.getElementById('R_0-value').textContent = '--';
        return;
    }
    const s_p = params.gamma * (1 - params.p_II) / (params.beta * params.p_SI);
    if (s_p <= 0 || s_p >= params.s0) {
        document.getElementById('tpi-value').textContent = '--';
        document.getElementById('h_tpi-value').textContent = '--';
        return;
    }
    const [sigma0, sigma1, sigma2] = calculate_thresholds(params);
    const tpi = compute_T(s_p);
    const h_tpi = compute_h_tpi();
    params.R_0_value = calculateR0(params);
    document.getElementById('R_0-value').textContent = isNaN(params.R_0_value) ? '--' : params.R_0_value.toFixed(2);
    document.getElementById('sigma0-value').textContent = isNaN(sigma0) ? '--' : sigma0.toFixed(2);
    document.getElementById('sigma1-value').textContent = isNaN(sigma1) ? '--' : sigma1.toFixed(2);
    document.getElementById('sigma2-value').textContent = isNaN(sigma2) ? '--' : sigma2.toFixed(2);
    document.getElementById('tpi-value').textContent = isNaN(tpi) ? '--' : tpi.toFixed(2);
    document.getElementById('h_tpi-value').textContent = isNaN(h_tpi) ? '--' : h_tpi.toFixed(2);
}

// Call safeUpdateThresholds after any parameter change
['s0', 'i0', 'h0', 'beta', 'gamma', 'alpha', 'p_SI', 'p_II', 'p_IH', 'p_IR', 'p_HR', 'p_HH'].forEach(param => {
    const rangeInput = document.getElementById(param);
    const numberInput = document.getElementById(`${param}-number`);
    if (rangeInput) rangeInput.addEventListener('input', safeUpdateThresholds);
    if (numberInput) numberInput.addEventListener('input', safeUpdateThresholds);
}); 