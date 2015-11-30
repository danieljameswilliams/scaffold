var App = App || {};

App.Account = (function() {
  'use strict';

  var dom = {};

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$logoutButton = $('.js-account__logout-button');
    dom.$facebookButton = $('.js-account__facebook-button');
  }

  function _addEventListeners() {
    dom.$logoutButton.on('click', _onLogoutButtonClicked);
    dom.$facebookButton.on('click', _onFacebookButtonClicked);
  }

  ////////////////
  /// PARTIALS ///
  ////////////////

  function _onLogoutButtonClicked( event ) {
    $(this).attr('disabled', 'disabled');

    deleteCookie('usertoken');
    window.location.href = '/';
  }

  function _onFacebookButtonClicked( event ) {
    event.preventDefault();

    $(this).attr('disabled', 'disabled');
    var username = $(this).data('username');

    loadFacebookScript(function() {
      FB.login(function( response ){
        if( response.status == 'connected' ) {
          mergeFacebookToUserInAPI( response, username );
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

  function mergeFacebookToUserInAPI( response, username ) {
    var userId = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    var url = '/api/account/facebook';

    var formData = {
      'accessToken': accessToken,
      'userId': userId,
      'username': username
    };

    var request = $.post( url, formData );

    request.done(function( data, textStatus, jqXHR ) {
      if( jqXHR.status == 200 && data !== undefined ) {
        console.log('Merge completed');
      }
    });

    request.fail(function( jqXHR ) {
      if( jqXHR.status == 403 ) {
        alert('Could not log you into Facebook');
      }
      else if( jqXHR.status == 500 ) {
        alert('Something went wrong');
      }
    });
  }

  ///////////////
  /// HELPERS ///
  ///////////////

  function deleteCookie( name ) {
    // We delete a cookie by setting it to expire in the past.
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();