let bcrypt = require('bcryptjs');

let sql = require('../../db');
let validate_token = require('../../validate_token').validate_token;

module.exports = {
  getUserAccounts: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        let db_data = ( await sql`
          select u.name, u.email, u.rol, u.id, null as password
          from users as u inner join subuser as s
          on u.id = s.user_id where admin_id = ${ decoded.id }
        `);
        return [ db_data ];
      }).then(( [ db_data ] ) => {
        res.send( { error: false, data: db_data } );
      });
    });
  },
  getUserType: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        let db_data = ( await sql`
          select rol from users where id = ${ req.params.id }
        `);
        return [ db_data ];
      }).then(( [ db_data ] ) => {
        if ( db_data[0].rol == 1 ) {
          res.send( { error: false, data: { rol: db_data[0].rol, rolString: 'admin', } } );
        } else {
          res.send( { error: false, data: { rol: db_data[0].rol, rolString: 'subuser', } } );
        }
      });
    });
  },
  updateUserPassword: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        let db_data = ( await sql`
          update users set
            password = ${ bcrypt.hashSync( req.body.password, 8 ) }
          where id = ${ req.params.id } returning *
        `);
        return [ db_data ];
      }).then(( [ db_data ] ) => {
        res.send( { error: false, data: db_data } );
      });
    });
  },
  updateUserDetails: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        let db_data = ( await sql`
          update users set
            name = ${ req.body.name }, email = ${ req.body.email }
          where id = ${ req.params.id } returning *
        `);
        return [ db_data ];
      }).then(( [ db_data ] ) => {
        res.send( { error: false, data: db_data } );
      });
    });
  },
  removeUser: async function(req, res) {
    validate_token( req, res, async function( decoded ) {
      sql.begin( async sql => {
        let db_data = ( await sql`
          delete from users where id = ${ req.params.id }
        `);
        return [ db_data ];
      }).then(( [ db_data ] ) => {
        res.send( { error: false, data: { id: parseInt(req.params.id) } } );
      });
    });
  }
}
