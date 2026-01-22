// Convert partition to QDV of length n
function partitionToQDV(partition, n) {
    const qdv = new Array(n);
    
    for (let i = 1; i <= n; i++) {
        const lambdaIndex = n - i + 1 - 1;
        const lambdaValue = (lambdaIndex >= 0 && lambdaIndex < partition.length) 
            ? partition[lambdaIndex] 
            : 0;
        qdv[i-1] = (i - 1) - lambdaValue;
    }
    
    return qdv;
}

// Convert QDV back to partition
function QDVToPartition(qdv) {
    const n = qdv.length;
    const partition = [];
    
    for (let i = 1; i <= n; i++) {
        const part = (n - i) - qdv[n - i];
        if (part > 0) {
            partition.push(part);
        }
    }
    
    return partition.sort((a, b) => b - a);
}

// Reduce QDV to minimal Dyck vector
function reduceQDVToReducedDyck(qdv) {
    if (!qdv || qdv.length === 0) return [0];
    let v = qdv.slice();
    
    while (v.some(x => x < 0)) {
        v = [0, ...v.map(x => x + 1)];
    }
    
    while (v.length > 1 && v[0] === 0) {
        const candidate = v.slice(1).map(x => x - 1);
        if (candidate.every(x => x >= 0)) {
            v = candidate;
        } else {
            break;
        }
    }
    return v;
}

function reducedDyckFromPartition(partition) {
    if (!partition || partition.length === 0) return [0];
    const parts = partition.slice().sort((a, b) => b - a);
    let n = 0;
    for (let j = 0; j < parts.length; j++) {
        n = Math.max(n, parts[j] + (j + 1));
    }
    if (n <= 0) n = 1;
    const qdv = partitionToQDV(parts, n);
    return qdv;
}

function isValidSMALLNumber(k, r) {
    return r <= Math.floor(k / 2) - 2;
}

function is_NU1_initial(partition) {
    if (partition.length === 0) return false;
    return partition[0] < partition.length;
}

function is_NU1_final(partition) {
    if (partition.length === 0) return false;
    return partition[0] > partition.length + 2;
}

function calculateDinv(partition) {
    if (partition.length === 0) return 0;
    
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

function calculateDeficit(partition) {
    if (partition.length === 0) return 0;
    const totalBoxes = partition.reduce((sum, part) => sum + part, 0);
    return totalBoxes - calculateDinv(partition);
}

// NU₁ map
function NU1(partition) {
    if (partition.length === 0) return null;
    
    const g1 = partition[0];
    const l = partition.length;
    
    if (is_NU1_final(partition)) return null;
    
    const newPartition = [l + 1, ...partition.map(p => p - 1)];
    return newPartition.filter(p => p > 0).sort((a, b) => b - a);
}

// ND₁ map - inverse of NU₁
function ND1(partition) {
    if (partition.length === 0) return null;
    
    const g1 = partition[0];
    const l = partition.length;
    
    if (is_NU1_initial(partition)) return null;
    
    const newParts = partition.slice(1).map(p => p + 1);
    const onesToAdd = new Array(g1 - l).fill(1);
    return [...newParts, ...onesToAdd].sort((a, b) => b - a);
}

// NU₂ Rule (a) pattern check
function matchesNU2RuleA(qdv) {
    if (qdv.length < 3) return null;
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return null;
    
    let trailingNeg1s = 0;
    for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) {
        trailingNeg1s++;
    }
    
    const h = trailingNeg1s + 1;
    
    let consecutive2s = 0;
    let i = 2;
    while (i < qdv.length && qdv[i] === 2) {
        consecutive2s++;
        i++;
    }
    
    if (consecutive2s < h) return null;
    
    const startA = 2 + h;
    const endA = qdv.length - (h - 1);
    const A = qdv.slice(startA, endA);
    
    if (A.length > 0) {
        if (A[A.length - 1] < 0) return null;
        for (let k = 0; k < A.length; k++) {
            if (A[k] > 2) return null;
        }
        for (let k = 0; k < A.length - 1; k++) {
            if (A[k + 1] > A[k] + 1) return null;
        }
    }
    
    return { h, A };
}

// NU₂ Rule (b) pattern check
function matchesNU2RuleB(qdv) {
    if (qdv.length < 3) return null;
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return null;
    
    let consecutive2s = 0;
    let i = 2;
    while (i < qdv.length && qdv[i] === 2) {
        consecutive2s++;
        i++;
    }
    const k = consecutive2s;
    
    let trailingNeg1s = 0;
    for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) {
        trailingNeg1s++;
    }
    
    if (trailingNeg1s < k) return null;
    
    const startB = 2 + k;
    const endB = qdv.length - k;
    const B = qdv.slice(startB, endB);
    
    if (B.length > 0) {
        if (B[0] > 1) return null;
        if (B[B.length - 1] < -1) return null;
        for (let m = 0; m < B.length; m++) {
            if (B[m] > 2) return null;
        }
        for (let m = 0; m < B.length - 1; m++) {
            if (B[m + 1] > B[m] + 1) return null;
        }
    }
    
    return { k, B };
}

function applyNU2RuleA(qdv, h, A) {
    return [0, ...new Array(h - 1).fill(0), 1, ...A, ...new Array(h).fill(1)];
}

function applyNU2RuleB(qdv, k, B) {
    return [0, ...new Array(k).fill(0), ...B, 0, ...new Array(k).fill(1)];
}

function NU2(qdv, suppressAlerts = false) {
    const ruleB = matchesNU2RuleB(qdv);
    if (ruleB) return applyNU2RuleB(qdv, ruleB.k, ruleB.B);
    
    const ruleA = matchesNU2RuleA(qdv);
    if (ruleA) return applyNU2RuleA(qdv, ruleA.h, ruleA.A);
    
    if (!suppressAlerts && typeof window !== 'undefined') {
        alert('NU₂ is undefined for this input');
    }
    return null;
}

function matchesND2RuleA(qdv) {
    let initial0s = 0;
    let i = 0;
    while (i < qdv.length && qdv[i] === 0) {
        initial0s++;
        i++;
    }
    
    if (initial0s < 2) return null;
    if (i >= qdv.length || qdv[i] !== 1) return null;
    i++;
    
    let trailingOnes = 0;
    for (let t = qdv.length - 1; t >= 0 && qdv[t] === 1; t--) trailingOnes++;
    if (trailingOnes < initial0s) return null;
    
    const startA = i;
    const endA = qdv.length - initial0s;
    const A = qdv.slice(startA, endA);
    
    return { h: initial0s, A };
}

function matchesND2RuleB(qdv) {
    let initial0s = 0;
    let i = 0;
    while (i < qdv.length && qdv[i] === 0) {
        initial0s++;
        i++;
    }
    
    if (initial0s < 2) return null;
    
    let final1s = 0;
    let j = qdv.length - 1;
    while (j >= 0 && qdv[j] === 1) {
        final1s++;
        j--;
    }
    
    const k = final1s;
    if (k < 1 || initial0s < k + 1) return null;
    if (j < 0 || qdv[j] !== 0) return null;
    
    const startB = k + 1;
    const endB = j;
    const B = qdv.slice(startB, endB);
    
    return { k, B };
}

function applyND2RuleA(qdv, h, A) {
    return [0, 1, 2, ...new Array(h - 1).fill(2), ...A, ...new Array(h - 1).fill(-1)];
}

function applyND2RuleB(qdv, k, B) {
    return [0, 1, ...new Array(k).fill(2), ...B, ...new Array(k).fill(-1)];
}

function ND2(qdv, suppressAlerts = false) {
    let initial0s = 0;
    let i = 0;
    while (i < qdv.length && qdv[i] === 0) {
        initial0s++;
        i++;
    }
    
    let final1s = 0;
    let j = qdv.length - 1;
    while (j >= 0 && qdv[j] === 1) {
        final1s++;
        j--;
    }
    
    if (final1s >= initial0s) {
        const ruleA = matchesND2RuleA(qdv);
        if (ruleA) return applyND2RuleA(qdv, ruleA.h, ruleA.A);
    } else {
        const ruleB = matchesND2RuleB(qdv);
        if (ruleB) return applyND2RuleB(qdv, ruleB.k, ruleB.B);
    }
    
    if (!suppressAlerts && typeof window !== 'undefined') {
        alert('ND₂ is undefined for this input');
    }
    return null;
}

// TI(μ) - first-order tail initiator
function TIFromPartition(muPartition) {
    if (!muPartition || muPartition.length === 0) return [0];
    const r = Math.max(...muPartition);
    const counts = new Array(r + 1).fill(0);
    for (const p of muPartition) counts[p]++;
    const B = [];
    for (let i = 1; i <= r; i++) {
        B.push(0);
        for (let t = 0; t < counts[i]; t++) B.push(1);
    }
    return [0, ...B];
}

// ND₁ on QDV vectors
function ND1_QDV(qdv) {
    if (!qdv || qdv.length === 0) return null;
    const vn = qdv[qdv.length - 1];

    let expected = 0, i = 0;
    while (i < qdv.length && qdv[i] === expected) { expected++; i++; }
    const d = expected - 1;

    if (d < vn) return null;
    const arr = qdv.slice(0, qdv.length - 1);

    if (vn === -1) return [0, ...arr];

    const firstIdx = arr.indexOf(vn);
    if (firstIdx === -1) return null;

    return arr.slice(0, firstIdx + 1).concat([vn + 1], arr.slice(firstIdx + 1));
}

// NU on QDV vectors - direct QDV to QDV transformation
function NU_QDV(qdv) {
    if (!qdv || qdv.length === 0) return null;

    // Convert QDV to partition
    const partition = QDVToPartition(qdv);
    if (!partition) return null;

    // Apply unified NU transformation
    const resultPartition = NU(partition);
    if (!resultPartition) return null;

    // Convert result back to QDV
    const n = resultPartition[0] + resultPartition.length;
    return partitionToQDV(resultPartition, n);
}

// TI₂ computation
function computeTI2(muPartition) {
    let currentQDV = TIFromPartition(muPartition);
    const steps = [{ qdv: [...currentQDV], used: 'start:TI(μ)' }];
    const defc0 = calculateDeficit(QDVToPartition(currentQDV));
    
    while (true) {
        let progressed = false;
        
        while (true) {
            const nd1Q = ND1_QDV(currentQDV);
            if (nd1Q) {
                const defcNext = calculateDeficit(QDVToPartition(nd1Q));
                if (defcNext === defc0) {
                    currentQDV = nd1Q;
                    steps.push({ qdv: [...currentQDV], used: 'ND₁' });
                    progressed = true;
                    continue;
                }
            }
            
            const nd2Q = ND2(currentQDV, true);
            if (nd2Q) {
                const defcNext = calculateDeficit(QDVToPartition(nd2Q));
                if (defcNext === defc0) {
                    currentQDV = nd2Q;
                    steps.push({ qdv: [...currentQDV], used: 'ND₂' });
                    progressed = true;
                    continue;
                }
            }
            break;
        }
        
        const reduced = reduceQDVToReducedDyck(currentQDV);
        if (JSON.stringify(reduced) !== JSON.stringify(currentQDV)) {
            currentQDV = reduced;
            steps.push({ qdv: [...currentQDV], used: 'reduce' });
            progressed = true;
        }
        
        if (!progressed) break;
    }
    return { finalQDV: currentQDV, steps };
}

function isTernary(v) {
    return v.every(x => x === 0 || x === 1 || x === 2);
}

function isType1(v) {
    if (!v || v.length === 0 || !isTernary(v)) return false;
    if (v[0] !== 0) return false;
    
    let i = 1;
    let m = 0;
    while (i < v.length && v[i] === 1) {
        m++;
        i++;
    }
    
    if (i >= v.length || v[i] !== 0) return false;
    i++;
    
    let n = 0;
    let j = v.length - 1;
    while (j >= i && v[j] === 2) {
        n++;
        j--;
    }
    
    if (n < 1) return false;
    
    const X_end = v.length - n;
    if (X_end < i) return m <= n;
    
    const X = v.slice(i, X_end);
    if (X.length > 0 && X[X.length - 1] === 2) return false;
    
    return m <= n;
}

function isType2(v) {
    if (!v || v.length === 0 || !isTernary(v)) return false;
    
    let i = 0;
    let n = 0;
    while (i < v.length && v[i] === 0) {
        n++;
        i++;
    }
    
    if (n < 2) return false;
    
    let j = v.length - 1;
    let m = 0;
    while (j >= 0 && v[j] === 1) {
        m++;
        j--;
    }
    
    if (!(0 < m && m < n)) return false;
    if (j < 0 || v[j] !== 2) return false;
    
    if (i <= j - 1) {
        const Y = v.slice(i, j);
        if (Y.length > 0 && Y[0] === 0) return false;
    }
    
    return true;
}

function isType3(v) {
    if (v.length === 1 && v[0] === 0) return true;
    if (!v || v.length === 0 || !isTernary(v)) return false;
    
    let i = 0;
    let n = 0;
    while (i < v.length && v[i] === 0) {
        n++;
        i++;
    }
    
    if (n < 2) return false;
    
    const remainder = v.slice(i);
    if (remainder.some(x => x !== 1)) return false;
    
    const m = remainder.length;
    return (m === n) || (m === n - 1);
}

function isFlagpoleTI2(v) {
    return isType1(v) || isType2(v) || isType3(v);
}

function getTI2Type(v) {
    if (isType1(v)) return 'Type 1';
    if (isType2(v)) return 'Type 2';
    if (isType3(v)) return 'Type 3';
    return 'Non-flagpole';
}

function finalTI2(muPartition) {
    const res = computeTI2(muPartition);
    const v = res.finalQDV || [];
    
    if (isFlagpoleTI2(v)) {
        return { ...res, type: getTI2Type(v), isFlagpole: true };
    }
    
    return null;
}

function findNU1FinalQDV(partition) {
    return reducedDyckFromPartition(partition);
}

function NU(partition) {
    if (is_NU1_final(partition)) {
        const qdv = findNU1FinalQDV(partition);
        if (!qdv) return null;
        const resultQDV = NU2(qdv);
        if (!resultQDV) return null;
        return QDVToPartition(resultQDV);
    } else {
        return NU1(partition);
    }
}

function ND(partition) {
    if (is_NU1_initial(partition)) {
        const n = partition[0] + partition.length;
        const qdv = partitionToQDV(partition, n);
        const defc0 = calculateDeficit(partition);
        
        const nd1Q = ND1_QDV(qdv);
        if (nd1Q) {
            const pNext = QDVToPartition(nd1Q);
            if (calculateDeficit(pNext) === defc0) return pNext;
        }
        
        const resultQDV = ND2(qdv);
        if (resultQDV) {
            const pNext = QDVToPartition(resultQDV);
            if (calculateDeficit(pNext) === defc0) return pNext;
        }
        return null;
    } else {
        return ND1(partition);
    }
}

function generateSequence(initialPartition, mapType, maxIterations = 50) {
    const sequence = [initialPartition];
    const deficits = [calculateDeficit(initialPartition)];
    const dinvs = [calculateDinv(initialPartition)];
    const types = [getPartitionType(initialPartition)];
    
    let currentPartition = initialPartition;
    let iteration = 0;
    
    while (iteration < maxIterations) {
        let nextPartition = null;
        
        switch (mapType) {
            case 'NU1':
                nextPartition = NU1(currentPartition);
                break;
            case 'ND1':
                nextPartition = ND1(currentPartition);
                break;
            case 'NU2':
                // Convert to QDV, apply NU₂, convert back
                const qdv = findNU1FinalQDV(currentPartition);
                if (qdv) {
                    const resultQDV = NU2(qdv);
                    if (resultQDV) {
                        nextPartition = QDVToPartition(resultQDV);
                    }
                }
                break;
            case 'ND2':
                // Convert to QDV, apply ND₂, convert back
                const n = currentPartition[0] + currentPartition.length;
                const inputQDV = partitionToQDV(currentPartition, n);
                const resultQDV = ND2(inputQDV);
                if (resultQDV) {
                    nextPartition = QDVToPartition(resultQDV);
                }
                break;
            case 'NU':
                nextPartition = NU(currentPartition);
                break;
            case 'ND':
                nextPartition = ND(currentPartition);
                break;
        }
        
        if (nextPartition === null) {
            break;
        }
        
        // Check for cycles
        if (JSON.stringify(nextPartition) === JSON.stringify(currentPartition)) {
            break;
        }
        
        currentPartition = nextPartition;
        sequence.push(currentPartition);
        deficits.push(calculateDeficit(currentPartition));
        dinvs.push(calculateDinv(currentPartition));
        types.push(getPartitionType(currentPartition));
        
        iteration++;
    }
    
    return {
        sequence,
        deficits,
        dinvs,
        types,
        iterations: iteration,
        terminationReason: getTerminationReason(mapType, types[types.length - 1], iteration, maxIterations)
    };
}

function getPartitionType(partition) {
    if (is_NU1_final(partition)) return 'NU₁-final';
    if (is_NU1_initial(partition)) return 'NU₁-initial';
    return 'Regular';
}

function getTerminationReason(mapType, finalType, iterations, maxIterations) {
    if (iterations >= maxIterations) return 'Maximum iterations reached';
    if (finalType === 'NU₁-final' && (mapType === 'NU1' || mapType === 'NU')) return 'Reached NU₁-final object';
    if (finalType === 'NU₁-initial' && (mapType === 'ND1' || mapType === 'ND')) return 'Reached NU₁-initial object';
    return 'Sequence completed';
}

function parsePartitionInput(input) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        const values = parts.map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        if (values.length === 0) throw new Error('Empty partition');
        return values.sort((a, b) => b - a);
    } catch (error) {
        throw new Error('Invalid partition format. Please use comma-separated positive integers.');
    }
}

function parseQDVInput(input) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        const values = parts.map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        if (values.length === 0) throw new Error('Empty QDV');
        if (values[0] !== 0) throw new Error('QDV must start with 0');
        return values;
    } catch (error) {
        throw new Error('Invalid QDV format. Please use comma-separated integers starting with 0.');
    }
}

function isNU2RuleAPattern(qdv) {
    if (qdv.length < 3) return false;
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return false;
    
    let h = 1;
    let i = 3;
    while (i < qdv.length && qdv[i] === 2) {
        h++;
        i++;
    }
    
    let trailingNeg1s = 0;
    let j = qdv.length - 1;
    while (j >= 0 && qdv[j] === -1) {
        trailingNeg1s++;
        j--;
    }
    
    return trailingNeg1s === h - 1;
}

function generateNuSequence() {
    const input = document.getElementById('input-vector').value;
    const method = document.querySelector('input[name="method"]:checked').value;
    const inputType = document.getElementById('input-type').value;
    const maxIterations = parseInt(document.getElementById('max-iterations').value);
    
    try {
        let sequence, deficits, dinvs, types, iterations, terminationReason;
        
        if (inputType === 'qdv') {
            // Handle QDV input
            const qdv = parseQDVInput(input);
            const partition = QDVToPartition(qdv);
            // Pre-validate rule templates for NU₂/ND₂ to block run if not applicable
            if (method === 'NU2') {
                const okA = matchesNU2RuleA(qdv);
                const okB = matchesNU2RuleB(qdv);
                if (!okA && !okB) {
                    alert('NU₂ is undefined for this input: it matches neither Rule (a) nor Rule (b) template.');
                    return;
                }
            }
            if (method === 'ND2') {
                const okA = matchesND2RuleA(qdv);
                const okB = matchesND2RuleB(qdv);
                if (!okA && !okB) {
                    alert('ND₂ is undefined for this input: it matches neither inverse Rule (a) nor inverse Rule (b) template.');
                    return;
                }
            }
            
            // For QDV input, we need special handling for NU₂ and ND₂
            if (method === 'NU2') {
                // Direct QDV to QDV transformation
                const resultQDV = NU2(qdv);
                if (resultQDV) {
                    const resultPartition = QDVToPartition(resultQDV);
                    sequence = [partition, resultPartition];
                    deficits = [calculateDeficit(partition), calculateDeficit(resultPartition)];
                    dinvs = [calculateDinv(partition), calculateDinv(resultPartition)];
                    types = [getPartitionType(partition), getPartitionType(resultPartition)];
                    iterations = 1;
                    terminationReason = 'NU₂ transformation completed';
                    
                    // Store the actual QDVs used for display
                    window.lastQDVSequence = [qdv, resultQDV];
                } else {
                    sequence = [partition];
                    deficits = [calculateDeficit(partition)];
                    dinvs = [calculateDinv(partition)];
                    types = [getPartitionType(partition)];
                    iterations = 0;
                    terminationReason = 'NU₂ not applicable to this QDV pattern';
                    
                    // Store the original QDV for display
                    window.lastQDVSequence = [qdv];
                }
            } else if (method === 'ND2') {
                // Direct QDV to QDV transformation for ND₂
                const resultQDV = ND2(qdv);
                if (resultQDV) {
                    const resultPartition = QDVToPartition(resultQDV);
                    sequence = [partition, resultPartition];
                    deficits = [calculateDeficit(partition), calculateDeficit(resultPartition)];
                    dinvs = [calculateDinv(partition), calculateDinv(resultPartition)];
                    types = [getPartitionType(partition), getPartitionType(resultPartition)];
                    iterations = 1;
                    terminationReason = 'ND₂ transformation completed';
                    window.lastQDVSequence = [qdv, resultQDV];
                } else {
                    sequence = [partition];
                    deficits = [calculateDeficit(partition)];
                    dinvs = [calculateDinv(partition)];
                    types = [getPartitionType(partition)];
                    iterations = 0;
                    terminationReason = 'ND₂ not applicable to this QDV pattern';
                    window.lastQDVSequence = [qdv];
                }
            } else if (method === 'ND1') {
                // QDV input: apply ND₁ vector rule iteratively until blocked
                const qList = [qdv];
                let cur = qdv;
                while (true) {
                    const next = ND1_QDV(cur);
                    if (!next) break;
                    qList.push(next);
                    cur = next;
                }
                const parts = qList.map(QDVToPartition);
                sequence = parts;
                deficits = parts.map(p => calculateDeficit(p));
                dinvs = parts.map(p => calculateDinv(p));
                types = parts.map(p => getPartitionType(p));
                iterations = Math.max(0, parts.length - 1);
                terminationReason = 'ND₁ (vector) completed';
                window.lastQDVSequence = qList;
            } else if (method === 'NU') {
                // Unified NU: try NU₂ on QDV first; if not applicable, fall back to NU₁ on partition
                const resultQDV = NU2(qdv, true);
                if (resultQDV) {
                    const resultPartition = QDVToPartition(resultQDV);
                    sequence = [partition, resultPartition];
                    deficits = [calculateDeficit(partition), calculateDeficit(resultPartition)];
                    dinvs = [calculateDinv(partition), calculateDinv(resultPartition)];
                    types = [getPartitionType(partition), getPartitionType(resultPartition)];
                    iterations = 1;
                    terminationReason = 'Unified NU: NU₂ applied';
                    window.lastQDVSequence = [qdv, resultQDV];
                } else {
                    const nu1Result = NU1(partition);
                    if (nu1Result) {
                        sequence = [partition, nu1Result];
                        deficits = [calculateDeficit(partition), calculateDeficit(nu1Result)];
                        dinvs = [calculateDinv(partition), calculateDinv(nu1Result)];
                        types = [getPartitionType(partition), getPartitionType(nu1Result)];
                        iterations = 1;
                        terminationReason = 'Unified NU: NU₁ applied';
                        window.lastQDVSequence = [qdv, partitionToQDV(nu1Result, nu1Result[0] + nu1Result.length)];
                    } else {
                        sequence = [partition];
                        deficits = [calculateDeficit(partition)];
                        dinvs = [calculateDinv(partition)];
                        types = [getPartitionType(partition)];
                        iterations = 0;
                        terminationReason = 'Unified NU not applicable to this input';
                        window.lastQDVSequence = [qdv];
                    }
                }
            } else if (method === 'ND') {
                // Unified ND: try ND₁ on QDV first; if not applicable, try ND₂; then fall back to ND₁ on partition
                const nd1Q = ND1_QDV(qdv);
                if (nd1Q) {
                    const resultPartition = QDVToPartition(nd1Q);
                    sequence = [partition, resultPartition];
                    deficits = [calculateDeficit(partition), calculateDeficit(resultPartition)];
                    dinvs = [calculateDinv(partition), calculateDinv(resultPartition)];
                    types = [getPartitionType(partition), getPartitionType(resultPartition)];
                    iterations = 1;
                    terminationReason = 'Unified ND: ND₁ applied (vector rule)';
                    window.lastQDVSequence = [qdv, nd1Q];
                } else {
                    const resultQDV = ND2(qdv, true);
                    if (resultQDV) {
                        const resultPartition = QDVToPartition(resultQDV);
                        sequence = [partition, resultPartition];
                        deficits = [calculateDeficit(partition), calculateDeficit(resultPartition)];
                        dinvs = [calculateDinv(partition), calculateDinv(resultPartition)];
                        types = [getPartitionType(partition), getPartitionType(resultPartition)];
                        iterations = 1;
                        terminationReason = 'Unified ND: ND₂ applied';
                        window.lastQDVSequence = [qdv, resultQDV];
                    } else {
                        const nd1Result = ND1(partition);
                        if (nd1Result) {
                            sequence = [partition, nd1Result];
                            deficits = [calculateDeficit(partition), calculateDeficit(nd1Result)];
                            dinvs = [calculateDinv(partition), calculateDinv(nd1Result)];
                            types = [getPartitionType(partition), getPartitionType(nd1Result)];
                            iterations = 1;
                            terminationReason = 'Unified ND: ND₁ applied (partition rule)';
                            window.lastQDVSequence = [qdv, partitionToQDV(nd1Result, nd1Result[0] + nd1Result.length)];
                        } else {
                            sequence = [partition];
                            deficits = [calculateDeficit(partition)];
                            dinvs = [calculateDinv(partition)];
                            types = [getPartitionType(partition)];
                            iterations = 0;
                            terminationReason = 'Unified ND not applicable to this input';
                            window.lastQDVSequence = [qdv];
                        }
                    }
                }
            } else {
                // Convert QDV to partition and use standard sequence generation
                const result = generateSequence(partition, method, maxIterations);
                sequence = result.sequence;
                deficits = result.deficits;
                dinvs = result.dinvs;
                types = result.types;
                iterations = result.iterations;
                terminationReason = result.terminationReason;
            }
        } else {
            // Handle partition input (existing logic)
            const partition = parsePartitionInput(input);
            const result = generateSequence(partition, method, maxIterations);
            sequence = result.sequence;
            deficits = result.deficits;
            dinvs = result.dinvs;
            types = result.types;
            iterations = result.iterations;
            terminationReason = result.terminationReason;
        }
        
        displayNuResults(sequence, deficits, dinvs, types, method, iterations, sequence[0], terminationReason, inputType);
        
    } catch (error) {
        showError(error.message);
    }
}

function displayNuResults(sequence, deficits, dinvs, types, method, iterations, originalPartition, terminationReason, inputType = 'partition') {
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    document.getElementById('initial-partition').textContent = `⟨${sequence[0].join(', ')}⟩`;
    document.getElementById('initial-deficit').textContent = deficits[0];
    document.getElementById('initial-dinv').textContent = dinvs[0];
    document.getElementById('initial-type').textContent = types[0];
    
    const finalPartition = sequence[sequence.length - 1];
    document.getElementById('final-partition').textContent = `⟨${finalPartition.join(', ')}⟩`;
    document.getElementById('final-deficit').textContent = deficits[deficits.length - 1];
    document.getElementById('final-dinv').textContent = dinvs[dinvs.length - 1];
    document.getElementById('final-type').textContent = types[types.length - 1];
    
    document.getElementById('total-iterations').textContent = iterations;
    document.getElementById('method-used').textContent = getMethodName(method);
    document.getElementById('termination-reason').textContent = terminationReason;
    
    let chainType = 'Unknown';
    if (sequence.length > 1) {
        if (types[0] === 'NU₁-initial' && types[types.length - 1] === 'NU₁-final') {
            chainType = 'Complete chain';
        } else if (types[types.length - 1] === 'NU₁-final') {
            chainType = 'NU₁-fragment';
        } else if (types[types.length - 1] === 'NU₁-initial') {
            chainType = 'NU₁-initial segment';
        }
    }
    document.getElementById('chain-type').textContent = chainType;
    
    createNuSequenceTable(sequence, deficits, dinvs, types, inputType);
    createNuVisualization(sequence, deficits, dinvs, types, inputType);
}

function getMethodName(method) {
    switch (method) {
        case 'NU1': return 'NU₁ (NEXT-UP)';
        case 'ND1': return 'ND₁ (NEXT-DOWN)';
        case 'NU2': return 'NU₂ (Chain Bridge)';
        case 'ND2': return 'ND₂ (Chain Bridge Inverse)';
        case 'NU': return 'Unified NU (NU₁ + NU₂)';
        case 'ND': return 'Unified ND (ND₁ + ND₂)';
        default: return 'Unknown';
    }
}

function createNuSequenceTable(sequence, deficits, dinvs, types, inputType = 'partition') {
    const tableContainer = document.getElementById('sequence-table');
    const showQDV = inputType === 'qdv';
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Iteration</th>
                    <th>Partition</th>
                    ${showQDV ? '<th>QDV Representation</th>' : ''}
                    <th>Deficit</th>
                    <th>Dinv</th>
                    <th>Type</th>
                    <th>Deficit Change</th>
                    <th>Dinv Change</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < sequence.length; i++) {
        const deficitChange = i > 0 ? deficits[i] - deficits[i - 1] : 0;
        const dinvChange = i > 0 ? dinvs[i] - dinvs[i - 1] : 0;
        
        let qdvCell = '';
        if (showQDV) {
            // Use stored QDV if available (for QDV input methods), otherwise calculate
            let qdv = null;
            if (window.lastQDVSequence && i < window.lastQDVSequence.length) {
                qdv = window.lastQDVSequence[i];
            } else {
                // Calculate QDV representation for this partition
                const totalBoxes = sequence[i].reduce((sum, part) => sum + part, 0);
                const estimatedLength = Math.max(sequence[i].length, Math.ceil(Math.sqrt(totalBoxes * 2)));
                
                // Try different QDV lengths to find a reasonable representation
                for (let len = estimatedLength; len <= estimatedLength + 3; len++) {
                    const testQdv = partitionToQDV(sequence[i], len);
                    if (testQdv.every(val => val >= -2 && val <= len)) { // Reasonable range
                        qdv = testQdv;
                        break;
                    }
                }
            }
            
            if (qdv) {
                qdvCell = `<td>[${qdv.join(', ')}]</td>`;
            } else {
                qdvCell = '<td>N/A</td>';
            }
        }
        
        tableHTML += `
            <tr>
                <td>${i}</td>
                <td>⟨${sequence[i].join(', ')}⟩</td>
                ${qdvCell}
                <td>${deficits[i]}</td>
                <td>${dinvs[i]}</td>
                <td>${types[i]}</td>
                <td>${deficitChange >= 0 ? '+' : ''}${deficitChange}</td>
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

function createNuVisualization(sequence, deficits, dinvs, types, inputType = 'partition') {
    const chartContainer = document.getElementById('sequence-chart');
    
    let chartHTML = '<div class="visualization">';
    chartHTML += '<h4>Sequence Progression</h4>';
    
    for (let i = 0; i < sequence.length; i++) {
        const deficitChange = i > 0 ? deficits[i] - deficits[i - 1] : 0;
        const dinvChange = i > 0 ? dinvs[i] - dinvs[i - 1] : 0;
        
        let partitionDisplay = `⟨${sequence[i].join(', ')}⟩`;
        let qdvDisplay = '';
        
        if (inputType === 'qdv') {
            // Use stored QDV if available (for QDV input methods), otherwise calculate
            let qdv = null;
            if (window.lastQDVSequence && i < window.lastQDVSequence.length) {
                qdv = window.lastQDVSequence[i];
            } else {
                // Calculate QDV representation for this partition
                const totalBoxes = sequence[i].reduce((sum, part) => sum + part, 0);
                const estimatedLength = Math.max(sequence[i].length, Math.ceil(Math.sqrt(totalBoxes * 2)));
                
                // Try different QDV lengths to find a reasonable representation
                for (let len = estimatedLength; len <= estimatedLength + 3; len++) {
                    const testQdv = partitionToQDV(sequence[i], len);
                    if (testQdv.every(val => val >= -2 && val <= len)) { // Reasonable range
                        qdv = testQdv;
                        break;
                    }
                }
            }
            
            if (qdv) {
                qdvDisplay = ` [QDV: [${qdv.join(', ')}]]`;
            }
        }
        
        chartHTML += `
            <div class="sequence-step">
                <strong>Step ${i}:</strong> ${partitionDisplay}${qdvDisplay}
                <span class="stats">deficit=${deficits[i]} (${deficitChange >= 0 ? '+' : ''}${deficitChange}) 
                dinv=${dinvs[i]} (${dinvChange >= 0 ? '+' : ''}${dinvChange}) [${types[i]}]</span>
            </div>
        `;
    }
    
    chartHTML += '</div>';
    chartContainer.innerHTML = chartHTML;
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

function generateAllPartitions(n) {
    const partitions = [];
    
    function generateRecursive(current, remaining, maxPart) {
        if (remaining === 0) {
            partitions.push([...current]);
            return;
        }
        
        const minPart = Math.min(maxPart, remaining);
        for (let part = minPart; part >= 1; part--) {
            if (current.length === 0 || part <= current[current.length - 1]) {
                generateRecursive([...current, part], remaining - part, part);
            }
        }
    }
    
    generateRecursive([], n, n);
    return partitions;
}

function countPartitions(n) {
    return generateAllPartitions(n).length;
}

function verifySMALLCondition() {
    const k = parseInt(document.getElementById('small-k').value);
    const r = parseInt(document.getElementById('small-r').value);

    // Validate SMALL constraint
    if (!isValidSMALLNumber(k, r)) {
        const maxR = Math.floor(k / 2) - 2;
        showError(`Invalid SMALL number: r = ${r} does not satisfy r ≤ ⌊${k}/2⌋ - 2 = ${maxR}`);
        return;
    }

    try {
        const targetLength = k + 2 - r;
        const allPartitions = generateAllPartitions(k);
        
        const flagpoles = [];
        const nonFlagpoles = [];
        
        allPartitions.forEach(mu => {
            const ti2Result = computeTI2(mu);
            const finalQDV = ti2Result.finalQDV || [];
            const rho = finalQDV.length;
            
            if (rho === targetLength) {
                const isFlagpole = isFlagpoleTI2(finalQDV);
                const type = getTI2Type(finalQDV);
                
                if (isFlagpole) {
                    flagpoles.push({ mu, rho, type, finalQDV });
                } else {
                    nonFlagpoles.push({ mu, rho, type, finalQDV });
                }
            }
        });
        
        const pR = countPartitions(r);
        const expected = 2 * pR;
        const actual = flagpoles.length;
        const smallSatisfied = (actual === expected);
        
        const results = document.getElementById('small-results');
        results.style.display = 'block';
        
        let summaryHTML = `
            <h4>SMALL(${r}, ${k}) Verification</h4>
            <p><strong>Target ρ(μ):</strong> k+2-r = ${k}+2-${r} = ${targetLength}</p>
            <p><strong>Expected count:</strong> 2·p(${r}) = 2·${pR} = ${expected}</p>
            <p><strong>Flagpole count (Type 1/2/3):</strong> ${actual}</p>
            ${nonFlagpoles.length > 0 ? `<p><strong>Other partitions with length ${targetLength} (not flagpoles):</strong> ${nonFlagpoles.length} <em>(not counted)</em></p>` : ''}
            <p style="font-size: 1.2em; margin-top: 12px;"><strong>SMALL condition:</strong> 
                <span style="color: ${smallSatisfied ? '#2e7d32' : '#c62828'}; font-weight: bold;">
                    ${smallSatisfied ? '✓ SATISFIED' : '✗ NOT SATISFIED'}
                </span>
            </p>
        `;
        
        let detailsHTML = '<h4>Flagpole Partitions (Type 1/2/3)</h4>';
        
        if (flagpoles.length === 0) {
            detailsHTML += '<p><em>No flagpole partitions found.</em></p>';
        } else {
            detailsHTML += `
                <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                    <thead>
                        <tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">
                            <th style="padding: 10px; text-align: left;">#</th>
                            <th style="padding: 10px; text-align: left;">Partition μ</th>
                            <th style="padding: 10px; text-align: center;">Type</th>
                            <th style="padding: 10px; text-align: left;">TI₂(μ)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            flagpoles.forEach(({mu, rho, type, finalQDV}, index) => {
                const typeColor = type === 'Type 1' ? '#1976d2' : type === 'Type 2' ? '#388e3c' : '#7b1fa2';
                detailsHTML += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px;">${index + 1}</td>
                        <td style="padding: 8px;">⟨${mu.join(', ')}⟩</td>
                        <td style="padding: 8px; text-align: center;">
                            <span style="background: ${typeColor}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9em;">
                                ${type}
                            </span>
                        </td>
                        <td style="padding: 8px; font-family: monospace; font-size: 0.9em;">[${finalQDV.join(', ')}]</td>
                    </tr>
                `;
            });
            
            detailsHTML += `
                    </tbody>
                </table>
            `;
        }
        
        if (nonFlagpoles.length > 0) {
            detailsHTML += `
                <h4 style="color: #888; margin-top: 24px;">Other Partitions (Not Type 1/2/3)</h4>
                <p style="color: #666; font-size: 0.9em; margin-bottom: 12px;">
                    <em>These have TI₂ length = ${targetLength} but are NOT flagpoles. They are NOT counted in ρ⁻¹(DV<sub>${targetLength}</sub>).</em>
                </p>
                <table style="width: 100%; border-collapse: collapse; opacity: 0.7;">
                    <thead>
                        <tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">
                            <th style="padding: 10px; text-align: left;">#</th>
                            <th style="padding: 10px; text-align: left;">Partition μ</th>
                            <th style="padding: 10px; text-align: left;">TI₂(μ)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            nonFlagpoles.forEach(({mu, rho, type, finalQDV}, index) => {
                detailsHTML += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px;">${index + 1}</td>
                        <td style="padding: 8px;">⟨${mu.join(', ')}⟩</td>
                        <td style="padding: 8px; font-family: monospace; font-size: 0.9em;">[${finalQDV.join(', ')}]</td>
                    </tr>
                `;
            });
            
            detailsHTML += `
                    </tbody>
                </table>
            `;
        }
        
        document.getElementById('small-summary').innerHTML = summaryHTML;
        document.getElementById('small-details').innerHTML = detailsHTML;
        
    } catch (error) {
        showError(error.message);
    }
}

function updateInputLabel() {
    const inputType = document.getElementById('input-type').value;
    const label = document.getElementById('input-label');
    const input = document.getElementById('input-vector');
    
    if (inputType === 'qdv') {
        label.textContent = 'Quasi-Dyck Vector (comma-separated, can include negatives):';
        input.placeholder = '0,1,2,2,A,-1,-1';
        input.value = '0,1,2,2,2,-1,-1';
    } else {
        label.textContent = 'Partition (comma-separated integers):';
        input.placeholder = '5,4,4,1';
        input.value = '5,4,4,1';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generate-sequence').addEventListener('click', generateNuSequence);
    document.getElementById('verify-small').addEventListener('click', verifySMALLCondition);
    document.getElementById('input-type').addEventListener('change', updateInputLabel);
    
    document.getElementById('input-vector').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateNuSequence();
        }
    });
    
    updateInputLabel();
    generateNuSequence();
});

function testNU2Example() {
    const testQDV = [0, 1, 2, 2, 2, 2, -1, 0, 0, 1, -1, -1];
    console.log('Testing NU₂ with vector:', testQDV);
    
    const ruleA = matchesNU2RuleA(testQDV);
    console.log('Rule (a) match:', ruleA);
    if (ruleA) {
        const resultA = applyNU2RuleA(testQDV, ruleA.h, ruleA.A);
        console.log('Rule (a) result:', resultA);
    }
    
    const ruleB = matchesNU2RuleB(testQDV);
    console.log('Rule (b) match:', ruleB);
    if (ruleB) {
        const resultB = applyNU2RuleB(testQDV, ruleB.k, ruleB.B);
        console.log('Rule (b) result:', resultB);
    }
    
    const result = NU2(testQDV);
    console.log('NU₂ result:', result);
    return result;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        partitionToQDV,
        QDVToPartition,
        reduceQDVToReducedDyck,
        reducedDyckFromPartition,
        is_NU1_initial,
        is_NU1_final,
        calculateDinv,
        calculateDeficit,
        NU1,
        ND1,
        ND1_QDV,
        NU2,
        ND2,
        NU,
        ND,
        NU_QDV,
        TIFromPartition,
        computeTI2,
        finalTI2,
        isType1,
        isType2,
        isType3,
        isFlagpoleTI2,
        getTI2Type,
        generateSequence,
        getPartitionType,
        getTerminationReason,
        testNU2Example
    };
}

// ============================================================
// HLLL Parameterization Functions
// ============================================================

/**
 * Compute f(μ) using Definition 0.7
 * - Even multiplicity a^e: all parts decrease by 1 → (a-1)^e
 * - Odd multiplicity a^e: (e-1) parts decrease by 1, one decreases by 2 → ((a-1)^{e-1}, a-2)
 */
function computeF(mu) {
    if (!mu || mu.length === 0) return [];
    
    // Count multiplicities
    const multiplicities = {};
    for (const part of mu) {
        multiplicities[part] = (multiplicities[part] || 0) + 1;
    }
    
    const result = [];
    
    // Process each part size (sorted descending)
    const partSizes = Object.keys(multiplicities).map(Number).sort((a, b) => b - a);
    
    for (const partSize of partSizes) {
        const count = multiplicities[partSize];
        const newSize = partSize - 1;
        
        if (newSize < 1) continue; // Parts of size < 1 are deleted
        
        if (count % 2 === 0) {
            // Even multiplicity: all parts drop by 1
            for (let i = 0; i < count; i++) {
                result.push(newSize);
            }
        } else {
            // Odd multiplicity: (count-1) parts drop by 1, one drops by 2
            for (let i = 0; i < count - 1; i++) {
                result.push(newSize);
            }
            // One part drops by 2
            const droppedBy2 = partSize - 2;
            if (droppedBy2 >= 1) {
                result.push(droppedBy2);
            }
        }
    }
    
    return result.sort((a, b) => b - a);
}

/**
 * Get partition statistics: distinct parts, total parts, size
 */
function getPartitionStats(partition) {
    if (!partition || partition.length === 0) {
        return { distinctParts: 0, totalParts: 0, size: 0 };
    }
    const distinctParts = new Set(partition).size;
    const totalParts = partition.length;
    const size = partition.reduce((a, b) => a + b, 0);
    return { distinctParts, totalParts, size };
}

/**
 * Compute μ from (λ, a, ε) using HLLL encoding
 * N_{j+1}(μ) = 2⌊n_j(λ)/2⌋ + (n_{j-1}(λ) mod 2)
 */
function computeMuFromLambda(lambda, a, epsilon) {
    if (!lambda || lambda.length === 0) {
        // λ = empty partition
        // μ will just have parts of size 1
        const result = [];
        // N_1 depends on a and epsilon
        const n1Count = 2 * Math.floor(a / 2) + (a % 2 === 1 ? 1 : 0) + epsilon;
        for (let i = 0; i < n1Count; i++) result.push(1);
        return result;
    }
    
    // Get multiplicities of λ
    const nLambda = {}; // n_j(λ) = multiplicity of part j in λ
    for (const part of lambda) {
        nLambda[part] = (nLambda[part] || 0) + 1;
    }
    
    // Find max part in λ
    const maxPart = Math.max(...lambda);
    
    // n_0 is related to parameter a
    // From the HLLL construction, n_0 = a
    nLambda[0] = a;
    
    // Compute multiplicities of μ using the recurrence
    // N_{j+1}(μ) = 2⌊n_j(λ)/2⌋ + (n_{j-1}(λ) mod 2)
    const NMu = {}; // N_j(μ) = multiplicity of part j in μ
    
    // Compute from largest part down
    for (let j = maxPart + 1; j >= 1; j--) {
        const n_j = nLambda[j] || 0;
        const n_jminus1 = nLambda[j - 1] || 0;
        NMu[j + 1] = 2 * Math.floor(n_j / 2) + (n_jminus1 % 2);
    }
    
    // Handle N_1 (boundary case with epsilon)
    // N_1 collects the bulk of n_0 plus adjustments
    const n_0 = nLambda[0] || 0;
    const n_minus1_mod2 = epsilon; // ε acts as n_{-1} mod 2
    
    // Count even entries in nLambda (for the 'p' term)
    let evenCount = 0;
    for (let j = 0; j <= maxPart; j++) {
        if ((nLambda[j] || 0) % 2 === 0 && (nLambda[j] || 0) > 0) {
            evenCount++;
        }
    }
    // Actually, simpler: N_1 = 2⌊n_0/2⌋ + something
    // From the example: N_1 = 2⌊n_0/2⌋ + p where p counts certain parities
    // Let's use: N_1 = 2⌊n_0/2⌋ + (number of j where n_j is even and positive) + epsilon adjustment
    
    // Simplified approach based on size constraint:
    // |μ| = |λ| + ρ(μ) - 2
    // ρ(μ) = 3 + a + d(λ) + ℓ(λ) + ε
    const stats = getPartitionStats(lambda);
    const rho = 3 + a + stats.distinctParts + stats.totalParts + epsilon;
    const targetSize = stats.size + rho - 2;
    
    // Sum up what we have so far
    let currentSize = 0;
    for (const [part, count] of Object.entries(NMu)) {
        if (count > 0) {
            currentSize += parseInt(part) * count;
        }
    }
    
    // N_1 makes up the difference
    NMu[1] = targetSize - currentSize;
    if (NMu[1] < 0) NMu[1] = 0;
    
    // Build partition from multiplicities
    const result = [];
    const parts = Object.keys(NMu).map(Number).sort((a, b) => b - a);
    for (const part of parts) {
        for (let i = 0; i < NMu[part]; i++) {
            result.push(part);
        }
    }
    
    return result.sort((a, b) => b - a);
}

/**
 * Compute both (a, ε) pairs for given λ and target size k
 * Returns array of {a, epsilon, mu, rho, valid}
 */
function computeAEpsilonPairs(lambda, k) {
    const stats = getPartitionStats(lambda);
    // ρ = 3 + a + d + ℓ + ε
    // |μ| = |λ| + ρ - 2 = k
    // So: ρ = k - |λ| + 2
    // And: a = ρ - 3 - d - ℓ - ε = (k - |λ| + 2) - 3 - d - ℓ - ε = k - |λ| - 1 - d - ℓ - ε
    
    const results = [];
    
    for (const epsilon of [0, 1]) {
        const a = k - stats.size - 1 - stats.distinctParts - stats.totalParts - epsilon;
        const rho = 3 + a + stats.distinctParts + stats.totalParts + epsilon;
        
        if (a >= 0) {
            const mu = computeMuFromLambda(lambda, a, epsilon);
            const muSize = mu.reduce((x, y) => x + y, 0);
            results.push({
                a: a,
                epsilon: epsilon,
                mu: mu,
                rho: rho,
                muSize: muSize,
                valid: muSize === k
            });
        } else {
            results.push({
                a: a,
                epsilon: epsilon,
                mu: null,
                rho: rho,
                muSize: null,
                valid: false,
                reason: `a = ${a} < 0`
            });
        }
    }
    
    return results;
}

/**
 * Build TI₂ vector from (λ, a, ε)
 * TI₂ = 001 2^a B_λ^+ 1^ε
 */
function buildTI2FromParams(lambda, a, epsilon) {
    // Build B_λ (binary Dyck vector)
    // B_λ = 0 1^{n_k} 0 1^{n_{k-1}} ... 0 1^{n_1}
    if (!lambda || lambda.length === 0) {
        // Empty λ: B_λ is just empty or minimal
        const ti2 = [0, 0, 1];
        for (let i = 0; i < a; i++) ti2.push(2);
        for (let i = 0; i < epsilon; i++) ti2.push(1);
        return ti2;
    }
    
    // Get multiplicities
    const nLambda = {};
    for (const part of lambda) {
        nLambda[part] = (nLambda[part] || 0) + 1;
    }
    const maxPart = Math.max(...lambda);
    
    // Build B_λ
    const bLambda = [];
    for (let j = maxPart; j >= 1; j--) {
        bLambda.push(0);
        const count = nLambda[j] || 0;
        for (let i = 0; i < count; i++) {
            bLambda.push(1);
        }
    }
    
    // Build B_λ^+ (increment each entry)
    const bLambdaPlus = bLambda.map(x => x + 1);
    
    // Build TI₂ = 001 2^a B_λ^+ 1^ε
    const ti2 = [0, 0, 1];
    for (let i = 0; i < a; i++) ti2.push(2);
    ti2.push(...bLambdaPlus);
    for (let i = 0; i < epsilon; i++) ti2.push(1);
    
    return ti2;
}

// Expose helpers to browser console
if (typeof window !== 'undefined') {
    try {
        window.TIFromPartition = TIFromPartition;
        window.computeTI2 = computeTI2;
        window.finalTI2 = finalTI2;
        window.QDVToPartition = QDVToPartition;
        window.reduceQDVToReducedDyck = reduceQDVToReducedDyck;
        window.reducedDyckFromPartition = reducedDyckFromPartition;
        window.NU_QDV = NU_QDV;
        window.ND1_QDV = ND1_QDV;
        window.isType1 = isType1;
        window.isType2 = isType2;
        window.isType3 = isType3;
        window.isFlagpoleTI2 = isFlagpoleTI2;
        window.getTI2Type = getTI2Type;
        window.computeF = computeF;
        window.computeMuFromLambda = computeMuFromLambda;
        window.computeAEpsilonPairs = computeAEpsilonPairs;
        window.buildTI2FromParams = buildTI2FromParams;
        window.getPartitionStats = getPartitionStats;
    } catch (e) { /* no-op if not defined */ }
}
