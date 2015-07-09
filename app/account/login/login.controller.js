(function() {
  'use strict';

  angular.module('tc.account').controller('LoginController', LoginController);

  LoginController.$inject = ['$log', '$state', '$stateParams', 'tcAuth', '$location', 'authtoken'];

  function LoginController($log, $state, $stateParams, tcAuth, $location, authtoken) {
    var vm = this;
    vm.passwordReset = false;

    if ($stateParams.state && $stateParams.code) {
      authtoken.getTokenFromAuth0Code($stateParams.code);
    }

    var redirect = function(force) {
      // check if the user is already logged in
      if (tcAuth.isAuthenticated() || force) {
        // redirect to next if exists else dashboard
        if ($stateParams.next) {
          $log.debug('Redirecting: ' + $stateParams.next);
          $location.path(decodeURIComponent($stateParams.next));
        } else {
          $state.go('dashboard');
        }
      }
    };

    redirect();

    vm.doLogin = function() {
      // TODO placeholder, validate form etc
      tcAuth.login(vm.username, vm.password).then(
        function(data) {
          // success
          $log.debug('logged in');
          redirect(true);
        },
        function(err) {
          // handle error
          vm.wrongPassword = true;
          vm.password = '';
        }
      );
    };

    vm.socialLogin = function(backend) {
      tcAuth.socialLogin(backend);
    }

  }

})();
