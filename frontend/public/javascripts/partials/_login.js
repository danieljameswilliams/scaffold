var App = App || {};

App.Login = (function() {
  'use strict';

  var dom = {};

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$facebookButton = $('.js-login__facebook-button');
  }

  function _addEventListeners() {
    dom.$facebookButton.on('click', _onFacebookButtonClicked);
  }

  ////////////////
  /// PARTIALS ///
  ////////////////

  function _onFacebookButtonClicked( event ) {
    event.preventDefault();

    $(this).attr('disabled', 'disabled');

    loadFacebookScript(function() {
      FB.login(function( response ){
        if( response.status == 'connected' ) {
          getOrCreateUserInAPI( response );
        }
        else if( response.status == 'not_authorized') {
          alert('not_authorized');
        }
        else {
          alert('Something went wrong');
        }
      }, {
        scope: 'email'
      });
    });
  }

  ///////////////
  /// HELPERS ///
  ///////////////

  function loadFacebookScript( callback ) {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/da_DK/sdk.js', function(){
      FB.init({
        appId: '415747435299107',
        xfbml: true,
        version: 'v2.5'
      });

      if( typeof(callback) == 'function' ) {
        callback.call(this);
      }
    });
  }

  function getOrCreateUserInAPI( response ) {
    var userId = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    var url = 'http://localhost:9000/auth/facebook';

    var formData = {
      'accessToken': accessToken,
      'userId': userId
    };

    var request = $.post( url, formData );

    request.done(function( data, textStatus, jqXHR ) {
      if( jqXHR.status == 200 && data !== undefined ) {
        App.Helpers.Cookie.create('usertoken', data.token, 365);

        if( window.location.pathname == '/bruger/opret' ) {
          window.location.href = '/?ref=auth_facebook';
        }
        else {
          window.location.href = window.location.pathname + '?ref=auth_facebook';
        }
      }
    });

    request.fail(function( jqXHR ) {
      if( jqXHR.status == 403 ) {
        alert('Could not log you into Facebook');
      }
      else if( jqXHR.status == 500 ) {
        alert('Something went wrong');
      }
      else if( jqXHR.status == 409 ) {
        alert('Already have a user');
      }
    });
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();