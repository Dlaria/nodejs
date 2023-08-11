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
    if (err) throw err;
    console.log('Connected !');

    var sql_template = 'SELECT * FROM ?? WHERE hire_date > STR_TO_DATE("20/11/1995", "%d/%m/%Y")';

    var replace = ['Employes'];
    sql = mysql.format(sql_template, replace);

    connection.query(sql, function(err, row, fields)
    {
        if (err) throw err;

        for(let i=0;i<row.length;i++)
        {
            console.log(row[i]);
        }
    });
})