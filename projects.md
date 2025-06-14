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
                        <h4>SIHR Model Visualization</h4>
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
                                <p>\[\frac{dS}{dt} = -\beta \frac{SI}{N}\]</p>
                                <p>\[\frac{dI}{dt} = \beta \frac{SI}{N} - \gamma I - \delta I\]</p>
                                <p>\[\frac{dH}{dt} = \delta I - \xi H\]</p>
                                <p>\[\frac{dR}{dt} = \gamma I + \xi H\]</p>
                            </div>
                            <p>where:</p>
                            <ul>
                                <li>\(S\): Susceptible population</li>
                                <li>\(I\): Infected population</li>
                                <li>\(H\): Hospitalized population</li>
                                <li>\(R\): Recovered population</li>
                                <li>\(N\): Total population (\(N = S + I + H + R\))</li>
                                <li>\(\beta\): Transmission rate</li>
                                <li>\(\gamma\): Recovery rate</li>
                                <li>\(\delta\): Hospitalization rate</li>
                                <li>\(\xi\): Hospital recovery rate</li>
                            </ul>
                        </div>
                        <p><a href="sihrvsODE-model.html" target="_blank">View Demo</a></p>
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
                            <li><a href="https://github.com/GrgAakash/Top-S25" target="_blank">Topology</a> - Problems which I find interesting. Level Undergrad.</li>
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
</style> 