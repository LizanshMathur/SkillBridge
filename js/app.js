var app = angular.module('skillBridgeApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'login.html',
      controller: 'LoginController'
    })
    .when('/register', {
      templateUrl: 'registration.html',
      controller: 'RegistrationController'
    })
    .when('/profile-setup', {
      templateUrl: 'profile-setup.html',
      controller: 'ProfileController'
    })
    .when('/dashboard', {
      templateUrl: 'dashboard.html',
      controller: 'DashboardController'
    })
    .when('/career-development', {
      templateUrl: 'career-development.html',
      controller: 'CareerController'
    })
    .when('/help', {
  templateUrl: 'help.html',
  controller: 'HelpController'
})

    .otherwise({ redirectTo: '/' });
});

// ---------------- Controllers ----------------

// Login
app.controller('LoginController', function($scope, $http, $location) {
  $scope.user = {};
  $scope.login = async function() {
    try {
      const res = await $http.post('http://localhost:5000/api/login', $scope.user);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        alert('Login successful!');
        $location.path('/profile-setup'); // ✅ go to profile setup first
      }
    } catch (err) {
      alert(err.data?.error || 'Login failed');
    }
  };
});

// Registration
app.controller('RegistrationController', function($scope, $http, $location) {
  $scope.user = {};
  $scope.register = async function() {
    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await $http.post('http://localhost:5000/api/register', {
        name: $scope.user.name,
        email: $scope.user.email,
        password: $scope.user.password
      });
      alert('Registration successful!');
      $location.path('/'); // ✅ after signup, go to login
    } catch (err) {
      alert(err.data?.error || 'Registration failed');
    }
  };
});

// Profile Setup
app.controller('ProfileController', function($scope, $http, $location) {
  $scope.profile = { skills: [], goalSkills: [] };
  $scope.currentStep = 1;
  $scope.progressPercentages = ["33%", "67%", "100%"];

  $scope.goToStep = function(step) {
    $scope.currentStep = step;
  };

  $scope.addSkill = function() {
    if ($scope.newSkill) {
      $scope.profile.skills.push($scope.newSkill);
      $scope.newSkill = '';
    }
  };

  $scope.addGoalSkill = function() {
    if ($scope.newGoalSkill) {
      $scope.profile.goalSkills.push($scope.newGoalSkill);
      $scope.newGoalSkill = '';
    }
  };

  $scope.saveProfile = async function() {
    const token = localStorage.getItem('token');
    try {
      await $http.post('http://localhost:5000/api/profile', $scope.profile, {
        headers: { Authorization: 'Bearer ' + token }
      });
      alert("✅ Profile completed successfully! Redirecting to dashboard...");
      $location.path('/dashboard');
    } catch (err) {
      alert(err.data?.error || 'Profile save failed');
    }
  };
});


// Dashboard
app.controller('DashboardController', function($scope, $location, $timeout) {
  $scope.message = "Welcome to your dashboard!";
  // Auto‑redirect after 2 seconds
  $timeout(function() {
    $location.path('/career-development'); // ✅ then go to career development
  }, 2000);
});

// Career Development
app.controller('CareerController', function($scope) {
  $scope.message = "Career Development page loaded!";
});

app.controller('HelpController', function($scope) {
  $scope.message = "Welcome to the Help page!";
});
