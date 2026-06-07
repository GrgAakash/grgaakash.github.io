/**
 * Core routines for partition ↔ reduced-Dyck-vector conversion, NU moves,
 * flagpole rows, deficit enumeration, and appendix chain comparison.
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

  function walkNu1ToFinal(initPart) {
    var cur = initPart;
    for (var i = 0; i < 200; i++) {
      if (isNu1Final(cur)) return cur;
      var nxt = nu1(cur);
      if (!nxt) return cur;
      cur = nxt;
    }
    return cur;
  }

  function walkNd1ToInitial(finalPart) {
    var cur = finalPart;
    for (var i = 0; i < 200; i++) {
      if (isNu1Initial(cur)) return cur;
      var prev = nd1(cur);
      if (!prev) return null;
      cur = prev;
    }
    return null;
  }

  function buildSegmentMapFromFinals(allNu1Final) {
    var segments = [];
    var seen = new Set();
    for (var fi = 0; fi < allNu1Final.length; fi++) {
      var F = allNu1Final[fi];
      var fRdv = partitionToReducedDv(F);
      if (!fRdv) continue;
      var fDinv = computeDinv(fRdv);
      var initial = walkNd1ToInitial(F);
      if (!initial) continue;
      var key = JSON.stringify(initial) + '|' + JSON.stringify(F);
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push({ initial: initial, final: F, finalDinv: fDinv });
    }
    return segments;
  }

  function findBackwardChain(ti2Part, allNu1Final, targetDefc) {
    var segments = buildSegmentMapFromFinals(allNu1Final);

    var backward = [];
    var currentInitial = ti2Part.slice();
    var maxBack = 50;
    var usedKeys = new Set();
    usedKeys.add(JSON.stringify(currentInitial));

    for (var step = 0; step < maxBack; step++) {
      var curRdv = partitionToReducedDv(currentInitial);
      var curDinv = computeDinv(curRdv);
      var targetFinalDinv = curDinv - 1;

      var found = null;
      for (var s = 0; s < segments.length; s++) {
        var seg = segments[s];
        if (seg.finalDinv !== targetFinalDinv) continue;
        var iKey = JSON.stringify(seg.initial);
        if (usedKeys.has(iKey)) continue;
        var iRdv = partitionToReducedDv(seg.initial);
        if (!iRdv || computeDefc(iRdv) !== targetDefc) continue;
        found = seg.initial;
        break;
      }
      if (!found) break;
      backward.push(found);
      usedKeys.add(JSON.stringify(found));
      currentInitial = found;
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

  // ── HLLL appendix data for k = 10 (all 42 global chains) ──────────────
  // Each key is the compact HLLL label for the chain‐labelling partition μ.
  // 'chain' lists the NU₁-initial partitions (compact strings),
  // 'a','m','h' are the amh-vectors from the appendix.
  var HLLL_DATA_K10 = {
    'A': { chain:['11111111111','2222221','333331','444431','5554321','6665431','77765321','888754321','9997654321','AA987654321'], a:[1,3,6,10,15,55], m:[0,0,2,2,0,0], h:[12,8,8,8,8,12] },
    '91': { chain:['2222211','33333','444331','5554311','6665331','77755321','887754321','AA987654311'], a:[2,5,9,14,54], m:[0,2,2,0,0], h:[8,8,8,8,12] },
    '55': { chain:['21111111111','3222221','433331','544431','6554321'], a:[2,4,7,11,16], m:[0,0,2,2,0], h:[12,8,8,8,8] },
    '82': { chain:['222111111','333221','444411','555332','6655421','888654311','9987654221'], a:[2,4,13,43], m:[0,0,1,0], h:[10,7,8,11] },
    '73': { chain:['2211111111','332222','443321','6665311','77754221','887653321'], a:[2,4,7,33], m:[0,1,0,0], h:[11,8,7,10] },
    '811': { chain:['3311111111','6511111','44433','5554211','6664331','77655321','AA987654211'], a:[4,6,8,13,53], m:[0,0,2,0,0], h:[11,8,8,8,12] },
    '6211': { chain:['31111111111','4222221','533331','6444211','6654411','9987644211'], a:[3,5,8,12,41], m:[0,0,2,0,0], h:[12,8,8,8,11] },
    '721': { chain:['4111111111','522222','6333111','6641111','554422','77664311','9987653311'], a:[3,5,8,10,12,42], m:[0,1,0,0,1,0], h:[11,8,8,8,8,11] },
    '7111': { chain:['441111111','55211111','6522211','5553211','6654331','AA987653211'], a:[5,7,9,12,52], m:[0,0,0,0,0], h:[10,9,8,8,12] },
    '42211': { chain:['32111111111','4322221','5532211','76642211','887544211'], a:[4,6,9,19,30], m:[0,0,0,0,0], h:[12,8,8,9,10] },
    '64': { chain:['6221111','4441111','552222','555222','6652221','6663321','77644321'], a:[4,6,8,11,14,24], m:[0,0,1,1,0,0], h:[8,8,8,8,8,9] },
    '3331': { chain:['22221111','3332111','442222','544222','6652111','6544311'], a:[2,4,6,9,12,14], m:[0,0,1,1,0,0], h:[9,8,8,8,8,8] },
    '631': { chain:['541111111','6422211','5553111','6633311','6655221','887644311'], a:[6,8,11,13,32], m:[0,0,0,0,0], h:[10,8,8,8,10] },
    '331111': { chain:['511111111','6222111','5322221','6433211','877643211'], a:[3,5,7,10,29], m:[0,0,0,0,0], h:[10,8,8,8,10] },
    '622': { chain:['3222211','443221','77754211','887653221'], a:[3,6,32], m:[0,0,0], h:[8,7,10] },
    '442': { chain:['322111111','433221','6554221'], a:[3,5,15], m:[0,0,0], h:[10,7,8] },
    '61111': { chain:['3322111','5511111','44333','5543211','AA987643211'], a:[3,5,7,11,51], m:[0,0,2,0,0], h:[8,8,8,8,12] },
    '433': { chain:['42111111111','4442111','543331','6554111','6643321'], a:[5,7,9,13,15], m:[0,0,2,0,0], h:[12,8,8,8,8] },
    '541': { chain:['332111111','64111111','5541111','553322','77653111','77554311'], a:[4,6,8,10,21,23], m:[0,0,0,1,0,0], h:[10,9,8,8,9,9] },
    '5311': { chain:['61111111','52221111','533222','5542211','77642211','887554211'], a:[3,5,7,10,20,31], m:[0,0,1,0,0,0], h:[9,9,8,8,9,10] },
    '532': { chain:['43221111','5333111','6631111','6444111','6642221','6663311','77644221'], a:[5,7,9,11,13,23], m:[0,0,0,0,0,0], h:[9,8,8,8,8,9] },
    '33211': { chain:['32221111','4332111','6521111','5443111','6632211','76644211'], a:[3,5,7,9,11,21], m:[0,0,0,0,0,0], h:[9,8,8,8,8,9] },
    '5221': { chain:['4222211','5422211','5552111','6533311','6655211','887643311'], a:[4,7,10,12,31], m:[0,0,0,0,0], h:[8,8,8,8,10] },
    '3322': { chain:['521111111','6322111','5422221','6532221','6553221'], a:[4,6,8,11,14], m:[0,0,0,0,0], h:[10,8,8,8,8] },
    '52111': { chain:['4221111111','44321111','65221111','55431111','75332111','76531111','75543111','77533211','9987553211'], a:[5,7,9,11,13,15,17,19,40], m:[0,0,0,0,0,0,0,0,0], h:[11,9,9,9,9,9,9,9,11] },
    '511111': { chain:['43111111111','63321111','65411111','64432111','76422111','66542111','76443211','AA987543211'], a:[6,8,10,12,14,16,18,50], m:[0,0,0,0,0,0,0,0], h:[12,9,9,9,9,9,9,12] },
    '4411': { chain:['33311111','43333','544331','76654211'], a:[4,6,10,22], m:[0,2,2,0], h:[9,8,8,9] },
    '4321': { chain:['433111111','642111111','55331111','75331111','75531111','75533111','77533111','77553111','77553311'], a:[6,8,10,12,14,16,18,20,22], m:[0,0,0,0,0,0,0,0,0], h:[10,10,9,9,9,9,9,9,9] },
    '322111': { chain:['62111111','63211111','54411111','64322111','66421111','65442111','76432211','877543111','886553211'], a:[4,6,8,10,12,14,16,27,29], m:[0,0,0,0,0,0,0,0,0], h:[9,9,9,9,9,9,9,10,10] },
    '43111': { chain:['63111111','63311111','64411111','64422111','66422111','66442111','76442211','887543111','886653211'], a:[5,7,9,11,13,15,17,28,30], m:[0,0,0,0,0,0,0,0,0], h:[9,9,9,9,9,9,9,10,10] },
    '32221': { chain:['522111111','443111111','54331111','75321111','65531111','75433111','77532111','76553111','77543311'], a:[5,7,9,11,13,15,17,19,21], m:[0,0,0,0,0,0,0,0,0], h:[10,10,9,9,9,9,9,9,9] },
    '4222': { chain:['42221111','5322211','5432221','6542221','6663211','77643221'], a:[4,6,9,12,22], m:[0,0,0,0,0], h:[9,8,8,8,9] },
    '421111': { chain:['43211111111','642211111','554211111','653321111','764311111','755421111','765332111','875431111','866532111','876443111','886542211','9986643211'], a:[7,9,11,13,15,17,19,21,23,25,27,39], m:[0,0,0,0,0,0,0,0,0,0,0,0], h:[12,10,10,10,10,10,10,10,10,10,10,11] },
    '411111': { chain:['5311111111','533211111','653111111','644311111','754221111','665321111','764431111','865422111','776432111','875542111','876533211','AA986543211'], a:[6,8,10,12,14,16,18,20,22,24,26,49], m:[0,0,0,0,0,0,0,0,0,0,0,0], h:[11,10,10,10,10,10,10,10,10,10,10,12] },
    '22222': { chain:['44221111','55221111','6432221','6543221'], a:[6,8,10,13], m:[0,0,0,0], h:[9,9,8,8] },
    '222211': { chain:['4322211','5432211','76642111','76544211'], a:[5,8,18,20], m:[0,0,0,0], h:[8,8,9,9] },
    '2221111': { chain:['5331111111','544211111','653221111','664311111','754421111','765322111','775431111','865532111','876433111','886542111','876643211'], a:[8,10,12,14,16,18,20,22,24,26,28], m:Array(11).fill(0), h:[11,10,10,10,10,10,10,10,10,10,10] },
    '2211111': { chain:['532211111','553111111','643311111','754211111','655321111','764331111','865421111','766432111','875442111','876532211','9886543211'], a:[7,9,11,13,15,17,19,21,23,25,37], m:Array(11).fill(0), h:[10,10,10,10,10,10,10,10,10,10,11] },
    '211111111': { chain:['54211111111','54321111111','65321111111','65431111111','75432111111','76532111111','76543111111','86543211111','87643211111','87654211111','87654321111','98654321111','98764321111','98765421111','98765432111','A9765432111','A9875432111','A9876532111','A9876543111','AA876543211'], a:[9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47], m:Array(20).fill(0), h:Array(20).fill(12) },
    '1111111111': { chain:['54311111111','64321111111','65421111111','65432111111','76432111111','76542111111','76543211111','87543211111','87653211111','87654311111','97654321111','98754321111','98765321111','98765431111','A8765432111','A9865432111','A9876432111','A9876542111','A9876543211'], a:[10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46], m:Array(19).fill(0), h:Array(19).fill(12) },
    '321111': { chain:['53211111111','6431111111','6442111111','6542211111','6643211111','7644211111','7654221111','7754321111','8755321111','8765331111','9765431111','9775432111','9875532111','9876533111','9976543111','9977543211'], a:[8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38], m:Array(16).fill(0), h:[12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11] },
    '31111111': { chain:['4421111111','5422111111','5532111111','6533111111','7543111111','7553211111','7653311111','8654311111','8664321111','8764421111','8765422111','8865432111','9866432111','9876442111','9876542211','AA976543211'], a:[7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,48], m:Array(16).fill(0), h:Array(15).fill(11).concat([12]) },
  };

  function parseHlllStr(s) {
    var parts = [];
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === '(') {
        var j = s.indexOf(')', i);
        parts.push(parseInt(s.substring(i + 1, j), 10));
        i = j;
      } else if (ch === 'A') parts.push(10);
      else if (ch === 'B') parts.push(11);
      else if (ch === 'C') parts.push(12);
      else parts.push(parseInt(ch, 10));
    }
    return sortedDesc(parts);
  }

  function countSameMindFrom(startMu) {
    var rdv = partitionToReducedDv(startMu);
    if (!rdv) return 1;
    var targetMind = rdv.length;
    var count = 1;
    var cur = startMu;
    for (var step = 0; step < 20; step++) {
      var r = applyNu(cur);
      if (!r.next) break;
      var nxtRdv = partitionToReducedDv(r.next);
      if (!nxtRdv || nxtRdv.length !== targetMind) break;
      count++;
      cur = r.next;
    }
    return count;
  }

  function checkChain(label, data, checkM) {
    var errors = [];
    var chainStrs = data.chain;
    var aVec = data.a;
    var mVec = data.m;
    var hVec = data.h;
    var chainParts = chainStrs.map(parseHlllStr);
    var Na = aVec.length;

    var partData = chainParts.map(function (p, i) {
      var rdv = partitionToReducedDv(p);
      return {
        part: p, rdv: rdv, str: chainStrs[i],
        dinv: computeDinv(rdv), area: computeArea(rdv),
        defc: computeDefc(rdv), mind: rdv.length,
        init: isNu1Initial(p),
      };
    });

    partData.forEach(function (pd, i) {
      if (pd.defc !== 10)
        errors.push('Element ' + i + ' ' + pd.str + ': defc=' + pd.defc + ' != 10');
    });

    var amhIndices = aVec.map(function (ai) {
      var matches = [];
      partData.forEach(function (pd, j) { if (pd.dinv === ai) matches.push(j); });
      if (matches.length === 0) { errors.push('No element with dinv=' + ai); return null; }
      return matches[0];
    });

    for (var k = 0; k < Na; k++) {
      var idx = amhIndices[k];
      if (idx === null) continue;
      var pd = partData[idx];
      if (pd.dinv !== aVec[k])
        errors.push('amh[' + k + ']: dinv=' + pd.dinv + ' != a=' + aVec[k]);
      if (pd.mind !== hVec[k])
        errors.push('amh[' + k + '] (' + pd.str + '): mind=' + pd.mind + ' != h=' + hVec[k]);
      if (!pd.init)
        errors.push('amh[' + k + '] (' + pd.str + '): NOT NU1-initial');
      if (checkM) {
        var sameMind = countSameMindFrom(pd.part);
        var computedM = sameMind - 1;
        if (computedM !== mVec[k])
          errors.push('amh[' + k + '] (' + pd.str + '): computed m=' + computedM + ' != m=' + mVec[k]);
      }
    }

    return { ok: errors.length === 0, errors: errors, partData: partData };
  }

  function checkAllChainsK10(checkM) {
    var results = [];
    var labels = Object.keys(HLLL_DATA_K10);
    labels.sort(function (a, b) {
      var pa = parseHlllStr(a), pb = parseHlllStr(b);
      var sa = pa.reduce(function (s, x) { return s + x; }, 0);
      var sb = pb.reduce(function (s, x) { return s + x; }, 0);
      if (sb !== sa) return sb - sa;
      return pb.length - pa.length;
    });
    labels.forEach(function (label) {
      var r = checkChain(label, HLLL_DATA_K10[label], !!checkM);
      results.push({ label: label, ok: r.ok, errors: r.errors, partData: r.partData, data: HLLL_DATA_K10[label] });
    });
    return results;
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
    walkNu1ToFinal,
    walkNd1ToInitial,
    buildSegmentMapFromFinals,
    findBackwardChain,
    flagpoleRowsForDefc,
    partitionLookup,
    HLLL_DATA_K10,
    parseHlllStr,
    countSameMindFrom,
    checkChain,
    checkAllChainsK10,
  };
})(typeof window !== 'undefined' ? window : globalThis);
