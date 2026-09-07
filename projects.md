---
layout: default
title: Projects
---

<div class="container mt-5">
    <h1 class="mb-5">Projects</h1>

    <div class="row">
        <div class="col-md-12">
            <div class="card mb-4" id="ai-assisted-mathematics">
                <div class="card-header">
                    <h3>AI-Assisted Mathematics</h3>
                </div>
                <div class="card-body">
                    <p>Lean-verified results and ongoing AI-assisted mathematical research.</p>
                    <div class="project-item mb-4">
                        <h4>
                            <a href="#ai-assisted-mathematics" class="factorial-toggle" data-bs-toggle="collapse" data-bs-target="#factorialDetails" aria-expanded="false" aria-controls="factorialDetails">
                                <span>Factorial-residue hypergraphs and covering congruences</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="factorialDetails" class="collapse">
                            <p class="text-muted">PALOMAR-verified core · ongoing manuscript development</p>
                            <p>A weighted prime-coloured hypergraph framework for factorial residues, in which compatible residue covers correspond exactly to Chinese-remainder covering systems. The main structural result gives a fixed proportional saving in the minimum compatible covering cost,</p>
                            <div class="equations">
                                <p>\[\kappa(L)\le (1-\delta)L\log L\]</p>
                            </div>
                            <p>for all sufficiently large \(L\).</p>
                            <p>As an arithmetic application, the framework gives a quantitative resolution of an auxiliary factorial problem posed by Erdős: for every sufficiently large \(L\), there are quantitatively many \(L\)-rough integers</p>
                            <div class="equations">
                                <p>\[2L!&lt;n\le (L+1)!\]</p>
                            </div>
                            <p>such that \(n-k!\) is composite for every \(1\le k\le L\).</p>
                            <p>The formally verified version of the auxiliary theorem is registered as <strong>PALOMAR-2026-08-27-000003 v1</strong>. The current manuscript is being reorganized around the broader factorial-residue hypergraph and covering-congruence theory.</p>
                            <p>
                                <a href="https://palomar-registry.org/entry.html?id=PALOMAR-2026-08-27-000003&amp;version=1" target="_blank" rel="noopener noreferrer" class="btn btn-primary">PALOMAR</a>
                                <a href="https://github.com/GrgAakash/factorial-hypergraph-auxiliary-erdos" target="_blank" rel="noopener noreferrer" class="btn btn-primary">GitHub</a>
                            </p>
                            <ul class="verified-meta">
                                <li><strong>Discovery and proof development:</strong> mostly AI-assisted using ChatGPT Web (GPT-5.6 Sol Pro), Codex (GPT-5.6 Sol Max), and Aristotle (Harmonic). Human involvement consisted of selecting and reframing the problem, proposing the broader factorial-residue hypergraph interpretation, and reviewing the resulting arguments</li>
                                <li><strong>Formal verification:</strong> Lean 4 · Comparator · Lean kernel · NanoDa</li>
                                <li><strong>Verified scope:</strong> quantitative auxiliary Erdős theorem and its problem-specific proof chain</li>
                                <li><strong>Working draft</strong> (human exposition and revision in progress)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="project-item mb-4" id="tunnell-ternary-forms">
                        <h4>
                            <a href="#tunnell-ternary-forms" class="tunnell-toggle" data-bs-toggle="collapse" data-bs-target="#tunnellDetails" aria-expanded="false" aria-controls="tunnellDetails">
                                <span>Stable matching and a two-to-one map for Tunnell’s ternary forms</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="tunnellDetails" class="collapse">
                            <p class="text-muted">PALOMAR-verified core · ongoing manuscript development</p>
                            <p>A deterministic arithmetic-combinatorial framework for Tunnell’s ternary quadratic forms, in which the numerical \(2{:}1\) relation between two representation sets is realized by an explicit map. Writing</p>
                            <div class="equations">
                                <p>\[\mathcal{B}_n=\left\{(x,y,z)\in\mathbb{Z}^3:2x^2+y^2+8z^2=n\right\},\qquad \mathcal{A}_n=\left\{(u,v,w)\in\mathbb{Z}^3:2u^2+v^2+32w^2=n\right\},\]</p>
                            </div>
                            <p>the main result constructs, for every odd positive squarefree \(n\) satisfying \(|\mathcal{B}_n|=2|\mathcal{A}_n|\), a deterministic map</p>
                            <div class="equations">
                                <p>\[\Phi_n:\mathcal{B}_n\longrightarrow\mathcal{A}_n,\qquad \left|\Phi_n^{-1}(a)\right|=2 \quad\text{for every }a\in\mathcal{A}_n.\]</p>
                            </div>
                            <p>For odd squarefree congruent numbers, <a href="https://doi.org/10.1007/BF01389327" target="_blank" rel="noopener noreferrer">Tunnell’s theorem</a> supplies the required counting identity. The construction combines an elementary even-coordinate map, three explicit quarter-turn correspondences, and a canonical stable matching of the remaining antipodal orbits determined by primitive midpoint directions.</p>
                            <p>The executable two-to-one map and its registered specifications are formally verified and registered as <strong>PALOMAR-2026-09-07-000010 v2</strong>.</p>
                            <p>
                                <a href="https://palomar-registry.org/entry.html?id=PALOMAR-2026-09-07-000010&amp;version=2" target="_blank" rel="noopener noreferrer" class="btn btn-primary">PALOMAR</a>
                                <a href="https://github.com/GrgAakash/tunnell-two-to-one-map" target="_blank" rel="noopener noreferrer" class="btn btn-primary">GitHub</a>
                            </p>
                            <ul class="verified-meta">
                                <li><strong>Discovery and proof development:</strong> AI-assisted using ChatGPT Web (GPT-5.6 Sol Pro), Codex (GPT-5.6 Sol Max), and Aristotle (Harmonic), with human direction in preventing dead ends and guiding the argument</li>
                                <li><strong>Formal verification:</strong> Lean 4 · Mathlib · Comparator · Lean kernel · NanoDa</li>
                                <li><strong>Verified scope:</strong> deterministic global map, inverse identities, exactly-two fibre theorem, and the complete \(n=41\) example</li>
                                <li><strong>Human mentor:</strong> Professor Kyungyong Lee, who aided me in the process of verification</li>
                                <li><strong>Working draft</strong> (human exposition and revision in progress)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="project-item mb-4" id="moh-p3-curve">
                        <h4>
                            <a href="#moh-p3-curve" class="moh-toggle" data-bs-toggle="collapse" data-bs-target="#mohDetails" aria-expanded="false" aria-controls="mohDetails">
                                <span>Moh’s \(P_3\) curve is a global set-theoretic complete intersection</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="mohDetails" class="collapse">
                            <p class="text-muted">PALOMAR-verified core · ongoing manuscript development</p>
                            <p>A global solution for the classical Moh \(P_3\) curve, arising from the family introduced by T. T. Moh in 1974 (<a href="https://www.jstage.jst.go.jp/article/jmath1948/26/4/26_4_722/_article/-char/en" target="_blank" rel="noopener noreferrer">Moh</a>).</p>
                            <p>Let
                            \[\mathfrak{p}=\ker\!\left(\mathbb{Q}[x,y,z]\to\mathbb{Q}[t]\right),\qquad (x,y,z)\mapsto(t^6+t^{31},t^8,t^{10}).\]
                            The main result constructs two explicit degree-\(16\) polynomials \(H_1,H_2\in\mathbb{Q}[x,y,z]\) satisfying
                            \[\mathfrak{p}^2\subseteq(H_1,H_2)\subseteq\mathfrak{p}.\]
                            Hence
                            \[\sqrt{(H_1,H_2)}=\mathfrak{p},\]
                            so the entire affine Moh curve is cut out set-theoretically by two polynomial equations.</p>
                            <p>The construction uses a globally invertible transformation of the Hilbert–Burch matrix into a symmetric form, followed by determinant and adjugate identities. The final verification reduces to a finite collection of exact polynomial identities: two proving \(H_1,H_2\in\mathfrak{p}\), and ten proving \(\mathfrak{p}^2\subseteq(H_1,H_2)\).</p>
                            <p>The set-theoretic complete intersection and its registered specifications are formally verified and registered as <strong>PALOMAR-2026-09-07-000012 v1</strong>.</p>
                            <p>
                                <a href="https://palomar-registry.org/entry.html?id=PALOMAR-2026-09-07-000012&amp;version=1" target="_blank" rel="noopener noreferrer" class="btn btn-primary">PALOMAR</a>
                                <a href="https://github.com/GrgAakash/moh-p3-set-theoretic-complete-intersection" target="_blank" rel="noopener noreferrer" class="btn btn-primary">GitHub</a>
                            </p>
                            <ul class="verified-meta">
                                <li><strong>Discovery and proof development:</strong> heavily AI-assisted using ChatGPT Web (GPT-5.6 Sol Pro and GPT-6 Pro)</li>
                                <li><strong>Explicit witnesses:</strong> two degree-\(16\) polynomials \(H_1,H_2\)</li>
                                <li><strong>Exact verification:</strong> 12 explicit polynomial identities over \(\mathbb{Q}\)</li>
                                <li><strong>Formal verification:</strong> Lean 4 · Mathlib · Comparator · Lean kernel · NanoDa</li>
                                <li><strong>Macaulay2:</strong> independent replay script prepared; external execution pending</li>
                                <li><strong>Working draft</strong> (human exposition and revision in progress)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h3> Class and Research Projects</h3>
                </div>
                <div class="card-body">
                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="sihr-toggle" data-bs-toggle="collapse" data-bs-target="#sihrDetails">
                                <span>SIHR Model Visualization</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="sihrDetails" class="collapse">
                            <p class="text-muted">2025</p>
                            <p>An interactive visualization tool for analyzing SIHR-IPC (Susceptible-Infected-Hospitalized-Recovered with Individual Possion Clock) epidemiological models.</p>
                            <div class="math-section">
                                <h5>Mathematical Model</h5>
                                <p>The SIHR-IPC model is described by the following system of ordinary differential equations:</p>
                                <div class="equations">
                                    <p>\[\frac{ds}{dt} = -p_{SI}\beta si\]</p>
                                    <p>\[\frac{di}{dt} = p_{SI}\beta si - \gamma(1-p_{II})i\]</p>
                                    <p>\[\frac{dh}{dt} = p_{IH}\gamma i - p_{HR}\alpha h\]</p>
                                    <p>\[\frac{dr}{dt} = p_{IR}\gamma i + p_{HR}\alpha h\]</p>
                                </div>
                                <p>where:</p>
                                <ul>
                                    <li>\(s\): Susceptible proportion</li>
                                    <li>\(i\): Infected proportion</li>
                                    <li>\(h\): Hospitalized proportion</li>
                                    <li>\(r\): Recovered proportion</li>
                                    <li>\(\beta\): Transmission rate</li>
                                    <li>\(\gamma\): I outflow rate</li>
                                    <li>\(\alpha\): H outflow rate</li>
                                    <li>\(p_{SI}\): Probability of S→I transition</li>
                                    <li>\(p_{II}, p_{IH}, p_{IR}\): I outflow probabilities (sum = 1)</li>
                                    <li>\(p_{HR}, p_{HH}\): H outflow probabilities (sum = 1)</li>
                                </ul>
                                <p>Key threshold parameters:</p>
                                <ul>
                                    <li>\(\sigma = \frac{p_{SI}\beta s_0}{\gamma(1-p_{II})}\): Basic reproduction number</li>
                                    <li>\(\tilde{\sigma} = \frac{\gamma p_{IH} i_0}{\alpha p_{HR} h_0}\): Initial condition ratio</li>
                                    <li>\(\tilde{\tilde{\sigma}} = \frac{\gamma p_{IH} i_{peak}}{\alpha p_{HR} h(t_{pi})}\): Peak condition ratio</li>
                            </ul>
                            </div>
                            <p><a href="SIHR Stochastic vs ODE/index_sihr.html" target="_blank" class="btn btn-primary">View Demo</a></p>
                        </div>
                    </div>

                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="sihrs-toggle" data-bs-toggle="collapse" data-bs-target="#sihrsDetails">
                                <span>SIHRS Model Visualization</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="sihrsDetails" class="collapse">
                            <p class="text-muted">2025</p>
                            <p>An advanced interactive visualization tool for analyzing SIHRS (Susceptible-Infected-Hospitalized-Recovered with Death) epidemiological models with reinfection dynamics and mortality tracking.</p>
                            <p>The MATLAB code for SIHRS can be found at <a href="https://github.com/GrgAakash/Code-collection--REU-25/tree/main/SIHRS" target="_blank">https://github.com/GrgAakash/Code-collection--REU-25/tree/main/SIHRS</a></p>
                            <div class="math-section">
                                <h5>Mathematical Model</h5>
                                <p>The SIHRS model is described by the following system of ordinary differential equations:</p>
                                <div class="equations">
                                    <p>\[\frac{ds}{dt} = -\beta p_{SI} si + p_{RS}\lambda r\]</p>
                                    <p>\[\frac{di}{dt} = \beta p_{SI} si - \gamma(1-p_{II})i\]</p>
                                    <p>\[\frac{dh}{dt} = p_{IH}\gamma i - \alpha(1-p_{HH})h\]</p>
                                    <p>\[\frac{dr}{dt} = p_{IR}\gamma i + p_{HR}\alpha h - p_{RS}\lambda r\]</p>
                                    <p>\[\frac{dd}{dt} = p_{ID}\gamma i + p_{HD}\alpha h\]</p>
                                </div>
                                <p>where:</p>
                                <ul>
                                    <li>\(s\): Susceptible proportion</li>
                                    <li>\(i\): Infected proportion</li>
                                    <li>\(h\): Hospitalized proportion</li>
                                    <li>\(r\): Recovered proportion</li>
                                    <li>\(d\): Death proportion</li>
                                    <li>\(\beta\): Transmission rate</li>
                                    <li>\(\gamma\): I outflow rate</li>
                                    <li>\(\alpha\): H outflow rate</li>
                                    <li>\(\lambda\): R outflow rate (reinfection)</li>
                                    <li>\(p_{SI}\): Probability of S→I transition</li>
                                    <li>\(p_{II}, p_{IH}, p_{IR}, p_{ID}\): I outflow probabilities (sum = 1)</li>
                                    <li>\(p_{HH}, p_{HR}, p_{HD}\): H outflow probabilities (sum = 1)</li>
                                    <li>\(p_{RR}, p_{RS}\): R outflow probabilities (sum = 1)</li>
                                </ul>
                            </div>
                            <p><a href="SIHR Stochastic vs ODE/index_sihrs.html" target="_blank" class="btn btn-primary">View SIHRS Demo</a></p>
                        </div>
                    </div>

                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="qtcat-toggle" data-bs-toggle="collapse" data-bs-target="#qtcatDetails">
                                <span>Q,T-Catalan Chain Decompositions</span>
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="qtcatDetails" class="collapse">
                            <p class="text-muted">2025</p>
                            <p>An advanced interactive tool for exploring Q,T-Catalan chain decompositions through NU₁, NU₂, ND₁, and ND₂ maps, including NU₁-tails, NU₂-bridging, and global chain construction.</p>
                            <p><a href="Codes_QTCat/QTNU_1and2_Jan9_2026.html" target="_blank" class="btn btn-primary">Explore Q,T-Catalan Chains</a> &nbsp; <a href="Codes_QTCat/dyck_visualizer.html" target="_blank" class="btn btn-primary">Dyck Path Visualizer</a> &nbsp; <a href="Codes_QTCat/hlll_verification_tools.html" target="_blank" class="btn btn-primary">HLLL verification tools</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h3>Others</h3>
                </div>
                <div class="card-body">
                    <div class="project-item mb-4">
                        <h4>
                            <a href="/moments" class="others-link">
                                Moments Captured
                            </a>
                        </h4>
                    </div>
                    <div class="project-item mb-4">
                        <h4>
                            <a href="https://github.com/GrgAakash/InterestingProblems" target="_blank" class="others-link">
                                Interesting Math Problems
                            </a>
                        </h4>
                    </div>
                    <div class="project-item mb-4">
                        <h4>
                            <a href="https://grgaakash.github.io/MathGREsubjectT/resources.html" target="_blank" class="others-link">
                                Math GRE Prep Resources
                            </a>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.math-section {
    margin: 2rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.equations {
    margin: 0.35rem 0;
    padding: 0;
    overflow-x: auto;
}

.equations p {
    margin: 0;
    text-align: center;
}

.collapse mjx-container[display="true"] {
    margin: 0.45em 0 !important;
}

.sihr-toggle, .sihrs-toggle, .qtcat-toggle, .factorial-toggle, .tunnell-toggle, .moh-toggle, .blog-toggle, .math495-toggle {
    color: #007bff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sihr-toggle:hover, .sihrs-toggle:hover, .qtcat-toggle:hover, .factorial-toggle:hover, .tunnell-toggle:hover, .moh-toggle:hover, .blog-toggle:hover, .math495-toggle:hover {
    color: #0056b3;
}

.others-link {
    color: #007bff;
    text-decoration: none;
}

.others-link:hover {
    color: #0056b3;
}

.sihr-toggle .fa-chevron-down, .sihrs-toggle .fa-chevron-down, .qtcat-toggle .fa-chevron-down, .factorial-toggle .fa-chevron-down, .tunnell-toggle .fa-chevron-down, .moh-toggle .fa-chevron-down, .blog-toggle .fa-chevron-down, .math495-toggle .fa-chevron-down {
    transition: transform 0.3s ease;
}

.sihr-toggle[aria-expanded="true"] .fa-chevron-down, .sihrs-toggle[aria-expanded="true"] .fa-chevron-down, .qtcat-toggle[aria-expanded="true"] .fa-chevron-down, .factorial-toggle[aria-expanded="true"] .fa-chevron-down, .tunnell-toggle[aria-expanded="true"] .fa-chevron-down, .moh-toggle[aria-expanded="true"] .fa-chevron-down, .blog-toggle[aria-expanded="true"] .fa-chevron-down, .math495-toggle[aria-expanded="true"] .fa-chevron-down {
    transform: rotate(180deg);
}

.btn-primary {
    /* Bootstrap 5.3 drives .btn through custom properties, so set those too
       or the hover/active states revert to solid blue. */
    --bs-btn-bg: transparent;
    --bs-btn-color: #1a4f8b;
    --bs-btn-border-color: #c8d3e0;
    --bs-btn-hover-bg: #f4f7fb;
    --bs-btn-hover-color: #1a4f8b;
    --bs-btn-hover-border-color: #1a4f8b;
    --bs-btn-active-bg: #e9eff7;
    --bs-btn-active-color: #1a4f8b;
    --bs-btn-active-border-color: #1a4f8b;

    background-color: transparent;
    color: #1a4f8b;
    border: 1px solid #c8d3e0;
    padding: 0.4rem 0.9rem;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
    font-size: 0.92rem;
}

.btn-primary:hover {
    background-color: #f4f7fb;
    border-color: #1a4f8b;
    color: #1a4f8b;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const sihrToggle = document.querySelector('.sihr-toggle');
    const sihrsToggle = document.querySelector('.sihrs-toggle');
    const qtcatToggle = document.querySelector('.qtcat-toggle');
    const factorialToggle = document.querySelector('.factorial-toggle');
    const factorialDetails = document.getElementById('factorialDetails');
    const tunnellToggle = document.querySelector('.tunnell-toggle');
    const tunnellDetails = document.getElementById('tunnellDetails');
    const mohToggle = document.querySelector('.moh-toggle');
    const mohDetails = document.getElementById('mohDetails');

    function wireToggle(toggle) {
        if (!toggle) return;
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.getAttribute('aria-expanded') === 'true') {
                this.setAttribute('aria-expanded', 'false');
            } else {
                this.setAttribute('aria-expanded', 'true');
            }
        });
    }

    wireToggle(sihrToggle);
    wireToggle(sihrsToggle);
    wireToggle(qtcatToggle);
    wireToggle(factorialToggle);
    wireToggle(tunnellToggle);
    wireToggle(mohToggle);

    if (window.bootstrap) {
        if (window.location.hash === '#ai-assisted-mathematics' && factorialDetails) {
            new bootstrap.Collapse(factorialDetails, { show: true });
            if (factorialToggle) {
                factorialToggle.setAttribute('aria-expanded', 'true');
            }
        }
        if (window.location.hash === '#tunnell-ternary-forms' && tunnellDetails) {
            new bootstrap.Collapse(tunnellDetails, { show: true });
            if (tunnellToggle) {
                tunnellToggle.setAttribute('aria-expanded', 'true');
            }
        }
        if (window.location.hash === '#moh-p3-curve' && mohDetails) {
            new bootstrap.Collapse(mohDetails, { show: true });
            if (mohToggle) {
                mohToggle.setAttribute('aria-expanded', 'true');
            }
        }
    }
    
});
</script> 
