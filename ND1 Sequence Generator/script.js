function dyckToPartition(v) {
    const n = v.length;
    const partition = [];
    
    for (let i = 1; i <= n; i++) {
        const part = (n - i) - v[n - i];
        if (part > 0) {
            partition.push(part);
        }
    }
    
    return partition.sort((a, b) => b - a);
}

function nd1OnPartition(gamma) {
    if (gamma.length === 0) {
        return null;
    }
    
    const g1 = gamma[0];
    const l = gamma.length;
    
    if (g1 < l) {
        return null;
    }
    
    const newParts = gamma.slice(1).map(p => p + 1);
    const onesToAdd = new Array(g1 - l).fill(1);
    const newPartition = [...newParts, ...onesToAdd];
    return newPartition.sort((a, b) => b - a);
}

function partitionToDyck(partition) {
    // Convert partition to proper Dyck vector
    const n = partition.length + 1;
    const dyck = new Array(n);
    dyck[0] = 0;
    
    // Build Dyck vector step by step ensuring constraints
    for (let i = 1; i < n; i++) {
        const maxAllowed = dyck[i-1] + 1;
        const partitionIndex = n - i - 1;
        
        if (partitionIndex < 0 || partitionIndex >= partition.length) {
            dyck[i] = 0;
        } else {
            const partitionValue = partition[partitionIndex];
            const calculatedValue = (n - i - 1) - partitionValue;
            dyck[i] = Math.max(0, Math.min(maxAllowed, calculatedValue));
        }
    }
    
    return dyck;
}

function calculateDinvPartition(partition) {
    if (partition.length === 0) {
        return 0;
    }
    
    let dinvCount = 0;
    
    for (let i = 0; i < partition.length; i++) {
        const part = partition[i];
        for (let j = 1; j <= part; j++) {
            const arm = part - j;
            let leg = 0;
            for (let k = i + 1; k < partition.length; k++) {
                if (j <= partition[k]) {
                    leg++;
                }
            }
            
            if (arm === leg || arm === leg + 1) {
                dinvCount++;
            }
        }
    }
    
    return dinvCount;
}

function calculateDefcPartition(partition) {
    if (partition.length === 0) {
        return 0;
    }
    
    const totalBoxes = partition.reduce((sum, part) => sum + part, 0);
    const dinvCount = calculateDinvPartition(partition);
    return totalBoxes - dinvCount;
}

function calculateDefc(v) {
    const partition = dyckToPartition(v);
    return calculateDefcPartition(partition);
}

function calculateDinv(v) {
    const partition = dyckToPartition(v);
    return calculateDinvPartition(partition);
}

function nd1OnDyckVector(v) {
    const n = v.length;
    if (n === 0) {
        return null;
    }
    
    let d = 0;
    while (d < n && v[d] === d) {
        d++;
    }
    d--;
    
    const s = v[n - 1];
    
    if (d < s) {
        return null;
    }
    
    let insertPos = -1;
    for (let i = 0; i < n; i++) {
        if (v[i] === s) {
            insertPos = i;
            break;
        }
    }
    
    if (insertPos === -1) {
        return null;
    }
    
    const newV = v.slice(0, -1);
    newV.splice(insertPos + 1, 0, s + 1);
    
    return newV;
}

function generateAllDyckVectors(n, targetDefc = null) {
    const vectors = [];
    
    function generateRecursive(current, remainingPositions) {
        if (remainingPositions === 0) {
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
        
        if (current.length === 0) {
            generateRecursive([...current, 0], remainingPositions - 1);
        } else {
            const maxVal = current[current.length - 1] + 1;
            for (let val = 0; val <= maxVal; val++) {
                generateRecursive([...current, val], remainingPositions - 1);
            }
        }
    }
    
    generateRecursive([], n);
    return vectors;
}

function parseInput(input, method) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        const values = parts.map(x => parseInt(x.trim()));
        
        if (method === 'method1') {
            const dyckVector = partitionToDyck(values);
            return { type: 'partition', vector: dyckVector, originalPartition: values };
        } else {
            if (values[0] !== 0) {
                throw new Error('Dyck vector must start with 0');
            }
            for (let i = 0; i < values.length - 1; i++) {
                if (values[i + 1] > values[i] + 1) {
                    throw new Error(`Invalid Dyck vector: v[${i + 1}] = ${values[i + 1]} > ${values[i]} + 1`);
                }
            }
            return { type: 'dyck', vector: values };
        }
    } catch (error) {
        if (error.message.includes('Dyck vector') || error.message.includes('Invalid')) {
            throw error;
        }
        throw new Error('Invalid input format. Please use comma-separated integers.');
    }
}

function generateSequence() {
    const input = document.getElementById('input-vector').value;
    const method = document.querySelector('input[name="method"]:checked').value;
    const useMethod2 = method === 'method2';
    
    try {
        const parsed = parseInput(input, method);
        const vCurrent = parsed.vector;
        const vectorLength = vCurrent.length;
        
        const sequence = [vCurrent];
        const partitions = [];
        const deficiencies = [calculateDefc(vCurrent)];
        const dinvs = [calculateDinv(vCurrent)];
        
        let currentVector = vCurrent;
        let iteration = 0;
        const maxIterations = 100;
        
        while (iteration < maxIterations) {
            let nextVector;
            
            if (useMethod2) {
                nextVector = nd1OnDyckVector(currentVector);
            } else {
                const pCurrent = dyckToPartition(currentVector);
                partitions.push(pCurrent);
                
                const pNext = nd1OnPartition(pCurrent);
                if (pNext === null) {
                    break;
                }
                
                nextVector = partitionToDyck(pNext);
            }
            
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
        
        displayResults(sequence, deficiencies, dinvs, partitions, useMethod2, iteration, parsed);
        
    } catch (error) {
        showError(error.message);
    }
}

function displayResults(sequence, deficiencies, dinvs, partitions, useMethod2, iterations, parsed) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    let inputInfo = '';
    if (parsed.type === 'partition') {
        inputInfo = ` (from partition [${parsed.originalPartition.join(', ')}])`;
    }
    
    document.getElementById('initial-vector').textContent = `[${sequence[0].join(', ')}]${inputInfo}`;
    document.getElementById('initial-defc').textContent = deficiencies[0];
    document.getElementById('initial-dinv').textContent = dinvs[0];
    
    const finalVector = sequence[sequence.length - 1];
    document.getElementById('final-vector').textContent = `[${finalVector.join(', ')}]`;
    document.getElementById('final-defc').textContent = deficiencies[deficiencies.length - 1];
    document.getElementById('final-dinv').textContent = dinvs[dinvs.length - 1];
    
    document.getElementById('total-iterations').textContent = iterations;
    document.getElementById('method-used').textContent = useMethod2 ? 'Method 2 (Direct)' : 'Method 1 (Partition-based)';
    
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
                return pNext === null ? null : partitionToDyck(pNext);
            })();
        
        if (nextVector === null) {
            terminationReason = 'Outside domain of ND₁';
        }
    }
    document.getElementById('termination-reason').textContent = terminationReason;
    
    createSequenceTable(sequence, deficiencies, dinvs);
    createVisualization(sequence, deficiencies, dinvs);
}

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

function createVisualization(sequence, deficiencies, dinvs) {
    const chartContainer = document.getElementById('sequence-chart');
    
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


function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.style.cssText = `
        background-color: #ffebee;
        color: #c62828;
        border: 2px solid #e57373;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(229, 115, 115, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    
    document.querySelectorAll('.error').forEach(el => el.remove());
    document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    document.querySelectorAll('.success').forEach(el => el.remove());
    document.querySelector('main').insertBefore(successDiv, document.querySelector('main').firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function updateInputLabel() {
    const method = document.querySelector('input[name="method"]:checked').value;
    const label = document.getElementById('input-label');
    const input = document.getElementById('input-vector');
    
    if (method === 'method1') {
        label.textContent = 'Partition (comma-separated):';
        input.placeholder = '5,4,4,1';
        input.value = '5,4,4,1';
    } else {
        label.textContent = 'Dyck Vector (comma-separated):';
        input.placeholder = '0,1,2,2,0,1,1';
        input.value = '0,1,2,2,0,1,1';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generate-sequence').addEventListener('click', generateSequence);
    
    document.querySelectorAll('input[name="method"]').forEach(radio => {
        radio.addEventListener('change', updateInputLabel);
    });
    
    document.getElementById('analyze-arbitrary-defc').addEventListener('click', analyzeArbitraryDefc);
    document.getElementById('show-available-defc').addEventListener('click', function() {
        const length = parseInt(document.getElementById('vector-length').value);
        listAvailableDefcValues(length);
    });
    
    document.getElementById('input-vector').addEventListener('keypress', function(e) {
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
    
    updateInputLabel();
    generateSequence();
});
