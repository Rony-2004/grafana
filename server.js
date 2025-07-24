const express = require('express');
const client = require('prom-client');
const app = express();
const register = new client.Registry();

// Define counter metric with labels 'method' and 'path'
const apiCounter = new client.Counter({
    name: 'api_requests_total',
    help: 'Total number of API requests',
    labelNames: ['method', 'path']
});

register.registerMetric(apiCounter);

// Example route
app.get('/api/hello', (req, res) => {
    apiCounter.inc({ method: req.method, path: '/api/hello' }); // use 'path' label
    res.send('Hello, this is your monitored API!');
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
