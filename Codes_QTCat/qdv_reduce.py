from typing import List, Sequence


def reduce_qdv_to_reduced_dyck(qdv: Sequence[int]) -> List[int]:
    """
    Reduce a Quasi-Dyck vector (QDV) to its reduced Dyck vector representative.

    Algorithm:
    1) Lift until non-negative: while any entry is negative, map v -> [0] + (v + 1).
    2) Shorten while safe: while v starts with 0 and (v without first 0) - 1 stays non-negative,
       replace v with that candidate.

    Args:
        qdv: Input sequence of integers representing a QDV.

    Returns:
        A list of integers representing the reduced Dyck vector.
    """
    if not qdv:
        return [0]

    v: List[int] = list(qdv)

    # Lift to Dyck (remove negatives) by adding 0 in front and +1 to all entries
    while any(x < 0 for x in v):
        v = [0] + [x + 1 for x in v]

    # Reduce length while possible without introducing negatives
    while len(v) > 1 and v[0] == 0:
        candidate = [x - 1 for x in v[1:]]
        if all(x >= 0 for x in candidate):
            v = candidate
        else:
            break

    return v


if __name__ == "__main__":
    # Minimal demo
    samples = [
        [0, 1, 1, 2, 2, 3, 3, 3, 2, 2],
        [0, 1, 2, 2, 1, 2, 2, 2, -1],
        [],
    ]
    for s in samples:
        print(f"in:  {s}")
        print(f"out: {reduce_qdv_to_reduced_dyck(s)}\n")


