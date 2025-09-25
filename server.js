const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

// STL file URL - using a decimated version for web
const STL_URL = 'https://github.com/nekonomicus/stl-viewer-app/releases/download/v1.0/model.stl';

app.get('/model.stl', (req, res) => {
    const localPath = path.join(__dirname, 'model.stl');
    
    // Check if we have a local copy first
    if (fs.existsSync(localPath)) {
        res.sendFile(localPath);
        return;
    }
    
    // Try to fetch from GitHub release
    https.get(STL_URL, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            // Follow redirect
            https.get(response.headers.location, (redirectResponse) => {
                res.type('application/octet-stream');
                redirectResponse.pipe(res);
            });
        } else if (response.statusCode === 200) {
            res.type('application/octet-stream');
            response.pipe(res);
        } else {
            // Fallback to cube
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
    }).on('error', (err) => {
        console.error('Error fetching STL:', err);
        res.status(500).send('Error loading model');
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));