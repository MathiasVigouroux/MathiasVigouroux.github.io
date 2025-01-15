// Example JavaScript code
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document is ready!');
    // Add your JavaScript code here

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
});

function sendEmail() {
    window.location.href = "mailto:mathias.vigouroux2@gmail.com?subject=Hello%20Mathias&body=I%20would%20like%20to%20get%20in%20touch%20with%20you.";
}
