const http = require('http')
const fs = require('fs')
const mysql = require('mysql');
const qs = require('querystring')

const hostname = '127.0.0.1'
const port = 3000

function onRequest(req,res)
{
  var baseURL = 'http://' + req.headers.host + '/';
  var myURL = new URL(req.url, baseURL);
  
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/HTML')

  if(req.url == '/')
  {
    index(req,res)
  }
  else if(req.url == '/showsignin')
  {
    showsignin(req,res)
  }
  else if(req.url == '/dosignin')
  {
    dosignin(req,res)
  }
  else if(req.url == '/showsignup')
  {
    showsignup(req,res)
  }
  else if(req.url == '/dosignup')
  {
    dosignup(req,res)
  }
  else{
    res.end();
  }  
}

function showsignup(req,res)
{
  fs.readFile('signup.html', function(err, data) {
    
    res.write(data);
    return res.end();
  });
}

function dosignup(req,res)
{
    var body = ''
    
    req.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    
    req.on('end', function() {
      console.log('Body: ' + body)
      var qs = new URLSearchParams(body)
      var username = qs.get("username")
      var password = qs.get('password')
      var confpasswd = qs.get('confpasswd')

      if(password != confpasswd)
      {
        res.write("<h1>Password Mismatch</h1>")
        return res.end();
      }

      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "IT"
      });

      con.connect(function(err) {
        
        if (err) throw err;
        
        console.log("Connected!");
        
        var sql = "INSERT INTO user (username, password) VALUES (?,?)";
        con.query(sql,[username,password], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.write("<h1>Congratulations! You have signed up successfully")
          res.end()
        });
      });

    })
}

function dosignin(req,res)
{
    var body = ''
    
    req.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    
    req.on('end', function() {
      console.log('Body: ' + body)
      var qs = new URLSearchParams(body)
      var username = qs.get("username")
      var password = qs.get('password')

      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "IT"
      });
    
      con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM user where username=? and password=?",[username,password], 
        function (err, result, fields) 
        {
          if (err) throw err;

          console.log(result);
          if(result.length==1)
          {
            res.write("<h1>Sign-In Successful</h1>")
            res.end()
          } 
          else
          {
            res.write("<h1>Sign-in Failed</h1>")
            res.end()
          }   
        });
      });
    })
}

function showsignin(req,res)
{
  fs.readFile('signin.html', function(err, data) {
    
    res.write(data);
    return res.end();
  });
}

function index(req,res)
{
  fs.readFile('index.html', function(err, data) {
    res.write(data);
    return res.end();
  });
}

const server = http.createServer(onRequest)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})