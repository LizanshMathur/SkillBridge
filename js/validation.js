// Bootstrap validation
(function () {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

document.addEventListener('DOMContentLoaded', function () {

  // ---------------- Admin Login ----------------
  const adminForm = document.getElementById('adminLoginForm');
  if (adminForm) {
    adminForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
      const code = document.getElementById('adminCode').value;

      if (email && password.length >= 6 && code.trim()) {
        alert("✅ Admin login successful! Redirecting...");
        window.location.href = "#!/admin-dashboard";
      } else {
        alert("❌ Invalid input. Please check your email, password, and access code.");
      }
    });
  }

  // ---------------- Registration ----------------
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!name || !email || !password || password.length < 6 || password !== confirmPassword) {
        alert("❌ Please check your inputs.");
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.id) {
          alert("✅ Registration successful. Continue to profile setup.");
          window.location.href = "#!/profile-setup";
        } else {
          alert("❌ Registration failed: " + data.error);
        }
      } catch (err) {
        alert("❌ Error: " + err.message);
      }
    });
  }

  // ---------------- Login ----------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert("❌ Invalid login credentials.");
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          alert("✅ Login successful! Redirecting...");
          window.location.href = "#!/dashboard";
        } else {
          alert("❌ Login failed: " + data.error);
        }
      } catch (err) {
        alert("❌ Error: " + err.message);
      }
    });
  }

  // ---------------- Profile Setup Wizard ----------------
  const profileForm = document.getElementById('profileSetupForm');
  if (profileForm) {
    const steps = ["step1","step2","step3"];
    let currentStep = 0;

    function showStep(index) {
      steps.forEach((id,i)=>{
        document.getElementById(id).classList.toggle("d-none", i!==index);
      });
      const progressBar = document.getElementById("progressBar");
      const progressLabel = document.getElementById("progressLabel");
      const percentages = ["33%","67%","100%"];
      progressBar.style.width = percentages[index];
      progressBar.textContent = percentages[index];
      progressLabel.textContent = `Step ${index+1} of 3`;
    }

    document.getElementById("next1").addEventListener("click", (event)=>{
      event.preventDefault();
      const role = document.getElementById('currentRole').value.trim();
      const exp = document.getElementById('experience').value;
      const industry = document.getElementById('industry').value;
      if (role && exp && industry) {
        currentStep=1; showStep(currentStep);
      } else {
        alert("❌ Please fill all fields in Step 1.");
      }
    });

    document.getElementById("next2").addEventListener("click", (event)=>{
      event.preventDefault();
      if (typeof skills !== "undefined" && skills.length === 0) {
        document.getElementById('skillsError').style.display = 'block';
      } else {
        document.getElementById('skillsError').style.display = 'none';
        currentStep=2; showStep(currentStep);
      }
    });

    document.getElementById("back2").addEventListener("click", ()=>{currentStep=0;showStep(currentStep);});
    document.getElementById("back3").addEventListener("click", ()=>{currentStep=1;showStep(currentStep);});

    profileForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const targetRole = document.getElementById('targetRole').value.trim();
      if (!targetRole) {
        alert("❌ Target role is required.");
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/profile', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            role: targetRole,
            industry: document.getElementById('industry').value,
            experience: document.getElementById('experience').value
          })
        });
        const data = await res.json();
        if (data.message) {
          alert("✅ Profile completed successfully. Redirecting to your dashboard...");
          setTimeout(()=> {
            window.location.href = "#!/career-development";
          }, 2000);
        } else {
          alert("❌ Profile save failed: " + data.error);
        }
      } catch (err) {
        alert("❌ Error: " + err.message);
      }
    });

    showStep(currentStep);
  }
});
