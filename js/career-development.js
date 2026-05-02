// Define AngularJS app once
var app = angular.module('careerApp', []);

// Dashboard Controller
app.controller('DashboardController', function($scope, $http) {
  // Default section
  $scope.section = 'overview';
  $scope.showProfile = false;
  $scope.user = {
    industry: '',
    experience: '',
    target_role: '',
    skills: []
  };

  // Metrics
  $scope.skillsAssessed = 0;
  $scope.goalsSet = 0;
  $scope.learningHours = 0;

  // Switch section
  $scope.setSection = function(section) {
    $scope.section = section;
  };

  // Toggle profile dropdown
  $scope.toggleProfile = function() {
    $scope.showProfile = !$scope.showProfile;
  };

  // Get token from localStorage
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  // ---------------- Fetch Data ----------------

  // Fetch user profile
  $http.get('http://localhost:5000/api/profile/' + 1, { headers })
    .then(res => {
      $scope.user.industry = res.data.industry;
      $scope.user.experience = res.data.experience;
    })
    .catch(err => console.error(err));

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
      if (res.data.length > 0) {
        $scope.goalsSet = res.data.length;
        $scope.user.target_role = res.data[0].target_role;
        $scope.user.skills = res.data[0].desired_skills.split(',');
      }
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

  // ---------------- Save Profile ----------------

  $scope.saveProfile = function() {
  // Save industry + experience
  $http.post('http://localhost:5000/api/profile', {
    industry: $scope.user.industry,
    experience: $scope.user.experience
  }, { headers })
  .then(() => {
    // Save career goals separately
    return $http.post('http://localhost:5000/api/goals', {
      target_role: $scope.user.target_role,
      desired_skills: $scope.user.skills.join(',')
    }, { headers });
  })
  .then(() => {
    alert('Profile completed successfully!');
  })
  .catch(err => console.error(err));
};

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
