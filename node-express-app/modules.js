var connection = () =>
{
    const mysql = require('mysql');

    return mysql.createConnection({
        database: 'restaurants',
        host: 'localhost',
        user: 'root',
        password: 'root'
    });
}

var createTable = () =>
{
    var sql10 = "DROP TABLE IF EXISTS Employes";
    var sql11 = "DROP TABLE IF EXISTS Restaurant";

    connection().query(sql10, function(err, results)
    {
        if (err) throw err;
        console.log('Table Employes dropped');
    });
    connection().query(sql11, function(err, results)
    {
        if (err) throw err;
        console.log('Table Restaurant dropped');
    });

    // Create table Employes
    var sql2 = 'CREATE TABLE Restaurant (id INT(11) AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, city VARCHAR(100) NOT NULL, nbcouverts INT(10) NOT NULL, terrasse VARCHAR(3), parking VARCHAR(3), PRIMARY KEY(id))';
    var sql3 = 'CREATE TABLE Employes (id INT(11) AUTO_INCREMENT NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, hire_date DATE NOT NULL, restaurants_id INT(11) NOT NULL, PRIMARY KEY(id))';

    connection().query(sql2, function(err, results)
    {
        if (err) throw err;
        console.log('Table Restaurant created !');
    });
    connection().query(sql3, function(err, results)
    {
        if (err) throw err;
        console.log('Table Employes created !');
    });
}

var routingParams = () => {
    connection().connect(function(err)
    {
    const express = require('express'),
    app = express(),
    mysql = require('mysql');
    const cors = require('cors');


    // Autoriser les requêtes DELETE depuis l'origine de l'application Vue.js
    app.use(cors({
    origin: 'http://localhost:8080', // Remplacez par l'URL de votre application Vue.js
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }));
    
    if (err)  throw err; 
    console.log('Connected !');

        app.listen(5000, () => 
    {
        console.log('Server linstening @5000');
    });

    // Middleware
    app.use(express.json());

    //POST Restaurant
    /** Resto de base
    {
        "name": "Le café de France",
        "city": "Grenoble",
        "nbcouverts": "60",
        "terrasse": "oui",
        "parking": "non"
    }
     */
    app.post('/restaurant', (req, res) =>
    {
        res.header("Access-Control-Allow-Origin", "*");

        let sql = 'INSERT INTO restaurant (name, city, nbcouverts, terrasse, parking)' +
        'VALUES ("' + req.body.name +'", "'
                    + req.body.city +'", "'
                    + req.body.nbcouverts +'", "'
                    + req.body.terrasse +'", "'
                    + req.body.parking +'")';
        connection().query(sql, (err, results) => 
        {
            if (err) throw err;
            console.log('Insert a record (restaurant)!');
        });
        res.status(200);
    });

    // GET ALL Restaurant
    app.get('/restaurant', (req, res) =>
    {
        var sql_template = 'SELECT * FROM ??',
        replaces = ['restaurant'];

        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, rows) => 
        {
            if (err) throw err;
            res.send(rows);
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200);
    });

    // GET id Restaurant
    app.get('/restaurant/:id', (req, res) =>
    {
        res.header("Access-Control-Allow-Origin", "*");

        var id = parseInt(req.params.id),
        sql_template = 'SELECT * FROM ?? WHERE ?? = ' + id,
        replaces = ['restaurant', 'id'];

        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, row, fields) => 
        {
            if (err) throw err;
            res.send(row);
        });
        res.status(200);
    });

    // PUT id Restaurant
    app.put('/restaurant/:id', (req, res) =>
    {
        res.header("Access-Control-Allow-Origin", "*");

        let name = '',
        city = '',
        nbcouverts = '',
        terrasse = '',
        parking = '';

        if (req.body.name && req.body.name != ''){
            name = req.body.name;
        }else{
            name = req.params.name;
        }
        if (req.body.city && req.body.city != ''){
            city = req.body.city;
        }else{
            city = req.params.city;
        }
        if (req.body.nbcouverts && req.body.nbcouverts != ''){
            nbcouverts = req.body.nbcouverts;
        }else{
            nbcouverts = req.params.nbcouverts;
        }
        if (req.body.terrasse && req.body.terrasse != ''){
            terrasse = req.body.terrasse;
        }else{
            terrasse = req.params.terrasse;
        }
        if (req.body.parking && req.body.parking != ''){
            parking = req.body.parking;
        }else{
            parking = req.params.parking;
        }


        var id = parseInt(req.params.id),
        sql_template = 'UPDATE ?? SET name = "'+ name +'", city = "'+ city +'", nbcouverts = "'+ nbcouverts +'", terrasse = "'+ terrasse +'", parking = "'+ parking +'" WHERE ?? = ' + id,
        replaces = ['restaurant', 'id'];
        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, results) => 
        {
            if (err) throw err;
            console.log("Update a restaurant !");
        });
        res.status(200);
    });

    // DELETE Restaurant
    app.delete('/restaurant/:id', (req, res) =>
    {
        var id = parseInt(req.params.id);

        var sql1_template = 'SELECT * FROM ?? WHERE ?? = ' + id,
        replaces1 = ['employes', 'restaurants_id'];
        sql1 = mysql.format(sql1_template, replaces1);

        connection().query(sql1, (err, results) =>
        {
            if (err) throw err;
            if (results.length != 0){
                var sql2_template = 'DELETE FROM ?? WHERE ?? = ' + id,
                replaces2 = ['employes', 'restaurants_id'],
                sql2 = mysql.format(sql2_template, replaces2);

                connection().query(sql2, (err) =>
                {
                    if (err) throw err;
                    console.log('Delete in Employes');
                })
            }
        });



        var sql_template = 'DELETE FROM ?? WHERE ?? = ' + id,
        replaces = ['restaurant', 'id'],
        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, results) => 
        {
            if (err) throw err;
            console.log("Delete in Restaurant in id :" + id);
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200);
    });

    // POST Employes
    /**
    {
        "firstname": "John",
        "lastname": "Doe",
        "hire_date": "12/08/1990",
        "restaurants_id": "1"
    }
     */
    app.post('/restaurant/:restid/employes', (req, res) => 
    {
        res.header("Access-Control-Allow-Origin", "*");

        var id = parseInt(req.params.restid);

        var sql1_template = 'SELECT * FROM ?? WHERE id = ' + id,
        replaces1 = ['restaurant'],
        sql1 = mysql.format(sql1_template, replaces1);

        connection().query(sql1, (err, results) =>
        {
            if (err) throw err;
            if (results.length == 0){
                console.log("le restaurant id: "+ id + " n'existe pas !");
            }else{
                let sql = 'INSERT INTO employes (firstname, lastname, hire_date, restaurants_id)' +
                'VALUES ("' + req.body.firstname +'", "'
                            + req.body.lastname +'", STR_TO_DATE("'
                            + req.body.hire_date +'", "%d/%m/%Y"), "'
                            + id +'")';

                connection().query(sql, (err, results) => 
                {
                    if (err) throw err;
                    console.log('Insert a record (Employes) !');
                });
            }
        });
        res.status(200);
    });

    // GET ALL Employes
    app.get('/restaurant/:restid/employes', (req, res) =>
    {
        var id = parseInt(req.params.restid);
        var sql_template = 'SELECT * FROM ?? WHERE ?? = ' + id,
        replaces = ['employes', 'restaurants_id'];

        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, rows) => 
        {
            if (err) throw err;
            for(let i=0;i<rows.length;i++)
            {
                res.send(rows[i]);
            }
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200);
    });

    // GET Employes
    app.get('/restaurant/:restid/employes/:empid', (req, res) => 
    {
        res.header("Access-Control-Allow-Origin", "*");

        var restId = parseInt(req.params.restid),
        empId = parseInt(req.params.empid);
        var sql_template = 'SELECT * FROM ?? WHERE ?? = ' + restId + ' AND ?? = ' + empId,
        replaces = ['employes', 'restaurants_id', 'id'];

        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, row) => 
        {
            if (err) throw err;
            res.send(row);
        });
        res.status(200);
    });

    // PUT Employes
    app.put('/restaurant/:restid/employes/:empid', (req, res) =>
    {
        res.header("Access-Control-Allow-Origin", "*");

        var restId = parseInt(req.params.restid),
        empId = parseInt(req.params.empid),
        firstname = '',
        lastname = '',
        hire_date = '',
        restaurants_id = '';

        var sql1_templates = 'SELECT * FROM ?? WHERE ?? = ' + empId,
        replaces1 = ['employes', 'id'],
        sql1 = mysql.format(sql1_templates, replaces1);

        connection().query(sql1, (err, row) =>
        {
            if (err) throw err;
            firstname = row[0].firstname;
            lastname = row[0].lastname;
            hire_date = row[0].hire_date;
            restaurants_id = row[0].restaurants_id;
        });

        if (req.body.firstname && req.body.firstname != ''){
            firstname = req.body.firstname;
        }
        if (req.body.lastname && req.body.lastname != ''){
            lastname = req.body.lastname;
        }
        if (req.body.hire_date && req.body.hire_date != ''){
            hire_date = req.body.hire_date;
        }
        if (req.body.restaurants_id && req.body.restaurants_id != ''){
            restaurants_id = req.body.restaurants_id;
        }

        var sql_template = 'UPDATE ?? SET firstname = "'+ firstname +'", lastname = "'+ lastname +'", hire_date = STR_TO_DATE("'+ hire_date +'", "%d/%m/%Y"), restaurants_id = "'+ restaurants_id +'" WHERE ?? = ' + empId + ' AND ?? = ' + restId,
        replaces = ['employes', 'id', 'restaurants_id'];
        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, results) => 
        {
            if (err) throw err;
            console.log("Update a employes !");
        });
        res.status(200);
    });

    // DELETE Employes
    app.delete('/restaurant/:restid/employes/:empid', (req, res) =>
    {
        var restId = parseInt(req.params.restid),
        empId = parseInt(req.params.empid),
        sql_template = 'DELETE FROM ?? WHERE ?? = ' + empId + ' AND ?? = ' + restId,
        replaces = ['employes', 'id', 'restaurants_id'];
        
        sql = mysql.format(sql_template, replaces);

        connection().query(sql, (err, results) => 
        {
            if (err) throw err;
            console.log("Delete in Employes in id :" + empId);
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200);
    });
});

}

exports.connection = connection();
// exports.createTable = createTable();
exports.routingParams = routingParams();