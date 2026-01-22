---
layout: default
title: Projects
---

<div class="container mt-5">
    <h1 class="mb-5">Projects</h1>

    <div class="row">
        <div class="col-md-12">
            <div class="card mb-4">
                <div class="card-header">
                    <h3> Class and Research Projects</h3>
                </div>
                <div class="card-body">
                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="sihr-toggle" data-bs-toggle="collapse" data-bs-target="#sihrDetails">
                                SIHR Model Visualization
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
                                SIHRS Model Visualization
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
                                Q,T-Catalan Chain Decompositions
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="qtcatDetails" class="collapse">
                            <p class="text-muted">2025</p>
                            <p>An advanced interactive tool for exploring Q,T-Catalan chain decompositions through NU₁, NU₂, ND₁, and ND₂ maps, including NU₁-tails, NU₂-bridging, and global chain construction.</p>
                            <p><a href="Codes_QTCat/QTNU_1and2_Jan9_2026.html" target="_blank" class="btn btn-primary">Explore Q,T-Catalan Chains</a></p>
                        </div>
                    </div>

                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="blog-toggle" data-bs-toggle="collapse" data-bs-target="#blogDetails">
                                EN381
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="blogDetails" class="collapse">
                            <p class="text-muted">2025</p>
                            <p>A blog on abc conjecture and its present context (extremely non mathematical). This is my EN381 blog task.</p>
                            <p><a href="EN381Blog/Scienceblog.html" target="_blank" class="btn btn-primary">Read Blog</a></p>
                        </div>
                    </div>

                    <div class="project-item mb-4">
                        <h4>
                            <a href="#" class="math495-toggle" data-bs-toggle="collapse" data-bs-target="#math495Details">
                                Math 495
                                <i class="fas fa-chevron-down ms-2"></i>
                            </a>
                        </h4>
                        <div id="math495Details" class="collapse">
                            <div class="sub-project-item" style="margin-left: 2rem; margin-top: 1rem;">
                                <h5 style="color: #333; font-weight: 600;">Blog 1: The 19th Problem</h5>
                                <p class="text-muted">2026</p>
                                <p>An expository blog post on Hilbert's 19th Problem exploring the regularity of solutions to variational problems. Written for students with Calculus 3 and Linear Algebra background.</p>
                                <p><a href="Math495/Blog1.html" target="_blank" class="btn btn-primary">Read Blog</a></p>
                            </div>
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
    margin: 1rem 0;
    padding: 1rem;
    background-color: white;
    border-radius: 4px;
    overflow-x: auto;
}

.equations p {
    margin: 0.5rem 0;
    text-align: center;
}

.sihr-toggle, .sihrs-toggle, .qtcat-toggle, .blog-toggle, .math495-toggle {
    color: #007bff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sihr-toggle:hover, .sihrs-toggle:hover, .qtcat-toggle:hover, .blog-toggle:hover, .math495-toggle:hover {
    color: #0056b3;
}

.others-link {
    color: #007bff;
    text-decoration: none;
}

.others-link:hover {
    color: #0056b3;
}

.sihr-toggle .fa-chevron-down, .sihrs-toggle .fa-chevron-down, .qtcat-toggle .fa-chevron-down, .blog-toggle .fa-chevron-down, .math495-toggle .fa-chevron-down {
    transition: transform 0.3s ease;
}

.sihr-toggle[aria-expanded="true"] .fa-chevron-down, .sihrs-toggle[aria-expanded="true"] .fa-chevron-down, .qtcat-toggle[aria-expanded="true"] .fa-chevron-down, .blog-toggle[aria-expanded="true"] .fa-chevron-down, .math495-toggle[aria-expanded="true"] .fa-chevron-down {
    transform: rotate(180deg);
}

.btn-primary {
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
}

.btn-primary:hover {
    background-color: #0056b3;
    color: white;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const sihrToggle = document.querySelector('.sihr-toggle');
    const sihrsToggle = document.querySelector('.sihrs-toggle');
    const qtcatToggle = document.querySelector('.qtcat-toggle');
    const blogToggle = document.querySelector('.blog-toggle');
    const math495Toggle = document.querySelector('.math495-toggle');
    
    sihrToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.fa-chevron-down');
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });
    
    sihrsToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.fa-chevron-down');
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });
    
    qtcatToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.fa-chevron-down');
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });
    
    blogToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.fa-chevron-down');
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });
    
    math495Toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.fa-chevron-down');
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });
});
</script> 