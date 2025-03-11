const popularNames = [
    "Yuri Gagarin", "Alan Shepard", "Neil Armstrong",  "Thomas Pesquet",
    "Sally Ride", "Buzz Aldrin", "John Glenn"];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Document is ready!');
    console.log('Current page URL:', window.location.href);
    console.log('Current path:', window.location.pathname);
    updateRandomName();
    setInterval(() => {
        updateRandomName();
    }, 5000); // Increased interval to allow for typing animation

    // Rest of your existing code for carousel, stars, etc.
    if (document.getElementById('carousel')) {
        fetch('projects.json')
            .then(response => response.json())
            .then(data => {
                const carousel = document.getElementById('carousel');
                data.projects.forEach(project => {
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
            })
            .catch(error => console.error('Error fetching projects:', error));
    }

    if (document.getElementById('scientific-carousel')) {
        fetch('projects.json')
            .then(response => response.json())
            .then(data => {
                loadProjects(data.scientific_projects, 'scientific-carousel');
                loadProjects(data.artistic_projects, 'artistic-carousel');
            })
            .catch(error => console.error('Error fetching projects:', error));
    }

    createStars();
    startShootingStars();

    // Handle main projects page
    if (document.getElementById('recent-carousel')) {
        console.log('Found recent-carousel, loading projects...');
        loadRecentProjects();
    }

    // Handle scientific projects page
    if (document.getElementById('recent-scientific-carousel')) {
        console.log('Found scientific carousel, loading projects...');
        loadScientificProjects();
    }

    // Handle artistic projects page
    if (document.getElementById('recent-artistic-carousel')) {
        console.log('Found artistic carousel, loading projects...');
        loadArtisticProjects();
    }
    
    console.log('DOM loaded in scripts.js');
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === '' || currentPage === 'index.html') {
        console.log('Home page detected');
        // Home page specific code
    } else if (currentPage === 'projects.html') {
        console.log('Projects page detected');
        // Ensure projects are loaded
        if (typeof loadRecentProjects === 'function') {
            console.log('Loading recent projects from scripts.js');
            loadRecentProjects();
        } else {
            console.error('loadRecentProjects function not available yet');
            // Try again after a slight delay to ensure scripts are loaded
            setTimeout(() => {
                if (typeof loadRecentProjects === 'function') {
                    loadRecentProjects();
                }
            }, 500);
        }
    } else if (currentPage === 'scientific-projects.html') {
        console.log('Scientific projects page detected');
        if (typeof loadScientificProjects === 'function') {
            loadScientificProjects();
        }
    } else if (currentPage === 'artistic-projects.html') {
        console.log('Artistic projects page detected');
        if (typeof loadArtisticProjects === 'function') {
            loadArtisticProjects();
        }
    }
});

// Add window.onload as a backup
window.onload = function() {
    console.log('Window loaded in scripts.js');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'projects.html' && typeof loadRecentProjects === 'function') {
        console.log('Window load: Loading recent projects');
        loadRecentProjects();
    }
};

function sendEmail() {
    window.location.href = "mailto:mathias.vigouroux2@gmail.com?subject=Hello%20Mathias&body=I%20would%20like%20to%20get%20in%20touch%20with%20you.";
}

// Add stars to the background
function createStars() {
    const body = document.body;
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite`;
        body.appendChild(star);
    }
}

function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random starting point and destination
    const startSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let startX, startY, moveX, moveY, angle;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    switch(startSide) {
        case 0: // top
            startX = Math.random() * screenWidth;
            startY = -100;
            moveX = (Math.random() - 0.5) * 2000;
            moveY = 2000;
            angle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            break;
        case 1: // right
            startX = screenWidth + 100;
            startY = Math.random() * screenHeight;
            moveX = -2000;
            moveY = (Math.random() - 0.5) * 2000;
            angle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            break;
        case 2: // bottom
            startX = Math.random() * screenWidth;
            startY = screenHeight + 100;
            moveX = (Math.random() - 0.5) * 2000;
            moveY = -2000;
            angle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            break;
        case 3: // left
            startX = -100;
            startY = Math.random() * screenHeight;
            moveX = 2000;
            moveY = (Math.random() - 0.5) * 2000;
            angle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            break;
    }
    
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    star.style.setProperty('--moveX', `${moveX}px`);
    star.style.setProperty('--moveY', `${moveY}px`);
    star.style.setProperty('--angle', `${angle}deg`);
    
    star.style.animation = 'shoot-diagonal 2s ease-out forwards';
    
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

function startShootingStars() {
    // Start with just one shooting star after a delay
    setTimeout(createShootingStar, 1500);
    
    // Continue creating new stars with lower frequency
    setInterval(() => {
        if (Math.random() < 0.15) { // Reduced from 0.15 to 0.08 (8% chance)
            createShootingStar();
        }
    }, 3500); // Increased from 3000 to 4000ms
}

async function updateRandomName() {
    const nameElement = document.getElementById('dynamic-name');
    if (!nameElement) {
        console.log('Name element not found');
        return;
    }

    const randomName = popularNames[Math.floor(Math.random() * popularNames.length)];
    
    // Delete current text with backspace effect
    const currentText = nameElement.textContent.replace('.', ''); // Remove existing dot if any
    for (let i = currentText.length; i >= 0; i--) {
        nameElement.textContent = currentText.substring(0, i);
        nameElement.style.opacity = '1'; // Ensure visibility
        await new Promise(resolve => setTimeout(resolve, 75));
    }

    // Short pause before typing new text
    await new Promise(resolve => setTimeout(resolve, 200));

    // Type new text
    for (let i = 0; i <= randomName.length; i++) {
        nameElement.textContent = randomName.substring(0, i);
        nameElement.style.opacity = '1'; // Ensure visibility
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Add the dot
    nameElement.textContent = randomName + '.';

    // Wait before next update
    await new Promise(resolve => setTimeout(resolve, 2000));
}
