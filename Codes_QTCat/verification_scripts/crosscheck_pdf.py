"""
Crosscheck our flagpole defc=10 computations against the HLLL 2020 appendix (app10_11.pdf).

The PDF lists "global chains" C(mu) for all partitions mu of size 10.
Each chain lists NU1-initial objects in the TAIL_2 chain.
We verify:
  1. Last element of C(mu) = TI(mu) from our computation
  2. Our TI_2 appears in the chain
  3. Area values at initial objects match
  4. defc = 10 for all chain elements
"""

# === Basic functions (from flagpole_defc10.py) ===

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

# === Parse PDF notation ===

def parse_partition_str(s):
    """Parse PDF partition string like 'AA987654321' into tuple.
    A=10, B=11."""
    parts = []
    i = 0
    while i < len(s):
        if s[i] == 'A':
            parts.append(10)
        elif s[i] == 'B':
            parts.append(11)
        else:
            parts.append(int(s[i]))
        i += 1
    return tuple(sorted(parts, reverse=True))

def partition_to_pdf_str(mu):
    """Convert partition tuple to PDF string notation."""
    s = ""
    for p in sorted(mu, reverse=True):
        if p == 10:
            s += "A"
        elif p == 11:
            s += "B"
        elif p >= 12:
            s += f"({p})"
        else:
            s += str(p)
    return s

# === PDF data for k=10 (manually transcribed from the appendix) ===

pdf_chains_k10 = {
    # mu: (list_of_partition_strings, a_values)
    '(A)': {
        'elements': ['11111111111', '2222221', '333331', '444431', '5554321',
                      '6665431', '77765321', '888754321', '9997654321', 'AA987654321'],
        'a': [1, 3, 6, 10, 15, 55],
        'N_indices': [5, 6, 7, 8],  # 0-indexed positions of N-marked elements
    },
    '(91)': {
        'elements': ['2222211', '33333', '444331', '5554311', '6665331',
                      '77755321', '887754321', 'AA987654311'],
        'a': [2, 5, 9, 14, 54],
    },
    '(55)': {
        'elements': ['21111111111', '3222221', '433331', '544431', '6554321'],
        'a': [2, 4, 7, 11, 16],
    },
    '(1111111111)': {
        'elements': ['54311111111', '64321111111', '65421111111', '65432111111',
                      '76432111111', '76542111111', '76543211111', '87543211111',
                      '87653211111', '87654311111', '97654321111', '98754321111',
                      '98765321111', '98765431111', 'A8765432111', 'A9865432111',
                      'A9876432111', 'A9876542111', 'A9876543211'],
        'a': [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46],
    },
    '(211111111)': {
        'elements': ['54211111111', '54321111111', '65321111111', '65431111111',
                      '75432111111', '76532111111', '76543111111', '86543211111',
                      '87643211111', '87654211111', '87654321111', '98654321111',
                      '98764321111', '98765421111', '98765432111', 'A9765432111',
                      'A9875432111', 'A9876532111', 'A9876543111', 'AA876543211'],
        'a': [9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
    },
    '(22111111)': {
        'elements': ['532211111', '553111111', '643311111', '754211111', '655321111',
                      '764331111', '865421111', '766432111', '875442111', '876532211',
                      '9886543211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 37],
    },
    '(2221111)': {
        'elements': ['5331111111', '544211111', '653221111', '664311111', '754421111',
                      '765322111', '775431111', '865532111', '876433111', '886542111',
                      '876643211'],
        'a': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
    },
    '(31111111)': {
        'elements': ['4421111111', '5422111111', '5532111111', '6533111111', '7543111111',
                      '7553211111', '7653311111', '8654311111', '8664321111', '8764421111',
                      '8765422111', '8865432111', '9866432111', '9876442111', '9876542211',
                      'AA976543211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 48],
    },
    '(3211111)': {
        'elements': ['53211111111', '6431111111', '6442111111', '6542211111', '6643211111',
                      '7644211111', '7654221111', '7754321111', '8755321111', '8765331111',
                      '9765431111', '9775432111', '9875532111', '9876533111', '9976543111',
                      '9977543211'],
        'a': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
    },
    '(4111111)': {
        'elements': ['5311111111', '533211111', '653111111', '644311111', '754221111',
                      '665321111', '764431111', '865422111', '776432111', '875542111',
                      '876533211', 'AA986543211'],
        'a': [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 49],
    },
    '(421111)': {
        'elements': ['43211111111', '642211111', '554211111', '653321111', '764311111',
                      '755421111', '765332111', '875431111', '866532111', '876443111',
                      '886542211', '9986643211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 39],
    },
    '(511111)': {
        'elements': ['43111111111', '63321111', '65411111', '64432111', '76422111',
                      '66542111', '76443211', 'AA987543211'],
        'a': [6, 8, 10, 12, 14, 16, 18, 50],
    },
    '(52111)': {
        'elements': ['4221111111', '44321111', '65221111', '55431111', '75332111',
                      '76531111', '75543111', '77533211', '9987553211'],
        'a': [5, 7, 9, 11, 13, 15, 17, 19, 40],
    },
    '(43111)': {
        'elements': ['63111111', '63311111', '64411111', '64422111', '66422111',
                      '66442111', '76442211', '887543111', '886653211'],
        'a': [5, 7, 9, 11, 13, 15, 17, 28, 30],
    },
    '(4321)': {
        'elements': ['433111111', '642111111', '55331111', '75331111', '75531111',
                      '75533111', '77533111', '77553111', '77553311'],
        'a': [6, 8, 10, 12, 14, 16, 18, 20, 22],
    },
    '(322111)': {
        'elements': ['62111111', '63211111', '54411111', '64322111', '66421111',
                      '65442111', '76432211', '877543111', '886553211'],
        'a': [4, 6, 8, 10, 12, 14, 16, 27, 29],
    },
    '(32221)': {
        'elements': ['522111111', '443111111', '54331111', '75321111', '65531111',
                      '75433111', '77532111', '76553111', '77543311'],
        'a': [5, 7, 9, 11, 13, 15, 17, 19, 21],
    },
}

# === Our flagpole data ===

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
    all_n = [n0] + n
    p_r1 = sum(1 for x in all_n if x % 2 == 0)
    C = [1] * eps
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

# === Main crosscheck ===

def main():
    print("=" * 80)
    print("CROSSCHECK: Our flagpole computations vs HLLL 2020 appendix")
    print("=" * 80)

    # First: verify defc = 10 for ALL chain elements in the PDF
    print("\n--- Verifying defc = 10 for all PDF chain elements ---")
    all_ok = True
    for mu_str, data in pdf_chains_k10.items():
        for elem_str in data['elements']:
            part = parse_partition_str(elem_str)
            rdv = partition_to_reduced_dv(part)
            if rdv is None:
                print(f"  ERROR: Could not compute reduced DV for {part} in C{mu_str}")
                all_ok = False
                continue
            defc = compute_defc(rdv)
            if defc != 10:
                print(f"  ERROR: defc({part}) = {defc} != 10 in C{mu_str}")
                all_ok = False
    if all_ok:
        print("  ALL PASS: Every chain element has defc = 10")

    # Second: verify dinv values match (HLLL 'a' = dinv, not area)
    print("\n--- Verifying dinv values ---")
    dinv_ok = True
    for mu_str, data in pdf_chains_k10.items():
        a_values = data['a']
        if len(a_values) == len(data['elements']):
            for i, elem_str in enumerate(data['elements']):
                part = parse_partition_str(elem_str)
                rdv = partition_to_reduced_dv(part)
                dinv = compute_dinv(rdv)
                if dinv != a_values[i]:
                    print(f"  MISMATCH in C{mu_str} element {i}: computed dinv={dinv}, PDF a={a_values[i]}")
                    dinv_ok = False
    if dinv_ok:
        print("  ALL PASS for chains where #a-values = #elements")

    # Third: compute our 14 flagpole partitions and crosscheck
    print("\n--- Crosschecking 14 flagpole partitions ---")

    flagpole_params = []
    for lam_size in range(0, 11):
        for lam in partitions_of(lam_size):
            lam1 = max(lam) if lam else 0
            ell_lam = len(lam) if lam else 0
            for eps in [0, 1]:
                a_val = 9 - lam1 - ell_lam - lam_size
                if a_val < max(2, a0(lam)):
                    continue
                flagpole_params.append((lam, a_val, eps))

    for lam, a_val, eps in flagpole_params:
        v = build_v(lam, a_val, eps)
        ti2_part = reduced_dv_to_partition(v)
        ti2_dinv = compute_dinv(v)

        ti_rdv = compute_ti_from_params(lam, a_val, eps)
        ti_part = reduced_dv_to_partition(ti_rdv)
        ti_dinv = compute_dinv(partition_to_reduced_dv(ti_part))

        # Recover mu from TI
        v_ti = list(ti_rdv)
        B = v_ti[1:]
        multiplicities = []
        i = 0
        while i < len(B):
            i += 1  # skip the 0
            count = 0
            while i < len(B) and B[i] == 1:
                count += 1
                i += 1
            multiplicities.append(count)
        mu_parts = []
        for j, nj in enumerate(multiplicities):
            mu_parts.extend([j + 1] * nj)
        mu = tuple(sorted(mu_parts, reverse=True))

        mu_pdf_str = f"({partition_to_pdf_str(mu)})"
        ti2_pdf_str = partition_to_pdf_str(ti2_part)
        ti_pdf_str = partition_to_pdf_str(ti_part)

        print(f"\n  lambda={lam if lam else '()'}, a={a_val}, eps={eps}")
        print(f"  mu = {mu} = {mu_pdf_str}")
        print(f"  TI_2 = {ti2_part} = ({ti2_pdf_str}), dinv={ti2_dinv}")
        print(f"  TI   = {ti_part} = ({ti_pdf_str}), dinv={ti_dinv}")

        # Find this mu in PDF chains
        if mu_pdf_str in pdf_chains_k10:
            pdf_data = pdf_chains_k10[mu_pdf_str]
            pdf_elems = pdf_data['elements']

            # Check: last element = TI?
            last_elem_part = parse_partition_str(pdf_elems[-1])
            if last_elem_part == ti_part:
                print(f"  TI CHECK: PASS (last PDF element = TI)")
            else:
                print(f"  TI CHECK: FAIL! Last PDF = {last_elem_part}, our TI = {ti_part}")

            # Check: TI_2 appears in chain?
            ti2_found = False
            for idx, elem_str in enumerate(pdf_elems):
                if parse_partition_str(elem_str) == ti2_part:
                    print(f"  TI_2 CHECK: PASS (found at position {idx+1}/{len(pdf_elems)} in PDF chain)")
                    ti2_found = True

                    if len(pdf_data['a']) == len(pdf_elems):
                        pdf_dinv = pdf_data['a'][idx]
                        if pdf_dinv == ti2_dinv:
                            print(f"  DINV CHECK: PASS (dinv={ti2_dinv})")
                        else:
                            print(f"  DINV CHECK: FAIL! PDF a={pdf_dinv}, our dinv={ti2_dinv}")
                    break
            if not ti2_found:
                print(f"  TI_2 CHECK: FAIL! TI_2 not found in PDF chain")
                print(f"    PDF elements: {pdf_elems}")
        else:
            print(f"  WARNING: {mu_pdf_str} not in our PDF data (may not have been transcribed)")

    # Summary: dinv check for consecutive elements
    print("\n\n--- Verifying dinv ordering in PDF chains ---")
    dinv_ok = True
    for mu_str, data in pdf_chains_k10.items():
        dinvs = []
        for elem_str in data['elements']:
            part = parse_partition_str(elem_str)
            rdv = partition_to_reduced_dv(part)
            dinvs.append(compute_dinv(rdv))

        # dinv should be strictly increasing (but not necessarily by 1,
        # since the PDF lists initial objects, not every chain element)
        for i in range(1, len(dinvs)):
            if dinvs[i] <= dinvs[i-1]:
                print(f"  FAIL: dinv not increasing in C{mu_str}: {dinvs}")
                dinv_ok = False
                break
    if dinv_ok:
        print("  ALL PASS: dinv is strictly increasing in every chain")

if __name__ == "__main__":
    main()
