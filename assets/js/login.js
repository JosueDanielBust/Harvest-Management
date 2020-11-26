(function() {
  let login = new Vue({
    el: '#login',
    data: { error: '' },
    methods: {
      //#region Auth user methods
      loginForm: function( e ) {
        e.preventDefault();
        let email  = document.getElementById('email').value;
        let password  = document.getElementById('password').value;

        fetch( '/api/user/login', {
          method: 'POST', mode: 'cors',
          body: JSON.stringify( {
            'email': email,
            'password': password
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
          login.error = 'Please review your username or password';
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