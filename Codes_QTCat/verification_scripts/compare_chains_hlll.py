"""
Build FULL chains C_mu for all flagpole partitions with defc=10,
and compare with HLLL appendix data (app10_11.pdf).

Strategy:
1. Enumerate ALL defc=10 partitions across grid sizes L=5..13
2. Build directed graph via NU map
3. Extract complete chains
4. Match chains to flagpole partitions (via TI_2 membership)
5. Output in HLLL format for comparison
"""

# ============================================================
# Core functions (from flagpole_defc10.py)
# ============================================================

def partition_to_reduced_dv(mu):
    if not mu:
        return (0,)
    mu = sorted(mu, reverse=True)
    ell = len(mu)
    for n in range(ell + 1, ell + mu[0] + 10):
        mu_pad = list(mu) + [0] * (n - ell)
        v = tuple(i - mu_pad[n - 1 - i] for i in range(n))
        if all(x >= 0 for x in v) and v[0] == 0:
            return v
    return None

def reduced_dv_to_partition(v):
    n = len(v)
    parts = [(n - 1 - j) - v[n - 1 - j] for j in range(n)]
    parts = sorted([p for p in parts if p > 0], reverse=True)
    return tuple(parts)

def compute_area(v):
    return sum(v)

def compute_dinv(v):
    n = len(v)
    return sum(1 for i in range(n) for j in range(i+1, n) if v[i] - v[j] in (0, 1))

def compute_defc(v):
    n = len(v)
    return n*(n-1)//2 - compute_area(v) - compute_dinv(v)

# ============================================================
# NU map
# ============================================================

def nu1(mu):
    if not mu:
        return None
    mu = list(mu)
    ell = len(mu)
    if mu[0] > ell + 2:
        return None
    new_parts = [ell + 1] + [p - 1 for p in mu]
    new_parts = sorted([p for p in new_parts if p > 0], reverse=True)
    return tuple(new_parts)

def is_nu1_final(mu):
    if not mu:
        return False
    return mu[0] > len(mu) + 2

def get_neg1_representative(reduced_dv):
    v = list(reduced_dv)
    while v[-1] != -1:
        if len(v) <= 1:
            return None
        w = [x - 1 for x in v[1:]]
        if w[0] != 0:
            return None
        v = w
    return v

def apply_nu2_on_qdv(qdv):
    v = list(qdv)
    n = len(v)
    if n < 3 or v[0] != 0 or v[1] != 1:
        return None

    num_twos = 0
    idx = 2
    while idx < n and v[idx] == 2:
        num_twos += 1
        idx += 1

    num_neg1 = 0
    idx2 = n - 1
    while idx2 >= 0 and v[idx2] == -1:
        num_neg1 += 1
        idx2 -= 1

    if num_neg1 == 0:
        return None

    k = num_neg1
    if num_twos == k and k >= 1:
        B = v[2 + k : n - k]
        valid = True
        if B:
            if B[0] > 1:
                valid = False
            if B[-1] < -1:
                valid = False
        if valid:
            return [0]*(k+1) + B + [0] + [1]*k

    h = num_neg1 + 1
    if h >= 2 and num_twos >= h:
        A = v[2 + h : n - (h - 1)]
        valid = True
        if A:
            if A[-1] < 0:
                valid = False
            if any(a > 2 for a in A):
                valid = False
        if valid:
            return [0]*h + [1] + A + [1]*h

    return None

def qdv_to_reduced(qdv):
    v = list(qdv)
    while min(v) < 0:
        v = [0] + [x + 1 for x in v]
    while len(v) > 1:
        w = [x - 1 for x in v[1:]]
        if len(w) > 0 and w[0] == 0 and all(x >= 0 for x in w):
            v = w
        else:
            break
    return tuple(v)

def apply_nu2(mu):
    rdv = partition_to_reduced_dv(mu)
    qdv = get_neg1_representative(rdv)
    if qdv is None:
        return None
    output_qdv = apply_nu2_on_qdv(qdv)
    if output_qdv is None:
        return None
    output_rdv = qdv_to_reduced(output_qdv)
    return reduced_dv_to_partition(output_rdv)

def apply_nu(mu):
    result = nu1(mu)
    if result is not None:
        return result
    if is_nu1_final(mu):
        result = apply_nu2(mu)
        if result is not None:
            return result
    return None

# ============================================================
# Enumerate all defc=10 Dyck vectors for grid size L
# ============================================================

def enumerate_defc_partitions(L, target_defc):
    """Enumerate all reduced Dyck vectors of length L with given defc."""
    target_ad = L * (L - 1) // 2 - target_defc  # area + dinv must equal this
    results = []

    def backtrack(i, v, area, dinv):
        remaining = L - i
        # Minimum additional area+dinv: if all remaining v[j] = 0
        # then area stays same, dinv increases by pairs (j, k) with v[j]-0 in {0,1}
        # This is hard to bound tightly, so we just bound area
        if area > target_ad:
            return
        # Max possible additional area: each v[j] ≤ j (since v[0]=0, v[i]≤v[i-1]+1≤i)
        max_add_area = sum(range(i, L)) if i < L else 0
        max_add_dinv = remaining * (remaining - 1) // 2 + remaining * i
        if area + dinv + max_add_area + max_add_dinv < target_ad:
            return

        if i == L:
            if area + dinv == target_ad:
                results.append(tuple(v))
            return

        min_val = 0
        max_val = v[i-1] + 1 if i > 0 else 0

        for val in range(min_val, max_val + 1):
            new_dinv = sum(1 for j in range(i) if v[j] - val in (0, 1))
            v.append(val)
            backtrack(i + 1, v, area + val, dinv + new_dinv)
            v.pop()

    backtrack(0, [], 0, 0)
    return results

# ============================================================
# TI_2 construction
# ============================================================

def build_v(lam, a, eps):
    if not lam:
        r = 0
        mults = []
    else:
        r = max(lam)
        mults = [0] * r
        for p in lam:
            mults[p - 1] += 1

    B_plus = []
    for i in range(r):
        B_plus.append(1)
        B_plus.extend([2] * mults[i])

    if eps == 0:
        v = [0, 0, 1] + [2]*a + B_plus
    else:
        v = [0, 0, 1] + [2]*(a-1) + B_plus + [1]

    return tuple(v)

def a0(lam):
    if not lam:
        return 3
    return sum(lam) - max(lam) - len(lam) + 3

def partitions_of(n, max_part=None):
    if max_part is None:
        max_part = n
    if n == 0:
        yield ()
        return
    for first in range(min(n, max_part), 0, -1):
        for rest in partitions_of(n - first, first):
            yield (first,) + rest

def ti_rdv_to_original_partition(rdv):
    v = list(rdv)
    assert v[0] == 0
    B = v[1:]
    multiplicities = []
    i = 0
    while i < len(B):
        assert B[i] == 0
        i += 1
        count = 0
        while i < len(B) and B[i] == 1:
            count += 1
            i += 1
        multiplicities.append(count)
    parts = []
    for j, nj in enumerate(multiplicities):
        parts.extend([j + 1] * nj)
    return tuple(sorted(parts, reverse=True))

def compute_ti_from_params(lam, a, eps):
    if not lam:
        r = 0
        n = []
    else:
        r = max(lam)
        n = [0] * r
        for p in lam:
            n[p - 1] += 1
    n0 = a - eps
    C = [1] * eps
    all_n = [n0] + n
    p_r1 = sum(1 for x in all_n if x % 2 == 0)
    result = [0, 0] + [1]*p_r1 + C
    for i in range(len(all_n)):
        ni = all_n[i]
        if i < len(all_n) - 1:
            result.extend([1] * (2 * (ni // 2)))
            result.append(0)
            result.extend([1] * (ni % 2))
        else:
            result.extend([1] * (2 * (ni // 2)))
            if ni % 2 == 1:
                result.extend([0, 1])
    return tuple(result)

# ============================================================
# HLLL appendix data for our 14 flagpole partitions (k=10)
# Manually extracted from app10_11.pdf pages 1-3
# Format: chain label -> list of partition strings
# ============================================================

HLLL_CHAINS = {
    # #12: mu = (4,3,2,1)
    (4,3,2,1): {
        'chain': ['433111111','642111111','55331111','75331111','75531111',
                   '75533111','77533111','77553111','77553311'],
        'a': [6,8,10,12,14,16,18,20,22],
        'm': [0,0,0,0,0,0,0,0,0],
        'h': [10,10,9,9,9,9,9,9,9],
    },
    # #11: mu = (4,3,1,1,1)
    (4,3,1,1,1): {
        'chain': ['63111111','63311111','64411111','64422111','66422111',
                   '66442111','76442211','887543111','886653211'],
        'a': [5,7,9,11,13,15,17,28,30],
        'm': [0,0,0,0,0,0,0,0,0],
        'h': [9,9,9,9,9,9,9,10,10],
    },
    # #14: mu = (3,2,2,2,1)
    (3,2,2,2,1): {
        'chain': ['52211111','54311111','54331111','65431111','75321111',
                   '75433111','77532111','77543311'],
        'a': [4,6,9,11,14,16,27,29],
        'm': [0,0,0,0,0,0,0,0],
        'h': [9,9,9,9,9,9,10,10],
    },
    # #13: mu = (3,2,2,1,1,1)
    (3,2,2,1,1,1): {
        'chain': ['62111111','63211111','54411111','64322111','66421111',
                   '65442111','66421111','877543111','886553211'],
        'a': [4,6,8,10,12,14,16,27,29],
        'm': [0,0,0,0,0,0,0,0,0],
        'h': [9,9,9,9,9,9,9,10,10],
    },
    # #10: mu = (5,2,1,1,1)
    (5,2,1,1,1): {
        'chain': ['4221111111','44321111','65221111','55431111','75332111',
                   '75543111','77533211','9987553211'],
        'a': [5,7,9,11,13,15,17,19,40],
        'm': [0,0,0,0,0,0,0,0,0],
        'h': [11,9,9,9,9,9,9,9,11],
    },
    # #9: mu = (5,1,1,1,1,1)
    (5,1,1,1,1,1): {
        'chain': ['43111111111','63211111','65411111','64432111','76422111',
                   '76442211','76443211','AA987543211'],
        'a': [6,8,10,12,14,16,18,50],
        'm': [0,0,0,0,0,0,0,0],
        'h': [12,9,9,9,9,9,9,12],
    },
}

# ============================================================
# Main: enumerate, build chains, compare
# ============================================================

def part_to_hlll_str(mu):
    """Convert partition to HLLL string notation. A=10, B=11."""
    chars = []
    for p in sorted(mu, reverse=True):
        if p < 10:
            chars.append(str(p))
        elif p == 10:
            chars.append('A')
        elif p == 11:
            chars.append('B')
        elif p == 12:
            chars.append('C')
        else:
            chars.append(f'({p})')
    return ''.join(chars)

def hlll_str_to_part(s):
    """Convert HLLL string to partition tuple."""
    parts = []
    for c in s:
        if c == 'A':
            parts.append(10)
        elif c == 'B':
            parts.append(11)
        elif c == 'C':
            parts.append(12)
        else:
            parts.append(int(c))
    return tuple(sorted(parts, reverse=True))

def main():
    # Step 1: Enumerate all defc=10 partitions
    print("=" * 80)
    print("ENUMERATING ALL DEFC=10 PARTITIONS")
    print("=" * 80)

    all_partitions = {}  # partition -> (rdv, L, dinv, area)

    for L in range(5, 14):
        dvs = enumerate_defc_partitions(L, 10)
        count = 0
        for v in dvs:
            part = reduced_dv_to_partition(v)
            # Check it's truly reduced (not liftable further)
            if len(v) == L:
                dinv = compute_dinv(v)
                area = compute_area(v)
                if part not in all_partitions or L < all_partitions[part][1]:
                    all_partitions[part] = (v, L, dinv, area)
                count += 1
        print(f"  L={L:2d}: found {count} Dyck vectors, {len(dvs)} total")

    print(f"\nTotal unique defc=10 partitions: {len(all_partitions)}")

    # Step 2: Build NU graph
    print("\n" + "=" * 80)
    print("BUILDING NU GRAPH")
    print("=" * 80)

    nu_map = {}  # partition -> next partition
    predecessors = {}  # partition -> set of predecessors

    for part in all_partitions:
        nxt = apply_nu(part)
        if nxt is not None and nxt in all_partitions:
            nu_map[part] = nxt
            if nxt not in predecessors:
                predecessors[nxt] = set()
            predecessors[nxt].add(part)

    # Find chain starts (no predecessor in our set)
    chain_starts = [p for p in all_partitions if p not in predecessors]
    print(f"Chain starts (no predecessor): {len(chain_starts)}")

    # Step 3: Build complete chains
    chains = []
    visited = set()
    for start in sorted(chain_starts, key=lambda p: all_partitions[p][2]):  # sort by dinv
        if start in visited:
            continue
        chain = [start]
        visited.add(start)
        current = start
        while current in nu_map:
            current = nu_map[current]
            if current in visited:
                break
            chain.append(current)
            visited.add(current)
        chains.append(chain)

    print(f"Total chains: {len(chains)}")

    # Step 4: Get our 14 flagpole partitions
    print("\n" + "=" * 80)
    print("FLAGPOLE PARTITIONS AND THEIR CHAINS")
    print("=" * 80)

    flagpole_data = []
    for lam_size in range(0, 11):
        for lam in partitions_of(lam_size):
            lam1 = max(lam) if lam else 0
            ell_lam = len(lam) if lam else 0
            for eps in [0, 1]:
                a = 9 - lam1 - ell_lam - lam_size
                if a < max(2, a0(lam)):
                    continue
                v = build_v(lam, a, eps)
                if compute_defc(v) != 10:
                    continue
                ti2_part = reduced_dv_to_partition(v)
                ti_rdv = compute_ti_from_params(lam, a, eps)
                mu = ti_rdv_to_original_partition(ti_rdv)
                flagpole_data.append({
                    'lambda': lam, 'a': a, 'eps': eps,
                    'ti2': ti2_part, 'mu': mu,
                    'v': v, 'L': len(v),
                    'dinv_ti2': compute_dinv(v),
                    'area_ti2': compute_area(v),
                })

    # Match each flagpole to a chain
    part_to_chain = {}
    for ci, chain in enumerate(chains):
        for p in chain:
            part_to_chain[p] = ci

    for idx, fd in enumerate(flagpole_data):
        mu = fd['mu']
        ti2 = fd['ti2']
        lam, a, eps = fd['lambda'], fd['a'], fd['eps']

        print(f"\n{'━' * 75}")
        print(f"#{idx+1}:  mu = {mu},  lambda = {lam if lam else '()'},  a = {a},  eps = {eps}")
        print(f"  TI_2 = {ti2}  [{part_to_hlll_str(ti2)}]")
        print(f"  dinv(TI_2) = {fd['dinv_ti2']},  area(TI_2) = {fd['area_ti2']},  L = {fd['L']}")

        # Find which chain contains TI_2
        if ti2 not in part_to_chain:
            print(f"  *** TI_2 NOT FOUND in any chain! ***")
            continue

        ci = part_to_chain[ti2]
        chain = chains[ci]
        ti2_pos = chain.index(ti2)

        print(f"\n  FULL CHAIN C_{part_to_hlll_str(mu)} ({len(chain)} elements, TI_2 at pos {ti2_pos}):")
        print(f"  {'pos':>4s}  {'partition (HLLL)':30s}  {'dinv':>5s}  {'area':>5s}  {'h':>3s}  notes")
        print(f"  {'─'*4}  {'─'*30}  {'─'*5}  {'─'*5}  {'─'*3}  {'─'*20}")

        for i, p in enumerate(chain):
            rdv, L, dinv, area = all_partitions[p]
            hlll_str = part_to_hlll_str(p)
            notes = []
            if p == ti2:
                notes.append("← TI_2")
            # Check if this is TI(mu) by checking rdv pattern 0 B_mu
            ti_rdv = compute_ti_from_params(lam, a, eps)
            ti_part = reduced_dv_to_partition(ti_rdv)
            if p == ti_part:
                notes.append("← TI(mu)")
            note_str = '  '.join(notes)
            print(f"  {i:4d}  {hlll_str:30s}  {dinv:5d}  {area:5d}  {L:3d}  {note_str}")

        # Output in HLLL format
        a_vals = [all_partitions[p][2] for p in chain]  # dinv values
        h_vals = [all_partitions[p][1] for p in chain]  # L values
        chain_strs = [part_to_hlll_str(p) for p in chain]

        print(f"\n  HLLL format:")
        print(f"  C_({part_to_hlll_str(mu)}): {', '.join(chain_strs)}.")
        print(f"  a = {tuple(a_vals)}")
        print(f"  h = {tuple(h_vals)}")

        # Compare with HLLL data if available
        if mu in HLLL_CHAINS:
            hlll = HLLL_CHAINS[mu]
            print(f"\n  HLLL APPENDIX DATA:")
            print(f"  C_({part_to_hlll_str(mu)}): {', '.join(hlll['chain'])}.")
            print(f"  a = {tuple(hlll['a'])}")
            print(f"  h = {tuple(hlll['h'])}")

            # Compare
            our_strs = chain_strs
            their_strs = hlll['chain']
            if our_strs == their_strs:
                print(f"  ✓ CHAINS MATCH EXACTLY")
            else:
                print(f"  ✗ CHAINS DIFFER!")
                print(f"    Ours:   {our_strs}")
                print(f"    Theirs: {their_strs}")
                # Check element by element
                for j in range(max(len(our_strs), len(their_strs))):
                    o = our_strs[j] if j < len(our_strs) else "---"
                    t = their_strs[j] if j < len(their_strs) else "---"
                    match = "✓" if o == t else "✗"
                    print(f"      [{j}] {match}  ours={o}  theirs={t}")

            if tuple(a_vals) == tuple(hlll['a']):
                print(f"  ✓ DINV VALUES MATCH")
            else:
                print(f"  ✗ DINV VALUES DIFFER: ours={a_vals} theirs={hlll['a']}")

    # Step 5: Summary
    print(f"\n\n{'=' * 80}")
    print("SUMMARY: ALL 14 FLAGPOLE CHAINS")
    print(f"{'=' * 80}")
    print(f"{'#':>3s}  {'mu':>25s}  {'lam':>10s}  {'a':>3s}  {'e':>1s}  "
          f"{'chain_len':>9s}  {'ti2_pos':>7s}  {'HLLL notation'}")
    print("-" * 110)

    for idx, fd in enumerate(flagpole_data):
        mu = fd['mu']
        ti2 = fd['ti2']
        if ti2 in part_to_chain:
            ci = part_to_chain[ti2]
            chain = chains[ci]
            ti2_pos = chain.index(ti2)
            chain_len = len(chain)
        else:
            chain_len = -1
            ti2_pos = -1

        lam_str = str(fd['lambda']) if fd['lambda'] else "()"
        print(f"{idx+1:3d}  {str(mu):>25s}  {lam_str:>10s}  {fd['a']:3d}  {fd['eps']:1d}  "
              f"{chain_len:9d}  {ti2_pos:7d}  C_({part_to_hlll_str(mu)})")

if __name__ == "__main__":
    main()
