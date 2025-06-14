---
layout: default
title: Projects
---

<h1 class="mb-5">Projects</h1>

<div class="row">
    {% assign sorted_projects = site.projects | sort: "date" | reverse %}
    {% for project in sorted_projects %}
    <div class="col-md-6 mb-4">
        <div class="card h-100 project-card">
            {% if project.image %}
            <img src="{{ project.image | relative_url }}" class="card-img-top" alt="{{ project.title }}">
            {% endif %}
            <div class="card-body">
                <h5 class="card-title">{{ project.title }}</h5>
                <p class="card-text">{{ project.description }}</p>
                <div class="project-links">
                    {% if project.github_url %}
                    <a href="{{ project.github_url }}" class="btn btn-sm btn-outline-dark me-2">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    {% endif %}
                    {% if project.demo_url %}
                    <a href="{{ project.demo_url }}" class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                    {% endif %}
                    {% if project.documentation_url %}
                    <a href="{{ project.documentation_url }}" class="btn btn-sm btn-outline-info">
                        <i class="fas fa-book"></i> Docs
                    </a>
                    {% endif %}
                </div>
            </div>
            <div class="card-footer text-muted">
                <small>{{ project.date | date: "%B %Y" }}</small>
                {% if project.technologies %}
                <div class="mt-2">
                    {% for tech in project.technologies %}
                    <span class="badge bg-secondary me-1">{{ tech }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </div>
    </div>
    {% endfor %}
</div> 