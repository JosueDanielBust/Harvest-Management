(function() {
  let dashboard = new Vue({
    el: '#dashboard',
    data: {
      users: [], error: '',
      username: '', useremail: '', userpassword: ''
    },
    mounted: function() {
      fetch( '/api/v1/subusers/', {
        method: 'GET', mode: 'cors',
        headers: { 'x-token': getCookie( 'rm_page' ) },
      })
      .then( function( res ){ return res.json(); })
      .then( function( res ) {
        if ( !res.error ) {
          dashboard.users = res.data;
        } else { throw Error( res ); }
      })
      .catch( error => {
        console.log( 'Error', error )
      });
    },
    methods: {
      //#region Auth user methods
      logout: function( e ) {
        e.preventDefault();
        removeCookie( 'rm_page' );
        document.location = '/';
      },
      resetUserData: function() {
        dashboard.username = '';
        dashboard.useremail = '';
        dashboard.userpassword = '';
      },
      createUser: function( name, email, password ) {
        fetch( '/api/v1/subusers/register', {
          method: 'POST', mode: 'cors',
          headers: {
            'x-token': getCookie( 'rm_page' ),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            rol: 2
          })
        })
        .then( function( res ){ return res.json(); })
        .then( function( res ) {
          if ( !res.error ) {
            dashboard.resetUserData();
            dashboard.users.push( res.data )
            console.log( 'Response: Link created with id', res.data.id )
          } else { throw Error( res ); }
        })
        .catch( error => {
          console.log( 'Error:', error )
        })
      },
      editUserDetails: function( user ) {
        fetch( '/api/v1/users/details/' + user.id, {
          method: 'PUT', mode: 'cors',
          headers: {
            'x-token': getCookie( 'rm_page' ),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email
          })
        })
        .then( function( res ){ return res.json(); })
        .then( function( res ) {
          if ( !res.error ) {
            console.log( 'Response: Link with id', res.data[0].id, 'updated' )
          } else { throw Error( res ); }
        })
        .catch( error => {
          console.log( 'Error:', error )
        })
      },
      editUserPassword: function( user ) {
        fetch( '/api/v1/users/password/' + user.id, {
          method: 'PUT', mode: 'cors',
          headers: {
            'x-token': getCookie( 'rm_page' ),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: user.password
          })
        })
        .then( function( res ){ return res.json(); })
        .then( function( res ) {
          if ( !res.error ) {
            console.log( 'Response: Link with id', res.data[0].id, 'updated' )
          } else { throw Error( res ); }
        })
        .catch( error => {
          console.log( 'Error:', error )
        })
      },
      editUser: function( user ) {
        dashboard.editUserDetails( user );
        if ( user.password.length > 0 ) {
          dashboard.editUserPassword( user );
        }
        alert('User updated');
      },
      removeUser: function( id ) {
        fetch( '/api/v1/users/' + id, {
          method: 'DELETE', mode: 'cors',
          headers: {
            'x-token': getCookie( 'rm_page' ),
            'Content-Type': 'application/json'
          }
        })
        .then( function( res ){ return res.json(); })
        .then( function( res ) {
          if ( !res.error ) {
            let users = dashboard.users.filter( function( user, i, arr ) {
              return user.id != id;
            });
            dashboard.users = users;
            console.log( 'Response: Link with id', res.data.id, 'removed' )
          } else { throw Error( res ); }
        })
        .catch( error => {
          console.log( 'Error:', error )
        })
      },
      //#endregion
    }
  });

  function getCookie( name ) {
    let cname = name + '=';
    let cookies = document.cookie.split(';');
    for( let i = 0; i < cookies.length; i++ ) {
      let c = cookies[i];
      while (c.charAt(0)==' ') c = c.substring( 1, c.length );
      if (c.indexOf( cname ) == 0) return c.substring( cname.length, c.length );
    }
    return null;
  }
  function removeCookie( name ) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
})();

//#region Utils
function getClosest( elem, selector ) {
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }
  return null;
}
function toogleEditUser( e ) {
  let link = this.getClosest( e, '.users-list-contents > div' );
  let edit = link.querySelector( 'div.users-list-contents__edit' );
  edit.classList.toggle('active');
}