(function() {
  let register = new Vue({
    el: '#register',
    data: { error: '' },
    methods: {
      //#region Auth user methods
      registerForm: function( e ) {
        e.preventDefault();
        let name      = document.getElementById('user-name').value;
        let email     = document.getElementById('user-email').value;
        let password  = document.getElementById('user-password').value;

        fetch( '/api/user/register', {
          method: 'POST', mode: 'cors',
          body: JSON.stringify( {
            'name': name,
            'email': email,
            'password': password,
            'rol': 1,
          } ),
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then( function( res ){ return res.json(); })
        .then( function( res ){
          if ( !res.error ) {
            setCookie( 'rm_page', res.token );
            document.location = '/dashboard/';
          } else { throw Error( res ); }
        })
        .catch( error => {
          register.error = 'Please review all the inputs';
          document.querySelector('.form-messages').style.display = 'block';
        });
      },
      //#endregion
    }
  });

  function setCookie( name, value ) {
    let date = new Date();
    date.setTime( date.getTime() + ( 60 * 60 * 1000 ) );
    let expires = '; expires=' + date.toUTCString();
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
  }
})();