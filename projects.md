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
                            <p>An interactive visualization tool for analyzing SIHR (Susceptible-Infected-Hospitalized-Recovered) epidemiological models. Features include:</p>
                            <ul>
                                <li>Real-time parameter adjustment and visualization</li>
                                <li>Comparison between deterministic and stochastic models</li>
                                <li>Pattern analysis and statistical insights</li>
                                <li>Interactive controls for simulation speed and analysis</li>
                            </ul>
                            <div class="math-section">
                                <h5>Mathematical Model</h5>
                                <p>The SIHR model is described by the following system of ordinary differential equations:</p>
                                <div class="equations">
                                    <p>\[\frac{dS}{dt} = -p_1\beta SI\]</p>
                                    <p>\[\frac{dI}{dt} = p_1\beta SI - p_2(p_h\gamma_1 + (1-p_h)\gamma_2)I\]</p>
                                    <p>\[\frac{dH}{dt} = p_2p_h\gamma_1I - p_3\alpha H\]</p>
                                    <p>\[\frac{dR}{dt} = p_2(1-p_h)\gamma_2I + p_3\alpha H\]</p>
                                </div>
                                <p>where:</p>
                                <ul>
                                    <li>\(S\): Susceptible population</li>
                                    <li>\(I\): Infected population</li>
                                    <li>\(H\): Hospitalized population</li>
                                    <li>\(R\): Recovered population</li>
                                    <li>\(\beta\): Transmission rate</li>
                                    <li>\(\gamma_1\): I to H rate</li>
                                    <li>\(\gamma_2\): I to R rate</li>
                                    <li>\(p_h\): Probability of I to H</li>
                                    <li>\(\alpha\): H to R rate</li>
                                    <li>\(p_1, p_2, p_3\): Probability of leaving state S,I,R respectively.</li>
                                </ul>
                                <p>In this model we assume</p>
                                <p>\[\gamma_1 = \gamma_2 = \gamma\]</p>
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