document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('article-items');
    
    // Only load papers if we're on the papers page
    if (articlesContainer) {
        loadArticles();
    }
    
    // Load featured papers on homepage
    const featuredContainer = document.getElementById('featured-articles');
    if (featuredContainer) {
        loadFeaturedArticles();
    }
    
    // Initialize statistics animation
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        initializeStats();
    }
    
    // Smooth scrolling for navigation
    initializeSmoothScrolling();
});

function loadArticles() {
    fetch('../data/articles.json')
        .then(response => response.json())
        .then(papers => {
            const articlesContainer = document.getElementById('article-items');
            articlesContainer.innerHTML = '';
            
            papers.forEach(paper => {
                const listItem = document.createElement('li');
                listItem.className = 'article-item';
                
                listItem.innerHTML = `
                    <div class="article-preview">
                        <h3><a href="${paper.url}" target="_blank">${paper.title}</a></h3>
                        <p class="article-meta">
                            <span class="author">By ${paper.author}</span> | 
                            <span class="date">${formatDate(paper.date)}</span>
                            <span class="paper-indicator">📄 Research Paper</span>
                        </p>
                        <p class="article-summary">${paper.summary}</p>
                        <div class="article-tags">
                            ${paper.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                articlesContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading papers:', error);
            document.getElementById('article-items').innerHTML = '<li>Error loading papers.</li>';
        });
}

function loadFeaturedArticles() {
    fetch('./src/data/articles.json')
        .then(response => response.json())
        .then(papers => {
            const featuredContainer = document.getElementById('featured-articles');
            featuredContainer.innerHTML = '';
            
            // Show all papers as featured
            papers.forEach(paper => {
                const articleElement = document.createElement('div');
                articleElement.className = 'featured-article';
                
                articleElement.innerHTML = `
                    <h3><a href="${paper.url}" target="_blank">${paper.title}</a></h3>
                    <p class="article-meta">
                        <span class="author">By ${paper.author}</span> | 
                        <span class="date">${formatDate(paper.date)}</span>
                        <span class="paper-indicator">📄 Research Paper</span>
                    </p>
                    <p class="article-summary">${paper.summary}</p>
                    <div class="article-tags">
                        ${paper.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                `;
                
                featuredContainer.appendChild(articleElement);
            });
        })
        .catch(error => {
            console.error('Error loading featured papers:', error);
        });
}

function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetNumber = parseInt(statNumber.dataset.number);
                animateCounter(statNumber, targetNumber);
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(statNumber => {
        observer.observe(statNumber);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}