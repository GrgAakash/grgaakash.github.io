// Corrected Implementation of NU and ND Maps
// Based on the comprehensive guide for partition chain maps

// ============================================================================
// STEP 1: CORE DATA STRUCTURES AND HELPERS
// ============================================================================

/**
 * Convert a partition to its Quasi-Dyck Vector (QDV) representation
 * @param {number[]} partition - Array representing the partition
 * @param {number} n - Length of the desired QDV
 * @returns {number[]} QDV representation
 */
function partitionToQDV(partition, n) {
    const qdv = new Array(n);
    
    for (let i = 1; i <= n; i++) {
        const lambdaIndex = n - i + 1 - 1; // Convert to 0-based indexing
        const lambdaValue = (lambdaIndex >= 0 && lambdaIndex < partition.length) 
            ? partition[lambdaIndex] 
            : 0;
        qdv[i-1] = (i - 1) - lambdaValue;
    }
    
    return qdv;
}

/**
 * Convert a QDV back to its partition representation
 * @param {number[]} qdv - Quasi-Dyck Vector
 * @returns {number[]} Partition representation
 */
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

/**
 * Reduce a QDV to its reduced Dyck vector representative of the Dyck class.
 * - If there are negatives, lift via v -> [0, v^+] until non-negative.
 * - Then repeatedly apply inverse equivalence (drop leading 0, decrement rest)
 *   while staying non-negative, to minimize length.
 * @param {number[]} qdv
 * @returns {number[]} reduced Dyck vector (non-negative, minimal length)
 */
function reduceQDVToReducedDyck(qdv) {
    if (!qdv || qdv.length === 0) return [0];
    let v = qdv.slice();
    // Lift to Dyck (remove negatives) by adding 0 and +1 to all
    while (v.some(x => x < 0)) {
        v = [0, ...v.map(x => x + 1)];
    }
    // Reduce length while possible without introducing negatives
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

/**
 * Compute the reduced Dyck vector from a partition by choosing
 * n = max_j (lambda_j + j), then building QDV_n(λ).
 * @param {number[]} partition - Partition (descending order recommended)
 * @returns {number[]} reduced Dyck vector
 */
function reducedDyckFromPartition(partition) {
    if (!partition || partition.length === 0) return [0];
    const parts = partition.slice().sort((a, b) => b - a);
    let n = 0;
    for (let j = 0; j < parts.length; j++) {
        n = Math.max(n, parts[j] + (j + 1));
    }
    if (n <= 0) n = 1;
    const qdv = partitionToQDV(parts, n);
    return qdv; // already non-negative and minimal by construction
}

/**
 * Check if a partition is NU₁-initial (where ND₁ is undefined)
 * @param {number[]} partition - Partition to check
 * @returns {boolean} True if γ₁ < ℓ(γ)
 */
function is_NU1_initial(partition) {
    if (partition.length === 0) return false;
    return partition[0] < partition.length;
}

/**
 * Check if a partition is NU₁-final (where NU₁ is undefined)
 * @param {number[]} partition - Partition to check
 * @returns {boolean} True if γ₁ > ℓ(γ) + 2
 */
function is_NU1_final(partition) {
    if (partition.length === 0) return false;
    return partition[0] > partition.length + 2;
}

/**
 * Calculate dinv for a partition
 * @param {number[]} partition - Partition to calculate dinv for
 * @returns {number} dinv value
 */
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

/**
 * Calculate deficit for a partition
 * @param {number[]} partition - Partition to calculate deficit for
 * @returns {number} deficit value
 */
function calculateDeficit(partition) {
    if (partition.length === 0) return 0;
    
    const totalBoxes = partition.reduce((sum, part) => sum + part, 0);
    const dinvCount = calculateDinv(partition);
    return totalBoxes - dinvCount;
}

// ============================================================================
// STEP 2: STANDARD MAPS (NU₁ and ND₁)
// ============================================================================

/**
 * NU₁ (NEXT-UP) Map
 * @param {number[]} partition - Input partition
 * @returns {number[]|null} Resulting partition or null if undefined
 */
function NU1(partition) {
    if (partition.length === 0) return null;
    
    const g1 = partition[0]; // γ₁
    const l = partition.length; // ℓ(γ)
    
    // Domain check: NOT NU₁-final (γ₁ ≤ ℓ(γ) + 2)
    if (is_NU1_final(partition)) {
        return null;
    }
    
    // Apply NU₁ formula: ⟨ℓ+1, γ₁-1, γ₂-1, ..., γₗ-1⟩
    const newPartition = [l + 1, ...partition.map(p => p - 1)];
    
    // Drop any zero parts and sort in descending order
    return newPartition.filter(p => p > 0).sort((a, b) => b - a);
}

/**
 * ND₁ (NEXT-DOWN) Map - Inverse of NU₁
 * @param {number[]} partition - Input partition
 * @returns {number[]|null} Resulting partition or null if undefined
 */
function ND1(partition) {
    if (partition.length === 0) return null;
    
    const g1 = partition[0]; // γ₁
    const l = partition.length; // ℓ(γ)
    
    // Domain check: NOT NU₁-initial (γ₁ ≥ ℓ(γ))
    if (is_NU1_initial(partition)) {
        return null;
    }
    
    // Apply ND₁ formula: ⟨γ₂+1, γ₃+1, ..., γₗ+1, 1^(γ₁-ℓ)⟩
    const newParts = partition.slice(1).map(p => p + 1);
    const onesToAdd = new Array(g1 - l).fill(1);
    const newPartition = [...newParts, ...onesToAdd];
    
    return newPartition.sort((a, b) => b - a);
}

// ============================================================================
// STEP 3: EXTENDED MAPS (NU₂ and ND₂)
// ============================================================================

/**
 * Check if QDV matches NU₂ Rule (a) pattern: [012^h A (-1)^{h-1}]
 * @param {number[]} qdv - QDV to check
 * @returns {Object|null} Object with h and A if matches, null otherwise
 */
function matchesNU2RuleA(qdv) {
    if (qdv.length < 3) return null;
    
    // Check for initial 012 pattern
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return null;
    
    // Count consecutive trailing -1s from the end
    let trailingNeg1s = 0;
    for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) {
        trailingNeg1s++;
    }
    
    // For Rule (a): we need h-1 trailing -1s, so h = trailingNeg1s + 1
    const h = trailingNeg1s + 1;
    
    // Check if we have at least h consecutive 2s starting from position 2
    let consecutive2s = 0;
    let i = 2;
    while (i < qdv.length && qdv[i] === 2) {
        consecutive2s++;
        i++;
    }
    
    // We need at least h consecutive 2s
    if (consecutive2s < h) return null;
    
    // Extract middle section A (everything between 012^h and the last h-1 -1s)
    const startA = 2 + h;  // After the 012^h part
    const endA = qdv.length - (h - 1);  // Before the last h-1 -1s
    const A = qdv.slice(startA, endA);  // Between 012^h and last h-1 -1s
    
    // Check conditions for A: A_s >= 0, A_i <= 2, A_{i+1} <= A_i + 1
    if (A.length > 0) {
        // A_s >= 0 (last element is non-negative)
        if (A[A.length - 1] < 0) return null;
        
        // A_i <= 2 for all i
        for (let k = 0; k < A.length; k++) {
            if (A[k] > 2) return null;
        }
        
        // A_{i+1} <= A_i + 1 for all i < s
        for (let k = 0; k < A.length - 1; k++) {
            if (A[k + 1] > A[k] + 1) return null;
        }
    }
    
    return { h, A };
}

/**
 * Check if QDV matches NU₂ Rule (b) pattern: [012^k B (-1)^k]
 * @param {number[]} qdv - QDV to check
 * @returns {Object|null} Object with k and B if matches, null otherwise
 */
function matchesNU2RuleB(qdv) {
    if (qdv.length < 3) return null;
    
    // Check for initial 012 pattern
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return null;
    
    // Count consecutive 2s starting from position 2
    let consecutive2s = 0;
    let i = 2;
    while (i < qdv.length && qdv[i] === 2) {
        consecutive2s++;
        i++;
    }
    
    // For Rule (b): k is determined by the number of consecutive 2s
    const k = consecutive2s;
    
    // Count consecutive trailing -1s from the end
    let trailingNeg1s = 0;
    for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) {
        trailingNeg1s++;
    }
    
    // We need at least k trailing -1s to match the pattern (B may end with -1)
    if (trailingNeg1s < k) return null;
    
    // Extract middle section B (everything between 012^k and the last k -1s)
    const startB = 2 + k;  // After the 012^k part
    const endB = qdv.length - k;  // Before the last k -1s
    const B = qdv.slice(startB, endB);  // Between 012^k and last k -1s
    
    // Check conditions for B: B_1 <= 1, B_s >= -1, B_i <= 2, B_{i+1} <= B_i + 1
    if (B.length > 0) {
        // B_1 <= 1 (first element is at most 1)
        if (B[0] > 1) return null;
        
        // B_s >= -1 (last element is at least -1)
        if (B[B.length - 1] < -1) return null;
        
        // B_i <= 2 for all i
        for (let m = 0; m < B.length; m++) {
            if (B[m] > 2) return null;
        }
        
        // B_{i+1} <= B_i + 1 for all i < s
        for (let m = 0; m < B.length - 1; m++) {
            if (B[m + 1] > B[m] + 1) return null;
        }
    }
    
    return { k, B };
}

/**
 * Apply NU₂ Rule (a) transformation
 * @param {number[]} qdv - Input QDV
 * @param {number} h - Number of 2s
 * @param {number[]} A - Middle section
 * @returns {number[]} Transformed QDV
 */
function applyNU2RuleA(qdv, h, A) {
    // Rule (a): [012^h A (-1)^{h-1}] → [00^{h-1} 1 A 1^h]
    return [
        0, // leading 0 in 00^{h-1}
        ...new Array(h - 1).fill(0), // the 0^{h-1} part
        1, // 1
        ...A, // A
        ...new Array(h).fill(1) // 1^h
    ];
}

/**
 * Apply NU₂ Rule (b) transformation
 * @param {number[]} qdv - Input QDV
 * @param {number} k - Number of 2s
 * @param {number[]} B - Middle section
 * @returns {number[]} Transformed QDV
 */
function applyNU2RuleB(qdv, k, B) {
    // Rule (b): [012^k B (-1)^k] → [00^k B 0 1^k]
    return [
        0, // Initial 0
        ...new Array(k).fill(0), // 0^k (k more zeros)
        ...B, // B
        0, // 0
        ...new Array(k).fill(1) // 1^k
    ];
}

/**
 * NU₂ (Chain Bridge) Map
 * @param {number[]} qdv - Input QDV (should be NU₁-final object)
 * @returns {number[]|null} Resulting QDV or null if undefined
 */
function NU2(qdv, suppressAlerts = false) {
    // Check Rule (b) first (takes priority when both match)
    const ruleB = matchesNU2RuleB(qdv);
    if (ruleB) {
        return applyNU2RuleB(qdv, ruleB.k, ruleB.B);
    }
    
    // Check Rule (a)
    const ruleA = matchesNU2RuleA(qdv);
    if (ruleA) {
        return applyNU2RuleA(qdv, ruleA.h, ruleA.A);
    }
    
    // No matching pattern: construct detailed diagnostics
    const diagnostics = [];
    // Run Rule (b) checks piecemeal for messages
    if (!(qdv[0] === 0 && qdv[1] === 1 && qdv[2] === 2)) {
        diagnostics.push('Rule (b) fails: prefix must be 012.');
    } else {
        let i = 2, c2 = 0; while (i < qdv.length && qdv[i] === 2) { c2++; i++; }
        const k = c2;
        let trailing = 0; for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) trailing++;
        if (trailing < k) diagnostics.push(`Rule (b) fails: need at least k=${k} trailing -1s, found ${trailing}.`);
        const startB = 2 + k, endB = qdv.length - k; const B = qdv.slice(startB, endB);
        if (B.length > 0) {
            if (B[0] > 1) diagnostics.push(`Rule (b) fails: B_1=${B[0]} must be ≤ 1.`);
            if (B[B.length - 1] < -1) diagnostics.push(`Rule (b) fails: B_s=${B[B.length - 1]} must be ≥ -1.`);
            for (let t = 0; t < B.length; t++) if (B[t] > 2) { diagnostics.push(`Rule (b) fails: B_i=${B[t]} must be ≤ 2.`); break; }
            for (let t = 0; t < B.length - 1; t++) if (B[t + 1] > B[t] + 1) { diagnostics.push(`Rule (b) fails: B_{i+1} ≤ B_i + 1 violated at ${B[t]}→${B[t+1]}.`); break; }
        }
    }
    // Rule (a) checks
    if (!(qdv[0] === 0 && qdv[1] === 1 && qdv[2] === 2)) {
        diagnostics.push('Rule (a) fails: prefix must be 012.');
    } else {
        let trailing = 0; for (let j = qdv.length - 1; j >= 0 && qdv[j] === -1; j--) trailing++;
        const h = trailing + 1;
        let i = 2, c2 = 0; while (i < qdv.length && qdv[i] === 2) { c2++; i++; }
        if (c2 < h) diagnostics.push(`Rule (a) fails: need at least h=${h} consecutive 2s after 01, found ${c2}.`);
        const startA = 2 + h, endA = qdv.length - (h - 1); const A = qdv.slice(startA, endA);
        if (A.length > 0) {
            if (A[A.length - 1] < 0) diagnostics.push(`Rule (a) fails: A_s=${A[A.length - 1]} must be ≥ 0.`);
            for (let t = 0; t < A.length; t++) if (A[t] > 2) { diagnostics.push(`Rule (a) fails: A_i=${A[t]} must be ≤ 2.`); break; }
            for (let t = 0; t < A.length - 1; t++) if (A[t + 1] > A[t] + 1) { diagnostics.push(`Rule (a) fails: A_{i+1} ≤ A_i + 1 violated at ${A[t]}→${A[t+1]}.`); break; }
        }
    }
    if (!suppressAlerts && typeof window !== 'undefined') {
        alert(['NU₂ is undefined for this input.','Details:'].concat(diagnostics).join('\n'));
    }
    return null; // No matching pattern
}

/**
 * Check if QDV matches ND₂ input pattern for Rule (a)
 * @param {number[]} qdv - QDV to check
 * @returns {Object|null} Object with h and A if matches, null otherwise
 */
function matchesND2RuleA(qdv) {
    // Pattern: [0^h 1 A 1^h]
    // Count initial 0s
    let initial0s = 0;
    let i = 0;
    while (i < qdv.length && qdv[i] === 0) {
        initial0s++;
        i++;
    }
    
    if (initial0s < 2) return null; // Need at least 2 zeros
    
    // Check for the 1 after initial 0s
    if (i >= qdv.length || qdv[i] !== 1) return null;
    i++;
    
    // Count trailing 1s (to ensure there are at least h of them)
    let trailingOnes = 0;
    for (let t = qdv.length - 1; t >= 0 && qdv[t] === 1; t--) trailingOnes++;
    if (trailingOnes < initial0s) return null;
    
    // Extract middle section A between the 1 after 0^h and the last h trailing 1s
    const startA = i; // immediately after the single 1
    const endA = qdv.length - initial0s; // exclude exactly the last h ones
    const A = qdv.slice(startA, endA);
    
    return { h: initial0s, A };
}

/**
 * Check if QDV matches ND₂ input pattern for Rule (b)
 * @param {number[]} qdv - QDV to check
 * @returns {Object|null} Object with k and B if matches, null otherwise
 */
function matchesND2RuleB(qdv) {
    // Pattern: [00^k B 0 1^k]
    // Count initial 0s
    let initial0s = 0;
    let i = 0;
    while (i < qdv.length && qdv[i] === 0) {
        initial0s++;
        i++;
    }
    
    if (initial0s < 2) return null; // Need at least 2 zeros (0 + 0^k for k >= 1)
    
    // Count final 1s
    let final1s = 0;
    let j = qdv.length - 1;
    while (j >= 0 && qdv[j] === 1) {
        final1s++;
        j--;
    }
    
    // For Rule (b): final_1s must equal k = initial_0s - 1 and k >= 1
    const k = initial0s - 1;
    if (final1s !== k || k < 1) return null;
    
    // Check for the 0 before final 1s
    if (j < 0 || qdv[j] !== 0) return null;
    j--;
    
    // Extract middle section B
    const startB = i;
    const endB = j + 1;
    const B = qdv.slice(startB, endB);
    
    return { k, B }; // k = initial0s - 1 (since we have 0 + 0^k)
}

/**
 * Apply ND₂ Rule (a) inverse transformation
 * @param {number[]} qdv - Input QDV
 * @param {number} h - Number from pattern
 * @param {number[]} A - Middle section
 * @returns {number[]} Transformed QDV
 */
function applyND2RuleA(qdv, h, A) {
    // Inverse of Rule (a): [0^h 1 A 1^h] → [012^h A (-1)^{h-1}]
    return [
        0, 1, 2, // 012
        ...new Array(h - 1).fill(2), // 2^{h-1}
        ...A, // A
        ...new Array(h - 1).fill(-1) // (-1)^{h-1}
    ];
}

/**
 * Apply ND₂ Rule (b) inverse transformation
 * @param {number[]} qdv - Input QDV
 * @param {number} k - Number from pattern
 * @param {number[]} B - Middle section
 * @returns {number[]} Transformed QDV
 */
function applyND2RuleB(qdv, k, B) {
    // Inverse of Rule (b): [00^k B 0 1^k] → [012^k B (-1)^k]
    return [
        0, 1, 2, // 012
        ...new Array(k - 1).fill(2), // 2^{k-1}
        ...B, // B
        ...new Array(k).fill(-1) // (-1)^k
    ];
}

/**
 * ND₂ (Chain Bridge Inverse) Map
 * @param {number[]} qdv - Input QDV (should be NU₁-initial object)
 * @returns {number[]|null} Resulting QDV or null if undefined
 */
function ND2(qdv, suppressAlerts = false) {
    // Count initial 0s and final 1s for rule selection
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
    
    // Rule selection logic
    if (final1s >= initial0s) {
        // Apply Rule (a)
        const ruleA = matchesND2RuleA(qdv);
        if (ruleA) {
            return applyND2RuleA(qdv, ruleA.h, ruleA.A);
        }
    } else {
        // Apply Rule (b)
        const ruleB = matchesND2RuleB(qdv);
        if (ruleB) {
            return applyND2RuleB(qdv, ruleB.k, ruleB.B);
        }
    }
    
    // No matching pattern: construct detailed diagnostics for ND₂
    const diagnostics = [];
    // Common measurements
    let init0 = 0, p = 0; while (p < qdv.length && qdv[p] === 0) { init0++; p++; }
    let end1 = 0, q = qdv.length - 1; while (q >= 0 && qdv[q] === 1) { end1++; q--; }
    
    // Rule (a) expected: [0^h 1 A 1^h], with h>=2, trailing 1s >= leading 0s
    if (init0 < 2) diagnostics.push(`Rule (a) fails: need at least 2 leading 0s (have ${init0}).`);
    else {
        if (qdv[p] !== 1) diagnostics.push('Rule (a) fails: the symbol after leading 0s must be 1.');
        if (end1 < init0) diagnostics.push(`Rule (a) fails: trailing 1s (=${end1}) must be ≥ leading 0s (=${init0}).`);
        // Extract A if structurally plausible
        if (qdv[p] === 1 && end1 >= init0) {
            const h = init0;
            const startA = p + 1;
            const endA = qdv.length - h;
            const A = qdv.slice(startA, endA);
            if (A.length > 0) {
                if (A[A.length - 1] < 0) diagnostics.push(`Rule (a) fails: A_s=${A[A.length - 1]} must be ≥ 0.`);
                for (let t = 0; t < A.length; t++) if (A[t] > 2) { diagnostics.push(`Rule (a) fails: A_i=${A[t]} must be ≤ 2.`); break; }
                for (let t = 0; t < A.length - 1; t++) if (A[t + 1] > A[t] + 1) { diagnostics.push(`Rule (a) fails: A_{i+1} ≤ A_i + 1 violated at ${A[t]}→${A[t+1]}.`); break; }
            }
        }
    }
    
    // Rule (b) expected: [0^(k+1) B 0 1^k], with leading 0s > trailing 1s (strict), separator 0 before 1^k
    if (init0 < 2) diagnostics.push(`Rule (b) fails: need at least 2 leading 0s (have ${init0}).`);
    else {
        if (init0 <= end1) diagnostics.push(`Rule (b) fails: leading 0s (=${init0}) must be > trailing 1s (=${end1}).`);
        // Check separator 0 before 1^k
        if (q < 0 || qdv[q] !== 0) diagnostics.push('Rule (b) fails: missing required 0 immediately before the trailing 1^k block.');
        // Extract B if structurally plausible
        if (init0 > end1 && q >= 0 && qdv[q] === 0) {
            const startB = init0;
            const endB = q; // exclusive of the separator 0 position
            const B = qdv.slice(startB, endB);
            if (B.length > 0) {
                if (B[0] > 1) diagnostics.push(`Rule (b) fails: B_1=${B[0]} must be ≤ 1.`);
                if (B[B.length - 1] < -1) diagnostics.push(`Rule (b) fails: B_s=${B[B.length - 1]} must be ≥ -1.`);
                for (let t = 0; t < B.length; t++) if (B[t] > 2) { diagnostics.push(`Rule (b) fails: B_i=${B[t]} must be ≤ 2.`); break; }
                for (let t = 0; t < B.length - 1; t++) if (B[t + 1] > B[t] + 1) { diagnostics.push(`Rule (b) fails: B_{i+1} ≤ B_i + 1 violated at ${B[t]}→${B[t+1]}.`); break; }
            }
        }
    }
    if (!suppressAlerts && typeof window !== 'undefined') {
        alert(['ND₂ is undefined for this input.','Details:'].concat(diagnostics).join('\n'));
    }
    return null; // No matching pattern
}

// ============================================================================
// STEP 4: UNIFIED MAPS (NU and ND)
// ============================================================================

/**
 * Build TI(μ) (first-order tail initiator) as a QDV from a partition μ.
 * B_μ = 01^{n1}01^{n2}...01^{nr}, where n_i is the count of parts equal to i.
 * TI(μ) = [0, ...B_μ].
 * @param {number[]} muPartition - Partition μ in descending order
 * @returns {number[]} QDV vector for TI(μ)
 */
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

/**
 * ND₁ on QDV (vector rule from Proposition 2.10(b))
 * Delete last symbol v_n; insert v_n+1 immediately after the first
 * occurrence of v_n. Special case v_n = -1: insert 0 at the front.
 * Defined only if leader d >= v_n, where leader d is the highest value
 * in the initial 0,1,2,... prefix.
 * @param {number[]} qdv
 * @returns {number[]|null}
 */
function ND1_QDV(qdv) {
    if (!qdv || qdv.length === 0) return null;
    const vn = qdv[qdv.length - 1];
    // compute leader d
    let expected = 0, i = 0;
    while (i < qdv.length && qdv[i] === expected) { expected++; i++; }
    const d = expected - 1;
    if (d < vn) return null;
    const arr = qdv.slice(0, qdv.length - 1);
    if (vn === -1) {
        return [0, ...arr];
    }
    const firstIdx = arr.indexOf(vn);
    if (firstIdx === -1) {
        // Invalid state under d >= v_n; refuse to apply ND₁
        return null;
    }
    const out = arr.slice(0, firstIdx + 1).concat([vn + 1], arr.slice(firstIdx + 1));
    return out;
}

/**
 * Compute TI₂(μ) by starting at TI(μ) and applying the extended ND
 * (ND₁ when defined on the partition; otherwise ND₂ on the QDV)
 * until neither applies.
 * @param {number[]} muPartition - Partition μ (descending)
 * @returns {{finalQDV:number[], steps:Array<{qdv:number[], used:string}>}} final QDV and steps
 */
function computeTI2(muPartition) {
    let currentQDV = TIFromPartition(muPartition);
    const steps = [{ qdv: [...currentQDV], used: 'start:TI(μ)' }];
    const defc0 = calculateDeficit(QDVToPartition(currentQDV));
    while (true) {
        let progressed = false;
        // ND phase: apply extended ND on QDV until blocked (preserving deficit)
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
        // Reduction phase: reduce to ternary representative; if changed, loop again
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

/**
 * Find the appropriate QDV representation for NU₁-final object
 * @param {number[]} partition - NU₁-final partition
 * @returns {number[]} QDV representation ending in -1
 */
function findNU1FinalQDV(partition) {
    // This is a complex function that needs to find the specific QDV
    // representation that matches the NU₂ input patterns
    // For now, return a placeholder
    return null;
}

/**
 * Unified NU (Extended NEXT-UP) Map
 * @param {number[]} partition - Input partition
 * @returns {number[]|null} Resulting partition or null if undefined
 */
function NU(partition) {
    if (is_NU1_final(partition)) {
        // Convert to QDV, apply NU₂, convert back
        const qdv = findNU1FinalQDV(partition);
        if (!qdv) return null;
        
        const resultQDV = NU2(qdv);
        if (!resultQDV) return null;
        
        return QDVToPartition(resultQDV);
    } else {
        // Apply standard NU₁
        return NU1(partition);
    }
}

/**
 * Unified ND (Extended NEXT-DOWN) Map
 * @param {number[]} partition - Input partition
 * @returns {number[]|null} Resulting partition or null if undefined
 */
function ND(partition) {
    if (is_NU1_initial(partition)) {
        // Convert to QDV, try ND₁ on QDV form first, else ND₂; convert back
        const n = partition[0] + partition.length; // Estimate QDV length
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
        // Apply standard ND₁
        return ND1(partition);
    }
}

// ============================================================================
// SEQUENCE GENERATION AND ANALYSIS
// ============================================================================

/**
 * Generate a sequence using the specified map
 * @param {number[]} initialPartition - Starting partition
 * @param {string} mapType - Type of map to use ('NU1', 'ND1', 'NU2', 'ND2', 'NU', 'ND')
 * @param {number} maxIterations - Maximum number of iterations
 * @returns {Object} Sequence data
 */
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

/**
 * Get partition type description
 * @param {number[]} partition - Partition to classify
 * @returns {string} Type description
 */
function getPartitionType(partition) {
    if (is_NU1_final(partition)) {
        return 'NU₁-final';
    } else if (is_NU1_initial(partition)) {
        return 'NU₁-initial';
    } else {
        return 'Regular';
    }
}

/**
 * Get termination reason for sequence
 * @param {string} mapType - Type of map used
 * @param {string} finalType - Type of final partition
 * @param {number} iterations - Number of iterations completed
 * @param {number} maxIterations - Maximum allowed iterations
 * @returns {string} Termination reason
 */
function getTerminationReason(mapType, finalType, iterations, maxIterations) {
    if (iterations >= maxIterations) {
        return 'Maximum iterations reached';
    } else if (finalType === 'NU₁-final' && (mapType === 'NU1' || mapType === 'NU')) {
        return 'Reached NU₁-final object';
    } else if (finalType === 'NU₁-initial' && (mapType === 'ND1' || mapType === 'ND')) {
        return 'Reached NU₁-initial object';
    } else {
        return 'Sequence completed';
    }
}

// ============================================================================
// WEBAPP INTEGRATION
// ============================================================================

/**
 * Parse input partition from string
 * @param {string} input - Comma-separated partition string
 * @returns {number[]} Partition array
 */
function parsePartitionInput(input) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        const values = parts.map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        
        if (values.length === 0) {
            throw new Error('Empty partition');
        }
        
        // Sort in descending order (canonical form)
        return values.sort((a, b) => b - a);
    } catch (error) {
        throw new Error('Invalid partition format. Please use comma-separated positive integers.');
    }
}

/**
 * Parse input QDV from string
 * @param {string} input - Comma-separated QDV string
 * @returns {number[]} QDV array
 */
function parseQDVInput(input) {
    try {
        const cleaned = input.replace(/[()]/g, '');
        const parts = cleaned.split(',');
        const values = parts.map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        
        if (values.length === 0) {
            throw new Error('Empty QDV');
        }
        
        // QDV must start with 0
        if (values[0] !== 0) {
            throw new Error('QDV must start with 0');
        }
        
        return values;
    } catch (error) {
        throw new Error('Invalid QDV format. Please use comma-separated integers starting with 0.');
    }
}

/**
 * Check if QDV matches NU₂ Rule (a) pattern: [012^h A (-1)^{h-1}]
 * @param {number[]} qdv - QDV to check
 * @returns {boolean} True if matches pattern
 */
function isNU2RuleAPattern(qdv) {
    if (qdv.length < 3) return false;
    
    // Check for initial 012 pattern
    if (qdv[0] !== 0 || qdv[1] !== 1 || qdv[2] !== 2) return false;
    
    // Count consecutive 2s
    let h = 1;
    let i = 3;
    while (i < qdv.length && qdv[i] === 2) {
        h++;
        i++;
    }
    
    // Count trailing -1s
    let trailingNeg1s = 0;
    let j = qdv.length - 1;
    while (j >= 0 && qdv[j] === -1) {
        trailingNeg1s++;
        j--;
    }
    
    // Check if pattern matches: trailing -1s should equal h-1
    return trailingNeg1s === h - 1;
}

/**
 * Generate sequence for webapp
 */
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
            } else if (method === 'NU') {
                // Unified NU: try NU₂ on QDV first; if not applicable, fall back to NU₁ on partition
                const resultQDV = NU2(qdv);
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
                    const resultQDV = ND2(qdv);
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

/**
 * Display results in the webapp
 */
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

/**
 * Get method display name
 */
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

/**
 * Create sequence table
 */
function createNuSequenceTable(sequence, deficits, dinvs, types, inputType = 'partition') {
    const tableContainer = document.getElementById('sequence-table');
    
    // Determine if we should show QDV column
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

/**
 * Create sequence visualization
 */
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

/**
 * Show error message
 */
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

/**
 * Generate all partitions of a given length
 */
function generateAllPartitions(length) {
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
    
    generateRecursive([], length, length);
    return partitions;
}

/**
 * List available deficit values
 */
function listAvailableDeficitValues(length) {
    try {
        const allPartitions = generateAllPartitions(length);
        const deficitValues = new Set();
        const deficitCounts = {};
        
        allPartitions.forEach(partition => {
            const deficit = calculateDeficit(partition);
            deficitValues.add(deficit);
            deficitCounts[deficit] = (deficitCounts[deficit] || 0) + 1;
        });
        
        const sortedDeficitValues = Array.from(deficitValues).sort((a, b) => a - b);
        
        const display = document.getElementById('deficit-values-display');
        let html = `<p><strong>Available deficit values for length ${length}:</strong> [${sortedDeficitValues.join(', ')}]</p>`;
        html += '<div class="deficit-values-display">';
        
        sortedDeficitValues.forEach(deficitVal => {
            html += `
                <div class="deficit-value-item">
                    <h4>Deficit = ${deficitVal}</h4>
                    <p><strong>${deficitCounts[deficitVal]} partitions</strong></p>
                </div>
            `;
        });
        
        html += '</div>';
        display.innerHTML = html;
        
        const infoDiv = document.getElementById('available-deficit-info');
        infoDiv.style.display = 'block';
        
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Analyze partitions with specific deficit
 */
function analyzeDeficitPartitions() {
    const length = parseInt(document.getElementById('partition-length').value);
    const targetDeficit = parseInt(document.getElementById('target-deficit').value);
    
    try {
        const allPartitions = generateAllPartitions(length);
        const targetPartitions = allPartitions.filter(p => calculateDeficit(p) === targetDeficit);
        
        const results = document.getElementById('deficit-analysis-results');
        results.style.display = 'block';
        
        let summaryHTML = `
            <h4>Summary</h4>
            <p><strong>Found ${targetPartitions.length} partitions with deficit=${targetDeficit} and length ${length}</p>
        `;
        
        if (targetPartitions.length === 0) {
            summaryHTML += '<p><em>No partitions found with this deficit value. Try checking available deficit values.</em></p>';
        }
        
        let detailsHTML = '<h4>Detailed Results</h4>';
        
        targetPartitions.forEach((partition, index) => {
            const type = getPartitionType(partition);
            const dinv = calculateDinv(partition);
            
            summaryHTML += `<p><strong>Partition ${index + 1}:</strong> ⟨${partition.join(', ')}⟩ [${type}]</p>`;
            
            detailsHTML += `
                <div class="deficit-analysis-item">
                    <h5>Partition ${index + 1}: ⟨${partition.join(', ')}⟩</h5>
                    <p><strong>Type:</strong> ${type}</p>
                    <p><strong>Deficit:</strong> ${targetDeficit}</p>
                    <p><strong>Dinv:</strong> ${dinv}</p>
                </div>
            `;
        });
        
        document.getElementById('deficit-analysis-summary').innerHTML = summaryHTML;
        document.getElementById('deficit-analysis-details').innerHTML = detailsHTML;
        
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Update input label and placeholder based on input type
 */
function updateInputLabel() {
    const inputType = document.getElementById('input-type').value;
    const label = document.getElementById('input-label');
    const input = document.getElementById('input-vector');
    
    if (inputType === 'qdv') {
        label.textContent = 'Quasi-Dyck Vector (comma-separated, can include negatives):';
        input.placeholder = '0,1,2,2,A,-1,-1';
        input.value = '0,1,2,2,2,-1,-1'; // Example NU₂ Rule (a) pattern
    } else {
        label.textContent = 'Partition (comma-separated integers):';
        input.placeholder = '5,4,4,1';
        input.value = '5,4,4,1';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generate-sequence').addEventListener('click', generateNuSequence);
    document.getElementById('analyze-deficit').addEventListener('click', analyzeDeficitPartitions);
    document.getElementById('show-available-deficits').addEventListener('click', function() {
        const length = parseInt(document.getElementById('partition-length').value);
        listAvailableDeficitValues(length);
    });
    
    document.getElementById('input-type').addEventListener('change', updateInputLabel);
    
    document.getElementById('input-vector').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateNuSequence();
        }
    });
    
    // Initialize with default sequence
    updateInputLabel();
    generateNuSequence();
});

/**
 * Test function for NU₂ with the example vector
 */
function testNU2Example() {
    const testQDV = [0, 1, 2, 2, 2, 2, -1, 0, 0, 1, -1, -1];
    console.log('Testing NU₂ with vector:', testQDV);
    
    // Test Rule (a)
    const ruleA = matchesNU2RuleA(testQDV);
    console.log('Rule (a) match:', ruleA);
    
    if (ruleA) {
        const resultA = applyNU2RuleA(testQDV, ruleA.h, ruleA.A);
        console.log('Rule (a) result:', resultA);
    }
    
    // Test Rule (b)
    const ruleB = matchesNU2RuleB(testQDV);
    console.log('Rule (b) match:', ruleB);
    
    if (ruleB) {
        const resultB = applyNU2RuleB(testQDV, ruleB.k, ruleB.B);
        console.log('Rule (b) result:', resultB);
    }
    
    // Test overall NU₂
    const result = NU2(testQDV);
    console.log('NU₂ result:', result);
    
    return result;
}

// Export functions for use in webapp
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
        NU2,
        ND2,
        NU,
        ND,
        TIFromPartition,
        computeTI2,
        generateSequence,
        getPartitionType,
        getTerminationReason,
        testNU2Example
    };
}

// Expose helpers to browser console
if (typeof window !== 'undefined') {
    try {
        window.TIFromPartition = TIFromPartition;
        window.computeTI2 = computeTI2;
        window.QDVToPartition = QDVToPartition;
        window.reduceQDVToReducedDyck = reduceQDVToReducedDyck;
        window.reducedDyckFromPartition = reducedDyckFromPartition;
    } catch (e) { /* no-op if not defined */ }
}
