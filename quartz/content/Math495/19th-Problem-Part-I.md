---
title: "The 19th Problem — Part I (2D)"
description: "Hilbert's 19th problem, 2D regularity, and why minimizers become smooth."
tags:
  - math495
  - hilbert-19
  - regularity
draft: false
---

[Printable PDF](/Math495/blog.pdf). [[Math495/index|Math 495 hub]] · [[index|Garden home]]

Have you ever wondered why soap bubbles are spherical, or why soap films look like they are pulling themselves into the shape of the least possible area, or why the light moving through glass of varying density bends and curves to find the fastest route, not the straightest one.

![A soap film on a wire frame.](Math495/media/SoapFilm.jpeg)

*A soap film on a wire frame.*



In each case, nature is quietly solving an optimization problem. Something is being minimized, whether it is the area or the time.

One thing to note is that even if the wire frame itself, the boundary, has sharp, jagged corners, the soap film suspended inside is perfectly smooth. It is definitely interesting to ponder on why the film develops no gaps, tears, or defects.

*Why should this be true? And more importantly: must it always be true?*

Before answering this, let’s rewind to the dawn of the $20^{th}$ century. In the International Congress of Mathematicians held at Paris in August 1900, the German Mathematician David Hilbert proposed $23$ problems, most of which would prove to be very influential in the coming century. [^1]

![David Hilbert (1862–1943)](Math495/media/Hilbert.jpg)

*David Hilbert (1862–1943)*



While many of his problems arose due to the urge to understand the foundational bedrock of Mathematics like the continuum hypothesis, a few were inspired by physics. Belonging to the latter category is the topic of our blog, which is the $19^{th}$ problem.

Hilbert was fascinated by the observation that physical principles, usually cast as variational problems like the principle of least action, seemed to produce solutions of remarkable smoothness.

These are but special cases of a universal variational principle. Hilbert observed that such analytic solutions arise from minimizing functional integrals of the form: <span id="eq-functional"></span>

$$
J(u) = \int_{B_1} F(\nabla u) \, dx,
$$
 where the function $F$ (often called the Lagrangian) is analytic and *strictly convex*. In the language of linear algebra, convexity here means the Hessian matrix of $F$ is positive definite (specifically, $\det(D^2 F) > 0$).

*The question is this: If the energy function $F$ is analytic, does it follow that the minimizing configuration $u$ is also analytic?*

Intuitively, the answer seemed to be yes. To prove it, we translate the minimization problem into an equation. We know from single-variable calculus that if $f(x)$ has a minimum at $x_0$, then $f'(x_0) = 0$. We apply the same logic here.

Suppose $u(x)$ is the true solution. Imagine we distort this solution by adding a small "perturbation" $\phi(x)$, scaled by a tiny number $\epsilon$: $$u_\epsilon(x) = u(x) + \epsilon \phi(x).$$

Since $u$ is a minimizer, the derivative of the energy with respect to $\epsilon$ must be zero at $\epsilon = 0$: $$\frac{d}{d\epsilon} J(u + \epsilon \phi) \bigg|_{\epsilon=0} = 0.$$

![Figure](Math495/media/tikz-export/a1-tikz-1.png)



Let us carry out the computation. We need $\frac{d}{d\epsilon}\big|_{\epsilon = 0} J(u + \epsilon\phi)$. Pulling the derivative inside the integral and applying the Chain Rule to $F$: $$\frac{d}{d\epsilon}\bigg|_{\epsilon=0} \int_{B_1} F(\nabla u + \epsilon \nabla\phi)\,dx
= \int_{B_1} \sum_{i=1}^n \frac{\partial F}{\partial p_i}(\nabla u) \cdot \frac{\partial \phi}{\partial x_i}\,dx.$$ Now integrate by parts in each term. Since $\phi$ vanishes on $\partial B_1$, the boundary contributions disappear:[^2] $$= -\int_{B_1} \sum_{i=1}^n \frac{\partial}{\partial x_i}\!\left(\frac{\partial F}{\partial p_i}(\nabla u)\right) \phi\,dx.$$ For this to vanish for every test function $\phi$, the integrand itself must be zero. That gives the Euler-Lagrange equation: <span id="eq-euler-lagrange"></span>

$$
\operatorname{Div}(\nabla F(\nabla u)) = 0.
$$


One more Chain Rule expands the left side. Since $\frac{\partial F}{\partial p_i}(\nabla u(x))$ depends on $x$ through $\nabla u$: $$\frac{\partial}{\partial x_i}\!\left(\frac{\partial F}{\partial p_i}(\nabla u)\right)
= \sum_{j=1}^n \frac{\partial^2 F}{\partial p_i \partial p_j}(\nabla u)\cdot u_{x_i x_j}
= \sum_{j=1}^n F_{ij}(\nabla u)\, u_{ij}.$$ Summing over $i$: <span id="eq-euler-lagrange-expanded"></span>

$$
\sum_{i,j=1}^n F_{ij}(\nabla u)\, u_{ij} = 0,
$$
 where $F_{ij}$ is the $(i,j)$ entry of the Hessian of $F$ and $u_{ij} = \frac{\partial^2 u}{\partial x_i \partial x_j}$.
*What does this look like for a specific $F$?*

Take $F(p) = |p|^2 = p_1^2 + \cdots + p_n^2$, so $J(u) = \int_{B_1}|\nabla u|^2\,dx$ is the Dirichlet energy, measuring the total "effort" of the function. Then $\frac{\partial F}{\partial p_i} = 2p_i$, and [→](#eq-euler-lagrange) becomes: $$\operatorname{Div}(2\nabla u) = 2\Delta u = 0.$$

The minimizer satisfies Laplace’s equation. Harmonic functions have been known to be infinitely smooth since the 19th century, so there is no mystery here. The Hessian is just $F_{ij} = 2\delta_{ij}$, a constant, so the coefficients $a_{ij}(x)$ do not depend on $\nabla u$ at all.

The trouble starts when $F$ is genuinely nonlinear: then $F_{ij}(\nabla u(x))$ varies across the domain and can be discontinuous.

Here comes the trouble. To see why, differentiate [→](#eq-euler-lagrange) with respect to $x_k$ and let $v = \partial_k u$. Writing the Euler-Lagrange equation as $\partial_i(F_i(\nabla u)) = 0$ where $F_i = \frac{\partial F}{\partial p_i}$, differentiating in $x_k$ gives: $$\partial_i\!\left(\partial_k F_i(\nabla u)\right) = 0.$$

Applying the Chain Rule to $\partial_k F_i(\nabla u) = \sum_j F_{ij}(\nabla u)\,\partial_j(\partial_k u) = \sum_j F_{ij}(\nabla u)\,\partial_j v$ yields a linear equation for $v$: <span id="eq-linearized"></span>

$$
\sum_{i,j=1}^n \frac{\partial}{\partial x_i} \Big( a_{ij}(x) \frac{\partial v}{\partial x_j} \Big) = 0, \quad \text{where } a_{ij}(x) = F_{ij}(\nabla u(x)).
$$
 Each partial derivative $v = \partial_k u$ of the minimizer satisfies a linear elliptic equation with coefficients $a_{ij}(x) = F_{ij}(\nabla u(x))$.

![Charles Morrey Jr. (1907–1984)](Math495/media/Charles_Morrey_Jr.jpeg)

*Charles Morrey Jr. (1907–1984)*



However, the coefficients $a_{ij}(x) = F_{ij}(\nabla u(x))$ of this new linearized equation [→](#eq-linearized) depend intrinsically on the unknown gradient. If we assume only that $u$ has bounded slope so that the gradient $\nabla u$ is bounded but not known to be continuous, then these coefficients are bounded, but they may be discontinuous.

We are thus caught in a vicious circle: to prove the coefficients are smooth, we need the solution’s gradient to be smooth; but to prove the solution is smooth, the classical theory demands the coefficients be smooth. This “gap” between having a bounded slope versus a continuous slope was what Morrey later called the “sad state of affairs” that hindered progress for decades.

The solution was finally achieved by bridging this gap. Let us illustrate the strategy in 2D, using geometric intuition.

You are likely familiar with the gradient $\nabla u$ as a vector field pointing in the direction of steepest increase. But for this problem, we need a shift in perspective. Imagine mapping every point $x$ in our domain not to its height $u(x)$, but to its slope vector $\nabla u(x)$. This creates a “gradient map” from the physical domain into a “plane of slopes.”
*The core question of regularity is simply: Is this map continuous? Or can the slope jump abruptly from one value to another, creating a sharp crease or kink in our soap film?*

![The Gradient Map. This map takes a location x in the physical domain (left) and sends it to its corresponding slope vect](Math495/media/tikz-export/a1-tikz-2.png)

*The Gradient Map. This map takes a location x in the physical domain (left) and sends it to its corresponding slope vector ∇u(x) in the plane of slopes (right). If the solution is smooth, the red "blob" of slopes will be connected. If the solution has a crease, this blob will be torn apart.*



Imagine the image of the gradient map $\nabla u$ as a region, a "blob," in the plane. Fix a direction $e$ (a unit vector) and consider the strip in the gradient plane between two parallel lines perpendicular to $e$, defined by values $a < b$.

Let $v(x) = \nabla u(x) \cdot e$ be the corresponding directional derivative. If the gradient image $\nabla u(B_r)$ crosses this strip, it means $v$ takes values both below $a$ and above $b$ within the ball $B_r$.

![Chopping the gradient image with parallel strips in many directions forces ∇u(Br) to lie entirely on one side of each st](Math495/media/tikz-export/a1-tikz-3.png)

*Chopping the gradient image with parallel strips in many directions forces ∇u(Br) to lie entirely on one side of each strip as r → 0. The image is squeezed toward a single point, which is exactly what continuity of ∇u means.*



Here we use the Maximum Principle. The Maximum Principle is a powerful property of elliptic equations. You’ve seen a special case already: Laplace’s equation $\nabla^2 u = 0.$ Its solutions (harmonic functions) obey the Mean Value Property and the Maximum Principle: the maximum and minimum occur on the boundary. Our linearized equation [→](#eq-linearized) is a generalization of Laplace’s equation with variable coefficients $a_{ij}(x)$. The principle still holds: the oscillation of $v$ inside a ball is controlled by its oscillation on the boundary-like how the temperature at the center of a room is bounded by the temperatures on the walls.

In simple terms, for elliptic equations, the values inside a domain are controlled by the values on the boundary (much like temperature in a room is controlled by the walls). By this principle, if $v$ oscillates inside $B_r$, it must oscillate at least as much on the boundary circle $\partial B_r$. This allows us to restrict our attention to the boundary.

To see whether this oscillation can persist as $r \to 0$, we measure its energy cost. Work in polar coordinates $(r, \theta)$ centered at the point in question. On the circle $\partial B_r$, the value of $v$ traces a path as $\theta$ runs from $0$ to $2\pi$. By the Fundamental Theorem of Calculus: $$\operatorname{osc}_{\partial B_r} v \le \int_0^{2\pi} \left|\frac{\partial v}{\partial \theta}\right| d\theta.$$

By Cauchy-Schwarz, and using the geometric fact that $|\partial_\theta v| \le r|\nabla v|$: $$\left(\operatorname{osc}_{\partial B_r} v\right)^2 \le 2\pi r^2 \int_0^{2\pi} |\nabla v|^2\,d\theta.$$

So the squared oscillation on $\partial B_r$ is controlled by the gradient energy on that circle. Now if the oscillation were at least $\delta > 0$ on every circle $\partial B_r$ for $r \in \left(\rho, \frac{1}{2}\right)$, then $r\int_0^{2\pi}|\nabla v|^2 d\theta \gtrsim \frac{\delta^2}{r}$ for each such $r$. Integrating over all those radii: $$\int_{B_{\frac{1}{2}}} |\nabla v|^2\,dx
= \int_0^{\frac{1}{2}}\!\left(r\int_0^{2\pi}|\nabla v|^2\,d\theta\right)dr
\gtrsim \delta^2 \int_\rho^{\frac{1}{2}} \frac{dr}{r}
= \delta^2\ln\!\left(\frac{1}{2\rho}\right).$$ As $\rho \to 0$, the right side blows up. Persistent oscillation on every circle forces the total gradient energy to be infinite. Rearranged as a usable bound, this is the Courant-Lebesgue lemma: <span id="eq-courant-lebesgue"></span>

$$
\left(\operatorname{osc}_{\partial B_r} v\right)^2 \le \frac{\pi}{\ln\!\left(\frac{1}{2r}\right)} \int_{B_{\frac{1}{2}}} |\nabla v|^2 \, dx.
$$
 As $r \to 0$, the factor $\frac{1}{\ln\!\left(\frac{1}{2r}\right)}$ goes to zero. So if the total gradient energy on the right is finite, the oscillation must shrink to zero as we zoom in. That is continuity at the center.

Now the argument closes quickly. Suppose, for contradiction, the oscillation stays at least $\delta > 0$ on every circle $\partial B_r$. Then [→](#eq-courant-lebesgue) forces: $$\int_{B_{\frac{1}{2}}} |\nabla v|^2\,dx \ge \frac{\delta^2\ln\!\left(\frac{1}{2r}\right)}{\pi} \to \infty \quad\text{as }r \to 0.$$

But the left side is a fixed finite number. This finiteness is the content of the Caccioppoli inequality, which we prove from scratch in [[Math495/19th-Problem-Part-II|Part II]]. For now we state it as a fact:[^3] <span id="eq-caccioppoli"></span>

$$
\int_{B_{\frac{1}{2}}} |\nabla v|^2 \, dx \le C \int_{B_1} v^2 \, dx < \infty.
$$

Persistent oscillation needs infinite energy. Caccioppoli says the energy is finite. Contradiction.

Therefore, for sufficiently small $r$, the gradient image $\nabla u(B_r)$ cannot cross the strip. It must lie entirely on one side. By "chopping" with strips in various directions, we force the gradient image to localize to a single point as $r \to 0$. Thus, $\nabla u$ is continuous.

In 3D, we analogously attempt to trap the gradient using parallel planes. If the gradient persists in crossing these planes, it again implies a singularity with characteristic scale $|\nabla v| \sim \frac{\delta}{r}$. However, the geometric measure of the boundary, surface area, now scales as $r^2$.

The energy integral in 3D becomes:

$$\text{Energy}_{3D} = \int_{0}^{1} \left( \int_{\partial B_r} |\nabla v|^2 \, d\sigma \right) dr.$$ Substituting the 3D scaling factor ($d\sigma \sim 4\pi r^2$): $$\text{Energy}_{3D} \sim \int_{0}^{1} \left( \frac{\delta}{r} \right)^2 \cdot (4\pi r^2) \, dr \sim 4\pi \delta^2 \int_{0}^{1} 1 \, dr = 4\pi \delta^2 < \infty.$$

There is no contradiction. The integral converges, meaning the energy cost of a persistent singularity is finite. The gradient can "afford" to keep oscillating across the planes forever without violating the global energy bounds.

While the “chopping” argument above relies on energy estimates, there is a second, completely different reason why 2D solutions are smooth. This second method relies on a "happy accident of geometry," a special feature that disappears in higher dimensions.

The linearized equation implies that the gradient map $\nabla u: \mathbb{R}^2 \to \mathbb{R}^2$ behaves like a linear transformation with bounded distortion. Recall from linear algebra that a matrix $A$ maps the unit circle to an ellipse. The "distortion" is determined by the condition number, the ratio of eigenvalues: <span id="eq-distortion"></span>

$$
K = \frac{|\lambda_{\max}|}{|\lambda_{\min}|}.
$$


![Action of a linear map on the unit circle and the induced distortion.](Math495/media/tikz-export/a1-tikz-4.png)

*Action of a linear map on the unit circle and the induced distortion.*



You might wonder: *Why is this distortion $K$ bounded?*

In 2D, the linearized equation $\sum a_{ij}v_{ij} = 0$ acts as a tight "lock" on the eigenvalues $\mu_1, \mu_2$ of the Hessian matrix $D^2u$. Since the coefficient matrix $a_{ij}$ is positive definite, for the weighted sum of eigenvalues to be zero, $\mu_1$ and $\mu_2$ must have opposite signs.

More importantly, the uniform ellipticity constants $[\lambda, \lambda^{-1}]$ force their magnitudes to be comparable: $$|\mu_1| \approx |\mu_2|.$$ Because they are "locked" together, one eigenvalue cannot grow large without the other growing continuously with it. This ensures that their ratio $K = \frac{|\mu_{\text{max}}|}{|\mu_{\text{min}}|}$ stays finite. Geometrically, this means the gradient map is *quasiconformal*: it transforms infinitesimal circles into ellipses of bounded eccentricity, a property known to strictly enforce continuity.

In higher dimensions, this "safety net" vanishes. Let’s take 3D as an example, we still have a single scalar equation $\sum a_{ij}v_{ij} = 0$, but now it must constrain three eigenvalues $\mu_1, \mu_2, \mu_3$. This single constraint is too weak to lock them together. Imagine a scenario where one eigenvalue is massive, and the other two are small and negative. The equation can still be satisfied, but the distortion ratio may blow up.

This allows the map to stretch space infinitely in one direction while remaining a valid solution to the equation. Consequently, the gradient map in 3D loses the quasiconformal property, and the geometric guarantee of regularity is lost.

How does preventing a circle from stretching into a thin ellipse guarantee that the solution is smooth? The link is provided by Mori’s Theorem. The theorem states that any map with bounded distortion $K$ (a $K$-quasiconformal map) is automatically Hölder continuous with an exponent $\alpha$ determined by the dimension and the distortion. Specifically, for dimension $n \ge 2$: $$\alpha = K^{\frac{1}{1-n}}.$$

In our specific 2D, this exponent simplifies elegantly: $$\alpha = K^{\frac{1}{1-2}} = K^{-1} = \frac{1}{K}.$$ This provides a direct translation from geometry to analysis: if the distortion $K$ is finite, the Hölder exponent $\alpha$ is positive. Intuitively, this means that because the map cannot stretch space infinitely, it cannot "tear" values apart. Points that are close in the domain are forced to map to values that are close in the range.
Mathematically, both the "chopping" argument and the "bounded distortion" argument enforce the same decay estimate. If we shrink the radius by a factor $\delta$, the oscillation drops by a fixed fraction: <span id="eq-recurrence"></span>

$$
\omega(\delta r) \le \frac{1}{2} \omega(r) \implies \omega(\delta^k) \le 2^{-k} \omega(1).
$$


This implies that the oscillation decays as a power of the radius: <span id="eq-holder"></span>

$$
\omega(r) \le C r^\alpha.
$$


[→](#eq-holder) guarantees that the gradient $\nabla u$ is continuous with a controlled rate of convergence (Hölder continuity). Thus, in the planar case, the specific geometry of 2D forces regularity. The wild oscillations are controlled by the very cost of their existence.

In two dimensions, geometry does the heavy lifting. But the same geometric arguments fail in three and higher dimensions, for the reasons we saw above. In Part II, we abandon the geometric approach entirely and build an analytical toolkit that works in every dimension: weak derivatives, Sobolev spaces, and the Sobolev and Caccioppoli inequalities — including a full proof of the Caccioppoli bound we used above.

[^1]: He actually had a list of $24$ problems but he chose to publish only $23$.

[^3]: The Caccioppoli inequality is derived in [[Math495/19th-Problem-Part-II|Part II]] from the elliptic structure of the equation together with a cutoff function argument. Here we need only its conclusion: gradient energy on a smaller ball is controlled by the $L^2$ norm of $v$ on a larger ball.

[^2]: The higher-dimensional integration by parts formula is $\int_\Omega f\,\partial_{x_i} g\,dx = -\int_\Omega (\partial_{x_i} f)\,g\,dx + \int_{\partial\Omega} fg\,\nu_i\,d\sigma$, where $\nu_i$ is the $i$-th component of the outward normal. Since $\phi = 0$ on $\partial B_1$, the surface term vanishes.
