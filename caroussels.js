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
            const projectsList = document.getElementById('artistic-projects-list');
            
            if (recentCarousel) {
                recentCarousel.innerHTML = '';
                data.artistic_projects
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3)
                    .forEach(project => createProjectElement(project, recentCarousel));
            }
            
            if (projectsList) {
                projectsList.innerHTML = '';
                data.artistic_projects.forEach(project => createProjectListItem(project, projectsList));
            }
        })
        .catch(error => console.error('Error loading artistic projects:', error));
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