---
layout: default
title: Publications
---

<h1 class="mb-5">Publications</h1>

{% assign publications_by_year = site.publications | sort: "date" | reverse | group_by_exp: "item", "item.date | date: '%Y'" %}

{% for year in publications_by_year %}
<h2 class="mt-4">{{ year.name }}</h2>
<div class="publications-list">
    {% for pub in year.items %}
    <div class="card publication-card mb-4">
        <div class="card-body">
            <h5 class="publication-title">{{ pub.title }}</h5>
            <p class="publication-authors">{{ pub.authors | join: ", " }}</p>
            <p class="publication-venue">{{ pub.venue }}</p>
            <div class="publication-links">
                {% if pub.paper_url %}
                <a href="{{ pub.paper_url }}" class="btn btn-sm btn-outline-primary me-2">
                    <i class="fas fa-file-pdf"></i> Paper
                </a>
                {% endif %}
                {% if pub.code_url %}
                <a href="{{ pub.code_url }}" class="btn btn-sm btn-outline-secondary me-2">
                    <i class="fas fa-code"></i> Code
                </a>
                {% endif %}
                {% if pub.project_url %}
                <a href="{{ pub.project_url }}" class="btn btn-sm btn-outline-info me-2">
                    <i class="fas fa-project-diagram"></i> Project
                </a>
                {% endif %}
                {% if pub.slides_url %}
                <a href="{{ pub.slides_url }}" class="btn btn-sm btn-outline-success me-2">
                    <i class="fas fa-presentation"></i> Slides
                </a>
                {% endif %}
                {% if pub.video_url %}
                <a href="{{ pub.video_url }}" class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-video"></i> Video
                </a>
                {% endif %}
            </div>
        </div>
    </div>
    {% endfor %}
</div>
{% endfor %} 