const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

// Cache the STL file in memory
let stlCache = null;

app.get('/model.stl', async (req, res) => {
    // Return cached version if available
    if (stlCache) {
        res.type('application/octet-stream');
        res.send(stlCache);
        return;
    }
    
    const localPath = path.join(__dirname, 'model.stl');
    
    // Check if we have a local copy
    if (fs.existsSync(localPath)) {
        stlCache = fs.readFileSync(localPath);
        res.type('application/octet-stream');
        res.send(stlCache);
        return;
    }
    
    // Fetch from GitHub release with proper redirect handling
    const fetchSTL = (url) => {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    // Follow redirect
                    fetchSTL(response.headers.location).then(resolve).catch(reject);
                } else if (response.statusCode === 200) {
                    const chunks = [];
                    response.on('data', chunk => chunks.push(chunk));
                    response.on('end', () => {
                        const buffer = Buffer.concat(chunks);
                        resolve(buffer);
                    });
                    response.on('error', reject);
                } else {
                    reject(new Error(`Failed to fetch: ${response.statusCode}`));
                }
            }).on('error', reject);
        });
    };
    
    try {
        console.log('Fetching STL from GitHub release...');
        stlCache = await fetchSTL('https://github.com/nekonomicus/stl-viewer-app/releases/download/v1.0/Example.stl');
        console.log(`STL cached in memory: ${(stlCache.length / 1024 / 1024).toFixed(2)} MB`);
        res.type('application/octet-stream');
        res.send(stlCache);
    } catch (error) {
        console.error('Error fetching STL:', error);
        // Fallback to cube if fetch fails
        const cubeSTL = Buffer.from('solid cube\n' +
                '  facet normal 0 0 -1\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 10 0 0\n' +
                '      vertex 10 10 0\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 0 -1\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 10 10 0\n' +
                '      vertex 0 10 0\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 0 1\n' +
                '    outer loop\n' +
                '      vertex 0 0 10\n' +
                '      vertex 10 10 10\n' +
                '      vertex 10 0 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 0 1\n' +
                '    outer loop\n' +
                '      vertex 0 0 10\n' +
                '      vertex 0 10 10\n' +
                '      vertex 10 10 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal -1 0 0\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 0 10 0\n' +
                '      vertex 0 10 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal -1 0 0\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 0 10 10\n' +
                '      vertex 0 0 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 1 0 0\n' +
                '    outer loop\n' +
                '      vertex 10 0 0\n' +
                '      vertex 10 10 10\n' +
                '      vertex 10 10 0\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 1 0 0\n' +
                '    outer loop\n' +
                '      vertex 10 0 0\n' +
                '      vertex 10 0 10\n' +
                '      vertex 10 10 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 -1 0\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 10 0 10\n' +
                '      vertex 10 0 0\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 -1 0\n' +
                '    outer loop\n' +
                '      vertex 0 0 0\n' +
                '      vertex 0 0 10\n' +
                '      vertex 10 0 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 1 0\n' +
                '    outer loop\n' +
                '      vertex 0 10 0\n' +
                '      vertex 10 10 0\n' +
                '      vertex 10 10 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                '  facet normal 0 1 0\n' +
                '    outer loop\n' +
                '      vertex 0 10 0\n' +
                '      vertex 10 10 10\n' +
                '      vertex 0 10 10\n' +
                '    endloop\n' +
                '  endfacet\n' +
                'endsolid cube\n');
        res.type('application/octet-stream');
        res.send(cubeSTL);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));