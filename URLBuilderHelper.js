// ******************** URL Builder Helper ***********************

var _qs = require('qs'); // Will need to 'npm install qs'

var getAuthCodeRedirectURL = function getAuthCodeRedirectURL(clientId, redirectUri, scopeList, state) {
  var SNAP_ACCOUNTS_LOGIN_URL = 'https://accounts.snapchat.com/accounts/oauth2/auth';
  var scope = scopeList.join(' ');
  var loginQS = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: state
  };

  var stringifyLoginQS = _qs.stringify(loginQS);
  return SNAP_ACCOUNTS_LOGIN_URL + '?' + stringifyLoginQS;
};

module.exports = {getAuthCodeRedirectURL}