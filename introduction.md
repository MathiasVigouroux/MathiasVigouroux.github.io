## For the sake of visualization clarity,

The box plots in Figure 2 and Figure 3 do not include outliers: the whiskers represent the first and third quartiles. For naturally occurring induction, we selected 1000 sequences from C4 that contained a repeated n-gram (n=6) and met our filtering criteria (each n-gram must be unique and contain no duplicate tokens).

The BOS and mean attention output ablation experiments were each carried out on one hundred 100-token input sequences. Baselines for BOS ablation consisted of 6 single-head ablations, 3 two-head ablations, and 3 three-head ablations. Mean attention to BOS (used for baseline selection) was calculated using 1000 sequences from C4. To calculate prefix matching scores for attention heads, we use 1024 sequences of duplicated random tokens.
