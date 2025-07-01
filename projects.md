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
                    <h3>Research Codes</h3>
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
                                    <p>\[\frac{dS}{dt} = -p_{SI}\beta SI\]</p>
                                    <p>\[\frac{dI}{dt} = p_{SI}\beta SI - \gamma(1-p_{II})I\]</p>
                                    <p>\[\frac{dH}{dt} = p_{IH}\gamma I - p_{HR}\alpha H\]</p>
                                    <p>\[\frac{dR}{dt} = p_{IR}\gamma I + p_{HR}\alpha H\]</p>
                                </div>
                                <p>where:</p>
                                <ul>
                                    <li>\(S\): Susceptible population</li>
                                    <li>\(I\): Infected population</li>
                                    <li>\(H\): Hospitalized population</li>
                                    <li>\(R\): Recovered population</li>
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
                            <p><a href="SIHR Stochastic vs ODE/index.html" target="_blank" class="btn btn-primary">View Demo</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h3>Personal Academic Ventures</h3>
                </div>
                <div class="card-body">
                    <div class="project-item mb-4">
                        <p class="text-muted">2025</p>
                        <ul>
                            <li><a href="https://github.com/GrgAakash/GT-S25" target="_blank">Group Theory</a> - Problems which I find interesting. Level Undergrad.</li>
                            <li><a href="https://github.com/GrgAakash/Top-S25." target="_blank">Topology</a> - Problems which I find interesting. Level Undergrad.</li>
                            <li><a href="https://github.com/GrgAakash/MT-S25" target="_blank">Measure Theory</a> -Problems which I find interesting. Level Grad.</li>
                            <li><a href="https://github.com/GrgAakash/MathGREsubjectT" target="_blank">Math GRE Preparation</a> - Subject test preparation materials based on my own preparation.</li>
                        </ul>
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

.sihr-toggle {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sihr-toggle:hover {
    color: #007bff;
}

.sihr-toggle .fa-chevron-down {
    transition: transform 0.3s ease;
}

.sihr-toggle[aria-expanded="true"] .fa-chevron-down {
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
    sihrToggle.addEventListener('click', function(e) {
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