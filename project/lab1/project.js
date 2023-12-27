const http = require('http');
const fs = require('fs');

const studentsData = [
    { id: 1, name: 'Kusain Sayat', group: 'SE-2208', gpa: 3.5 },
    { id: 2, name: 'Lin Aibyn', group: 'SE-2206', gpa: 3.2 },
    { id: 3, name: 'Alibekov Zhandos', group: 'SE-2232', gpa: 2.61 },

    { id: 4, name: 'Alya Baktygalieva', group: 'CS-2316', gpa: 3.9 },
    { id: 5, name: 'Zhan Kazykhanov', group: 'IT-2209', gpa: 3.87 },
    { id: 6, name: 'Asyl Erlan', group: 'MT-2101', gpa: 1.78 },
    { id: 7, name: 'Abay Qunanbay', group: 'CS-2231', gpa: 2.56 },

];

function serveStaticFile(res, path, contentType, responseCode) {
    if (!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

function handleStudentRequest(studentId, res) {
    const student = studentsData.find((s) => s.id === parseInt(studentId));
    if (student) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>${student.name}</h1>
            <p>Group: ${student.group}</p>
            <p>GPA: ${student.gpa}</p>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Student Not Found</h1>');
    }
}

http.createServer(function (req, res) {
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch (path) {
        case '':
            serveStaticFile(res, '/public/home.html', 'text/html');
            break;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const studentListHTML = studentsData
                .map((student) => `<h2>${student.name}</h2><p>Group: ${student.group}</p>`)
                .join('');
            res.end(`<h1>Students</h1>${studentListHTML}`);
            break;
        default:
            const match = path.match(/^\/about\/(\d+)$/);
            if (match) {
                handleStudentRequest(match[1], res);
            } else {
                serveStaticFile(res, '/public/404.html', 'text/html', 404);
            }
            break;
    }
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');