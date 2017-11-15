angular.module('mainCtrl', ['ngFileUpload'])

.controller('mainController', function(Upload,$rootScope, $location, Auth, User) {

  var vm = this;
  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();
  // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
    vm.ofertante = Auth.esOfertante();


    // get user information on route change
    Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
      });
  });

  // function to handle login form
  vm.doLogin = function() {
    vm.processing = true;
    // call the Auth.login() function


    Auth.login(vm.loginData.username, vm.loginData.password)

    .then(function(data) {
      vm.processing = false;

      // if a user successfully logs in, redirect to users page
      if (data.data.success){
        $location.path('/inicio');
      }
      else
      {
        vm.error = data.data.message;
      }
    });
  };
  // doSignUp to handle signUp form
  vm.doSignUp= function() {
    vm.processing = true;

    console.log("entro");
    // call the Auth.login() function
    if(vm.signUpData){

      if(vm.signUpData.perfil){
        Upload.upload({
          url: '/api/fixer/subirFotoPerfil', //webAPI exposed to upload the file
          data:{foto:vm.signUpData.perfil} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
          if(resp.data.error_code === 0){ //validate success
            Auth.signUp(vm.signUpData.name,vm.signUpData.username, vm.signUpData.password,vm.signUpData.ofertante,resp.data.route)
            .then(function(data) {
              vm.processing = false;
              // if a user successfully logs in, redirect to users page
              if (data.data.success){
                $location.path('/inicio');
              }
              else
              {
                vm.error = data.data.message;
              }
            });
          }

        })
      }
    }
    else    vm.error = "Llene los campos";

  };
  // function to handle logging out
  vm.doLogout = function() {
    Auth.logout();
    // reset all user info
    vm.user = {};
    $location.path('/login');
  };

});
