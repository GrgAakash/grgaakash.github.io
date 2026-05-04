---
title: "The 19th Problem - Part III"
description: "De Giorgi's theorem: Hölder continuity of minimizers in all dimensions."
tags:
  - math495
  - hilbert-19
  - regularity
draft: false
---

[Printable PDF](/Math495/blog3.pdf). [[Math495/index|Math 495 hub]] · [[Math495/19th-Problem-Part-I|Part I]] · [[Math495/19th-Problem-Part-II|Part II]] · [[index|Garden home]]

# Introduction

Let's recap where we are. In [[Math495/19th-Problem-Part-I|Part I]], we looked at Hilbert's $19^{th}$ problem in two dimensions where we analyzed two methods: the "chopping argument," which used the energy cost of oscillation on boundary circles, and the quasiconformal argument, which forced the gradient map to have bounded distortion. Both gave us the same results of oscillation decay, and eventually the Hölder continuity of $\nabla u$. We also discussed how in dimensions greater than two, the chopping argument fails because the energy integral converges, so the gradient can "afford" to keep oscillating across planes forever without violating the [Caccioppoli bound](/Math495/19th-Problem-Part-II#Thm-Caccioppoli). The quasiconformal argument falls apart due to "too much" algebraic slack it invites. Due to this failure, we moved from a geometrical argument to a more analytical argument.

To that end, in [[Math495/19th-Problem-Part-II|Part II]], we introduced some necessary analytical toolkit and successfully bootstrapped our way to $\nabla u \in L^\infty$ (gradient is bounded) which was a good leap. However, just being bounded doesn't cut it. Recall the [vicious circle from Part I](/Math495/19th-Problem-Part-I#eq-linearized): to prove the solution is smooth, the classical theory (Schauder estimates) needs the coefficients $a_{ij}(x) = F_{ij}(\nabla u(x))$ be smooth and those coefficients are the gradient we're trying to prove smooth. So *how do we break this vicious circle is the main food for thought.*
The way to break this circle is to get just a *little* regularity (($C^\alpha$ control of the gradient)) for free, without assuming anything about the coefficients. If we can show $\nabla u \in C^\alpha$ for some $\alpha > 0$, then Schauder takes over and bootstraps us to $C^\infty$, and when $F$ is analytic, we eventually hope to get $C^\omega$.
*So the entire proof in $n$ dimensions reduces to one question: can we prove that $\nabla u$ is Hölder continuous, without assuming anything about the smoothness of the coefficients?*

The answer is yes. The tool that does it is De Giorgi's Theorem, published in 1957. Let's dive right into this.

# De Giorgi's Theorem

Before we get to De Giorgi's theorem, let's set up the problem. We start with something familiar, i.e. [Euler-Lagrange equation from Part I](/Math495/19th-Problem-Part-I#eq-euler-lagrange):

$$\text{div}(\nabla F(\nabla u)) = F_{ij}(\nabla u) \, u_{ij} = 0,$$

where $F$ is analytic and uniformly convex (meaning $D^2 F$ has eigenvalues between $\lambda$ and $\lambda^{-1}$).

We use an idea that we already saw in [Part I](/Math495/19th-Problem-Part-I#eq-linearized) which is to differentiate the whole equation with respect to $x_k$. If $u$ is smooth,[^1] we can move $\partial_k$ inside and get

$$\partial_i \big( F_{ij}(\nabla u) \, \partial_j (\partial_k u) \big) = 0, \quad k = 1, \ldots, n.$$

Let us analyze what just happened. Each component $v = \partial_k u$ of the gradient satisfies a *linear* equation in divergence form:

$$\partial_i \big( a_{ij}(x) \, \partial_j v \big) = 0,$$

where $a_{ij}(x) = F_{ij}(\nabla u(x))$. Because $F$ is uniformly convex, $a_{ij}$ has eigenvalues in $[\lambda, \lambda^{-1}]$. The equation for $v$ is *uniformly elliptic*.

But we don't yet know whether $\nabla u$ is continuous. So, the coefficients $a_{ij}(x) = F_{ij}(\nabla u(x))$ might be discontinuous. We only know they're *bounded* and *measurable*. So, the entire problem boils down to:

> If $v$ solves $\partial_i(a_{ij}(x) \partial_j v) = 0$ where the eigenvalues of $a_{ij}$ lie in $[\lambda, \lambda^{-1}]$, then
> $$\|v\|_{C^\alpha(B_{\frac{1}{2}})} \leq C(n, \lambda) \, \|v\|_{L^\infty(B_1)}$$
> for some $\alpha(n, \lambda) > 0$.

This is De Giorgi's theorem. Once we have it, $v = \partial_k u \in C^\alpha$, so $\nabla u \in C^\alpha$, and the vicious circle is broken. Now let's move towards the proof of it.

## A Two-Variable Model of the Proof

Before doing the proof in full generality, let us do the proof in two variables to get more used to the idea.

Suppose $u=u(x,y)$ minimizes (One thing to note is: The existence of a minizer is itself something worth pondering more on. Here we just assume it exists)

$$
J(u)=\int F(u_x,u_y)\,dx\,dy.
$$

From Part I, the Euler-Lagrange equation is

$$
\frac{\partial}{\partial x}\left(F_{p_1}(\nabla u)\right)
+\frac{\partial}{\partial y}\left(F_{p_2}(\nabla u)\right)=0.
$$

Now take one derivative of $u$, for example

$$
v=u_x.
$$

As in Part I, differentiating the Euler-Lagrange equation with respect to $x$ gives a linear equation for $v$:

$$
\frac{\partial}{\partial x}\left(a_{11}v_x+a_{12}v_y\right)
+\frac{\partial}{\partial y}\left(a_{21}v_x+a_{22}v_y\right)=0,
$$

where

$$
A(x,y)=
\begin{pmatrix}
a_{11} & a_{12}\\
a_{21} & a_{22}
\end{pmatrix}
=D^2F(\nabla u(x,y)).
$$

The entries $a_{ij}$ might be rough, because they depend on $\nabla u$. But uniform convexity says the matrix $A$ is never degenerate. In concrete terms, there are constants $0<\lambda<1$ such that

$$
\lambda(\xi_1^2+\xi_2^2)
\leq
a_{11}\xi_1^2+2a_{12}\xi_1\xi_2+a_{22}\xi_2^2
\leq
\lambda^{-1}(\xi_1^2+\xi_2^2)
$$

for every vector $\xi=(\xi_1,\xi_2)$. So the equation may have rough coefficients, but it is still elliptic.

Now imagine that, after subtracting a constant and dividing by another constant, we have normalized $v$ so that

$$
-1\leq v\leq 1
$$

on a disk. The goal is to prove that when we zoom into a smaller disk, the range of $v$ gets shorter. That is oscillation decay.

Here is how the De Giorgi proof sees this.

Pick a height $\kappa$, say $\kappa=\frac{1}{2}$, and look only at the part of $v$ above that height:

$$
v_\kappa=(v-\kappa)_+.
$$

This means

$$
v_\kappa=
\begin{cases}
v-\kappa, & v>\kappa,\\
0, & v\leq \kappa.
\end{cases}
$$

So $v_\kappa$ ignores everything below the level $\kappa$ and measures only the part of $v$ sticking above that level.

Now let us multiply by a cutoff function $\psi$. Think of $\psi$ as a smooth window meaning it equals $1$ on the smaller disk we care about and goes to $0$ before the boundary of a larger disk. The Caccioppoli inequality says (roughly speaking)

$$
\int |\nabla(v_\kappa\psi)|^2
\leq
C\int v_\kappa^2|\nabla\psi|^2.
$$

This is the first key step. It says that the energy of the part of $v$ above height $\kappa$ is controlled by how much of that part exists on the larger disk. Then Sobolev says that gradient control improves integrability. Simply speaking if a function has a controlled gradient energy, then it cannot concentrate too sharply on a tiny set. So Caccioppoli plus Sobolev says:

If the set where $v>\kappa$ is already small, then the part of $v$ above the next higher level is even smaller.

For example, compare two heights

$$
\tau=\frac{1}{2},
\qquad
\kappa=\frac{3}{4}.
$$

If very little of the disk lies above $\tau$, then even less can lie above $\kappa$. Repeating this with the levels

$$
\frac{1}{2},\quad \frac{3}{4},\quad \frac{7}{8},\quad \frac{15}{16},\quad \ldots
$$

forces the high-level sets to disappear in the smaller disk. To keep it simple, if $v$ is not large on much of the bigger disk, then it cannot suddenly become almost $1$ in the middle.
This is the $L^2\to L^\infty$ step.

The oscillation step uses the same idea from both sides. Suppose $v$ ranges between $-1$ and $1$ on the big disk. Then at least half of the disk satisfies either

$$
v\leq 0
$$

or

$$
v\geq 0.
$$

If $v\leq 0$ on a big piece, then the positive part of $v$ has trouble climbing all the way up to $1$ in the smaller disk. The estimate forces

$$
\sup_{B_{\frac{1}{2}}} v\leq 1-\epsilon.
$$

If instead $v\geq 0$ on a big piece, apply the same argument to $-v$. Then

$$
\inf_{B_{\frac{1}{2}}} v\geq -1+\epsilon.
$$

Either way, the range of values shrinks:

$$
\operatorname{osc}_{B_{\frac{1}{2}}} v
\leq
(1-\epsilon)\operatorname{osc}_{B_1} v.
$$

Then we repeat this on smaller and smaller disks:

$$
B_1,\quad B_{\frac{1}{2}},\quad B_{\frac{1}{4}},\quad B_{\frac{1}{8}},\quad \ldots
$$

Each zoom reduces the oscillation by a certain factor. That repeated shrinking is exactly what becomes Hölder continuity.

So the proof has three moves:

1. Use truncations like $(v-\kappa)_+$ to focus only on high values.
2. Use Caccioppoli plus Sobolev to show high-value sets shrink as the height rises.
3. Use that shrinking at every scale to force oscillation decay.

The formal proof below is the same argument, but written in a form that works in every dimension and for rough coefficient matrices.

## The $L^2 \to L^\infty$ Estimate

Before stating the first key result, we need a definition.

A *sub-solution* is a function $v$ satisfying $\partial_i(a_{ij} \partial_j v) \geq 0$ in the weak sense.

*What does this mean intuitively?*

Recall that a solution satisfies $\partial_i(a_{ij} \partial_j v) = 0$, which is a generalization of $\Delta v = 0$. Replacing the equality with $\geq 0$ is like saying the function is allowed to curve upward more than a solution would, but never more downward. In the special case of Laplace's equation, $\Delta v \geq 0$ means $v$ at any point is bounded above by its average on surrounding balls. Sub-solutions are the same idea, but for our rougher equation.

The first ingredient of De Giorgi's proof says something intuitive: sub-solutions can't have interior upward spikes. If a sub-solution is small in an $L^2$ sense, it must be small pointwise in the interior.

<span id="thm-l2-linfty"></span>

> [!abstract] Theorem 1 ($L^2 \to L^\infty$ Estimate)
> Assume that $\partial_i(a_{ij}(x) \partial_j v) \geq 0$ in $B_2 \subset \mathbb{R}^n$. Then
> $$\sup_{B_1} v \leq C(n, \lambda) \, \|v_+\|_{L^2(B_2)},$$
> where $v_+ = \max\{v, 0\}$.

So the pointwise max on the interior ball is controlled by the $L^2$ size on the bigger ball.

*Why should this be true?*
We already know two things from [[Math495/19th-Problem-Part-II|Part II]]:

1. **[Caccioppoli](/Math495/19th-Problem-Part-II#Thm-Caccioppoli)** says the gradient energy on a smaller ball is controlled by the function's $L^2$ norm on a larger ball:
$$\int_{B_{\frac{r}{2}}} |\nabla v|^2 \, dx \leq \frac{C}{r^2} \int_{B_r} v^2 \, dx.$$
It says the equation doesn't allow the solution to oscillate too wildly.

2. **[Sobolev](/Math495/19th-Problem-Part-II#Thm-Sobolev-Ineq)** says having $\nabla v \in L^2$ forces $v$ into a strictly better $L^p$ space:
$$\|v\|_{L^{2^*}} \leq C \, \|v\|_{W^{1,2}}, \quad \text{where } 2^* = \frac{2n}{n-2} > 2.$$

Now here's the key insight. Caccioppoli converts $L^2$ information about $v$ into $L^2$ information about $\nabla v$. Sobolev then converts that into $L^{2^*}$ information about $v$, where $2^* > 2$. So composing the two, we go from $v \in L^2$ to $v \in L^{2^*}$. We've *gained integrability*. And since $v \in L^{2^*}$ is just another $L^p$ space, nothing stops us from repeating the argument, but now starting from a better exponent.

Each trip around this loop, the exponent goes up. After enough iterations, the exponent is so large that $L^p$ control effectively gives $L^\infty$ control.[^2] This is the essence of the $L^2 \to L^\infty$ estimate: a *feedback loop* between the Caccioppoli and Sobolev that keeps tightening until the function is trapped.

### The proof

Let's make this precise. For any $\kappa \in \mathbb{R}$, define the truncation $v_\kappa := (v - \kappa)_+ = \max(v - \kappa, \, 0)$. This just chops off everything below the height $\kappa$ and shifts the rest down. Since $v$ is a sub-solution and the map $t \mapsto \max(t - \kappa, 0)$ is convex and increasing, $v_\kappa$ is also a sub-solution. So, Caccioppoli applies to $v_\kappa$.

Using Caccioppoli on $v_\kappa$ (multiplied by a *cutoff function* $\psi$, a smooth function that equals $1$ on a smaller ball and smoothly drops to $0$ outside a larger ball[^3]) and then applying Sobolev, we get after some work with Hölder's inequality:

$$\int v_\kappa^2 \psi^2 \leq C(n, \lambda) \left( \int v_\kappa^2 |\nabla \psi|^2 \right) \big|\{v_\kappa \psi^2 > 0\}\big|^{\frac{2}{n}}.$$

Now let $0 \leq \tau < \kappa \leq 1$. Choose $\psi$ to be a standard cutoff: $1$ on $B_{2-\kappa}$, zero outside $B_{2-\tau}$. Define

$$V(s) := \int_{B_{2-s}} v_s^2 \, dx.$$

Substituting, we arrive at the key recursive inequality:

$$V(\kappa) \leq \frac{C}{(\kappa - \tau)^{2 + \frac{4}{n}}} \, V(\tau)^{1 + \frac{2}{n}}.$$

Notice that exponent on the right is strictly greater than $1$. This is the whole game.

If the power were exactly $1$, we'd just get $V(\kappa) \leq C  V(\tau)$ that tells us nothing. But because the power is *superlinear*, small inputs get crushed. If $V$ is already small, then $V^{1+\frac{2}{n}}$ is *much* smaller than $V$. Each iteration shrinks $V$ faster than the last. If $V(0)$ starts sufficiently small (depending on $n$ and $\lambda$), iterating forces $V(1) = 0$.

$V(1) = 0$ means $v_1 = (v-1)_+ = 0$ in $B_1$, i.e., $v \leq 1$ in $B_1$. And since we can always normalize $\|v_+\|_{L^2(B_2)}$ to be small (just divide $v$ by a large constant and the equation is linear), we get

$$\sup_{B_1} v \leq C(n, \lambda) \, \|v_+\|_{L^2(B_2)}.$$

## Oscillation Decay

The $L^2 \to L^\infty$ estimate tells us sub-solutions can't spike. That's useful, but we need the *oscillation* of a solution to shrink as we zoom in. This shrinking is what gives Hölder continuity.

In [[Math495/19th-Problem-Part-I|Part I]], we got oscillation decay from the chopping argument. Here we'll get it by a completely different method, one that works in every dimension.
<span id="prop-oscillation-decay"></span>

> [!abstract] Proposition 2 (Oscillation Decay)
> Assume $\partial_i(a_{ij}(x) \partial_j v) \geq 0$ in $B_1 \subset \mathbb{R}^n$. For any $\delta > 0$, there exists $\epsilon(n, \lambda, \delta) > 0$ such that if
> $$|\{v_+ = 0\} \cap B_1| \geq \delta \, |B_1|,$$
> then
> $$\sup_{B_{\frac{1}{2}}} v \leq (1 - \epsilon) \sup_{B_1} v_+.$$

*What does this say?* If a sub-solution is zero (or negative) on a decent chunk of the ball (at least a fraction $\delta$ of the volume), then its maximum *must drop* when we step inside to $B_{\frac{1}{2}}$. It can't stay close to its boundary maximum throughout the interior. The interior has to separate.

This is a *quantitative* maximum principle. The classical version, which we used in [Part I](/Math495/19th-Problem-Part-I), says sub-solutions can't have interior maxima. Proposition 2 is stronger: they can't even get *close* to the maximum deep inside, and the gap depends only on $n$, $\lambda$, and $\delta$, not on any smoothness of the coefficients.

Imagine a sub-solution $v$ in $B_1$ with $\sup_{B_1} v_+ = 1$, and suppose the set where $v \leq 0$ takes up at least a $\delta$-fraction of the ball. For $v$ to stay close to $1$ on the smaller ball $B_{\frac{1}{2}}$, it would have to climb from $0$ to nearly $1$ somewhere. But $H^1$ functions cannot do this for free, since they have to "pay" in gradient energy for every level set they cross. On the other hand, Caccioppoli puts a cap on the total energy budget. So if the function is zero on a sizable part of the ball, it cannot stay close to its maximum value $1$ throughout the smaller ball $B_{\frac{1}{2}}$. Something has to give, and what gives is the maximum.

### The proof

We'll show a slightly weaker version to keep things clean. Assume $v$ is a sub-solution in $B_2$ with $\sup_{B_2} v_+ = 1$ and $|\{v_+ = 0\} \cap B_1| \geq \delta |B_1|$. We want $\sup_{B_{\frac{1}{2}}} v \leq 1 - \epsilon$.

Define the distribution function

$$W(s) := \frac{|\{v \leq s\} \cap B_1|}{|B_1|}, \quad s \in [0, 1].$$

This $W$ is nondecreasing. Our hypothesis says $W(0) \geq \delta > 0$, and we want to show it reaches $1$ (or close to it) before $s$ reaches $1$.

For $0 \leq s < t \leq 1$, define

$$w = \frac{(v - s)_+}{1 - s},$$

so $0 \leq w \leq 1$. Let $\bar{w} = \min\left\{w, \, \frac{t-s}{1-s}\right\}$, which is $w$ capped at a certain height.

Now we hit $\bar{w}$ with two inequalities pulling in opposite directions:

Since $w \leq 1$ is a sub-solution, Caccioppoli bounds $\int |\nabla w|^2$, and Cauchy-Schwarz gives

$$\int_{B_1} |\nabla \bar{w}| \leq C(n, \lambda) \, (W(t) - W(s))^{\frac{1}{2}}.$$

The function $\bar{w}$ equals $0$ on $\{v \leq s\}$ and $\frac{t-s}{1-s}$ on $\{v \geq t\}$. It's stuck at two different heights on two sets of definite measure. To get between them, $\bar{w}$ needs gradient:

$$\int_{B_1} |\nabla \bar{w}| \geq c(n) \, W(s) \, (1 - W(t)) \, \frac{t - s}{1 - s}.$$

Combining:

$$W(s) \left(1 + c(n,\lambda) \, \frac{(t-s)^2}{(1-s)^2} \, W(s) \, (1 - W(t))^2 \right) \leq W(t).$$

Now set $b_k = W(1 - 2^{-k})$ and $a_k = 1 - b_k$. The inequality becomes

$$a_{k+1} \leq a_k - c \, a_k^2,$$

where $c > 0$ depends on $n$, $\lambda$, $\delta$. This is a nice recurrence. A direct induction[^4] gives $a_k \leq \frac{1}{1 + ck} \to 0$, so $W(1 - 2^{-k}) \to 1$.

In particular, there's some $\epsilon(n, \lambda, \delta) > 0$ such that the sub-solution $\bar{v} = \frac{[v - (1-2\epsilon)]_+}{2\epsilon}$ has $L^2$ norm small enough that [Theorem 1](#thm-l2-linfty) gives $\bar{v} \leq \frac{1}{2}$ in $B_{\frac{1}{2}}$. Unwinding, $v \leq 1 - \epsilon$ in $B_{\frac{1}{2}}$. The maximum has dropped.

## Hölder Continuity

We're almost there. Here's how we go from oscillation decay to full Hölder continuity.

If $v$ solves $\partial_i(a_{ij} \partial_j v) = 0$, then both $v$ and $-v$ are sub-solutions (since flipping the sign flips the inequality). So we can apply [Proposition 2](#prop-oscillation-decay) to both. After shifting and rescaling so that $\inf_{B_1} v = -1$ and $\sup_{B_1} v = 1$, at least one of $\{v \leq 0\}$ or $\{v \geq 0\}$ has measure $\geq \frac{|B_1|}{2}$.[^5] If $\{v \leq 0\}$ is big, apply [Proposition 2](#prop-oscillation-decay) to $v$: the sup drops to $1 - \epsilon$ on $B_{\frac{1}{2}}$. If $\{v \geq 0\}$ is big, apply it to $-v$: the inf rises to $-1 + \epsilon$ on $B_{\frac{1}{2}}$. Either way:

$$\text{osc}_{B_{\frac{1}{2}}} \, v \leq \left(1 - \frac{\epsilon}{2}\right) \, \text{osc}_{B_1} \, v.$$

Now, the nice thing is that this decay works at *every scale*. If $v$ solves the equation in a ball of radius $r$, we can rescale by defining $\tilde{v}(x) = v(rx)$, which solves the same type of equation in $B_1$. So the oscillation decay applies to any ball, not just $B_1$:

$$\text{osc}_{B_{\frac{r}{2}}} \, v \leq (1 - \epsilon) \, \text{osc}_{B_r} \, v.$$

Iterating $k$ times:

$$\text{osc}_{B_{2^{-k}}} \, v \leq (1 - \epsilon)^k \, \text{osc}_{B_1} \, v.$$

Setting $r = 2^{-k}$: <span id="eq-osc-power"></span>

$$\text{osc}_{B_r} \, v \leq r^{\alpha} \, \text{osc}_{B_1} \, v, \quad \text{where } \alpha = \frac{\log\!\left(\frac{1}{1-\epsilon}\right)}{\log 2} > 0.$$

When we compare this to [Part I](/Math495/19th-Problem-Part-I#eq-holder), we see that there we had the same kind of estimate, $\omega(r) \leq C r^\alpha$. We got the same conclusion (oscillation decays as a power of the radius) but by a completely different approach. In Part I it came from the geometry of 2D whereas here it comes from the interplay of Caccioppoli and Sobolev, which works in *every* dimension.

This power-law decay is exactly Hölder continuity:

$$\|v\|_{C^\alpha(B_{\frac{1}{2}})} \leq C(n, \lambda) \, \|v\|_{L^\infty(B_1)}.$$

And that is it. This is the De Giorgi's theorem which proves the key estimate.

# Putting It Together

We've now proved all three steps of De Giorgi's theorem: the $L^2 \to L^\infty$ estimate, the oscillation decay, and Hölder continuity. *So have we solved the Hilbert's 19^{th} problem?* Not quite, we still have some work to do. Let us look at the chain below which will clear things for us:

| | Step | Tool |
|---|---|---|
| 1 | $u$ minimizes $J(u) = \int F(\nabla u)\,dx$, with $\nabla u \in L^\infty$ | (from [[Math495/19th-Problem-Part-II|Part II]]) |
| 2 | Each $v = \partial_k u$ solves $\partial_i(a_{ij}(x)\,\partial_j v) = 0$ (uniformly elliptic, rough coefficients) | differentiate the E-L equation |
| **3** | **$\nabla u \in C^\alpha$ (the vicious circle is broken)** | **De Giorgi's theorem** |
| 4 | $u \in C^{2,\alpha} \to C^{3,\alpha} \to C^{4,\alpha} \to \cdots \to u \in C^\infty$ | Schauder estimates[^6] |
| 5 | $u \in C^\omega$ (the minimizer is real analytic) | $F$ is analytic $\Rightarrow$ $u$ is analytic |

The only steps we haven't discussed much are the last two. We won't go into much detail about Schauder estimates but to give a brief overview of how Schauder comes into play: once De Giorgi gives us $\nabla u \in C^\alpha$, the coefficients $F_{ij}(\nabla u)$ are $C^\alpha$ too, so Schauder gives $u \in C^{2,\alpha}$. But now $\nabla u \in C^{1,\alpha}$, so the coefficients are $C^{1,\alpha}$. We use Schauder again and get $u \in C^{3,\alpha}$. Each iteration we gain more smoothness, and this never stops. Since $u \in C^{k,\alpha}$ for every $k$, we get $u \in C^\infty$. The final step from $C^\infty$ to $C^\omega$ uses the fact that $F$ itself is analytic. One can carefully estimate the growth of higher derivatives $\|D^k u\|_{L^\infty} \leq C^k k!$, which is exactly the condition that guarantees the Taylor series of $u$ converges. And that ladies and gentlemen is how we deal with Hilbert's $19^{th}$ problem, in all dimensions.

[^1]: To emphasize ideas, we'll assume $u$ is smooth and derive estimates that don't depend on this assumption. These are called *a priori* ("before the fact") estimates. The rigorous extension to weak solutions uses standard approximation arguments, but the ideas are the same.

[^2]: Recall that $\|v\|_{L^p} \to \|v\|_{L^\infty}$ as $p \to \infty$. So once the exponent is large enough, we basically have pointwise control.

[^3]: Why do we need cutoffs? We want to localize our estimates to a specific region. The cutoff $\psi$ acts like a smooth "window" that lets us focus on one ball without worrying about boundary effects.

[^4]: If $0 \leq a_{k+1} \leq a_k - c\,a_k^2$ with $a_0 \leq 1$, then $a_k \leq \frac{1}{1+ck}$. The idea: $a_k \geq \frac{1}{1+ck}$ implies $a_k^2 \geq \frac{a_k}{1+ck}$, so the drop $ca_k^2$ is at least $\frac{ca_k}{1+ck}$, which is exactly the decrease we need.

[^5]: Pigeonhole: the two sets cover all of $B_1$, so at least one has half the measure.

[^6]: Roughly, solutions to elliptic equations are "two derivatives more regular" than their coefficients. $C^\alpha$ coefficients give $C^{2,\alpha}$ solutions.
