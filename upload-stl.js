const fs = require('fs');
const https = require('https');
const path = require('path');

// Read the local STL file
const stlPath = '/Users/samuel/Downloads/Example.stl';
const stlData = fs.readFileSync(stlPath);

console.log(`STL file size: ${(stlData.length / 1024 / 1024).toFixed(2)} MB`);

// Upload to file.io (free temporary file hosting)
const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
const formData = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="model.stl"\r\nContent-Type: application/octet-stream\r\n\r\n`),
    stlData,
    Buffer.from(`\r\n--${boundary}--\r\n`)
]);

const options = {
    hostname: 'file.io',
    port: 443,
    path: '/?expires=1d',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': formData.length
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const result = JSON.parse(data);
        if (result.success) {
            console.log('\n✅ STL uploaded successfully!');
            console.log(`📎 Download URL: ${result.link}`);
            console.log('\nNow update the index.html to use this URL...');
            
            // Update index.html with the new URL
            const indexPath = path.join(__dirname, 'index.html');
            let indexContent = fs.readFileSync(indexPath, 'utf8');
            indexContent = indexContent.replace(
                "loader.load('/model.stl'",
                `loader.load('${result.link}'`
            );
            fs.writeFileSync(indexPath, indexContent);
            console.log('✅ Updated index.html with external STL URL');
            console.log('\n🚀 Run: git add -A && git commit -m "Use external STL hosting" && git push');
        } else {
            console.error('Upload failed:', data);
        }
    });
});

req.on('error', error => console.error('Error:', error));
req.write(formData);
req.end();

console.log('⏳ Uploading STL file to temporary hosting...');