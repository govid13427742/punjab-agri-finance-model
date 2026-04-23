/* ========================================
   PUNJAB AGRI-FINANCE MODEL
   Interactive Application Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // NAVIGATION
    // ========================================
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Sticky nav shadow on scroll
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = navLinks.querySelectorAll('a');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // HERO COUNTER ANIMATION
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-value[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                if (target >= 10000) {
                    counter.textContent = current.toLocaleString('en-IN');
                } else {
                    counter.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
    }

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll(
        '.problem-card, .pillar-card, .cycle-detail-card, .village-level, ' +
        '.sme-item, .partner-card, .fin-model-card, .metric-card, .roadmap-phase, ' +
        '.action-card, .chart-panel, .sme-profit-model, .benefits-content, ' +
        '.export-channel, .surplus-gap-panel, .surplus-absorption-summary'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // METRIC RINGS ANIMATION
    // ========================================
    const metricRings = document.querySelectorAll('.metric-ring');

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const value = parseFloat(ring.dataset.value);
                const max = parseFloat(ring.dataset.max);
                const circumference = 2 * Math.PI * 54; // r=54
                const offset = circumference - (value / max) * circumference;
                const fill = ring.querySelector('.metric-ring-fill');
                if (fill) {
                    setTimeout(() => {
                        fill.style.strokeDashoffset = offset;
                    }, 200);
                }
                metricObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    metricRings.forEach(ring => metricObserver.observe(ring));

    // ========================================
    // BENEFITS TABS
    // ========================================
    const tabs = document.querySelectorAll('.benefits-tab');
    const tabContents = document.querySelectorAll('.benefits-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });

            // Initialize chart for tab if needed
            initTabChart(targetTab);
        });
    });

    // ========================================
    // CHARTS
    // ========================================
    const chartDefaults = {
        font: { family: "'Inter', sans-serif" },
        color: '#8888AA'
    };

    Chart.defaults.font.family = chartDefaults.font.family;
    Chart.defaults.color = chartDefaults.color;

    // --- Value Leakage Doughnut ---
    const valueLeakageCtx = document.getElementById('valueLeakageChart');
    if (valueLeakageCtx) {
        new Chart(valueLeakageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Farmer Retains', 'Middlemen', 'Transportation', 'Market Fees', 'Wastage'],
                datasets: [{
                    data: [25, 40, 15, 12, 8],
                    backgroundColor: [
                        '#2E7D32',
                        '#C62828',
                        '#E65100',
                        '#F57F17',
                        '#78909C'
                    ],
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 13, weight: 500 },
                            usePointStyle: true,
                            pointStyleWidth: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ₹${ctx.raw} per ₹100`
                        }
                    }
                }
            }
        });
    }

    // --- Farmer Income Chart ---
    const farmerIncomeCtx = document.getElementById('farmerIncomeChart');
    let farmerChart = null;
    if (farmerIncomeCtx) {
        farmerChart = new Chart(farmerIncomeCtx, {
            type: 'bar',
            data: {
                labels: ['Revenue', 'Costs', 'Net Income'],
                datasets: [
                    {
                        label: 'Current Model',
                        data: [200000, 140000, 60000],
                        backgroundColor: 'rgba(198, 40, 40, 0.7)',
                        borderColor: '#C62828',
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Punjab Model',
                        data: [275000, 165000, 110000],
                        backgroundColor: 'rgba(212, 168, 67, 0.8)',
                        borderColor: '#D4A843',
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255,255,255,0.7)',
                            font: { size: 12 },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ₹${(ctx.raw / 1000).toFixed(0)}K`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.6)' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: {
                            color: 'rgba(255,255,255,0.6)',
                            callback: (v) => `₹${(v / 1000).toFixed(0)}K`
                        }
                    }
                }
            }
        });
    }

    // --- Tab-specific charts ---
    const createdCharts = { farmer: true };

    function initTabChart(tabName) {
        if (createdCharts[tabName]) return;
        createdCharts[tabName] = true;

        if (tabName === 'business') {
            const ctx = document.getElementById('businessChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Logistics', 'Marketing', 'Technology', 'Processing', 'Export'],
                        datasets: [{
                            label: 'Revenue Opportunity (₹ Cr/Year)',
                            data: [800, 500, 300, 1200, 700],
                            backgroundColor: [
                                'rgba(21, 101, 192, 0.8)',
                                'rgba(66, 165, 245, 0.8)',
                                'rgba(100, 181, 246, 0.8)',
                                'rgba(33, 150, 243, 0.8)',
                                'rgba(13, 71, 161, 0.8)'
                            ],
                            borderRadius: 6,
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => `₹${ctx.raw} Cr/Year`
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: {
                                    color: 'rgba(255,255,255,0.6)',
                                    callback: (v) => `₹${v} Cr`
                                }
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: 'rgba(255,255,255,0.7)', font: { weight: 600 } }
                            }
                        }
                    }
                });
            }
        }

        if (tabName === 'state') {
            const ctx = document.getElementById('stateChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Agri GDP Increase', 'Tax Revenue', 'Export Earnings', 'Rural Investment'],
                        datasets: [{
                            data: [25000, 2500, 16000, 10000],
                            backgroundColor: [
                                '#D4A843',
                                '#2E7D32',
                                '#1565C0',
                                '#6A1B9A'
                            ],
                            borderWidth: 3,
                            borderColor: 'rgba(12, 26, 58, 0.9)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '50%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: 'rgba(255,255,255,0.7)',
                                    padding: 16,
                                    font: { size: 12 },
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => `${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')} Cr`
                                }
                            }
                        }
                    }
                });
            }
        }

        if (tabName === 'consumer') {
            const ctx = document.getElementById('consumerChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Quality', 'Traceability', 'Affordability', 'Freshness', 'Variety', 'Accessibility'],
                        datasets: [
                            {
                                label: 'Current System',
                                data: [3, 1, 4, 3, 3, 4],
                                borderColor: 'rgba(198, 40, 40, 0.8)',
                                backgroundColor: 'rgba(198, 40, 40, 0.1)',
                                pointBackgroundColor: '#C62828',
                                borderWidth: 2
                            },
                            {
                                label: 'Punjab Model',
                                data: [9, 9, 8, 8, 7, 9],
                                borderColor: 'rgba(212, 168, 67, 0.9)',
                                backgroundColor: 'rgba(212, 168, 67, 0.15)',
                                pointBackgroundColor: '#D4A843',
                                borderWidth: 2
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'rgba(255,255,255,0.7)',
                                    font: { size: 12 },
                                    usePointStyle: true
                                }
                            }
                        },
                        scales: {
                            r: {
                                grid: { color: 'rgba(255,255,255,0.08)' },
                                pointLabels: { color: 'rgba(255,255,255,0.6)', font: { size: 12 } },
                                ticks: { display: false },
                                suggestedMin: 0,
                                suggestedMax: 10
                            }
                        }
                    }
                });
            }
        }
    }

    // --- Surplus Gap Chart ---
    const surplusGapCtx = document.getElementById('surplusGapChart');
    if (surplusGapCtx) {
        const surplusObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new Chart(surplusGapCtx, {
                        type: 'bar',
                        data: {
                            labels: ['Wheat', 'Rice (Paddy)', 'Dairy', 'Fruits & Veg', 'Pulses & Oilseeds'],
                            datasets: [
                                {
                                    label: 'Production (LMT)',
                                    data: [175, 135, 130, 55, 15],
                                    backgroundColor: 'rgba(212, 168, 67, 0.8)',
                                    borderColor: '#D4A843',
                                    borderWidth: 2,
                                    borderRadius: 6
                                },
                                {
                                    label: 'Local Consumption (LMT)',
                                    data: [35, 20, 60, 30, 10],
                                    backgroundColor: 'rgba(46, 125, 50, 0.7)',
                                    borderColor: '#2E7D32',
                                    borderWidth: 2,
                                    borderRadius: 6
                                },
                                {
                                    label: 'SURPLUS (LMT)',
                                    data: [140, 115, 70, 25, 5],
                                    backgroundColor: 'rgba(198, 40, 40, 0.7)',
                                    borderColor: '#C62828',
                                    borderWidth: 2,
                                    borderRadius: 6
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        font: { size: 13, weight: 600 },
                                        usePointStyle: true,
                                        padding: 20
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} LMT`
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { font: { weight: 600 } }
                                },
                                y: {
                                    grid: { color: 'rgba(0,0,0,0.06)' },
                                    ticks: {
                                        callback: (v) => `${v} LMT`
                                    }
                                }
                            }
                        }
                    });
                    surplusObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        surplusObserver.observe(surplusGapCtx);
    }

    // --- Absorption / Export Pipeline Chart ---
    const absorptionCtx = document.getElementById('absorptionChart');
    if (absorptionCtx) {
        const absorptionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new Chart(absorptionCtx, {
                        type: 'bar',
                        data: {
                            labels: [
                                'Middle East\nFood Security',
                                'Diaspora\nMarkets',
                                'G2G Food\nSecurity',
                                'Institutional\n& B2B',
                                'Ready-to-Eat\nGlobal',
                                'E-Commerce\nExport'
                            ],
                            datasets: [
                                {
                                    label: 'Volume (LMT/year)',
                                    data: [90, 17, 60, 35, 12, 6],
                                    backgroundColor: [
                                        'rgba(212, 168, 67, 0.85)',
                                        'rgba(21, 101, 192, 0.8)',
                                        'rgba(46, 125, 50, 0.8)',
                                        'rgba(106, 27, 154, 0.8)',
                                        'rgba(230, 81, 0, 0.8)',
                                        'rgba(0, 151, 167, 0.8)'
                                    ],
                                    borderRadius: 8,
                                    borderWidth: 0
                                },
                                {
                                    label: 'Revenue ($ Billion/year)',
                                    data: [4, 1.75, 2.5, 1.5, 2.5, 0.75],
                                    backgroundColor: [
                                        'rgba(232, 201, 106, 0.5)',
                                        'rgba(66, 165, 245, 0.5)',
                                        'rgba(76, 175, 80, 0.5)',
                                        'rgba(171, 71, 188, 0.5)',
                                        'rgba(255, 152, 0, 0.5)',
                                        'rgba(77, 208, 225, 0.5)'
                                    ],
                                    borderRadius: 8,
                                    borderWidth: 0,
                                    yAxisID: 'y1'
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'rgba(255,255,255,0.7)',
                                        font: { size: 12, weight: 600 },
                                        usePointStyle: true,
                                        padding: 20
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (ctx) => {
                                            if (ctx.datasetIndex === 0) return `Volume: ${ctx.raw} LMT/year`;
                                            return `Revenue: $${ctx.raw}B/year`;
                                        }
                                    }
                                },
                                annotation: {
                                    annotations: {
                                        surplusLine: {
                                            type: 'line',
                                            yMin: 230,
                                            yMax: 230,
                                            borderColor: '#C62828',
                                            borderWidth: 2,
                                            borderDash: [6, 4],
                                            label: {
                                                display: true,
                                                content: 'Surplus: 230 LMT',
                                                color: '#C62828'
                                            }
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: {
                                        color: 'rgba(255,255,255,0.6)',
                                        font: { size: 11, weight: 600 },
                                        maxRotation: 0
                                    }
                                },
                                y: {
                                    position: 'left',
                                    grid: { color: 'rgba(255,255,255,0.06)' },
                                    ticks: {
                                        color: 'rgba(255,255,255,0.6)',
                                        callback: (v) => `${v} LMT`
                                    },
                                    title: {
                                        display: true,
                                        text: 'Volume (LMT)',
                                        color: 'rgba(255,255,255,0.5)'
                                    }
                                },
                                y1: {
                                    position: 'right',
                                    grid: { display: false },
                                    ticks: {
                                        color: 'rgba(255,255,255,0.6)',
                                        callback: (v) => `$${v}B`
                                    },
                                    title: {
                                        display: true,
                                        text: 'Revenue ($B)',
                                        color: 'rgba(255,255,255,0.5)'
                                    }
                                }
                            }
                        }
                    });
                    absorptionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        absorptionObserver.observe(absorptionCtx);
    }

    // --- Investment vs Returns Chart ---
    const investmentCtx = document.getElementById('investmentChart');
    if (investmentCtx) {
        new Chart(investmentCtx, {
            type: 'bar',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [
                    {
                        label: 'Cumulative Investment',
                        data: [1000, 6000, 16000, 16000, 16000],
                        backgroundColor: 'rgba(198, 40, 40, 0.6)',
                        borderColor: '#C62828',
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Cumulative Returns',
                        data: [500, 5000, 15000, 28000, 42000],
                        backgroundColor: 'rgba(212, 168, 67, 0.7)',
                        borderColor: '#D4A843',
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255,255,255,0.7)',
                            font: { size: 13 },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')} Cr`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.6)' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: {
                            color: 'rgba(255,255,255,0.6)',
                            callback: (v) => `₹${(v / 1000).toFixed(0)}K Cr`
                        }
                    }
                }
            }
        });
    }

    // ========================================
    // HERO PARTICLES (subtle floating dots)
    // ========================================
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(212, 168, 67, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * -10}s;
            `;
            particleContainer.appendChild(particle);
        }

        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2); opacity: 0.6; }
                50% { transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0.8); opacity: 0.4; }
                75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1); opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // CYCLE NODE HOVER EFFECTS
    // ========================================
    const cycleNodes = document.querySelectorAll('.cycle-node');
    cycleNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            cycleNodes.forEach(n => {
                if (n !== node) n.style.opacity = '0.4';
            });
        });
        node.addEventListener('mouseleave', () => {
            cycleNodes.forEach(n => n.style.opacity = '1');
        });
    });

    // ========================================
    // PROFIT SHARE BAR ANIMATION
    // ========================================
    const profitBars = document.querySelectorAll('.profit-share-bar');
    const profitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.profit-share-bar');
                bars.forEach((bar, i) => {
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = bar.style.getPropertyValue('--share-width');
                    }, 200 + i * 150);
                });
                profitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const profitDistribution = document.querySelector('.profit-distribution');
    if (profitDistribution) profitObserver.observe(profitDistribution);

    // ========================================
    // SMOOTH SCROLL for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});
