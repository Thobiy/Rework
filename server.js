
const http = require('http');
const fs = require('fs');


const requestHandler = (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Handle GET request for home page
        fs.readFile('form.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('500 Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = parseFormData(body);
            saveToDatabase(formData, (err) => {
                if (err) {
                    res.writeHead(500, { 'content-Type': 'text/html '});
                    res.end('500 Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('Form submitted successfully! <a href="/">Return to Home</a>');
                }
            });
        });
    } else {
        
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
    }
};



const server = http.createServer(requestHandler);

//server listening on port 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Parse form data
function parseFormData(body) {
    const params = new URLSearchParams(body);
    const formData = {};

    for (const [key, value] of params) {
        formData[key] = value;
    }

    return formData;
}

// Save data to database
function saveToDatabase(formData, callback) {
    const data = JSON.stringify(formData);

    fs.appendFile('database.json', data + '\n', 'utf8', (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}
