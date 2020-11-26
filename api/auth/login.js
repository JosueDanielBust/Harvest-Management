let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

let config = require('../../config');
let sql = require('../../db');

module.exports = {
  login: async function(req, res){
    sql.begin( async sql => {
      const [ user ] = ( await sql.savepoint( sql => sql`
        select id, name, email, password, rol from users where email = ${ req.body.email }
      `).catch( err => { throw Error( err ) })) || []
      return [ user ];
    }).then(( [ user ] ) => {
      if ( user ) {
        let password = bcrypt.compareSync( req.body.password, user.password );
        if ( !password ) return res.status(401).send({ error: true, auth: false, token: null });
    
        let token = jwt.sign({
          id: user.id, email: user.email, name: user.name, rol: user.rol
        }, config.secret, { expiresIn: '1h' });
    
        res.send({ error: false, auth: true, token: token });
      } else {
        res.status(401).send({ error: true, auth: false, token: null });
      }
    })
  }
}