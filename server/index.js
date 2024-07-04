const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;
let startTime = Date.now();

app.use(express.json());

app.post('/api', (req, res) => {
    const currentTime = Date.now();
    if (currentTime - startTime >= 1000) {
        startTime = currentTime;
        requestCount = 0;
    }

    requestCount++;

    if (requestCount > 50) {
        return res.status(429).send('Too many requests');
    }

    const delay = Math.floor(Math.random() * 1000) + 1;
    setTimeout(() => {
        res.send({ index: req.body.index });
    }, delay);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
