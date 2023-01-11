const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//connect db
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "infosys"
});

conn.connect((err)=>{
  if (err) throw err;
  console.log('MYSQL Connected');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getData', (req,res)=>{
  let selectSQL = "select * from spring";
  conn.query(selectSQL, (err, rows)=>{
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
});

//get user data for editing
router.get('/getUser', (req,res)=>{
  let id = req.query.id;
  let selectSQL = `select * from spring where id = ${id}`;

  conn.query(selectSQL, (err,rows)=>{
    if (err) throw err;
    res.send(rows);
  });
});

//user edit
router.post('/editUser', (req,res)=>{
  let {newName, newDesg, newDept,newSal,newLoc, emID} = req.body;

  let upSQL = `UPDATE spring set name = '${newName}', designation = '${newDesg}', department = '${newDept}', salary = '${newSal}', location = '${newLoc}' where id = '${emID}'`;

  conn.query(upSQL, (err)=>{
    if (err) throw err;
    res.send('success');
    console.log('update success');
  })
});


//delete user
router.get("/deleteCat", (req,res)=>{
  let id = req.query.id;

  let delSQL = `delete from spring where id = ${id}`;

  conn.query(delSQL, (err)=>{
    if (err) throw err;
    res.send('Deleted');
    console.log('Deleted');
  })
});


//add user
router.post('/addUser', (req,res)=>{
  let {addName, addDesg, addDept, addSal, addLoc} = req.body;

  let inSQL = `insert into spring values(NULL, '${addName}','${addDesg}', '${addDept}', '${addSal}', '${addLoc}')`;

  conn.query(inSQL, (err)=>{
    if(err) throw err;
    res.send('Added');
    console.log('Added');
  })
});

//search
router.get('/search', (req,res)=>{
  let search = req.query.search;

  let srSQL = `select * from spring where name like '%${search}%' or designation like '%${search}%' or department like '%${search}%' or salary>='${search}'`;

  conn.query(srSQL, (err,rows)=>{
    if (err) throw err;

    res.send(rows);
    console.log(rows);
  })
});

module.exports = router;
