function loadProjects(projects, carouselId) {
    const carousel = document.getElementById(carouselId);
    projects.forEach(project => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        
        const iframe = document.createElement('iframe');
        iframe.src = project.url + '#page=1';
        iframe.width = '100%';
        iframe.height = '400px';
        iframe.style.border = 'none';
        
        const description = document.createElement('p');
        description.textContent = project.description;
        
        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = 'View Full PDF';
        link.target = '_blank';
        
        carouselItem.appendChild(iframe);
        carouselItem.appendChild(description);
        carouselItem.appendChild(link);
        carousel.appendChild(carouselItem);
    });
}

function createProjectElement(project, container) {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    
    const title = document.createElement('h3');
    title.textContent = project.name;
    
    const description = document.createElement('p');
    description.textContent = project.description;
    
    const link = document.createElement('a');
    link.href = project.url;
    link.textContent = 'View Project';
    link.target = '_blank';
    
    carouselItem.appendChild(title);
    carouselItem.appendChild(description);
    carouselItem.appendChild(link);
    container.appendChild(carouselItem);
}

function loadRecentProjects() {
    const jsonPath = window.location.pathname.includes('github.io') ? 
        '/MathiasVigouroux.github.io/projects.json' : '/projects.json';
    
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const carousel = document.getElementById('recent-carousel');
            if (!carousel) return;
            
            carousel.innerHTML = ''; // Clear loading message
            
            const allProjects = [
                ...data.scientific_projects.map(p => ({...p, type: 'scientific'})),
                ...data.artistic_projects.map(p => ({...p, type: 'artistic'}))
            ];
            
            const recentProjects = allProjects
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            
            recentProjects.forEach(project => createProjectElement(project, carousel));
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            const carousel = document.getElementById('recent-carousel');
            if (carousel) {
                carousel.innerHTML = '<p class="error">Error loading projects. Please try again later.</p>';
            }
        });
}

function loadScientificProjects() {
    const jsonPath = window.location.pathname.includes('github.io') ? 
        '/MathiasVigouroux.github.io/projects.json' : '/projects.json';
    
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const recentCarousel = document.getElementById('recent-scientific-carousel');
            const projectsList = document.getElementById('scientific-projects-list');
            
            if (recentCarousel) {
                recentCarousel.innerHTML = '';
                data.scientific_projects
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3)
                    .forEach(project => createProjectElement(project, recentCarousel));
            }
            
            if (projectsList) {
                projectsList.innerHTML = '';
                data.scientific_projects.forEach(project => createProjectListItem(project, projectsList));
            }
        })
        .catch(error => console.error('Error loading scientific projects:', error));
}

function loadArtisticProjects() {
    const jsonPath = window.location.pathname.includes('github.io') ? 
        '/MathiasVigouroux.github.io/projects.json' : '/projects.json';
    
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const recentCarousel = document.getElementById('recent-artistic-carousel');
            
            // Get all artistic subcategories
            const allArtisticProjects = [];
            const artisticCategories = {};
            
            // Map category keys to display names and IDs
            const categoryDisplayNames = {
                'artistic_theater': { name: 'Theater', id: 'theater' },
                'artistic_screen': { name: 'Screen', id: 'screen' },
                'artistic_dance': { name: 'Dance', id: 'dance' },
                'artistic_choir': { name: 'Choir', id: 'choir' },
                'artistic_classes': { name: 'Classes', id: 'classes' },
                'artistic_projects': { name: 'Other Projects', id: 'other' }
            };
            
            // Collect all artistic subcategories
            Object.keys(data).forEach(key => {
                if (key.startsWith('artistic_')) {
                    // Store the category for later use
                    artisticCategories[key] = data[key];
                    
                    // Add all projects from this category to the combined list
                    if (data[key] && Array.isArray(data[key])) {
                        data[key].forEach(project => {
                            allArtisticProjects.push({
                                ...project,
                                category: key
                            });
                        });
                    }
                }
            });
            
            // Handle the recent works carousel
            if (recentCarousel) {
                recentCarousel.innerHTML = '';
                
                if (allArtisticProjects.length === 0) {
                    recentCarousel.innerHTML = '<p>No artistic projects found.</p>';
                } else {
                    // Sort all artistic projects by date and take the 3 most recent
                    allArtisticProjects
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3)
                        .forEach(project => createProjectElement(project, recentCarousel));
                }
            }
            
            // Create sections for each artistic subcategory
            const categoriesContainer = document.getElementById('artistic-categories');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '';
                
                // Process each category
                Object.keys(artisticCategories).forEach(categoryKey => {
                    // Skip empty categories
                    if (!artisticCategories[categoryKey] || artisticCategories[categoryKey].length === 0) return;
                    
                    const categoryId = categoryKey.replace('artistic_', '');
                    const displayInfo = categoryDisplayNames[categoryKey] || {
                        name: categoryId.replace('_', ' '),
                        id: categoryId
                    };
                    
                    // Create a section for this category
                    const section = document.createElement('section');
                    section.className = 'category-section';
                    section.id = displayInfo.id;  // Set the ID for scroll target
                    
                    const heading = document.createElement('h2');
                    heading.textContent = displayInfo.name;
                    section.appendChild(heading);
                    
                    const projectsList = document.createElement('div');
                    projectsList.className = 'projects-list';
                    
                    // Add all projects for this category
                    artisticCategories[categoryKey].forEach(project => {
                        createProjectListItem(project, projectsList);
                    });
                    
                    section.appendChild(projectsList);
                    categoriesContainer.appendChild(section);
                });
                
                // Setup navigation click handlers
                setupCategoryNavigation();
            }
        })
        .catch(error => {
            console.error('Error loading artistic projects:', error);
            const recentCarousel = document.getElementById('recent-artistic-carousel');
            if (recentCarousel) {
                recentCarousel.innerHTML = '<p class="error">Error loading projects. Please try again later.</p>';
            }
        });
}

// Add this new function to handle smooth scrolling
function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.art-categories-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate scroll position with offset for fixed header
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to the section
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state for navigation
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function createProjectListItem(project, container) {
    const item = document.createElement('div');
    item.className = 'project-item';
    
    const title = document.createElement('h3');
    title.textContent = project.name;
    
    const description = document.createElement('p');
    description.textContent = project.description;
    
    const link = document.createElement('a');
    link.href = project.url;
    link.textContent = 'View Project';
    link.target = '_blank';
    
    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(link);
    container.appendChild(item);
}