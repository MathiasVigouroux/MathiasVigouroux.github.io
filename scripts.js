const popularNames = [
    "Muhammad", "Li Wei", "Wang Wei", "James", "John", "Maria", "Ana", "Zhang Wei", "Wei Wang", "Li Na",
    "David", "Carlos", "Antonio", "José", "Manuel", "Ali", "Ibrahim", "Sofia", "Elena", "Anna",
    "Juan", "Miguel", "Luis", "Chen Wei", "Li Ming", "Ahmed", "Hassan", "Fatima", "Sarah", "Emma",
    "Oliver", "Jack", "Harry", "George", "Noah", "Mohammed", "William", "Leonardo", "Alessandro", "Giuseppe",
    "Yang", "Wu", "Zhang", "Liu", "Chen", "Wang", "Li", "Smith", "Johnson", "Williams",
    "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
    "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson",
    "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans"
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Document is ready!');
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

    createStars();
    startShootingStars();
});

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
