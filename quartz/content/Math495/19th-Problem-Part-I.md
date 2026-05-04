---
title: "The 19th Problem - Part I (2D)"
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



Let us carry out the computation slowly in two variables first, since that is the easiest place to see the pattern. Write

$$
\nabla u = (u_x,u_y),
$$

so the energy becomes

$$
J(u)=\int_{B_1} F(u_x,u_y)\,dx\,dy.
$$

Think of $F$ as a rule that assigns an energy cost to the slope of $u$.

Now perturb $u$ by replacing it with $u+\epsilon\phi$, where $\phi$ is smooth and vanishes on $\partial B_1$. Since $u$ is a minimizer, the function $\epsilon \mapsto J(u+\epsilon\phi)$ must have derivative $0$ at $\epsilon=0$:

$$
\left.\frac{d}{d\epsilon}\right|_{\epsilon=0} J(u+\epsilon\phi)=0.
$$

Because

$$
\nabla(u+\epsilon\phi)=(u_x+\epsilon\phi_x,\;u_y+\epsilon\phi_y),
$$

we get

$$
J(u+\epsilon\phi)=\int_{B_1} F(u_x+\epsilon\phi_x,\;u_y+\epsilon\phi_y)\,dx\,dy.
$$

Differentiate with respect to $\epsilon$. By the Chain Rule,

$$
\frac{d}{d\epsilon}F(u_x+\epsilon\phi_x,\;u_y+\epsilon\phi_y)
=F_{p_1}(u_x+\epsilon\phi_x,\;u_y+\epsilon\phi_y)\phi_x
+F_{p_2}(u_x+\epsilon\phi_x,\;u_y+\epsilon\phi_y)\phi_y.
$$

Setting $\epsilon=0$ gives

$$
0=\int_{B_1}\left[F_{p_1}(\nabla u)\phi_x+F_{p_2}(\nabla u)\phi_y\right]\,dx\,dy.
$$

Now integrate by parts in each term. Since $\phi=0$ on $\partial B_1$, the boundary terms vanish:[^2]

$$
\int_{B_1} F_{p_1}(\nabla u)\phi_x\,dx\,dy
=-\int_{B_1}\frac{\partial}{\partial x}\!\left(F_{p_1}(\nabla u)\right)\phi\,dx\,dy,
$$

and similarly

$$
\int_{B_1} F_{p_2}(\nabla u)\phi_y\,dx\,dy
=-\int_{B_1}\frac{\partial}{\partial y}\!\left(F_{p_2}(\nabla u)\right)\phi\,dx\,dy.
$$

So

$$
0=-\int_{B_1}\left[
\frac{\partial}{\partial x}\!\left(F_{p_1}(\nabla u)\right)
+\frac{\partial}{\partial y}\!\left(F_{p_2}(\nabla u)\right)
\right]\phi\,dx\,dy.
$$

Because this must hold for every test function $\phi$, the quantity in brackets must be zero. That gives the Euler-Lagrange equation: <span id="eq-euler-lagrange"></span>

$$
\frac{\partial}{\partial x}\!\left(F_{p_1}(\nabla u)\right)
+\frac{\partial}{\partial y}\!\left(F_{p_2}(\nabla u)\right)=0.
$$

In compact vector notation, this is

$$
\operatorname{Div}(\nabla F(\nabla u)) = 0.
$$

This is the same formula you would write in $n$ variables:

$$
\sum_{i=1}^n \frac{\partial}{\partial x_i}\!\left(\frac{\partial F}{\partial p_i}(\nabla u)\right)=0.
$$

Now let us expand the equation one step further. Since $F_{p_1}(u_x,u_y)$ depends on $x$ through both $u_x$ and $u_y$, the Chain Rule gives

$$
\frac{\partial}{\partial x}F_{p_1}(u_x,u_y)
=F_{p_1p_1}(u_x,u_y)u_{xx}+F_{p_1p_2}(u_x,u_y)u_{xy}.
$$

Likewise,

$$
\frac{\partial}{\partial y}F_{p_2}(u_x,u_y)
=F_{p_2p_1}(u_x,u_y)u_{xy}+F_{p_2p_2}(u_x,u_y)u_{yy}.
$$

Adding the two pieces together, we obtain <span id="eq-euler-lagrange-expanded"></span>

$$
F_{p_1p_1}(\nabla u)u_{xx}
+2F_{p_1p_2}(\nabla u)u_{xy}
+F_{p_2p_2}(\nabla u)u_{yy}=0,
$$

using the symmetry $F_{p_1p_2}=F_{p_2p_1}$. In higher dimensions, this becomes the same matrix pattern:

$$
\sum_{i,j=1}^n F_{ij}(\nabla u)\,u_{ij}=0,
$$

where $F_{ij}$ is the $(i,j)$ entry of the Hessian of $F$ and $u_{ij}=\frac{\partial^2 u}{\partial x_i\partial x_j}$.

*What does this look like for a specific $F$?*

Take the simplest example,

$$
F(p)=|p|^2=p_1^2+\cdots+p_n^2.
$$

Then

$$
J(u)=\int_{B_1}|\nabla u|^2\,dx
$$

is the Dirichlet energy, measuring the total "effort" of the function. In two variables, the Euler-Lagrange equation becomes

$$
\frac{\partial}{\partial x}(2u_x)+\frac{\partial}{\partial y}(2u_y)=0,
$$

which is exactly

$$
2u_{xx}+2u_{yy}=0.
$$

Dividing by $2$, we get

$$
\Delta u=0.
$$

So the minimizer satisfies Laplace’s equation. Harmonic functions have been known to be infinitely smooth since the 19th century, so there is no mystery here. The key reason is that the second derivatives of $F$ are constant, so the coefficients of the PDE do not depend on $\nabla u$ at all.

The trouble starts when $F$ is genuinely nonlinear. Then the second derivatives of $F$ are no longer constant: they depend on the unknown slope $\nabla u$ itself.

Now comes the key step. Let

$$
v=u_x.
$$

We want to know what equation this derivative satisfies. Start from the Euler-Lagrange equation:

$$
\frac{\partial}{\partial x}\!\left(F_{p_1}(\nabla u)\right)
+\frac{\partial}{\partial y}\!\left(F_{p_2}(\nabla u)\right)=0.
$$

Differentiate the whole equation with respect to $x$:

$$
\frac{\partial}{\partial x}\!\left[
\frac{\partial}{\partial x}\!\left(F_{p_1}(\nabla u)\right)
+\frac{\partial}{\partial y}\!\left(F_{p_2}(\nabla u)\right)
\right]=0.
$$

Since $v=u_x$, we have $v_x=u_{xx}$ and $v_y=u_{xy}$. Applying the Chain Rule again,

$$
\frac{\partial}{\partial x}F_{p_1}(\nabla u)
=F_{p_1p_1}(\nabla u)v_x+F_{p_1p_2}(\nabla u)v_y,
$$

and

$$
\frac{\partial}{\partial x}F_{p_2}(\nabla u)
=F_{p_2p_1}(\nabla u)v_x+F_{p_2p_2}(\nabla u)v_y.
$$

Substituting these into the differentiated equation shows that $v$ satisfies <span id="eq-linearized"></span>

$$
\frac{\partial}{\partial x}\!\left(
F_{p_1p_1}(\nabla u)v_x+F_{p_1p_2}(\nabla u)v_y
\right)
+\frac{\partial}{\partial y}\!\left(
F_{p_2p_1}(\nabla u)v_x+F_{p_2p_2}(\nabla u)v_y
\right)=0.
$$

This is linear in the new unknown $v$. In matrix form,

$$
\operatorname{Div}(A(x)\nabla v)=0,
\qquad
A(x)=D^2F(\nabla u(x)).
$$

In $n$ variables, the same pattern is

$$
\sum_{i,j=1}^n \frac{\partial}{\partial x_i}\Big(a_{ij}(x)\frac{\partial v}{\partial x_j}\Big)=0,
\qquad
a_{ij}(x)=F_{ij}(\nabla u(x)).
$$

So each partial derivative of the minimizer satisfies a linear elliptic equation whose coefficients are determined by the Hessian of $F$ evaluated at $\nabla u$.

![Charles Morrey Jr. (1907–1984)](Math495/media/Charles_Morrey_Jr.jpeg)

*Charles Morrey Jr. (1907–1984)*



However, the coefficients $a_{ij}(x) = F_{ij}(\nabla u(x))$ of this new linearized equation depend intrinsically on the unknown gradient. If we assume only that $u$ has bounded slope so that the gradient $\nabla u$ is bounded but not known to be continuous, then these coefficients are bounded, but they may be discontinuous.

We are thus caught in a vicious circle: to prove the coefficients are smooth, we need the solution’s gradient to be smooth; but to prove the solution is smooth, the classical theory demands the coefficients be smooth. This “gap” between having a bounded slope versus a continuous slope was what Morrey later called the “sad state of affairs” that hindered progress for decades.

The solution was finally achieved by bridging this gap. Let us illustrate the strategy in 2D, using geometric intuition.

You are likely familiar with the gradient $\nabla u$ as a vector field pointing in the direction of steepest increase. But for this problem, we need a shift in perspective. Imagine mapping every point $x$ in our domain not to its height $u(x)$, but to its slope vector $\nabla u(x)$. This creates a “gradient map” from the physical domain into a “plane of slopes.”
*The core question of regularity is simply: Is this map continuous? Or can the slope jump abruptly from one value to another, creating a sharp crease or kink in our soap film?*

![The Gradient Map. This map takes a location x in the physical domain (left) and sends it to its corresponding slope vect](Math495/media/tikz-export/a1-tikz-2.png)

*The Gradient Map. This map takes a location x in the physical domain (left) and sends it to its corresponding slope vector ∇u(x) in the plane of slopes (right). If the solution is smooth, the red "blob" of slopes will be connected. If the solution has a crease, this blob will be torn apart.*



Imagine the image of the gradient map $\nabla u$ as a region, a "blob," in the plane. Fix a direction $e$ (a unit vector) and consider the strip in the gradient plane between two parallel lines perpendicular to $e$, defined by values $a < b$.

Let $v(x) = \nabla u(x) \cdot e$ be the corresponding directional derivative. If the gradient image $\nabla u(B_r)$ crosses this strip, it means $v$ takes values both below $a$ and above $b$ within the ball $B_r$.

![Chopping the gradient image with parallel strips in many directions forces ∇u(Br) to lie entirely on one side of each st](Math495/media/tikz-export/a1-tikz-3.png)

*Chopping the gradient image with parallel strips in many directions is one way to imagine the goal: as r tends to 0, the image should squeeze toward a single point. That is the geometric picture behind continuity of ∇u.*



Here we use the Maximum Principle. The Maximum Principle is a powerful property of elliptic equations. You’ve seen a special case already: Laplace’s equation $\nabla^2 u = 0.$ Its solutions (harmonic functions) obey the Mean Value Property and the Maximum Principle: the maximum and minimum occur on the boundary. The linearized equation for $v$ is a generalization of Laplace’s equation with variable coefficients $a_{ij}(x)$. The principle still holds: the oscillation of $v$ inside a ball is controlled by its oscillation on the boundary, like how the temperature at the center of a room is bounded by the temperatures on the walls.

In simple terms, for elliptic equations, the values inside a domain are controlled by the values on the boundary (much like temperature in a room is controlled by the walls). By this principle, if $v$ oscillates inside $B_r$, it must oscillate at least as much on the boundary circle $\partial B_r$. This allows us to restrict our attention to the boundary.

Now we ask a simple question:

*If a function keeps jumping by a fixed amount $\delta$ near a point, how much energy must its gradient spend?*

Suppose $v$ changes by a noticeable amount $\delta>0$ on smaller and smaller scales near the origin. To change by size $\delta$ across a distance comparable to $r$, its gradient should have size roughly

$$
|\nabla v|\sim \frac{\delta}{r}.
$$

This is just the basic calculus idea

$$
\text{slope}\approx \frac{\text{change in height}}{\text{change in distance}}.
$$

The relevant energy is

$$
\int |\nabla v|^2.
$$

In two dimensions, the polar-coordinate area element is

$$
dA=r\,dr\,d\theta.
$$

So if $|\nabla v|\sim \frac{\delta}{r}$, then

$$
|\nabla v|^2\sim \frac{\delta^2}{r^2}.
$$

Therefore the energy near the origin behaves like

$$
\int_0^1\int_0^{2\pi}\frac{\delta^2}{r^2}\,r\,d\theta\,dr.
$$

Simplifying,

$$
\int_0^1\int_0^{2\pi}\frac{\delta^2}{r}\,d\theta\,dr
=2\pi\delta^2\int_0^1\frac{1}{r}\,dr.
$$

But

$$
\int_0^1\frac{1}{r}\,dr=\infty.
$$

So in two dimensions, maintaining a fixed oscillation $\delta$ all the way down to a point costs infinite energy.

Weak solutions, however, have finite energy. In this setting, that finiteness comes from the Caccioppoli inequality, which we prove from scratch in [[Math495/19th-Problem-Part-II|Part II]]. For now we state it as a fact:[^3] <span id="eq-caccioppoli"></span>

$$
\int_{B_{\frac{1}{2}}} |\nabla v|^2 \, dx \le C \int_{B_1} v^2 \, dx < \infty.
$$

So persistent oscillation asks for infinite energy, while Caccioppoli says the available energy is finite. This scaling computation does not by itself prove continuity, but it explains the mechanism behind the two-dimensional argument: persistent oscillation is too expensive.

A more careful version of the same idea gives the Courant-Lebesgue estimate: <span id="eq-courant-lebesgue"></span>

$$
\left(\operatorname{osc}_{\partial B_r} v\right)^2 \le \frac{\pi}{\ln\!\left(\frac{1}{2r}\right)} \int_{B_{\frac{1}{2}}} |\nabla v|^2 \, dx.
$$

As $r$ tends to $0$, the factor $\frac{1}{\ln\!\left(\frac{1}{2r}\right)}$ goes to zero. So finite energy forces the boundary oscillation to shrink as we zoom in.

That is the basic reason two dimensions are special.

What changes in three dimensions? The same slope estimate is still

$$
|\nabla v|\sim \frac{\delta}{r}.
$$

But now the volume element in spherical coordinates is

$$
dV=r^2\sin\theta\,dr\,d\theta\,d\varphi.
$$

Ignoring the angular constants, the important factor is $r^2\,dr$. So the energy near the origin behaves like

$$
\int_0^1 \frac{\delta^2}{r^2}\,r^2\,dr.
$$

The $r^2$ from the volume element cancels the $\frac{1}{r^2}$ from $|\nabla v|^2$:

$$
\int_0^1 \delta^2\,dr=\delta^2<\infty.
$$

So in three dimensions, the same point-scale oscillation does not automatically cost infinite energy. A function can behave much worse near a point while still having finite energy.

This is why the two-dimensional proof strategy does not automatically generalize to three dimensions.

The same comparison in general dimension is useful. In $n$ dimensions, the volume element behaves like

$$
r^{n-1}\,dr.
$$

So the same estimate becomes

$$
\int_0^1\left(\frac{\delta}{r}\right)^2r^{n-1}\,dr
=\delta^2\int_0^1 r^{n-3}\,dr.
$$

Now compare:

$$
n=2:\qquad \delta^2\int_0^1 r^{-1}\,dr=\infty.
$$

But

$$
n=3:\qquad \delta^2\int_0^1 1\,dr<\infty.
$$

So $n=2$ is the borderline case where this kind of point singularity is too expensive. In $n=3$, the same energy argument no longer rules out bad behavior.

While the “chopping” argument above relies on energy estimates, there is a second, completely different reason why 2D solutions are smooth. This second method relies on a "happy accident of geometry," a special feature that disappears in higher dimensions.

The linearized equation implies that the gradient map sends points in $\mathbb{R}^2$ to slope vectors in $\mathbb{R}^2$, and behaves like a linear transformation with bounded distortion. Recall from linear algebra that a matrix $A$ maps the unit circle to an ellipse. The "distortion" is determined by the condition number, the ratio of eigenvalues: <span id="eq-distortion"></span>

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


This estimate guarantees that the gradient $\nabla u$ is continuous with a controlled rate of convergence (Hölder continuity). Thus, in the planar case, the specific geometry of 2D forces regularity. The wild oscillations are controlled by the very cost of their existence.

In two dimensions, geometry does the heavy lifting. But the same geometric arguments fail in three and higher dimensions, for the reasons we saw above. In Part II, we abandon the geometric approach entirely and build an analytical toolkit that works in every dimension: weak derivatives, Sobolev spaces, and the Sobolev and Caccioppoli inequalities — including a full proof of the Caccioppoli bound we used above.

[^1]: He actually had a list of $24$ problems but he chose to publish only $23$.

[^3]: The Caccioppoli inequality is derived in [[Math495/19th-Problem-Part-II|Part II]] from the elliptic structure of the equation together with a cutoff function argument. Here we need only its conclusion: gradient energy on a smaller ball is controlled by the $L^2$ norm of $v$ on a larger ball.

[^2]: The higher-dimensional integration by parts formula is $\int_\Omega f\,\partial_{x_i} g\,dx = -\int_\Omega (\partial_{x_i} f)\,g\,dx + \int_{\partial\Omega} fg\,\nu_i\,d\sigma$, where $\nu_i$ is the $i$-th component of the outward normal. Since $\phi = 0$ on $\partial B_1$, the surface term vanishes.
