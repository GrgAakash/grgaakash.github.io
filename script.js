/**
 * ND₁ Sequence Generator - JavaScript Implementation
 * 
 * This file contains all the mathematical functions for the ND₁ transformation
 * and the interactive web interface functionality.
 */

// Mathematical Functions (translated from Python/Julia)

/**
 * Converts a Dyck vector to an integer partition
 */
function dyckToPartition(v) {
    const n = v.length;
    const partition = [];
    
    for (let i = 1; i <= n; i++) {
        const part = (n - i) - v[n - i];
        if (part > 0) {
            partition.push(part);
        }
    }
    
    return partition.sort((a, b) => b - a); // Sort in decreasing order
}

/**
 * Applies the ND₁ map to an integer partition (Method 1)
 */
function nd1OnPartition(gamma) {
    if (gamma.length === 0) {
        return null; // ND₁ is undefined on the empty partition
    }
    
    const g1 = gamma[0]; // The first part (driver)
    const l = gamma.length; // Length of partition
    
    // Domain condition: first part >= length
    if (g1 < l) {
        return null; // Outside the domain
    }
    
    // Step 1: Remove first part, add 1 to each remaining part
    const newParts = gamma.slice(1).map(p => p + 1);
    
    // Step 2: Add (g1 - l) parts of size 1
    const onesToAdd = new Array(g1 - l).fill(1);
    
    // Combine and sort
    const newPartition = [...newParts, ...onesToAdd];
    return newPartition.sort((a, b) => b - a);
}

/**
 * Converts an integer partition back to a Dyck vector of length n
 */
function partitionToDyck(p, n) {
    // Pad the partition with zeros
    const paddedP = [...p, ...new Array(n - p.length).fill(0)];
    
    // Initialize the Dyck vector with zeros
    const v = new Array(n).fill(0);
    
    // Apply the inverse conversion formula
    for (let i = 1; i <= n; i++) {
        v[i - 1] = (i - 1) - paddedP[n - i];
    }
    
    return v;
}

/**
 * Calculates the dinv (diagonal inversions) of an integer partition using the arm-leg rule
 */
function calculateDinvPartition(partition) {
    if (partition.length === 0) {
        return 0;
    }
    
    let dinvCount = 0;
    
    for (let i = 0; i < partition.length; i++) {
        const part = partition[i];
        for (let j = 1; j <= part; j++) {
            // Box at position (i, j) in the partition diagram
            // Arm = number of boxes to the right
            const arm = part - j;
            
            // Leg = number of boxes below
            let leg = 0;
            for (let k = i + 1; k < partition.length; k++) {
                if (j <= partition[k]) {
                    leg++;
                }
            }
            
            // Count if balanced (arm === leg or arm === leg + 1)
            if (arm === leg || arm === leg + 1) {
                dinvCount++;
            }
        }
    }
    
    return dinvCount;
}

/**
 * Calculates the deficit (defc) of an integer partition using the arm-leg rule
 */
function calculateDefcPartition(partition) {
    if (partition.length === 0) {
        return 0;
    }
    
    const totalBoxes = partition.reduce((sum, part) => sum + part, 0);
    const dinvCount = calculateDinvPartition(partition);
    return totalBoxes - dinvCount;
}

/**
 * Calculates the deficit (defc) of a Dyck vector
 */
function calculateDefc(v) {
    const partition = dyckToPartition(v);
    return calculateDefcPartition(partition);
}

/**
 * Calculates the dinv of a Dyck vector
 */
function calculateDinv(v) {
    const partition = dyckToPartition(v);
    return calculateDinvPartition(partition);
}

/**
 * Apply ND₁ directly to a Dyck vector using Method 2
 */
function nd1OnDyckVector(v) {
    const n = v.length;
    if (n === 0) {
        return null;
    }
    
    // Find the leader d (largest k where v starts with [0,1,...,k])
    let d = 0;
    while (d < n && v[d] === d) {
        d++;
    }
    d--; // Adjust to get the actual leader
    
    // Get the last symbol
    const s = v[n - 1];
    
    // Check condition: d >= s
    if (d < s) {
        return null; // ND₁ is undefined
    }
    
    // Find the first occurrence of s
    let insertPos = -1;
    for (let i = 0; i < n; i++) {
        if (v[i] === s) {
            insertPos = i;
            break;
        }
    }
    
    if (insertPos === -1) {
        return null; // Should not happen
    }
    
    // Create new vector: remove last element, insert (s+1) after first s
    const newV = v.slice(0, -1); // Remove last element
    newV.splice(insertPos + 1, 0, s + 1); // Insert s+1 after first occurrence of s
    
    return newV;
}

/**
 * Generate all Dyck vectors of length n with target defc
 * 
 * A Dyck vector must satisfy:
 * 1. v[0] = 0 (must start with 0)
 * 2. v[i+1] <= v[i] + 1 for all i
 */
function generateAllDyckVectors(n, targetDefc = null) {
    const vectors = [];
    
    function generateRecursive(current, remainingPositions) {
        if (remainingPositions === 0) {
            // Calculate actual defc for filtering
            if (targetDefc === null) {
                vectors.push([...current]);
            } else {
                const actualDefc = calculateDefc(current);
                if (actualDefc === targetDefc) {
                    vectors.push([...current]);
                }
            }
            return;
        }
        
        // For Dyck vectors:
        // 1. The first element must be 0
        // 2. Each subsequent component must satisfy v[i+1] <= v[i] + 1
        if (current.length === 0) {
            // First element must be 0
            generateRecursive([...current, 0], remainingPositions - 1);
        } else {
            // Subsequent elements: v[i+1] <= v[i] + 1
            const maxVal = current[current.length - 1] + 1;
            for (let val = 0; val <= maxVal; val++) {
                generateRecursive([...current, val], remainingPositions - 1);
            }
        }
    }
    
    generateRecursive([], n);
    return vectors;
}

// UI Functions

/**
 * Parse input string to array of integers
 */
function parseDyckVector(input) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        return parts.map(x => parseInt(x.trim()));
    } catch (error) {
        throw new Error('Invalid input format. Please use comma-separated integers.');
    }
}

/**
 * Generate ND₁ sequence and display results
 */
function generateSequence() {
    const input = document.getElementById('dyck-vector').value;
    const method = document.querySelector('input[name="method"]:checked').value;
    const useMethod2 = method === 'method2';
    
    try {
        const vCurrent = parseDyckVector(input);
        const vectorLength = vCurrent.length;
        
        // Initialize sequence data
        const sequence = [vCurrent];
        const partitions = [];
        const deficiencies = [calculateDefc(vCurrent)];
        const dinvs = [calculateDinv(vCurrent)];
        
        let currentVector = vCurrent;
        let iteration = 0;
        const maxIterations = 100;
        
        // Generate sequence
        while (iteration < maxIterations) {
            let nextVector;
            
            if (useMethod2) {
                // Method 2: Direct Dyck vector transformation
                nextVector = nd1OnDyckVector(currentVector);
            } else {
                // Method 1: Partition-based transformation
                const pCurrent = dyckToPartition(currentVector);
                partitions.push(pCurrent);
                
                const pNext = nd1OnPartition(pCurrent);
                if (pNext === null) {
                    break;
                }
                
                nextVector = partitionToDyck(pNext, vectorLength);
            }
            
            if (nextVector === null) {
                break;
            }
            
            // Check for fixed point
            if (JSON.stringify(nextVector) === JSON.stringify(currentVector)) {
                break;
            }
            
            currentVector = nextVector;
            sequence.push(currentVector);
            deficiencies.push(calculateDefc(currentVector));
            dinvs.push(calculateDinv(currentVector));
            
            iteration++;
        }
        
        // Display results
        displayResults(sequence, deficiencies, dinvs, partitions, useMethod2, iteration);
        
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Display sequence results
 */
function displayResults(sequence, deficiencies, dinvs, partitions, useMethod2, iterations) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    // Update initial state
    document.getElementById('initial-vector').textContent = `[${sequence[0].join(', ')}]`;
    document.getElementById('initial-defc').textContent = deficiencies[0];
    document.getElementById('initial-dinv').textContent = dinvs[0];
    
    // Update final state
    const finalVector = sequence[sequence.length - 1];
    document.getElementById('final-vector').textContent = `[${finalVector.join(', ')}]`;
    document.getElementById('final-defc').textContent = deficiencies[deficiencies.length - 1];
    document.getElementById('final-dinv').textContent = dinvs[dinvs.length - 1];
    
    // Update statistics
    document.getElementById('total-iterations').textContent = iterations;
    document.getElementById('method-used').textContent = useMethod2 ? 'Method 2 (Direct)' : 'Method 1 (Partition-based)';
    
    // Determine termination reason
    let terminationReason = 'Sequence completed';
    if (iterations >= 100) {
        terminationReason = 'Maximum iterations reached';
    } else if (sequence.length > 1) {
        const lastVector = sequence[sequence.length - 1];
        const nextVector = useMethod2 ? 
            nd1OnDyckVector(lastVector) : 
            (() => {
                const p = dyckToPartition(lastVector);
                const pNext = nd1OnPartition(p);
                return pNext === null ? null : partitionToDyck(pNext, lastVector.length);
            })();
        
        if (nextVector === null) {
            terminationReason = 'Outside domain of ND₁';
        }
    }
    document.getElementById('termination-reason').textContent = terminationReason;
    
    // Create sequence table
    createSequenceTable(sequence, deficiencies, dinvs);
    
    // Create visualization
    createVisualization(sequence, deficiencies, dinvs);
}

/**
 * Create sequence table
 */
function createSequenceTable(sequence, deficiencies, dinvs) {
    const tableContainer = document.getElementById('sequence-table');
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Iteration</th>
                    <th>Dyck Vector</th>
                    <th>Defc</th>
                    <th>Dinv</th>
                    <th>Defc Change</th>
                    <th>Dinv Change</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < sequence.length; i++) {
        const defcChange = i > 0 ? deficiencies[i] - deficiencies[i - 1] : 0;
        const dinvChange = i > 0 ? dinvs[i] - dinvs[i - 1] : 0;
        
        tableHTML += `
            <tr>
                <td>${i}</td>
                <td>[${sequence[i].join(', ')}]</td>
                <td>${deficiencies[i]}</td>
                <td>${dinvs[i]}</td>
                <td>${defcChange >= 0 ? '+' : ''}${defcChange}</td>
                <td>${dinvChange >= 0 ? '+' : ''}${dinvChange}</td>
            </tr>
        `;
    }
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

/**
 * Create simple visualization
 */
function createVisualization(sequence, deficiencies, dinvs) {
    const chartContainer = document.getElementById('sequence-chart');
    
    // Simple text-based visualization for now
    let chartHTML = '<div class="visualization">';
    chartHTML += '<h4>Sequence Progression</h4>';
    
    for (let i = 0; i < sequence.length; i++) {
        const defcChange = i > 0 ? deficiencies[i] - deficiencies[i - 1] : 0;
        const dinvChange = i > 0 ? dinvs[i] - dinvs[i - 1] : 0;
        
        chartHTML += `
            <div class="sequence-step">
                <strong>Step ${i}:</strong> [${sequence[i].join(', ')}] 
                <span class="stats">defc=${deficiencies[i]} (${defcChange >= 0 ? '+' : ''}${defcChange}) 
                dinv=${dinvs[i]} (${dinvChange >= 0 ? '+' : ''}${dinvChange})</span>
            </div>
        `;
    }
    
    chartHTML += '</div>';
    chartContainer.innerHTML = chartHTML;
}

/**
 * List available defc values for a given length
 */
function listAvailableDefcValues(length) {
    try {
        const allVectors = generateAllDyckVectors(length);
        const defcValues = new Set();
        const defcCounts = {};
        
        allVectors.forEach(vector => {
            const defc = calculateDefc(vector);
            defcValues.add(defc);
            defcCounts[defc] = (defcCounts[defc] || 0) + 1;
        });
        
        const sortedDefcValues = Array.from(defcValues).sort((a, b) => a - b);
        
        const display = document.getElementById('defc-values-display');
        let html = `<p><strong>Available defc values for length ${length}:</strong> [${sortedDefcValues.join(', ')}]</p>`;
        html += '<div class="defc-values-display">';
        
        sortedDefcValues.forEach(defcVal => {
            html += `
                <div class="defc-value-item">
                    <h4>Defc = ${defcVal}</h4>
                    <p><strong>${defcCounts[defcVal]} vectors</strong></p>
                </div>
            `;
        });
        
        html += '</div>';
        display.innerHTML = html;
        
        const infoDiv = document.getElementById('available-defc-info');
        infoDiv.style.display = 'block';
        
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Analyze vectors with arbitrary defc
 */
function analyzeArbitraryDefc() {
    const length = parseInt(document.getElementById('vector-length').value);
    const targetDefc = parseInt(document.getElementById('target-defc').value);
    
    try {
        const vectors = generateAllDyckVectors(length, targetDefc);
        const results = document.getElementById('defc-analysis-results');
        results.style.display = 'block';
        
        let summaryHTML = `
            <h4>Summary</h4>
            <p><strong>Found ${vectors.length} Dyck vectors with defc=${targetDefc} and length ${length}</p>
        `;
        
        if (vectors.length === 0) {
            summaryHTML += '<p><em>No vectors found with this defc value. Try checking available defc values.</em></p>';
        }
        
        let detailsHTML = '<h4>Detailed Results</h4>';
        
        vectors.forEach((vector, index) => {
            const sequence = [vector];
            const deficiencies = [targetDefc];
            const dinvs = [calculateDinv(vector)];
            
            let currentVector = vector;
            let iteration = 0;
            const maxIterations = 100;
            
            // Generate sequence
            while (iteration < maxIterations) {
                const nextVector = nd1OnDyckVector(currentVector);
                if (nextVector === null) {
                    break;
                }
                
                if (JSON.stringify(nextVector) === JSON.stringify(currentVector)) {
                    break;
                }
                
                currentVector = nextVector;
                sequence.push(currentVector);
                deficiencies.push(calculateDefc(currentVector));
                dinvs.push(calculateDinv(currentVector));
                
                iteration++;
            }
            
            summaryHTML += `<p><strong>Vector ${index + 1}:</strong> [${vector.join(', ')}] → ${iteration} iterations</p>`;
            
            detailsHTML += `
                <div class="defc-analysis-item">
                    <h5>Vector ${index + 1}: [${vector.join(', ')}]</h5>
                    <p><strong>Iterations:</strong> ${iteration}</p>
                    <p><strong>Final vector:</strong> [${currentVector.join(', ')}]</p>
                    <p><strong>Final defc:</strong> ${deficiencies[deficiencies.length - 1]}</p>
                    <p><strong>Final dinv:</strong> ${dinvs[dinvs.length - 1]}</p>
                </div>
            `;
        });
        
        document.getElementById('defc-analysis-summary').innerHTML = summaryHTML;
        document.getElementById('defc-analysis-details').innerHTML = detailsHTML;
        
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    // Remove existing errors
    document.querySelectorAll('.error').forEach(el => el.remove());
    
    // Add new error
    document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    // Remove existing messages
    document.querySelectorAll('.success').forEach(el => el.remove());
    
    // Add new message
    document.querySelector('main').insertBefore(successDiv, document.querySelector('main').firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Generate sequence button
    document.getElementById('generate-sequence').addEventListener('click', generateSequence);
    
    // Arbitrary defc analysis buttons
    document.getElementById('analyze-arbitrary-defc').addEventListener('click', analyzeArbitraryDefc);
    document.getElementById('show-available-defc').addEventListener('click', function() {
        const length = parseInt(document.getElementById('vector-length').value);
        listAvailableDefcValues(length);
    });
    
    // Enter key support for inputs
    document.getElementById('dyck-vector').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateSequence();
        }
    });
    
    document.getElementById('vector-length').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeArbitraryDefc();
        }
    });
    
    document.getElementById('target-defc').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeArbitraryDefc();
        }
    });
    
    // Initial demo
    generateSequence();
});
