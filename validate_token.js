let jwt = require('jsonwebtoken');
let config = require('./config');

module.exports = {
  validate_token: function( req, res, callback ) {
    let token = req.headers['x-token'] || req.cookies['rm_page'];
    if ( !token ) {
      return res.status(401).send({ error: true, auth: false, message: 'No token provided.' })
    };
  
    jwt.verify( token, config.secret, function( err, decoded) {
      if ( err ) {
        return res.status(401).send({ error: true, auth: false, message: 'Failed to authenticate token.' })
      } else {
        if ( 'function' == typeof callback ) { callback( decoded ); }
      }
    });
  }
}