angular.module('careerApp', [])
  .controller('DashboardController', function($scope) {
    // Default section
    $scope.section = 'overview';

    // Metrics
    $scope.skillsAssessed = 0;
    $scope.goalsSet = 0;
    $scope.learningHours = 0;

    // Switch section
    $scope.setSection = function(sec) {
      $scope.section = sec;
    };
  });

  // Define AngularJS app
var app = angular.module('careerApp', []);

// Dashboard Controller
app.controller('DashboardController', function($scope, $http) {
  $scope.section = 'overview';
  $scope.skillsAssessed = 0;
  $scope.goalsSet = 0;
  $scope.learningHours = 0;

  // Switch sections
  $scope.setSection = function(section) {
    $scope.section = section;
  };

  // Get token from localStorage
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  // Fetch skills
  $http.get('http://localhost:5000/api/skills/1', { headers })
    .then(res => {
      $scope.skillsAssessed = res.data.length;
      renderSkillsChart(res.data);
    })
    .catch(err => console.error(err));

  // Fetch goals
  $http.get('http://localhost:5000/api/goals/1', { headers })
    .then(res => {
      $scope.goalsSet = res.data.length;
    })
    .catch(err => console.error(err));

  // Fetch roadmap (example: count steps as learning hours)
  $http.get('http://localhost:5000/api/roadmap/1', { headers })
    .then(res => {
      if (res.data.length > 0 && res.data[0].roadmap_json) {
        const roadmap = JSON.parse(res.data[0].roadmap_json);
        $scope.learningHours = roadmap.steps ? roadmap.steps.length * 5 : 0; // assume 5h per step
        renderRoadmapChart(roadmap.steps);
      }
    })
    .catch(err => console.error(err));

  // ---------------- Charts ----------------

  function renderSkillsChart(skills) {
    const ctx = document.getElementById('skillsChart').getContext('2d');
    const levels = { beginner: 0, intermediate: 0, advanced: 0 };
    skills.forEach(s => levels[s.proficiency_level]++);
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [{
          data: [levels.beginner, levels.intermediate, levels.advanced],
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71']
        }]
      }
    });
  }

  function renderRoadmapChart(steps) {
    const ctx = document.getElementById('roadmapChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: steps,
        datasets: [{
          label: 'Learning Steps',
          data: steps.map(() => 5), // each step = 5h
          backgroundColor: '#9b59b6'
        }]
      }
    });
  }
});
