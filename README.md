# Mathias Vigouroux's Personal Website

This repository contains my personal website which is deployed through GitHub Pages.

## GitHub Pages Deployment

The site is automatically deployed at: https://mathiasvigouroux.github.io/

When pushing changes:
1. Always verify your paths are working correctly with the `/MathiasVigouroux.github.io` base path
2. Ensure all resources (images, CSS, JS) have proper relative or absolute paths
3. Wait a few minutes after pushing for GitHub Pages to rebuild the site

## Local Development

Due to CORS restrictions, the website won't fully work if you open the HTML files directly in a browser using the `file://` protocol. JSON files won't load properly.

### Running a Local Server

To test the website locally:

1. Open a terminal or command prompt
2. Navigate to the project directory:
   ```
   cd /path/to/MathiasVigouroux.github.io
   ```

3. Start a simple HTTP server:
   - Using Python (already installed on most systems):
     ```
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     ```
   - Using Node.js:
     ```
     # Install http-server if you haven't already
     npm install -g http-server
     
     # Run the server
     http-server
     ```

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```