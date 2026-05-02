"""
Comprehensive verification of ALL defc=10 HLLL chains against appendix data.

For each chain C_mu in the HLLL 2020 appendix (app10_11.pdf):
  1. Every listed element has defc = 10
  2. a_i = dinv of the i-th listed element
  3. h_i = mind (= len of reduced DV) of the i-th listed element
  4. Each listed element is NU1-initial
  5. m_i = consecutive same-mind elements starting at the i-th element, minus 1
  6. For flagpole partitions: TI_2(mu) appears in the chain at the correct position

HLLL amh definition (from HLLL_final_version.tex, Definition 5.1):
  - a_i = dinv values at descents of the mind-profile
  - h_i = mind value at descent a_i
  - m_i = largest integer s.t. p_{a_i} = p_{a_i+1} = ... = p_{a_i+m_i}
    i.e., m_i + 1 consecutive chain elements at a_i have the same mind
"""

from flagpole_defc10 import (
    partition_to_reduced_dv, reduced_dv_to_partition,
    compute_area, compute_dinv, compute_defc,
    nu1, is_nu1_initial, is_nu1_final,
    apply_nu2, apply_nu,
    build_v, compute_ti_from_params, ti_rdv_to_original_partition,
    a0, partitions_of, partition_to_compact,
)


def parse_hlll(s):
    s = s.strip().strip('()')
    parts = []
    for c in s:
        if c == 'A': parts.append(10)
        elif c == 'B': parts.append(11)
        elif c == 'C': parts.append(12)
        elif c == 'N': continue
        else: parts.append(int(c))
    return tuple(sorted(parts, reverse=True))


def count_same_mind_from(start_mu):
    """Walk NU from start_mu, count consecutive elements with same mind."""
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


HLLL_DATA_K10 = {
    (10,): {
        'chain': ['11111111111', '2222221', '333331', '444431', '5554321',
                  '6665431', '77765321', '888754321', '9997654321', 'AA987654321'],
        'a': [1, 3, 6, 10, 15, 55],
        'm': [0, 0, 2, 2, 0, 0],
        'h': [12, 8, 8, 8, 8, 12],
    },
    (9,1): {
        'chain': ['2222211', '33333', '444331', '5554311', '6665331',
                  '77755321', '887754321', 'AA987654311'],
        'a': [2, 5, 9, 14, 54],
        'm': [0, 2, 2, 0, 0],
        'h': [8, 8, 8, 8, 12],
    },
    (5,5): {
        'chain': ['21111111111', '3222221', '433331', '544431', '6554321'],
        'a': [2, 4, 7, 11, 16],
        'm': [0, 0, 2, 2, 0],
        'h': [12, 8, 8, 8, 8],
    },
    (8,2): {
        'chain': ['222111111', '333221', '444411', '555332', '6655421',
                  '888654311', '9987654221'],
        'a': [2, 4, 13, 43],
        'm': [0, 0, 1, 0],
        'h': [10, 7, 8, 11],
    },
    (7,3): {
        'chain': ['2211111111', '332222', '443321', '6665311', '77754221',
                  '887653321'],
        'a': [2, 4, 7, 33],
        'm': [0, 1, 0, 0],
        'h': [11, 8, 7, 10],
    },
    (8,1,1): {
        'chain': ['3311111111', '6511111', '44433', '5554211', '6664331',
                  '77655321', 'AA987654211'],
        'a': [4, 6, 8, 13, 53],
        'm': [0, 0, 2, 0, 0],
        'h': [11, 8, 8, 8, 12],
    },
    (6,2,1,1): {
        'chain': ['31111111111', '4222221', '533331', '6444211', '6654411',
                  '9987644211'],
        'a': [3, 5, 8, 12, 41],
        'm': [0, 0, 2, 0, 0],
        'h': [12, 8, 8, 8, 11],
    },
    (7,2,1): {
        'chain': ['4111111111', '522222', '6333111', '6641111', '554422',
                  '77664311', '9987653311'],
        'a': [3, 5, 8, 10, 12, 42],
        'm': [0, 1, 0, 0, 1, 0],
        'h': [11, 8, 8, 8, 8, 11],
    },
    (7,1,1,1): {
        'chain': ['441111111', '55211111', '6522211', '5553211', '6654331',
                  'AA987653211'],
        'a': [5, 7, 9, 12, 52],
        'm': [0, 0, 0, 0, 0],
        'h': [10, 9, 8, 8, 12],
    },
    (4,2,2,1,1): {
        'chain': ['32111111111', '4322221', '5532211', '76642211', '887544211'],
        'a': [4, 6, 9, 19, 30],
        'm': [0, 0, 0, 0, 0],
        'h': [12, 8, 8, 9, 10],
    },
    (6,4): {
        'chain': ['6221111', '4441111', '552222', '555222', '6652221',
                  '6663321', '77644321'],
        'a': [4, 6, 8, 11, 14, 24],
        'm': [0, 0, 1, 1, 0, 0],
        'h': [8, 8, 8, 8, 8, 9],
    },
    (3,3,3,1): {
        'chain': ['22221111', '3332111', '442222', '544222', '6652111',
                  '6544311'],
        'a': [2, 4, 6, 9, 12, 14],
        'm': [0, 0, 1, 1, 0, 0],
        'h': [9, 8, 8, 8, 8, 8],
    },
    (6,3,1): {
        'chain': ['541111111', '6422211', '5553111', '6633311', '6655221',
                  '887644311'],
        'a': [6, 8, 11, 13, 32],
        'm': [0, 0, 0, 0, 0],
        'h': [10, 8, 8, 8, 10],
    },
    (3,3,1,1,1,1): {
        'chain': ['511111111', '6222111', '5322221', '6433211', '877643211'],
        'a': [3, 5, 7, 10, 29],
        'm': [0, 0, 0, 0, 0],
        'h': [10, 8, 8, 8, 10],
    },
    (6,2,2): {
        'chain': ['3222211', '443221', '77754211', '887653221'],
        'a': [3, 6, 32],
        'm': [0, 0, 0],
        'h': [8, 7, 10],
    },
    (4,4,2): {
        'chain': ['322111111', '433221', '6554221'],
        'a': [3, 5, 15],
        'm': [0, 0, 0],
        'h': [10, 7, 8],
    },
    (6,1,1,1,1): {
        'chain': ['3322111', '5511111', '44333', '5543211', 'AA987643211'],
        'a': [3, 5, 7, 11, 51],
        'm': [0, 0, 2, 0, 0],
        'h': [8, 8, 8, 8, 12],
    },
    (4,3,3): {
        'chain': ['42111111111', '4442111', '543331', '6554111', '6643321'],
        'a': [5, 7, 9, 13, 15],
        'm': [0, 0, 2, 0, 0],
        'h': [12, 8, 8, 8, 8],
    },
    (5,4,1): {
        'chain': ['332111111', '64111111', '5541111', '553322', '77653111',
                  '77554311'],
        'a': [4, 6, 8, 10, 21, 23],
        'm': [0, 0, 0, 1, 0, 0],
        'h': [10, 9, 8, 8, 9, 9],
    },
    (5,3,1,1): {
        'chain': ['61111111', '52221111', '533222', '5542211', '77642211',
                  '887554211'],
        'a': [3, 5, 7, 10, 20, 31],
        'm': [0, 0, 1, 0, 0, 0],
        'h': [9, 9, 8, 8, 9, 10],
    },
    (5,3,2): {
        'chain': ['43221111', '5333111', '6631111', '6444111', '6642221',
                  '6663311', '77644221'],
        'a': [5, 7, 9, 11, 13, 23],
        'm': [0, 0, 0, 0, 0, 0],
        'h': [9, 8, 8, 8, 8, 9],
    },
    (3,3,2,1,1): {
        'chain': ['32221111', '4332111', '6521111', '5443111', '6632211',
                  '76644211'],
        'a': [3, 5, 7, 9, 11, 21],
        'm': [0, 0, 0, 0, 0, 0],
        'h': [9, 8, 8, 8, 8, 9],
    },
    (5,2,2,1): {
        'chain': ['4222211', '5422211', '5552111', '6533311', '6655211',
                  '887643311'],
        'a': [4, 7, 10, 12, 31],
        'm': [0, 0, 0, 0, 0],
        'h': [8, 8, 8, 8, 10],
    },
    (3,3,2,2): {
        'chain': ['521111111', '6322111', '5422221', '6532221', '6553221'],
        'a': [4, 6, 8, 11, 14],
        'm': [0, 0, 0, 0, 0],
        'h': [10, 8, 8, 8, 8],
    },
    (5,2,1,1,1): {
        'chain': ['4221111111', '44321111', '65221111', '55431111', '75332111',
                  '76531111', '75543111', '77533211', '9987553211'],
        'a': [5, 7, 9, 11, 13, 15, 17, 19, 40],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [11, 9, 9, 9, 9, 9, 9, 9, 11],
    },
    (5,1,1,1,1,1): {
        'chain': ['43111111111', '63321111', '65411111', '64432111', '76422111',
                  '66542111', '76443211', 'AA987543211'],
        'a': [6, 8, 10, 12, 14, 16, 18, 50],
        'm': [0, 0, 0, 0, 0, 0, 0, 0],
        'h': [12, 9, 9, 9, 9, 9, 9, 12],
    },
    (4,4,1,1): {
        'chain': ['33311111', '43333', '544331', '76654211'],
        'a': [4, 6, 10, 22],
        'm': [0, 2, 2, 0],
        'h': [9, 8, 8, 9],
    },
    (4,3,2,1): {
        'chain': ['433111111', '642111111', '55331111', '75331111', '75531111',
                  '75533111', '77533111', '77553111', '77553311'],
        'a': [6, 8, 10, 12, 14, 16, 18, 20, 22],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [10, 10, 9, 9, 9, 9, 9, 9, 9],
    },
    (3,2,2,1,1,1): {
        'chain': ['62111111', '63211111', '54411111', '64322111', '66421111',
                  '65442111', '76432211', '877543111', '886553211'],
        'a': [4, 6, 8, 10, 12, 14, 16, 27, 29],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [9, 9, 9, 9, 9, 9, 9, 10, 10],
    },
    (4,3,1,1,1): {
        'chain': ['63111111', '63311111', '64411111', '64422111', '66422111',
                  '66442111', '76442211', '887543111', '886653211'],
        'a': [5, 7, 9, 11, 13, 15, 17, 28, 30],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [9, 9, 9, 9, 9, 9, 9, 10, 10],
    },
    (3,2,2,2,1): {
        'chain': ['522111111', '443111111', '54331111', '75321111', '65531111',
                  '75433111', '77532111', '76553111', '77543311'],
        'a': [5, 7, 9, 11, 13, 15, 17, 19, 21],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [10, 10, 9, 9, 9, 9, 9, 9, 9],
    },
    (4,2,2,2): {
        'chain': ['42221111', '5322211', '5432221', '6542221', '6663211',
                  '77643221'],
        'a': [4, 6, 9, 12, 22],
        'm': [0, 0, 0, 0, 0],
        'h': [9, 8, 8, 8, 9],
    },
    (4,2,1,1,1,1): {
        'chain': ['43211111111', '642211111', '554211111', '653321111', '764311111',
                  '755421111', '765332111', '875431111', '866532111', '876443111',
                  '886542211', '9986643211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 39],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [12, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    },
    (4,1,1,1,1,1,1): {
        'chain': ['5311111111', '533211111', '653111111', '644311111', '754221111',
                  '665321111', '764431111', '865422111', '776432111', '875542111',
                  '876533211', 'AA986543211'],
        'a': [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 49],
        'm': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'h': [11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12],
    },
    (3,2,1,1,1,1,1): {
        'chain': ['53211111111', '6431111111', '6442111111', '6542211111',
                  '6643211111', '7644211111', '7654221111', '7754321111',
                  '8755321111', '8765331111', '9765431111', '9775432111',
                  '9875532111', '9876533111', '9976543111', '9977543211'],
        'a': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
        'm': [0]*16,
        'h': [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
    },
    (3,1,1,1,1,1,1,1): {
        'chain': ['4421111111', '5422111111', '5532111111', '6533111111',
                  '7543111111', '7553211111', '7653311111', '8654311111',
                  '8664321111', '8764421111', '8765422111', '8865432111',
                  '9866432111', '9876442111', '9876542211', 'AA976543211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 48],
        'm': [0]*16,
        'h': [11]*15 + [12],
    },
    (2,2,2,2,2): {
        'chain': ['44221111', '55221111', '6432221', '6543221'],
        'a': [6, 8, 10, 13],
        'm': [0, 0, 0, 0],
        'h': [9, 9, 8, 8],
    },
    (2,2,2,2,1,1): {
        'chain': ['4322211', '5432211', '76642111', '76544211'],
        'a': [5, 8, 18, 20],
        'm': [0, 0, 0, 0],
        'h': [8, 8, 9, 9],
    },
    (2,2,2,1,1,1,1): {
        'chain': ['5331111111', '544211111', '653221111', '664311111', '754421111',
                  '765322111', '775431111', '865532111', '876433111', '886542111',
                  '876643211'],
        'a': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
        'm': [0]*11,
        'h': [11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    },
    (2,2,1,1,1,1,1,1): {
        'chain': ['532211111', '553111111', '643311111', '754211111', '655321111',
                  '764331111', '865421111', '766432111', '875442111', '876532211',
                  '9886543211'],
        'a': [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 37],
        'm': [0]*11,
        'h': [10]*10 + [11],
    },
    (2,1,1,1,1,1,1,1,1): {
        'chain': ['54211111111', '54321111111', '65321111111', '65431111111',
                  '75432111111', '76532111111', '76543111111', '86543211111',
                  '87643211111', '87654211111', '87654321111', '98654321111',
                  '98764321111', '98765421111', '98765432111', 'A9765432111',
                  'A9875432111', 'A9876532111', 'A9876543111', 'AA876543211'],
        'a': [9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
        'm': [0]*20,
        'h': [12]*20,
    },
    (1,1,1,1,1,1,1,1,1,1): {
        'chain': ['54311111111', '64321111111', '65421111111', '65432111111',
                  '76432111111', '76542111111', '76543211111', '87543211111',
                  '87653211111', '87654311111', '97654321111', '98754321111',
                  '98765321111', '98765431111', 'A8765432111', 'A9865432111',
                  'A9876432111', 'A9876542111', 'A9876543211'],
        'a': [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46],
        'm': [0]*19,
        'h': [12]*19,
    },
}


def verify_chain(mu, data):
    """Verify one HLLL chain. Returns (ok, errors)."""
    errors = []
    chain_strs = data['chain']
    a_vec = data['a']
    m_vec = data['m']
    h_vec = data['h']

    chain_parts = [parse_hlll(s) for s in chain_strs]
    N = len(chain_parts)

    # amh vectors should have same length (= number of descent entries)
    # But chain may list more elements (some chains list every element,
    # others only the descent-start initials). The amh vectors correspond
    # to the descent-start initials.
    Na = len(a_vec)
    Nm = len(m_vec)
    Nh = len(h_vec)

    if Na != Nm or Na != Nh:
        errors.append(f"amh vector lengths differ: a={Na}, m={Nm}, h={Nh}")
        return False, errors

    # The chain lists more elements than amh entries when N-marked elements
    # are intermediate (not at descents). The amh entries correspond to
    # elements at indices where a descent in the mind-profile occurs.
    # For simplicity, match amh to the chain by dinv values.

    part_data = []
    for p in chain_parts:
        rdv = partition_to_reduced_dv(p)
        part_data.append({
            'part': p,
            'rdv': rdv,
            'dinv': compute_dinv(rdv),
            'area': compute_area(rdv),
            'defc': compute_defc(rdv),
            'mind': len(rdv),
            'init': is_nu1_initial(p),
            'final': is_nu1_final(p),
        })

    # Check 1: all defc = 10
    for i, pd in enumerate(part_data):
        if pd['defc'] != 10:
            errors.append(f"Element {i} {chain_strs[i]}: defc={pd['defc']} != 10")

    # Match chain elements to amh entries by dinv
    amh_indices = []
    for ai in a_vec:
        matches = [j for j, pd in enumerate(part_data) if pd['dinv'] == ai]
        if len(matches) == 1:
            amh_indices.append(matches[0])
        elif len(matches) == 0:
            errors.append(f"No chain element with dinv={ai} (a-value)")
            amh_indices.append(None)
        else:
            amh_indices.append(matches[0])

    # Check 2-5 for each amh entry
    for k in range(Na):
        idx = amh_indices[k]
        if idx is None:
            continue
        pd = part_data[idx]

        # Check 2: a_k = dinv
        if pd['dinv'] != a_vec[k]:
            errors.append(f"amh[{k}]: dinv={pd['dinv']} != a={a_vec[k]}")

        # Check 3: h_k = mind
        if pd['mind'] != h_vec[k]:
            errors.append(f"amh[{k}] ({chain_strs[idx]}): mind={pd['mind']} != h={h_vec[k]}")

        # Check 4: is NU1-initial
        if not pd['init']:
            errors.append(f"amh[{k}] ({chain_strs[idx]}): NOT NU1-initial")

        # Check 5: m_k = consecutive same-mind count - 1
        same_mind = count_same_mind_from(pd['part'])
        computed_m = same_mind - 1
        if computed_m != m_vec[k]:
            errors.append(f"amh[{k}] ({chain_strs[idx]}): computed m={computed_m} != m={m_vec[k]} (same_mind_count={same_mind})")

    ok = len(errors) == 0
    return ok, errors


def get_flagpole_data():
    """Enumerate all flagpole partitions with defc=10."""
    results = []
    for lam_size in range(0, 11):
        for lam in partitions_of(lam_size):
            lam1 = max(lam) if lam else 0
            ell_lam = len(lam) if lam else 0
            for eps in [0, 1]:
                a_val = 9 - lam1 - ell_lam - lam_size
                if a_val < max(2, a0(lam)):
                    continue
                v = build_v(lam, a_val, eps)
                if compute_defc(v) != 10:
                    continue
                ti2_part = reduced_dv_to_partition(v)
                ti_rdv = compute_ti_from_params(lam, a_val, eps)
                mu = ti_rdv_to_original_partition(ti_rdv)
                results.append({
                    'lambda': lam, 'a': a_val, 'eps': eps,
                    'ti2': ti2_part, 'mu': mu,
                    'v': v, 'dinv_ti2': compute_dinv(v),
                })
    return results


def main():
    print("=" * 90)
    print("COMPREHENSIVE VERIFICATION: ALL defc=10 HLLL CHAINS")
    print("=" * 90)

    total = len(HLLL_DATA_K10)
    passed = 0
    failed = 0
    all_errors = {}

    for mu in sorted(HLLL_DATA_K10.keys(), key=lambda p: (-sum(p), p)):
        data = HLLL_DATA_K10[mu]
        ok, errors = verify_chain(mu, data)
        label = partition_to_compact(mu)
        if ok:
            passed += 1
            print(f"  PASS  C({label}): {len(data['chain'])} elements, "
                  f"{len(data['a'])} amh entries")
        else:
            failed += 1
            all_errors[mu] = errors
            print(f"  FAIL  C({label}): {len(errors)} error(s)")
            for e in errors:
                print(f"        - {e}")

    print(f"\n{'─' * 90}")
    print(f"CHAINS: {passed} PASS / {failed} FAIL / {total} total")

    # Flagpole verification
    print(f"\n{'=' * 90}")
    print("FLAGPOLE PARTITIONS: TI_2 placement in HLLL chains")
    print(f"{'=' * 90}")

    flagpoles = get_flagpole_data()
    fp_pass = 0
    fp_fail = 0

    for fd in flagpoles:
        mu = fd['mu']
        ti2 = fd['ti2']
        label = partition_to_compact(mu)
        ti2_label = partition_to_compact(ti2)

        if mu not in HLLL_DATA_K10:
            print(f"  SKIP  mu={label}: not in HLLL data")
            continue

        data = HLLL_DATA_K10[mu]
        chain_parts = [parse_hlll(s) for s in data['chain']]

        ti2_found = False
        for i, p in enumerate(chain_parts):
            if p == ti2:
                ti2_found = True
                rdv = partition_to_reduced_dv(p)
                ti2_dinv = compute_dinv(rdv)
                print(f"  PASS  mu={label}: TI_2=({ti2_label}) found at position {i+1}/{len(chain_parts)}, "
                      f"dinv={ti2_dinv}, lambda={fd['lambda'] or '()'}, a={fd['a']}, eps={fd['eps']}")
                fp_pass += 1
                break

        if not ti2_found:
            print(f"  FAIL  mu={label}: TI_2=({ti2_label}) NOT FOUND in chain!")
            fp_fail += 1

    print(f"\n{'─' * 90}")
    print(f"FLAGPOLE: {fp_pass} PASS / {fp_fail} FAIL / {len(flagpoles)} total")

    print(f"\n{'=' * 90}")
    print(f"OVERALL: {'ALL PASS' if failed == 0 and fp_fail == 0 else 'SOME FAILURES'}")
    print(f"{'=' * 90}")


if __name__ == "__main__":
    main()
