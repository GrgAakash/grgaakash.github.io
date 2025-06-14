---
layout: default
title: Home
---

<div class="row align-items-center py-5">
    <div class="col-md-4 text-center">
        <img src="{{ site.author.avatar }}" alt="{{ site.author.name }}" class="rounded-circle img-fluid mb-3" style="max-width: 200px;">
    </div>
    <div class="col-md-8">
        <h1>{{ site.author.name }}</h1>
        <h3>{{ site.author.bio }}</h3>
        <p class="lead">Mathematics and Computer Science student with research interests in combinatorics and mathematical research.</p>
        <div class="mt-4">
            <a href="mailto:{{ site.email }}" class="btn btn-primary me-2">
                <i class="fas fa-envelope"></i> Contact Me
            </a>
        </div>
    </div>
</div>

<div class="row mt-5">
    <div class="col-md-12">
        <h2>About Me</h2>
        <p>
            I am currently pursuing a BS in Mathematics and Computer Science at The University of Alabama, 
            with an expected graduation in May 2026. Previously, I studied at Juniata College where I was 
            awarded the Samuel J. Steinberger, Jr. Memorial Award.
        </p>
        <p>
            My research interests focus on combinatorics and mathematical research. I am currently working 
            on the combinatorial nature of q,t Catalan polynomials under the guidance of Professor Kyungyong Lee.
        </p>
    </div>
</div>

<div class="row mt-5">
    <div class="col-md-12">
        <h2>Current Research</h2>
        <ul class="list-unstyled">
            <li class="mb-3">
                <strong>Combinatorial Nature of q,t Catalan Polynomials</strong>
                <p>Working with Professor Kyungyong Lee (Jan 2025-present)</p>
            </li>
            <li class="mb-3">
                <strong>Continued Fractions and a-Fibonacci Numbers</strong>
                <p>Published work with Cheng-Han Pan on "Continued Fractions, a-Fibonacci numbers, and the middle b-noise" in Mathematics Exchange</p>
            </li>
            <li class="mb-3">
                <strong>Game of Cycles on Maximal Plane Graphs</strong>
                <p>Presented at CUNY Undergraduate Research Day 2024 and MathFest 2024</p>
            </li>
        </ul>
    </div>
</div>

<div class="row mt-5">
    <div class="col-md-12">
        <h2>Experience</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h5>Current Positions</h5>
                <ul>
                    <li>Student Technology Assistant - Student Center, University of Alabama</li>
                    <li>Mechanical Design Team Member - Astrobotics team of UA 2024-25</li>
                    <li>Peer Tutor - Mathematics Technology Learning Center</li>
                </ul>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h5>Previous Roles</h5>
                <ul>
                    <li>Junior Member and Outreach Coordinator - Nepal Astronomical Society (2020-2022)</li>
                    <li>Content Department and Outreach Department Head - Mathematics Initiatives in Nepal (2020-2022)</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="row mt-5">
    <div class="col-md-12">
        <h2>Skills</h2>
        <div class="card">
            <div class="card-body">
                <p>C++, Java, SQL, Python, LaTeX, HTML, CSS, R</p>
            </div>
        </div>
    </div>
</div>

{% if site.data.display.homepage.show_news %}
<div class="row mt-5">
    <div class="col-md-12">
        <h2>Latest News</h2>
        <ul class="list-unstyled">
            {% for news in site.news limit:site.data.display.homepage.num_news %}
            <li class="mb-3">
                <strong>{{ news.date | date: "%B %d, %Y" }}</strong> - {{ news.content }}
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endif %}

{% if site.data.display.homepage.show_publications %}
<div class="row mt-5">
    <div class="col-md-12">
        <h2>Selected Publications</h2>
        {% assign selected_publications = site.publications | where: "selected", true | sort: "date" | reverse %}
        {% for pub in selected_publications limit:site.data.display.homepage.num_publications %}
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{{ pub.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ pub.authors | join: ", " }}</h6>
                <p class="card-text">{{ pub.venue }} ({{ pub.date | date: "%Y" }})</p>
                <div class="btn-group">
                    {% if pub.paper_url %}
                    <a href="{{ pub.paper_url }}" class="btn btn-sm btn-outline-primary">Paper</a>
                    {% endif %}
                    {% if pub.code_url %}
                    <a href="{{ pub.code_url }}" class="btn btn-sm btn-outline-secondary">Code</a>
                    {% endif %}
                </div>
            </div>
        </div>
        {% endfor %}
        <a href="{{ '/publications' | relative_url }}" class="btn btn-primary mt-3">View All Publications</a>
    </div>
</div>
{% endif %}

{% if site.data.display.homepage.show_projects %}
<div class="row mt-5">
    <div class="col-md-12">
        <h2>Featured Projects</h2>
        <div class="row">
            {% assign featured_projects = site.projects | where: "featured", true | sort: "date" | reverse %}
            {% for project in featured_projects limit:site.data.display.homepage.num_projects %}
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    {% if project.image %}
                    <img src="{{ project.image | relative_url }}" class="card-img-top" alt="{{ project.title }}">
                    {% endif %}
                    <div class="card-body">
                        <h5 class="card-title">{{ project.title }}</h5>
                        <p class="card-text">{{ project.description }}</p>
                        <a href="{{ project.url | relative_url }}" class="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
        <a href="{{ '/projects' | relative_url }}" class="btn btn-primary mt-3">View All Projects</a>
    </div>
</div>
{% endif %} 