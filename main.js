let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let helmet = require('helmet');

if ( process.env.NODE_ENV != 'production' ) {
  require('dotenv').config();
}
let port = process.env.PORT || 3000;
let config = require('./config');

let app = express();

app.set( 'view engine', 'pug' );

app.use( helmet() );
app.use( cors() );
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

//#region Validate Token
let validate_token = require('./validate_token').validate_token;
//#endregion

//#region UI Router
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
  res.render( 'home' );
});

app.get('/register', function(req, res) {
  res.render( 'register' );
});

app.get('/login', function(req, res) {
  let devuser = { user: config.devuser.username, pass: config.devuser.password };
  res.render( 'login', devuser );
});

app.get('/dashboard/', function(req, res) {
  validate_token( req, res, async function( decoded ) {
    res.render( 'dashboard', { user: decoded } )
  });
});

app.get('/dashboard/users/', function(req, res, next) {
  validate_token( req, res, async function( decoded ) {
    decoded.role != 1 ? res.render( 'users', { user: decoded } ) : next();
  });
});
//#endregion

//#region Auth
let auth_register = require('./api/auth/register');
app.post('/api/user/register', auth_register.register);

let auth_login = require('./api/auth/login');
app.post('/api/user/login', auth_login.login);
//#endregion

//#region Users
let users = require('./api/v1/users');
app.post('/api/v1/subusers/register', auth_register.registerSubUser);
app.get('/api/v1/subusers/', users.getUserAccounts);
app.delete('/api/v1/users/:id', users.removeUser);
app.put('/api/v1/users/details/:id', users.updateUserDetails);
app.put('/api/v1/users/password/:id', users.updateUserPassword);
app.get('/api/v1/user/type/:id', users.getUserType);
//#endregion

//#region 404 Error
app.use(function(req, res, next) {
  res.status(404).send( { error: true, message: '404 - Not found' } );
});
//#endregion

//#region Starting Web Server
app.listen( port, function() {
  console.log( `ReachMe is running on port ${port}` );
});
//#endregion

module.exports = app;