var express = require("express");
var router = express.Router();
var mysql = require('mysql');

var date = new Date();

var con = mysql.createConnection({
    host: "db-intern.ciupl0p5utwk.us-east-1.rds.amazonaws.com",
    port: "3306", 
    user: "dummyUser",
    password: "dummyUser01",
    database: "db_intern"
});

con.connect(function(err) {
    if (err) {
        console.log("Database connection error!");
    }
});


router.get('/', function (req, res) {
    res.render('index');
})

//Insert or update in the table
router.post('/query', function (req, res) {
    
    response = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email1,
        phno: req.body.phno,
        dateTime: date.getTime()
    };
    response.dateTime = date.getUTCFullYear() + '-' +
                        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
                        ('00' + date.getUTCHours()).slice(-2) + ':' + 
                        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
                        ('00' + date.getUTCSeconds()).slice(-2);

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(response.email) == false || /^\d{10}$/.test(response.phno) == false || response.name.length == 0 || response.password.length == 0){
        res.render('error');
    }
    
    else{
        var sql1 = "SELECT * FROM `userData` WHERE emailId = '"+response.email+"'";
        con.query(sql1, function (err, result1) {
            if(err)
                res.render('error');
            else{
                if(result1.length == 1){
                    var sql2 = "UPDATE userData set userName = '"+response.name+"', emailId = '"+response.email+"', phoneNo = '"+response.phno+"', password = '"+response.password+"', dateTime = '"+response.dateTime+"' WHERE emailId = '"+response.email+"'";
                    con.query(sql2, function (err, result2) {
                        if(err)
                        res.render('error');
                        else{
                            res.render('show', { update: "true", originalArray: result1[0], resArray: response});
                        }
                    });
                }
                else{
                    var sql3 = "INSERT INTO `userData`(`userName`,`emailId`, `phoneNo`, `password`, `dateTime`) VALUES ('"+response.name+"','"+response.email+"','"+response.phno+"','"+response.password+"', '"+response.dateTime+"')";
                    con.query(sql3, function (err, result2) {
                        if(err)
                            res.render('error');
                        else{
                            res.render('show', { update: "false", resArray: response});
                        }
                    });
                }
            }
        });
    }
})

//Search for a record on the basis of email id
router.post('/search', function (req, res) {
    response = {
        email:req.body.email2
    };
    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(response.email) == false){
        res.render('error');
    }
    else{
        var sql = "SELECT * FROM `userData` WHERE emailId = '"+req.body.email2+"'";
        con.query(sql, function (err, result) {
            if (err) {
                res.render('error');
            }
            else{
                if(result.length == 1)
                    res.render('result', { TS: result[0].dateTime, resArray: result[0], querySuccess: 'true', message: "Eamil Id Found"});
                else
                    res.render('result', {querySuccess : 'false'});
            }
        });
    }
})

//Delete record from the table for given email id
router.post('/delete', function (req, res) {
    response = {
        email:req.body.email3
    };
    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(response.email) == false){
        res.render('error');
    }
    else{
        var sql = "DELETE FROM `userData` WHERE emailId = '"+req.body.email3+"'";
        con.query(sql, function (err, result) {
            if (err)
                res.render('error');
            else{
                if(result.affectedRows == 0)
                    res.render('result', {querySuccess : 'false'});
                else
                    res.render('result', { resArray: result[0], querySuccess: 'true', message: "DATA DELETED", id: req.body.email3});
            }
        });
    }
})

//autocomplete suggestions
router.get('/autoComplete',function(req,res){
    con.query('SELECT emailId from userData where emailId like "%'+req.query.query+'%"',
    function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++){
            data.push(rows[i].emailId);
        }
        res.end(JSON.stringify(data));
    });
});

//invalid url
router.get('/*', function(req, res){
    res.render('notfound');
})

module.exports = router;
