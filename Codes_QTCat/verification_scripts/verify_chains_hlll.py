"""
Build FULL global chains C_mu for all flagpole partitions (defc=10).
Compare with HLLL appendix (app10_11.pdf).

The HLLL global chain lists NU1-INITIAL objects only.
Between consecutive initials: I_k -> NU1 -> F_k -> NU2 -> I_{k+1}.

Strategy:
- From TI_2 forward: alternate NU1/NU2 and collect initial elements (TAIL)
- From TI_2 backward: find F s.t. NU2(F)=TI_2, then I s.t. NU1(I)=F (HEAD)
- Combine and compare with HLLL

CLI:
  python verify_chains_hlll.py
  python verify_chains_hlll.py --enumerate-defc 10
  python verify_chains_hlll.py --partition 5,3,1,1
"""

import argparse

# === Core functions ===

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

def compute_area(v): return sum(v)
def compute_dinv(v):
    n = len(v)
    return sum(1 for i in range(n) for j in range(i+1, n) if v[i] - v[j] in (0, 1))
def compute_defc(v):
    n = len(v)
    return n*(n-1)//2 - compute_area(v) - compute_dinv(v)

def nu1(mu):
    if not mu: return None
    mu = list(mu)
    ell = len(mu)
    if mu[0] > ell + 2: return None
    new_parts = [ell + 1] + [p - 1 for p in mu]
    new_parts = sorted([p for p in new_parts if p > 0], reverse=True)
    return tuple(new_parts)

def is_nu1_final(mu):
    if not mu: return False
    return mu[0] > len(mu) + 2

def is_nu1_initial(mu):
    if not mu: return True
    return mu[0] < len(mu)

def get_neg1_representative(reduced_dv):
    v = list(reduced_dv)
    while v[-1] != -1:
        if len(v) <= 1: return None
        w = [x - 1 for x in v[1:]]
        if w[0] != 0: return None
        v = w
    return v

def apply_nu2_on_qdv(qdv):
    v = list(qdv)
    n = len(v)
    if n < 3 or v[0] != 0 or v[1] != 1: return None
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
    if num_neg1 == 0: return None
    k = num_neg1
    if num_twos == k and k >= 1:
        B = v[2 + k : n - k]
        valid = True
        if B:
            if B[0] > 1: valid = False
            if B[-1] < -1: valid = False
        if valid:
            return [0]*(k+1) + B + [0] + [1]*k
    h = num_neg1 + 1
    if h >= 2 and num_twos >= h:
        A = v[2 + h : n - (h - 1)]
        valid = True
        if A:
            if A[-1] < 0: valid = False
            if any(a > 2 for a in A): valid = False
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
    if qdv is None: return None
    output_qdv = apply_nu2_on_qdv(qdv)
    if output_qdv is None: return None
    output_rdv = qdv_to_reduced(output_qdv)
    return reduced_dv_to_partition(output_rdv)

def apply_nu(mu):
    result = nu1(mu)
    if result is not None: return result, "NU1"
    if is_nu1_final(mu):
        result = apply_nu2(mu)
        if result is not None: return result, "NU2"
    return None, None

# === ND1: inverse of NU1 on partitions ===

def nd1(F):
    """Given NU1-final partition F, find I such that NU1(I) = F."""
    F = sorted(list(F), reverse=True)
    m = len(F)
    num_trailing_ones = F[0] - m
    if num_trailing_ones < 0:
        return None
    mu_parts = [p + 1 for p in F[1:]] + [1] * num_trailing_ones
    mu_parts = sorted([p for p in mu_parts if p > 0], reverse=True)
    if not mu_parts:
        return None
    mu = tuple(mu_parts)
    # Verify
    check = nu1(mu)
    if check is not None and tuple(sorted(check, reverse=True)) == tuple(F):
        return mu
    return None

# === Enumerate all defc=10 partitions ===

def enumerate_defc_partitions(L, target_defc):
    target_ad = L * (L - 1) // 2 - target_defc
    results = []
    def backtrack(i, v, area, dinv):
        if area > target_ad: return
        remaining = L - i
        max_add_area = sum(range(i, L)) if i < L else 0
        max_add_dinv = remaining * (remaining - 1) // 2 + remaining * i
        if area + dinv + max_add_area + max_add_dinv < target_ad: return
        if i == L:
            if area + dinv == target_ad:
                results.append(tuple(v))
            return
        max_val = v[i-1] + 1 if i > 0 else 0
        for val in range(0, max_val + 1):
            new_dinv = sum(1 for j in range(i) if v[j] - val in (0, 1))
            v.append(val)
            backtrack(i + 1, v, area + val, dinv + new_dinv)
            v.pop()
    backtrack(0, [], 0, 0)
    return results

# === TI_2 construction ===

def build_v(lam, a, eps):
    if not lam: r, mults = 0, []
    else:
        r = max(lam)
        mults = [0] * r
        for p in lam: mults[p-1] += 1
    B_plus = []
    for i in range(r):
        B_plus.append(1)
        B_plus.extend([2] * mults[i])
    if eps == 0:
        v = [0,0,1] + [2]*a + B_plus
    else:
        v = [0,0,1] + [2]*(a-1) + B_plus + [1]
    return tuple(v)

def a0(lam):
    if not lam: return 3
    return sum(lam) - max(lam) - len(lam) + 3

def partitions_of(n, max_part=None):
    if max_part is None: max_part = n
    if n == 0:
        yield ()
        return
    for first in range(min(n, max_part), 0, -1):
        for rest in partitions_of(n - first, first):
            yield (first,) + rest

def compute_ti_from_params(lam, a, eps):
    if not lam: r, n = 0, []
    else:
        r = max(lam)
        n = [0] * r
        for p in lam: n[p-1] += 1
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

def ti_rdv_to_original_partition(rdv):
    """Recover mu from reduced DV 0 B_mu (leading 0, then B_mu pattern)."""
    v = list(rdv)
    assert v[0] == 0, f"Expected leading 0, got {v}"
    B = v[1:]
    multiplicities = []
    i = 0
    while i < len(B):
        assert B[i] == 0, f"Expected 0 at B[{i}] in B={B}"
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

def part_to_hlll_str(mu):
    chars = []
    for p in sorted(mu, reverse=True):
        if p < 10: chars.append(str(p))
        elif p == 10: chars.append('A')
        elif p == 11: chars.append('B')
        elif p == 12: chars.append('C')
        else: chars.append(f'({p})')
    return ''.join(chars)

# === Build full chain by going forward AND backward from TI_2 ===

def build_full_chain_initials(ti2_part):
    """Build complete list of NU1-initial elements in the chain,
    by going forward from TI_2 and backward."""

    # FORWARD: from TI_2, alternate NU1/NU2, collect initials
    forward_initials = []
    current = ti2_part
    max_steps = 200

    for step in range(max_steps):
        if is_nu1_initial(current):
            rdv = partition_to_reduced_dv(current)
            forward_initials.append(current)

            # Check if TI(mu): no 2's in rdv and is initial
            if not any(x >= 2 for x in rdv) and step > 0:
                break  # reached TI(mu)

        nxt, stype = apply_nu(current)
        if nxt is None:
            break
        current = nxt

    return forward_initials

def find_backward_chain(ti2_part, all_nu1_final_partitions, target_defc=10):
    """Find initial elements BEFORE TI_2 by searching ND2 pre-images."""
    backward_initials = []
    current_initial = ti2_part
    max_back_steps = 50

    for step in range(max_back_steps):
        # Find F such that NU2(F) = current_initial
        found_F = None
        for F in all_nu1_final_partitions:
            result = apply_nu2(F)
            if result == current_initial:
                found_F = F
                break

        if found_F is None:
            break  # no predecessor; current_initial is the chain start

        # Find I such that NU1(I) = F
        I = nd1(found_F)
        if I is None:
            break

        # Verify I is NU1-initial
        if not is_nu1_initial(I):
            break

        # Verify defc
        rdv_I = partition_to_reduced_dv(I)
        if compute_defc(rdv_I) != target_defc:
            break

        backward_initials.append(I)
        current_initial = I

    backward_initials.reverse()
    return backward_initials


def min_length_for_defc(k):
    """Smallest L with L(L-1)/2 >= k (room for deficit k)."""
    L = 1
    while L * (L - 1) // 2 < k:
        L += 1
    return L


def all_distinct_partitions_of_defc(k, l_min=None, l_max=None):
    """
    All distinct partitions that arise as reduced_dv_to_partition(v) for some
    length-L reduced Dyck vector v with compute_defc(v) == k.
    """
    if l_min is None:
        l_min = min_length_for_defc(k)
    if l_max is None:
        l_max = max(l_min + 8, 14)
    seen = set()
    for L in range(l_min, l_max + 1):
        if L * (L - 1) // 2 < k:
            continue
        for v in enumerate_defc_partitions(L, k):
            seen.add(reduced_dv_to_partition(v))
    return sorted(seen, key=lambda p: (-sum(p), -len(p), p))


def print_partition_lookup(mu):
    """Stats for one partition; explains relation to defc-k chains."""
    mu = tuple(sorted(mu, reverse=True))
    v = partition_to_reduced_dv(mu)
    if v is None:
        print(f"No valid reduced Dyck vector for mu = {mu}")
        return
    dfc = compute_defc(v)
    print(f"mu = {mu}   compact: {part_to_hlll_str(mu)}")
    print(f"  reduced Dyck vector (length {len(v)}): {list(v)}")
    print(f"  area = {compute_area(v)}, dinv = {compute_dinv(v)}, defc = {dfc}")
    print()
    print("  In the HLLL appendix, C(<compact>) names a global chain for a *fixed*")
    print("  deficit k (e.g. k=10 in app10_11.pdf). The listed tuples are NU1-initial")
    print("  partitions in that chain — each has defc = k, not necessarily the same")
    print("  as defc(mu) for the label mu.")
    if dfc != 10:
        print()
        print("  To list every partition with defc = 10 (appendix k=10), run:")
        print("    python verify_chains_hlll.py --enumerate-defc 10")


def run_enumerate_defc(k, l_min, l_max, limit=None):
    parts = all_distinct_partitions_of_defc(k, l_min, l_max)
    total = len(parts)
    print(f"Distinct partitions with defc = {k} (L in [{l_min}, {l_max}]): {total}")
    if limit is not None and limit > 0 and total > limit:
        print(f"(showing first {limit} of {total}; omit --limit for all)")
        parts = parts[:limit]
    for i, p in enumerate(parts):
        v = partition_to_reduced_dv(p)
        print(f"  {i+1:5d}  {str(p):30s}  {part_to_hlll_str(p):20s}  L={len(v):2d}  "
              f"dinv={compute_dinv(v):4d}  area={compute_area(v):4d}")


def main_verify(defc=10):
    print("=" * 80)
    print(f"STEP 1: Enumerate all defc={defc} NU1-final partitions")
    print("=" * 80)

    all_nu1_final = []
    for L in range(5, 14):
        dvs = enumerate_defc_partitions(L, defc)
        for v in dvs:
            part = reduced_dv_to_partition(v)
            if is_nu1_final(part):
                if part not in all_nu1_final:
                    all_nu1_final.append(part)
        print(f"  L={L:2d}: cumulative NU1-final count = {len(all_nu1_final)}")

    print(f"\nTotal NU1-final defc={defc} partitions: {len(all_nu1_final)}")

    # Step 2: Get flagpole data
    print("\n" + "=" * 80)
    print("STEP 2: Compute flagpole partitions")
    print("=" * 80)

    flagpole_data = []
    for lam_size in range(0, defc + 1):
        for lam in partitions_of(lam_size):
            lam1 = max(lam) if lam else 0
            ell_lam = len(lam) if lam else 0
            for eps in [0, 1]:
                a = (defc - 1) - lam1 - ell_lam - lam_size
                if a < max(2, a0(lam)):
                    continue
                v = build_v(lam, a, eps)
                if compute_defc(v) != defc:
                    continue
                ti2_part = reduced_dv_to_partition(v)
                ti_rdv = compute_ti_from_params(lam, a, eps)
                mu = ti_rdv_to_original_partition(ti_rdv)
                flagpole_data.append({
                    'lambda': lam, 'a': a, 'eps': eps,
                    'ti2': ti2_part, 'mu': mu, 'v': v, 'L': len(v),
                    'dinv_ti2': compute_dinv(v), 'area_ti2': compute_area(v),
                })

    print(f"Found {len(flagpole_data)} flagpole partitions\n")

    # Step 3: Build full chains
    print("=" * 80)
    print("STEP 3: Build full global chains and compare with HLLL")
    print("=" * 80)

    for idx, fd in enumerate(flagpole_data):
        mu = fd['mu']
        ti2 = fd['ti2']
        lam, a, eps = fd['lambda'], fd['a'], fd['eps']
        ti_rdv = compute_ti_from_params(lam, a, eps)
        ti_part = reduced_dv_to_partition(ti_rdv)

        print(f"\n{'━' * 75}")
        print(f"#{idx+1}: mu = {mu}")
        print(f"  lambda = {lam if lam else '()'},  a = {a},  eps = {eps}")
        print(f"  TI_2 = {ti2}  [{part_to_hlll_str(ti2)}]")
        print(f"  TI   = {ti_part}  [{part_to_hlll_str(ti_part)}]")

        # Build forward chain (initials only)
        forward = build_full_chain_initials(ti2)

        # Build backward chain
        backward = find_backward_chain(ti2, all_nu1_final, target_defc=defc)

        # Full chain = backward + forward
        full_chain = backward + forward

        # Find TI_2 and TI positions
        ti2_pos = len(backward)  # TI_2 is first in forward
        ti_pos = -1
        for i, p in enumerate(full_chain):
            if p == ti_part:
                ti_pos = i

        print(f"\n  FULL GLOBAL CHAIN C_({part_to_hlll_str(mu)}) "
              f"[{len(full_chain)} initials, TI_2 at pos {ti2_pos}]:")
        print(f"  {'pos':>4s}  {'HLLL':25s}  {'dinv':>5s}  {'area':>5s}  {'L':>3s}  notes")
        print(f"  {'─'*4}  {'─'*25}  {'─'*5}  {'─'*5}  {'─'*3}  {'─'*15}")

        a_vals = []
        h_vals = []
        for i, p in enumerate(full_chain):
            rdv = partition_to_reduced_dv(p)
            dinv = compute_dinv(rdv)
            area = compute_area(rdv)
            L = len(rdv)
            hlll_str = part_to_hlll_str(p)
            a_vals.append(dinv)
            h_vals.append(L)

            notes = []
            if p == ti2:
                notes.append("TI_2")
            if p == ti_part:
                notes.append("TI")
            note_str = '  '.join(notes)
            print(f"  {i:4d}  {hlll_str:25s}  {dinv:5d}  {area:5d}  {L:3d}  {note_str}")

        print(f"\n  HLLL format:")
        chain_strs = [part_to_hlll_str(p) for p in full_chain]
        print(f"  C_({part_to_hlll_str(mu)}): {', '.join(chain_strs)}.")
        print(f"  a = {tuple(a_vals)}, h = {tuple(h_vals)}")

    # Summary
    print(f"\n\n{'=' * 80}")
    print("SUMMARY")
    print(f"{'=' * 80}")
    print(f"{'#':>3s}  {'mu':>25s}  {'chain_len':>9s}  {'ti2_pos':>7s}  "
          f"{'dinv(ti2)':>9s}  {'dinv(ti)':>8s}  C_mu")
    print("-" * 100)
    for idx, fd in enumerate(flagpole_data):
        mu = fd['mu']
        ti2 = fd['ti2']
        ti_rdv = compute_ti_from_params(fd['lambda'], fd['a'], fd['eps'])
        ti_part = reduced_dv_to_partition(ti_rdv)

        forward = build_full_chain_initials(ti2)
        backward = find_backward_chain(ti2, all_nu1_final, target_defc=defc)
        full_chain = backward + forward
        ti2_pos = len(backward)

        ti_dinv = compute_dinv(partition_to_reduced_dv(ti_part))

        print(f"{idx+1:3d}  {str(mu):>25s}  {len(full_chain):9d}  {ti2_pos:7d}  "
              f"{fd['dinv_ti2']:9d}  {ti_dinv:8d}  C_({part_to_hlll_str(mu)})")


def main():
    parser = argparse.ArgumentParser(
        description="HLLL chain tools: flagpole verification, enumerate by deficit, partition lookup.",
    )
    parser.add_argument(
        "--enumerate-defc",
        type=int,
        metavar="K",
        help="List distinct partitions that appear as reduced_dv_to_partition(v) "
        "for some Dyck vector v with defc(v)=K (scan lengths L in [--l-min,--l-max]).",
    )
    parser.add_argument(
        "--partition",
        type=str,
        metavar="P",
        help="Comma-separated parts, e.g. 5,3,1,1 — print reduced DV, area, dinv, defc.",
    )
    parser.add_argument(
        "--l-min",
        type=int,
        default=None,
        help="Minimum length L for --enumerate-defc (default: smallest L with C(L,2)>=K).",
    )
    parser.add_argument(
        "--l-max",
        type=int,
        default=None,
        help="Maximum length L for --enumerate-defc (default: max(l_min+8, 14)).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Cap rows printed by --enumerate-defc (default: print all).",
    )
    args = parser.parse_args()

    if args.enumerate_defc is not None:
        k = args.enumerate_defc
        l_min = args.l_min if args.l_min is not None else min_length_for_defc(k)
        l_max = args.l_max if args.l_max is not None else max(l_min + 8, 14)
        if l_max < l_min:
            parser.error("--l-max must be >= --l-min")
        run_enumerate_defc(k, l_min, l_max, limit=args.limit)
        return

    if args.partition:
        parts = [int(x.strip()) for x in args.partition.split(",") if x.strip()]
        if not parts:
            parser.error("--partition needs at least one integer")
        print_partition_lookup(tuple(parts))
        return

    main_verify(10)


if __name__ == "__main__":
    main()
