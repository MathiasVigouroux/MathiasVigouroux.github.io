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

function getProjectsJsonUrl() {
    // Simplify path resolution for GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        // For GitHub Pages, use an absolute path
        return '/projects.json';
    } else {
        // For local development
        return 'projects.json';
    }
}

function loadRecentProjects() {
    const jsonUrl = getProjectsJsonUrl();
    console.log('Loading projects from:', jsonUrl);
    
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to load projects.json: ${response.status} ${response.statusText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Projects data loaded successfully:', Object.keys(data));
            const carousel = document.getElementById('recent-carousel');
            if (!carousel) {
                console.warn('Carousel element not found: recent-carousel');
                return;
            }
            
            carousel.innerHTML = '';
            
            // Handle new subcategory data structure
            let allProjects = [];
            
            // Collect all scientific projects from subcategories
            Object.keys(data).forEach(key => {
                if (key.startsWith('scientific_') && Array.isArray(data[key])) {
                    allProjects = [
                        ...allProjects,
                        ...data[key].map(p => ({...p, type: key}))
                    ];
                }
                
                // Also collect artistic projects from subcategories
                if (key.startsWith('artistic_') && Array.isArray(data[key])) {
                    allProjects = [
                        ...allProjects,
                        ...data[key].map(p => ({...p, type: key}))
                    ];
                }
            });
            
            console.log(`Found ${allProjects.length} total projects`);
            
            if (allProjects.length === 0) {
                carousel.innerHTML = '<p>No projects found. Please check your projects.json file.</p>';
                return;
            }
            
            // Sort by date if available, otherwise just use the first 3
            const recentProjects = allProjects
                .filter(p => p.date) // Only include projects with dates
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
                
            if (recentProjects.length === 0) {
                // If no projects have dates, just use the first 3
                allProjects.slice(0, 3).forEach(project => createProjectElement(project, carousel));
            } else {
                recentProjects.forEach(project => createProjectElement(project, carousel));
            }
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
    const jsonUrl = getProjectsJsonUrl();
    console.log('Loading scientific projects from:', jsonUrl);
    
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const recentCarousel = document.getElementById('recent-scientific-carousel');
            const categoriesContainer = document.getElementById('scientific-categories');
            
            // Get all scientific subcategories
            const allScientificProjects = [];
            const scientificCategories = {};
            
            // Map category keys to display names and IDs
            const categoryDisplayNames = {
                'scientific_nlp': { name: 'Natural Language Processing & AI', id: 'nlp' },
                'scientific_rl': { name: 'Reinforcement Learning', id: 'rl' },
                'scientific_math': { name: 'Mathematics', id: 'math' },
                'scientific_med': { name: 'Medical Applications', id: 'med' },
                'scientific_cog': { name: 'Cognitive Science', id: 'cog' },
                'scientific_thesis': { name: 'Thesis & Reports', id: 'thesis' }
            };
            
            // Collect all scientific subcategories
            Object.keys(data).forEach(key => {
                if (key.startsWith('scientific_')) {
                    // Store the category for later use
                    scientificCategories[key] = data[key];
                    
                    // Add all projects from this category to the combined list
                    if (data[key] && Array.isArray(data[key])) {
                        data[key].forEach(project => {
                            allScientificProjects.push({
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
                
                if (allScientificProjects.length === 0) {
                    recentCarousel.innerHTML = '<p>No scientific projects found.</p>';
                } else {
                    // Sort all scientific projects by date and take the 3 most recent
                    allScientificProjects
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3)
                        .forEach(project => createProjectElement(project, recentCarousel));
                }
            }
            
            // Create sections for each scientific subcategory
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '';
                console.log('Creating scientific category sections');
                
                // Process each category
                Object.keys(scientificCategories).forEach(categoryKey => {
                    // Skip empty categories
                    if (!scientificCategories[categoryKey] || scientificCategories[categoryKey].length === 0) return;
                    
                    // Get the ID from the mapping
                    const sectionId = categoryDisplayNames[categoryKey] ? 
                        categoryDisplayNames[categoryKey].id : 
                        categoryKey.replace('scientific_', '');
                    
                    console.log(`Creating section for ${categoryKey} with id ${sectionId}`);
                    
                    // Create a section for this category
                    const section = document.createElement('section');
                    section.className = 'category-section';
                    section.id = sectionId;  // Set the ID for scroll target
                    
                    const heading = document.createElement('h2');
                    heading.textContent = categoryDisplayNames[categoryKey] ? 
                        categoryDisplayNames[categoryKey].name : 
                        categoryKey.replace('scientific_', '').replace('_', ' ').toUpperCase();
                    section.appendChild(heading);
                    
                    const projectsList = document.createElement('div');
                    projectsList.className = 'projects-list';
                    
                    // Add all projects for this category
                    scientificCategories[categoryKey].forEach(project => {
                        createProjectListItem(project, projectsList);
                    });
                    
                    section.appendChild(projectsList);
                    categoriesContainer.appendChild(section);
                });
                
                // Debug output of all section IDs
                const allSections = categoriesContainer.querySelectorAll('section');
                console.log('Created scientific sections with IDs:', Array.from(allSections).map(s => s.id));
            }
        })
        .catch(error => {
            console.error('Error loading scientific projects:', error);
            const recentCarousel = document.getElementById('recent-scientific-carousel');
            if (recentCarousel) {
                recentCarousel.innerHTML = '<p class="error">Error loading projects. Please try again later.</p>';
            }
            const categoriesContainer = document.getElementById('scientific-categories');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '<p class="error">Error loading scientific categories. Please try again later.</p>';
            }
        });
}

function loadArtisticProjects() {
    const jsonUrl = getProjectsJsonUrl();
    console.log('Loading artistic projects from:', jsonUrl);
    
    fetch(jsonUrl)
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
                console.log('Creating category sections');
                
                // Process each category
                Object.keys(artisticCategories).forEach(categoryKey => {
                    // Skip empty categories
                    if (!artisticCategories[categoryKey] || artisticCategories[categoryKey].length === 0) return;
                    
                    // Map category keys to section IDs
                    let sectionId;
                    if (categoryKey === 'artistic_projects') {
                        sectionId = 'other';
                    } else if (categoryKey === 'artistic_classes') {
                        sectionId = 'classes';
                    } else {
                        sectionId = categoryKey.replace('artistic_', '');
                    }
                    
                    console.log(`Creating section for ${categoryKey} with id ${sectionId}`);
                    
                    // Create a section for this category
                    const section = document.createElement('section');
                    section.className = 'category-section';
                    section.id = sectionId;  // Set the ID for scroll target
                    
                    const heading = document.createElement('h2');
                    heading.textContent = categoryDisplayNames[categoryKey].name;
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
                
                // Debug output of all section IDs
                const allSections = categoriesContainer.querySelectorAll('section');
                console.log('Created sections with IDs:', Array.from(allSections).map(s => s.id));
                
                // Don't call setupCategoryNavigation here anymore
                // setupCategoryNavigation();
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

// Keep the function but we won't use it directly from the carousel.js
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