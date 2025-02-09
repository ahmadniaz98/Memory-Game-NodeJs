const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


http.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});