function (user, context, callback) {
  // For Logging Events
  var log = context.log ? context.log : console.log;
  var RULE = 'Restrict Admin Access';
  
  console.log([].includes);

  var requestedScopes = context.request.query.scope.split(' ');

  user.app_metadata = user.app_metadata || {};
  var authorization = user.app_metadata.authorization || {};
  var groups = authorization.groups || [];
  
  if (requestedScopes.indexOf('admin') !== -1) {
    if (groups.indexOf('admin') !== -1) {
      return callback(new UnauthorizedError('Access to admin requires admin group'));
    }
    log('INFO', RULE, 'Forcing MFA for user ' + user.name + ' due to admin scope', true);
    forceMFA();
  }

  // Finished
  callback(null, user, context);

  function forceMFA() {
    context.multifactor = { 
      provider: 'guardian',
      allowRememberBrowser: true
    };  
  }
}