let mysql = require('mysql');

console.log('Get connection...');

var connection = mysql.createConnection({
    database: 'testnodejs',
    host: 'localhost',
    user: 'root',
    password: 'root'
});

connection.connect(function(err)
{
    if (err)  throw err; 
    console.log('Connected !');

    // Drop Employes table if exist
    var sql1 = "DROP TABLE IF EXISTS Employes";

    connection.query(sql1, function(err, results)
    {
        if (err) throw err;
        console.log('Table Employes dropped');
    });

    // Create table Employes
    var sql2 = 'CREATE TABLE Employes  (id INT AUTO_INCREMENT NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, hire_date DATE NOT NULL, PRIMARY KEY(id))';

    connection.query(sql2, function(err, results)
    {
        if (err) throw err;
        console.log('Table Employes created !');
    });

    var firstname = ['John', 'Jack', 'Paul'],
    lastname = ['Hikes', 'Smith', 'Gates'],
    hire_date = ['22/10/2001', "11/11/2000", '12/12/1990'];

    for(let i=0;i<firstname.length;i++)
    {
        var sql3 = 'INSERT INTO Employes (firstname, lastname, hire_date) VALUES ("'+ firstname[i] +'", "'+ lastname[i] +'", STR_TO_DATE("'+ hire_date[i] +'", "%d/%m/%Y"))';

        connection.query(sql3, function(err, results)
        {
            if (err) throw err;
            console.log('Insert a record !');
        });
    }
})