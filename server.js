const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));
app.get('/model.stl', (req, res) => {
    res.sendFile(path.join(__dirname, 'model.stl'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));