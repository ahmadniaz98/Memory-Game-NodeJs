const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 4000;
http.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});