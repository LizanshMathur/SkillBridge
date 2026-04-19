$routeProvider
  .when('/', {
    templateUrl: 'html/login.html',
    controller: 'LoginController'
  })
  .when('/register', {
    templateUrl: 'html/registration.html',
    controller: 'RegistrationController'
  })
  .when('/profile-setup', {
    templateUrl: 'html/profile-setup.html',
    controller: 'ProfileController'
  })
  .when('/dashboard', {
    templateUrl: 'html/dashboard.html',
    controller: 'DashboardController'
  })
  .otherwise({ redirectTo: '/' });
