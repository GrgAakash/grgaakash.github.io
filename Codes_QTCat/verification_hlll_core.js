/**
 * Browser port of Codes_QTCat/verification_scripts/verify_chains_hlll.py
 * and flagpole_defc10.py core routines (partition ↔ reduced DV, NU, flagpole, enumeration).
 */
(function (global) {
  'use strict';

  function sortedDesc(mu) {
    return [...mu].sort((a, b) => b - a);
  }

  function partitionToReducedDv(mu) {
    if (!mu || mu.length === 0) return [0];
    const parts = sortedDesc(mu);
    const ell = parts.length;
    const mu0 = parts[0];
    for (let n = ell + 1; n <= ell + mu0 + 9; n++) {
      const muPad = parts.concat(Array(n - ell).fill(0));
      const v = [];
      for (let i = 0; i < n; i++) v.push(i - muPad[n - 1 - i]);
      if (v.every((x) => x >= 0) && v[0] === 0) return v;
    }
    return null;
  }

  function reducedDvToPartition(v) {
    const n = v.length;
    const parts = [];
    for (let j = 0; j < n; j++) {
      const p = n - 1 - j - v[n - 1 - j];
      if (p > 0) parts.push(p);
    }
    return parts.sort((a, b) => b - a);
  }

  function computeArea(v) {
    return v.reduce((s, x) => s + x, 0);
  }

  function computeDinv(v) {
    const n = v.length;
    let d = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = v[i] - v[j];
        if (diff === 0 || diff === 1) d++;
      }
    }
    return d;
  }

  function computeDefc(v) {
    const n = v.length;
    return (n * (n - 1)) / 2 - computeArea(v) - computeDinv(v);
  }

  function nu1(mu) {
    if (!mu || mu.length === 0) return null;
    const parts = [...mu];
    const ell = parts.length;
    if (parts[0] > ell + 2) return null;
    const np = [ell + 1].concat(parts.map((p) => p - 1)).filter((p) => p > 0);
    return sortedDesc(np);
  }

  function isNu1Final(mu) {
    if (!mu || mu.length === 0) return false;
    return mu[0] > mu.length + 2;
  }

  function isNu1Initial(mu) {
    if (!mu || mu.length === 0) return true;
    return mu[0] < mu.length;
  }

  function getNeg1Representative(reducedDv) {
    let v = reducedDv.slice();
    while (v[v.length - 1] !== -1) {
      if (v.length <= 1) return null;
      const w = v.slice(1).map((x) => x - 1);
      if (w[0] !== 0) return null;
      v = w;
    }
    return v;
  }

  function applyNu2OnQdv(qdv) {
    const v = qdv.slice();
    const n = v.length;
    if (n < 3 || v[0] !== 0 || v[1] !== 1) return null;
    let numTwos = 0;
    let idx = 2;
    while (idx < n && v[idx] === 2) {
      numTwos++;
      idx++;
    }
    let numNeg1 = 0;
    let idx2 = n - 1;
    while (idx2 >= 0 && v[idx2] === -1) {
      numNeg1++;
      idx2--;
    }
    if (numNeg1 === 0) return null;
    const k = numNeg1;
    if (numTwos === k && k >= 1) {
      const B = v.slice(2 + k, n - k);
      let valid = true;
      if (B.length > 0) {
        if (B[0] > 1) valid = false;
        if (B[B.length - 1] < -1) valid = false;
      }
      if (valid) return Array(k + 1).fill(0).concat(B).concat([0]).concat(Array(k).fill(1));
    }
    const h = numNeg1 + 1;
    if (h >= 2 && numTwos >= h) {
      const A = v.slice(2 + h, n - (h - 1));
      let valid = true;
      if (A.length > 0) {
        if (A[A.length - 1] < 0) valid = false;
        if (A.some((a) => a > 2)) valid = false;
      }
      if (valid) return Array(h).fill(0).concat([1]).concat(A).concat(Array(h).fill(1));
    }
    return null;
  }

  function qdvToReduced(qdv) {
    let v = qdv.slice();
    while (Math.min(...v) < 0) v = [0].concat(v.map((x) => x + 1));
    while (v.length > 1) {
      const w = v.slice(1).map((x) => x - 1);
      if (w.length > 0 && w[0] === 0 && w.every((x) => x >= 0)) v = w;
      else break;
    }
    return v;
  }

  function applyNu2(mu) {
    const rdv = partitionToReducedDv(mu);
    if (!rdv) return null;
    const qdv = getNeg1Representative(rdv);
    if (!qdv) return null;
    const outQ = applyNu2OnQdv(qdv);
    if (!outQ) return null;
    const outR = qdvToReduced(outQ);
    return reducedDvToPartition(outR);
  }

  function applyNu(mu) {
    const n1 = nu1(mu);
    if (n1 !== null) return { next: n1, type: 'NU1' };
    if (isNu1Final(mu)) {
      const n2 = applyNu2(mu);
      if (n2 !== null) return { next: n2, type: 'NU2' };
    }
    return { next: null, type: null };
  }

  function nd1(F) {
    const parts = sortedDesc(F);
    const m = parts.length;
    const numTrailingOnes = parts[0] - m;
    if (numTrailingOnes < 0) return null;
    const muParts = parts.slice(1).map((p) => p + 1).concat(Array(numTrailingOnes).fill(1)).filter((p) => p > 0);
    const mu = sortedDesc(muParts);
    const check = nu1(mu);
    if (check !== null && JSON.stringify(sortedDesc(check)) === JSON.stringify(parts)) return mu;
    return null;
  }

  function buildV(lam, a, eps) {
    let r = 0;
    let mults = [];
    if (lam && lam.length > 0) {
      r = Math.max(...lam);
      mults = Array(r).fill(0);
      for (const p of lam) mults[p - 1]++;
    }
    const Bplus = [];
    for (let i = 0; i < r; i++) {
      Bplus.push(1);
      for (let t = 0; t < mults[i]; t++) Bplus.push(2);
    }
    if (eps === 0) return [0, 0, 1].concat(Array(a).fill(2)).concat(Bplus);
    return [0, 0, 1].concat(Array(a - 1).fill(2)).concat(Bplus).concat([1]);
  }

  function a0(lam) {
    if (!lam || lam.length === 0) return 3;
    return lam.reduce((s, x) => s + x, 0) - Math.max(...lam) - lam.length + 3;
  }

  function* partitionsOf(n, maxPart) {
    const mp = maxPart === undefined ? n : maxPart;
    if (n === 0) {
      yield [];
      return;
    }
    for (let first = Math.min(n, mp); first > 0; first--) {
      for (const rest of partitionsOf(n - first, first)) yield [first].concat(rest);
    }
  }

  function computeTiFromParams(lam, a, eps) {
    let r = 0;
    let n = [];
    if (lam && lam.length > 0) {
      r = Math.max(...lam);
      n = Array(r).fill(0);
      for (const p of lam) n[p - 1]++;
    }
    const n0 = a - eps;
    const C = Array(eps).fill(1);
    const allN = [n0].concat(n);
    const pr1 = allN.filter((x) => x % 2 === 0).length;
    const result = [0, 0].concat(Array(pr1).fill(1)).concat(C);
    for (let i = 0; i < allN.length; i++) {
      const ni = allN[i];
      if (i < allN.length - 1) {
        result.push(...Array(2 * Math.floor(ni / 2)).fill(1));
        result.push(0);
        result.push(...Array(ni % 2).fill(1));
      } else {
        result.push(...Array(2 * Math.floor(ni / 2)).fill(1));
        if (ni % 2 === 1) result.push(0, 1);
      }
    }
    return result;
  }

  function tiRdvToOriginalPartition(rdv) {
    const v = rdv.slice();
    const B = v.slice(1);
    const multiplicities = [];
    let i = 0;
    while (i < B.length) {
      if (B[i] !== 0) throw new Error('tiRdv parse');
      i++;
      let count = 0;
      while (i < B.length && B[i] === 1) {
        count++;
        i++;
      }
      multiplicities.push(count);
    }
    const parts = [];
    for (let j = 0; j < multiplicities.length; j++) {
      for (let t = 0; t < multiplicities[j]; t++) parts.push(j + 1);
    }
    return sortedDesc(parts);
  }

  function partToHlllStr(mu) {
    if (!mu || mu.length === 0) return '';
    return sortedDesc(mu)
      .map((p) => {
        if (p < 10) return String(p);
        if (p === 10) return 'A';
        if (p === 11) return 'B';
        if (p === 12) return 'C';
        return `(${p})`;
      })
      .join('');
  }

  function minLengthForDefc(k) {
    let L = 1;
    while ((L * (L - 1)) / 2 < k) L++;
    return L;
  }

  function enumerateDefcPartitions(L, targetDefc) {
    const targetAd = (L * (L - 1)) / 2 - targetDefc;
    const results = [];
    function backtrack(i, v, area, dinv) {
      if (area > targetAd) return;
      const remaining = L - i;
      let maxAddArea = 0;
      for (let t = i; t < L; t++) maxAddArea += t;
      let maxAddDinv = 0;
      if (remaining > 0) maxAddDinv = (remaining * (remaining - 1)) / 2 + remaining * i;
      if (area + dinv + maxAddArea + maxAddDinv < targetAd) return;
      if (i === L) {
        if (area + dinv === targetAd) results.push(v.slice());
        return;
      }
      const minVal = 0;
      const maxVal = i === 0 ? 0 : v[i - 1] + 1;
      for (let val = minVal; val <= maxVal; val++) {
        let newDinv = 0;
        for (let j = 0; j < i; j++) {
          const diff = v[j] - val;
          if (diff === 0 || diff === 1) newDinv++;
        }
        v.push(val);
        backtrack(i + 1, v, area + val, dinv + newDinv);
        v.pop();
      }
    }
    backtrack(0, [], 0, 0);
    return results;
  }

  function allDistinctPartitionsOfDefc(k, lMin, lMax) {
    const seen = new Map();
    for (let L = lMin; L <= lMax; L++) {
      if ((L * (L - 1)) / 2 < k) continue;
      for (const vec of enumerateDefcPartitions(L, k)) {
        const p = reducedDvToPartition(vec);
        const key = JSON.stringify(p);
        if (!seen.has(key)) seen.set(key, { part: p, v: vec, L });
      }
    }
    return Array.from(seen.values()).sort((a, b) => {
      const sa = a.part.reduce((s, x) => s + x, 0);
      const sb = b.part.reduce((s, x) => s + x, 0);
      if (sb !== sa) return sb - sa;
      if (b.part.length !== a.part.length) return b.part.length - a.part.length;
      return JSON.stringify(b.part).localeCompare(JSON.stringify(a.part));
    });
  }

  function collectNu1FinalDefc(defc, lMin, lMax) {
    const out = [];
    const seen = new Set();
    for (let L = lMin; L <= lMax; L++) {
      for (const v of enumerateDefcPartitions(L, defc)) {
        const part = reducedDvToPartition(v);
        if (!isNu1Final(part)) continue;
        const key = JSON.stringify(part);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(part);
        }
      }
    }
    return out;
  }

  function buildFullChainInitials(ti2Part) {
    const forward = [];
    let current = ti2Part.slice();
    const maxSteps = 200;
    for (let step = 0; step < maxSteps; step++) {
      const rdv = partitionToReducedDv(current);
      if (!rdv) break;
      if (isNu1Initial(current)) {
        forward.push(current.slice());
        const has2 = rdv.some((x) => x >= 2);
        if (!has2 && step > 0) break;
      }
      const { next, type } = applyNu(current);
      if (!next || !type) break;
      current = next;
    }
    return forward;
  }

  function findBackwardChain(ti2Part, allNu1Final, targetDefc) {
    const backward = [];
    let currentInitial = ti2Part.slice();
    const maxBack = 50;
    for (let step = 0; step < maxBack; step++) {
      let foundF = null;
      for (const F of allNu1Final) {
        const r = applyNu2(F);
        if (r && JSON.stringify(r) === JSON.stringify(currentInitial)) {
          foundF = F;
          break;
        }
      }
      if (!foundF) break;
      const I = nd1(foundF);
      if (!I || !isNu1Initial(I)) break;
      const rdvI = partitionToReducedDv(I);
      if (!rdvI || computeDefc(rdvI) !== targetDefc) break;
      backward.push(I);
      currentInitial = I;
    }
    backward.reverse();
    return backward;
  }

  function flagpoleRowsForDefc(defc) {
    const rows = [];
    const maxLam = defc;
    for (let lamSize = 0; lamSize <= maxLam; lamSize++) {
      for (const lam of partitionsOf(lamSize)) {
        const lam1 = lam.length ? Math.max(...lam) : 0;
        const ellLam = lam.length;
        for (const eps of [0, 1]) {
          const a = defc - 1 - lam1 - ellLam - lamSize;
          if (a < Math.max(2, a0(lam))) continue;
          const v = buildV(lam, a, eps);
          if (computeDefc(v) !== defc) continue;
          const ti2Part = reducedDvToPartition(v);
          const tiRdv = computeTiFromParams(lam, a, eps);
          const mu = tiRdvToOriginalPartition(tiRdv);
          rows.push({
            lambda: lam,
            a,
            eps,
            v,
            ti2: ti2Part,
            tiRdv,
            mu,
            L: v.length,
            dinvTi2: computeDinv(v),
            areaTi2: computeArea(v),
          });
        }
      }
    }
    return rows;
  }

  function partitionLookup(mu) {
    const v = partitionToReducedDv(mu);
    if (!v) return { ok: false, error: 'No valid reduced Dyck vector for this partition.' };
    const dfc = computeDefc(v);
    return {
      ok: true,
      mu: sortedDesc(mu),
      compact: partToHlllStr(mu),
      v,
      area: computeArea(v),
      dinv: computeDinv(v),
      defc: dfc,
      L: v.length,
    };
  }

  global.HLLLVerification = {
    partitionToReducedDv,
    reducedDvToPartition,
    computeArea,
    computeDinv,
    computeDefc,
    nu1,
    isNu1Final,
    isNu1Initial,
    applyNu,
    applyNu2,
    nd1,
    buildV,
    a0,
    partitionsOf,
    computeTiFromParams,
    tiRdvToOriginalPartition,
    partToHlllStr,
    minLengthForDefc,
    enumerateDefcPartitions,
    allDistinctPartitionsOfDefc,
    collectNu1FinalDefc,
    buildFullChainInitials,
    findBackwardChain,
    flagpoleRowsForDefc,
    partitionLookup,
  };
})(typeof window !== 'undefined' ? window : globalThis);
