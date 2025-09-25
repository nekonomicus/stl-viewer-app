const express = require('express');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

// Serve STL file - check for compressed version first
app.get('/model.stl', (req, res) => {
    const stlGzPath = path.join(__dirname, 'model.stl.gz');
    const stlPath = path.join(__dirname, 'model.stl');
    
    if (fs.existsSync(stlGzPath)) {
        // Serve decompressed gzipped STL
        res.type('application/octet-stream');
        fs.createReadStream(stlGzPath)
            .pipe(zlib.createGunzip())
            .pipe(res);
    } else if (fs.existsSync(stlPath)) {
        res.sendFile(stlPath);
    } else {
        // Create a simple cube STL as placeholder
        const cubeSTL = Buffer.from('solid cube\n' +
            '  facet normal 0 0 -1\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 1 0 0\n' +
            '      vertex 1 1 0\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 0 -1\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 1 1 0\n' +
            '      vertex 0 1 0\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 0 1\n' +
            '    outer loop\n' +
            '      vertex 0 0 1\n' +
            '      vertex 1 1 1\n' +
            '      vertex 1 0 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 0 1\n' +
            '    outer loop\n' +
            '      vertex 0 0 1\n' +
            '      vertex 0 1 1\n' +
            '      vertex 1 1 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal -1 0 0\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 0 1 0\n' +
            '      vertex 0 1 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal -1 0 0\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 0 1 1\n' +
            '      vertex 0 0 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 1 0 0\n' +
            '    outer loop\n' +
            '      vertex 1 0 0\n' +
            '      vertex 1 1 1\n' +
            '      vertex 1 1 0\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 1 0 0\n' +
            '    outer loop\n' +
            '      vertex 1 0 0\n' +
            '      vertex 1 0 1\n' +
            '      vertex 1 1 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 -1 0\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 1 0 1\n' +
            '      vertex 1 0 0\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 -1 0\n' +
            '    outer loop\n' +
            '      vertex 0 0 0\n' +
            '      vertex 0 0 1\n' +
            '      vertex 1 0 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 1 0\n' +
            '    outer loop\n' +
            '      vertex 0 1 0\n' +
            '      vertex 1 1 0\n' +
            '      vertex 1 1 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            '  facet normal 0 1 0\n' +
            '    outer loop\n' +
            '      vertex 0 1 0\n' +
            '      vertex 1 1 1\n' +
            '      vertex 0 1 1\n' +
            '    endloop\n' +
            '  endfacet\n' +
            'endsolid cube\n');
        res.type('application/octet-stream');
        res.send(cubeSTL);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));