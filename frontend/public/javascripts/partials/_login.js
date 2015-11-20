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

  //////////////
  // Partials //
  //////////////

  function loadFacebookScript( callback ) {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/da_DK/sdk.js', function(){
      console.log('Loaded');
      FB.init({
        appId: '415747435299107',
        xfbml: true,
        version: 'v2.5'
      });

      if( typeof(callback) == 'function' ) {
        console.log('Calling Callback');
        callback.call(this);
      }
    });
  }

  function getOrCreateUserInAPI( response ) {
    var userId = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    var url = 'http://localhost:3000/api/auth/facebook';

    var formData = {
      'accessToken': accessToken,
      'userId': userId
    };

    $.post( url, formData, function( data, textStatus, jqXHR ) {
      if( jqXHR.status == 200 && data !== undefined ) {
        window.location.href = window.location.href;
      }
    });
  }

  function _onFacebookButtonClicked( event ) {
    event.preventDefault();
    console.log('Clicked');
    loadFacebookScript(function() {
      console.log('Callback Loaded');
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
        scope: 'publish_actions, email'
      });
    });
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();