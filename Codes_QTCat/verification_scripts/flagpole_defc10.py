"""
Enumerate all flagpole partitions with defc = 10.
For each: compute TI_2, recover mu, build the chain C_mu (TAIL_2).

Compare to app10_11.pdf (k=10): run with --brief for appendix-style lines only.
In that PDF, each listed tuple is an NU1-initial partition; a_i is dinv (not area);
m_i is (# of NU1 steps from that initial to NU1-final) - 1; h_i is mind = len(reduced DV).

Key formulas from HLLL (MR4473898):
- v(lam, a, 0) = 001 2^a B_lam^+
- v(lam, a, 1) = 001 2^{a-1} B_lam^+ 1
- B_lam = 01^{n1} 01^{n2} ... 01^{nr}  where ni = mult of i in lam
- B_lam^+ = 12^{n1} 12^{n2} ... 12^{nr}
- a0(lam) = |lam| - lam1 - ell(lam) + 3
- defc = a + 1 + lam1 + ell(lam) + |lam|
- L = a + 3 + lam1 + ell(lam)
"""

import argparse

# === Basic conversions ===

def partition_to_reduced_dv(mu):
    """Convert partition to its reduced Dyck vector."""
    if not mu:
        return (0,)
    mu = sorted(mu, reverse=True)
    ell = len(mu)
    for n in range(ell + 1, ell + mu[0] + 10):
        mu_pad = list(mu) + [0] * (n - ell)
        # v_i (1-indexed) = (i-1) - mu_{n+1-i}
        # v[i] (0-indexed) = i - mu_pad[n-1-i]
        v = tuple(i - mu_pad[n - 1 - i] for i in range(n))
        if all(x >= 0 for x in v) and v[0] == 0:
            return v
    return None

def reduced_dv_to_partition(v):
    """Convert reduced Dyck vector to partition."""
    n = len(v)
    # mu_pad[j] = (n-1-j) - v[n-1-j] for j = 0,...,n-1
    parts = [(n - 1 - j) - v[n - 1 - j] for j in range(n)]
    parts = sorted([p for p in parts if p > 0], reverse=True)
    return tuple(parts)

def ti_rdv_to_original_partition(rdv):
    """Given reduced DV of TI(mu) = 0 B_mu, recover mu.
    B_mu = 01^{n1} 01^{n2} ... 01^{nr}, mu = (r^{nr}, ..., 1^{n1})."""
    v = list(rdv)
    assert v[0] == 0, f"Expected leading 0, got {v}"
    B = v[1:]  # B_mu
    multiplicities = []
    i = 0
    while i < len(B):
        assert B[i] == 0, f"Expected 0 at position {i} in B = {B}"
        i += 1
        count = 0
        while i < len(B) and B[i] == 1:
            count += 1
            i += 1
        multiplicities.append(count)
    # mu = (r^{nr}, ..., 2^{n2}, 1^{n1})
    parts = []
    for j, nj in enumerate(multiplicities):
        parts.extend([j + 1] * nj)
    parts = sorted(parts, reverse=True)
    return tuple(parts)

# === Statistics ===

def compute_area(v):
    return sum(v)

def compute_dinv(v):
    n = len(v)
    return sum(1 for i in range(n) for j in range(i+1, n) if v[i] - v[j] in (0, 1))

def compute_defc(v):
    n = len(v)
    return n*(n-1)//2 - compute_area(v) - compute_dinv(v)

# === NU1 and ND1 on partitions ===

def nu1(mu):
    """Apply NU1. Returns None if NU1-final or empty."""
    if not mu:
        return None
    mu = list(mu)
    ell = len(mu)
    if mu[0] > ell + 2:
        return None  # NU1-final
    new_parts = [ell + 1] + [p - 1 for p in mu]
    new_parts = sorted([p for p in new_parts if p > 0], reverse=True)
    return tuple(new_parts)

def is_nu1_final(mu):
    if not mu:
        return False
    return mu[0] > len(mu) + 2

def is_nu1_initial(mu):
    if not mu:
        return True
    return mu[0] < len(mu)

# === QDV operations for NU2 ===

def get_neg1_representative(reduced_dv):
    """Get the QDV representative ending in -1 by inverse-lifting."""
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
    """Apply NU2 to QDV ending in -1. Returns output QDV."""
    v = list(qdv)
    n = len(v)

    if n < 3 or v[0] != 0 or v[1] != 1:
        return None

    # Count 2's starting at index 2
    num_twos = 0
    idx = 2
    while idx < n and v[idx] == 2:
        num_twos += 1
        idx += 1

    # Count -1's at the end
    num_neg1 = 0
    idx2 = n - 1
    while idx2 >= 0 and v[idx2] == -1:
        num_neg1 += 1
        idx2 -= 1

    if num_neg1 == 0:
        return None

    # Rule (b): v = 012^k B (-1)^k where k = num_neg1
    # This applies when num_twos == num_neg1 (B doesn't start with 2)
    # OR num_twos < num_neg1 ... actually num_twos >= k is needed
    # HLLL: Rule (b) applies when the number of initial 2's = k = num_neg1
    # i.e., B does not start with 2
    k = num_neg1
    if num_twos == k and k >= 1:
        B = v[2 + k : n - k]
        # Check B conditions: B empty, or B1 <= 1, Bs >= -1, B_{i+1} <= B_i + 1
        valid = True
        if B:
            if B[0] > 1:
                valid = False
            if B[-1] < -1:
                valid = False
        if valid:
            return [0]*(k+1) + B + [0] + [1]*k

    # Rule (a): v = 012^h A (-1)^{h-1} where h = num_neg1 + 1
    h = num_neg1 + 1
    if h >= 2 and num_twos >= h:
        A = v[2 + h : n - (h - 1)]
        # Check A conditions: A empty, or all A_i <= 2, As >= 0, A_{i+1} <= A_i+1
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
    """Convert QDV to reduced Dyck vector by lifting then reducing."""
    v = list(qdv)
    # Lift until all entries >= 0
    while min(v) < 0:
        v = [0] + [x + 1 for x in v]
    # Reduce: inverse-lift while possible
    while len(v) > 1:
        w = [x - 1 for x in v[1:]]
        if len(w) > 0 and w[0] == 0 and all(x >= 0 for x in w):
            v = w
        else:
            break
    return tuple(v)

def apply_nu2(mu):
    """Apply NU2 to a NU1-final partition. Returns new partition or None."""
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
    """Apply the extended NU map (NU1 if possible, else NU2)."""
    result = nu1(mu)
    if result is not None:
        return result, "NU1"
    if is_nu1_final(mu):
        result = apply_nu2(mu)
        if result is not None:
            return result, "NU2"
    return None, None

# === Build v(lambda, a, epsilon) ===

def build_v(lam, a, eps):
    """Build the reduced Dyck vector v(lambda, a, epsilon)."""
    if not lam:
        r = 0
        mults = []
    else:
        r = max(lam)
        mults = [0] * r
        for p in lam:
            mults[p - 1] += 1

    # B_lam^+
    B_plus = []
    for i in range(r):
        B_plus.append(1)  # the 0 in B_lam becomes 1 in B_lam^+
        B_plus.extend([2] * mults[i])  # the 1^{ni} becomes 2^{ni}

    if eps == 0:
        v = [0, 0, 1] + [2]*a + B_plus
    else:
        v = [0, 0, 1] + [2]*(a-1) + B_plus + [1]

    return tuple(v)

# === Compute TI(mu) from (lambda, a, epsilon) using eq (4.5) ===

def compute_ti_from_params(lam, a, eps):
    """Compute TI(mu) reduced DV from (lambda, a, epsilon) using HLLL eq (4.5)."""
    if not lam:
        r = 0
        n = []  # n_1, ..., n_r (multiplicities of 1,...,r in lambda)
    else:
        r = max(lam)
        n = [0] * r
        for p in lam:
            n[p - 1] += 1

    n0 = a - eps  # number of 2's from the a parameter
    C = [1] * eps  # C = 1^eps

    # List: n0, n[0], n[1], ..., n[r-1]
    all_n = [n0] + n

    # p_{r+1} = number of even integers in n0, n[0], ..., n[r-1]
    p_r1 = sum(1 for x in all_n if x % 2 == 0)

    # Build 0 B_mu using eq (4.5):
    # 0 0 1^{p_{r+1}} C
    #   1^{2*floor(n0/2)} 0 1^{n0 mod 2}
    #   1^{2*floor(n[0]/2)} 0 1^{n[0] mod 2}
    #   ...
    #   1^{2*floor(n[r-2]/2)} 0 1^{n[r-2] mod 2}
    #   1^{2*floor(n[r-1]/2)} (01)^{n[r-1] mod 2}

    result = [0, 0] + [1]*p_r1 + C

    for i in range(len(all_n)):
        ni = all_n[i]
        if i < len(all_n) - 1:
            # Not the last: append 1^{2*floor(ni/2)} 0 1^{ni mod 2}
            result.extend([1] * (2 * (ni // 2)))
            result.append(0)
            result.extend([1] * (ni % 2))
        else:
            # Last entry (i = r, which is all_n[-1] = n[r-1]):
            # append 1^{2*floor(ni/2)} (01)^{ni mod 2}
            result.extend([1] * (2 * (ni // 2)))
            if ni % 2 == 1:
                result.extend([0, 1])

    return tuple(result)

# === Enumerate all (lambda, a, epsilon) with defc = 10 ===

def a0(lam):
    """a0(lambda) = |lam| - lam1 - ell(lam) + 3."""
    if not lam:
        return 3
    return sum(lam) - max(lam) - len(lam) + 3

def partitions_of(n, max_part=None):
    """Generate all partitions of n in descending order."""
    if max_part is None:
        max_part = n
    if n == 0:
        yield ()
        return
    for first in range(min(n, max_part), 0, -1):
        for rest in partitions_of(n - first, first):
            yield (first,) + rest

# === Appendix-style (PDF) formatting ===

def partition_to_compact(mu):
    """Same compact notation as app10_11.pdf: parts concatenated, A=10, B=11."""
    if not mu:
        return ""
    mu = tuple(sorted(mu, reverse=True))
    out = []
    for p in mu:
        if p <= 9:
            out.append(str(p))
        elif p == 10:
            out.append("A")
        elif p == 11:
            out.append("B")
        else:
            out.append(f"[{p}]")  # k>11: explicit, PDF rarely uses
    return "".join(out)


def count_same_mind(start_mu):
    """Count consecutive chain elements with the same mind value as start_mu.
    HLLL m_i = (count of same-mind elements starting at descent a_i) - 1.
    Walk NU (NU1 then NU2) from start_mu, counting elements with mind = mind(start_mu)."""
    rdv = partition_to_reduced_dv(start_mu)
    target_mind = len(rdv)
    count = 1
    cur = start_mu
    for _ in range(500):
        nxt, typ = apply_nu(cur)
        if nxt is None:
            break
        nxt_rdv = partition_to_reduced_dv(nxt)
        if len(nxt_rdv) != target_mind:
            break
        count += 1
        cur = nxt
    return count


def tail2_appendix_vectors(ti2_partition):
    """
    Walk NU from TI2 until TI(mu): collect data in app10_11.pdf style.

    Only list **segment-start** NU1-initials: TI2, then each partition right after an NU2
    (not every intermediate NU1-initial inside a long NU1-run).

    a_i = dinv, h_i = len(reduced DV), m_i = nu1_count_until_nu2 - 1.
    At TI(mu), m_i is forced to 0 to match the PDF (infinite tail follows).
    """
    initials = []
    a_list = []
    m_list = []
    h_list = []

    current = ti2_partition
    last_edge = None  # 'NU1' or 'NU2' of edge *into* current (None at TI2)
    for step in range(500):
        rdv = partition_to_reduced_dv(current)
        if rdv is None:
            break
        has_2 = any(x >= 2 for x in rdv)
        dinv_val = compute_dinv(rdv)

        segment_start = is_nu1_initial(current) and (step == 0 or last_edge == "NU2")
        if segment_start:
            same_mind_count = count_same_mind(current)
            is_ti = (not has_2) and (step > 0)
            m_val = 0 if is_ti else same_mind_count - 1
            initials.append(current)
            a_list.append(dinv_val)
            m_list.append(m_val)
            h_list.append(len(rdv))

        if not has_2 and is_nu1_initial(current) and step > 0:
            break

        nxt, typ = apply_nu(current)
        if nxt is None or typ is None:
            break
        last_edge = typ
        current = nxt

    return initials, tuple(a_list), tuple(m_list), tuple(h_list)


def print_appendix_block(mu, lam, a_param, eps, ti2, initials, a_vec, m_vec, h_vec):
    """One copy-paste friendly block for PDF comparison."""
    key = partition_to_compact(mu)
    print(f"  mu = {mu}  |  PDF lookup: C({key})")
    print(f"  flag data: lambda={lam if lam else ()}, a={a_param}, eps={eps}")
    comp = [partition_to_compact(p) for p in initials]
    joined = ", ".join(f"({c})" for c in comp)
    print(f"  TAIL_2 initials (compact): {joined}")
    print(f"  a = {a_vec}")
    print(f"  m = {m_vec}")
    print(f"  h = {h_vec}")
    print(f"  (Match the *suffix* of the PDF line C({key}) if the PDF lists more initials before TI2.)")

# === Main computation ===

def main():
    parser = argparse.ArgumentParser(
        description="Flagpole partitions at defc=10; compare TAIL_2 to app10_11.pdf")
    parser.add_argument(
        "--brief",
        action="store_true",
        help="Only print appendix-style blocks (easy to diff against the PDF).",
    )
    parser.add_argument(
        "--no-chain",
        action="store_true",
        help="Skip the long step-by-step chain (still prints appendix block unless --brief).",
    )
    args = parser.parse_args()

    if not args.brief:
        print("=" * 80)
        print("FLAGPOLE PARTITIONS WITH defc = 10")
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
                defc_val = compute_defc(v)
                if defc_val != 10:
                    print(f"  ERROR: defc mismatch for lam={lam}, a={a}, eps={eps}: "
                          f"got {defc_val}, expected 10")
                    continue

                ti2_partition = reduced_dv_to_partition(v)
                ti_rdv = compute_ti_from_params(lam, a, eps)
                mu = ti_rdv_to_original_partition(ti_rdv)

                # Verify: defc of mu should be 10
                mu_rdv = partition_to_reduced_dv(mu)
                mu_defc = compute_defc(mu_rdv)

                flagpole_data.append({
                    'lambda': lam,
                    'a': a,
                    'eps': eps,
                    'v': v,
                    'ti2_partition': ti2_partition,
                    'ti_rdv': ti_rdv,
                    'mu': mu,
                    'mu_defc': mu_defc,
                    'L': len(v),
                    'area_ti2': compute_area(v),
                    'dinv_ti2': compute_dinv(v),
                })

    if not args.brief:
        print(f"\nFound {len(flagpole_data)} flagpole partitions with defc = 10\n")

    for idx, fd in enumerate(flagpole_data):
        lam, a, eps = fd['lambda'], fd['a'], fd['eps']
        v = fd['v']
        ti2 = fd['ti2_partition']
        mu = fd['mu']

        initials, a_vec, m_vec, h_vec = tail2_appendix_vectors(ti2)

        if args.brief:
            print(f"--- #{idx + 1} ---")
            print_appendix_block(mu, lam, a, eps, ti2, initials, a_vec, m_vec, h_vec)
            print()
            continue

        print(f"\n{'─' * 70}")
        print(f"#{idx+1}:  lambda = {lam if lam else '(empty)'},  a = {a},  eps = {eps}")
        print(f"  v(lam,a,eps) = {list(v)}")
        print(f"  L = {fd['L']},  area(TI2) = {fd['area_ti2']},  dinv(TI2) = {fd['dinv_ti2']}")
        print(f"  TI_2 as partition = {ti2}")
        print(f"  TI   reduced DV   = {list(fd['ti_rdv'])}")
        ti_part = reduced_dv_to_partition(fd['ti_rdv'])
        print(f"  TI   as partition = {ti_part}")
        print(f"  mu = {mu}  (|mu| = {sum(mu)}, defc = {fd['mu_defc']})")

        print("\n  --- Appendix-style TAIL_2 (compare to app10_11.pdf) ---")
        print_appendix_block(mu, lam, a, eps, ti2, initials, a_vec, m_vec, h_vec)

        if not args.no_chain:
            # Build the chain from TI2 forward
            print(f"\n  Chain C_mu (TAIL_2), step-by-step:")
            chain = []
            current = ti2
            found_ti = False
            max_steps = 100

            for step in range(max_steps):
                rdv = partition_to_reduced_dv(current)
                dinv_val = compute_dinv(rdv)
                area_val = compute_area(rdv)
                has_2 = any(x >= 2 for x in rdv)

                markers = []
                if is_nu1_initial(current):
                    markers.append("init")
                if is_nu1_final(current):
                    markers.append("final")
                if not has_2 and is_nu1_initial(current) and step > 0:
                    markers.append("=TI(mu)")
                    found_ti = True

                marker_str = f"  [{', '.join(markers)}]" if markers else ""

                chain.append((current, dinv_val, area_val, marker_str))

                if found_ti:
                    if step > 0:
                        for extra in range(4):
                            nxt, step_type = apply_nu(current)
                            if nxt is None:
                                break
                            current = nxt
                            rdv2 = partition_to_reduced_dv(current)
                            d2 = compute_dinv(rdv2)
                            a2 = compute_area(rdv2)
                            m2 = []
                            if is_nu1_initial(current):
                                m2.append("init")
                            if is_nu1_final(current):
                                m2.append("final")
                            ms2 = f"  [{', '.join(m2)}]" if m2 else ""
                            chain.append((current, d2, a2, ms2))
                        break

                nxt, step_type = apply_nu(current)
                if nxt is None:
                    chain[-1] = (current, dinv_val, area_val, marker_str + " [STUCK]")
                    break
                chain[-1] = (current, dinv_val, area_val, marker_str + f" --{step_type}-->")
                current = nxt

            for i, (part, dinv_val, area_val, marker) in enumerate(chain):
                print(f"    {i:3d}: {str(part):30s}  dinv={dinv_val:3d}  area={area_val:3d}{marker}")

            if len(chain) >= max_steps:
                print(f"    ... (chain continues)")

    if args.brief:
        return

    # Summary table
    print(f"\n\n{'=' * 80}")
    print("SUMMARY TABLE")
    print(f"{'=' * 80}")
    print(f"{'#':>3s}  {'lambda':>12s}  {'a':>3s}  {'eps':>3s}  {'mu':>25s}  {'|mu|':>4s}  "
          f"{'L':>3s}  {'dinv(TI2)':>9s}  {'area(TI2)':>9s}")
    print("-" * 100)
    for idx, fd in enumerate(flagpole_data):
        lam_str = str(fd['lambda']) if fd['lambda'] else "()"
        mu_str = str(fd['mu'])
        print(f"{idx+1:3d}  {lam_str:>12s}  {fd['a']:3d}  {fd['eps']:3d}  {mu_str:>25s}  "
              f"{sum(fd['mu']):4d}  {fd['L']:3d}  {fd['dinv_ti2']:9d}  {fd['area_ti2']:9d}")

    print("\nTip: run `python3 flagpole_defc10.py --brief` for PDF-ready a,m,h lines only.")
    print("     `python3 flagpole_defc10.py --no-chain` skips the long step list.")

if __name__ == "__main__":
    main()
