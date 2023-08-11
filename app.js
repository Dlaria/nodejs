let http = require('http'),
url = require('url'),
querystring = require('querystring'),
hostname = '127.0.0.1',
port = 5000;

let server = http.createServer(function(req, res)
{
    let page = url.parse(req.url).pathname;
    let params = querystring.parse(url.parse(req.url).query);

    res.setHeader('Content-type', 'text/html');

    if (page == '/')
    {
        res.statusCode = 200;
        res.write('You are at home page');
    }
    else if (page == '/controller')
    {
        res.statusCode = 200;
        res.write('You are at the controller');
    }
    else if (page == '/controller/method')
    {
        res.statusCode = 200;
        res.write('You are at the method of the controller');
    }
    else
    {
        res.statusCode = 404;
        res.write('Page do not exist');

    }

    if ('firstname' in params && 'lastname' in params) 
    {
        res.write('<br>You are '+ params['lastname'] +' '+ params['firstname']);
    }
    else
    {
        res.write('<br>Firstname and Lastname are empty !');
    }

    res.end();
});

server.listen(port, hostname, function()
{
    console.log('Server running as http://'+ hostname + ':'+ port +'/');
})