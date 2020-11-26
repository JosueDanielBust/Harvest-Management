let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

let config = require('../../config');
let sql = require('../../db');

let validate_token = require('../../validate_token').validate_token;

module.exports = {
  register: async function(req, res){
    sql.begin( async sql => {
      const [ user ] = ( await sql.savepoint( sql => sql`
        insert into users ( name, email, rol, password )
        values (
          ${ req.body.name }, ${ req.body.email }, ${ req.body.rol },
          ${ bcrypt.hashSync( req.body.password, 8 ) }
        ) returning *
      `).catch( err => { throw Error( err ) })) || []
      return [ user ];
    }).then(( [ user ] ) => {
      if ( user ) {
        let token = jwt.sign({
          id: user.id, email: user.email, name: user.name, rol: user.rol
        }, config.secret, { expiresIn: '1h' } );
        res.send( { error: false, status: 201, auth: true, token: token } );
      } else { throw Error( user ); }
    }).catch(( err ) => {
      if (err) return res.status(500).send( { error: true, status: 400, message: 'There was a problem registering the user.', err: err });
    })
  },

  registerSubUser: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        const [ user ] = ( await sql.savepoint( sql => sql`
          insert into users ( name, email, rol, password )
          values (
            ${ req.body.name }, ${ req.body.email }, ${ req.body.rol },
            ${ bcrypt.hashSync( req.body.password, 8 ) }
          ) returning id, name, email, null as password
        `).catch( err => { throw Error( err ) })) || []

        const [ user_relation ] = ( await sql.savepoint( sql => sql`
          insert into subuser ( user_id, admin_id )
          values ( ${ [user][0].id }, ${ decoded.id } ) returning *
        `).catch( err => { throw Error( err ) })) || []

        return [ user, user_relation ];
      }).then(( [ user, user_relation ] ) => {
        if ( user ) {
          res.send( { error: false, status: 201, data: user, message: 'User Successfully Registered' } );
        } else { throw Error( user ); }
      }).catch(( err ) => {
        if (err) return res.status(500).send( { error: true, status: 400, message: 'There was a problem registering the user.', err: err });
      })
    });
  },
}