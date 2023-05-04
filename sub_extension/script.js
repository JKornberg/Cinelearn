
const opts = {
  headers: {
    'mode': 'cors',
    'Access-Control-Allow-Origin': '*'
  },
}

function fillProgressBar() {

  // Update the progress bar
  var progressBar = document.getElementById("myProgress");

  progressBar.value += 100 / 7;
  if (progressBar.value > 100) {
    console.log('here');
    progressBar.value = 0;
  }


  // Get the mountain climber element
  var climber = document.querySelector("#mountain-climber");

  // Calculate the new position of the mountain climber
  var progress = parseInt(progressBar.value * 7 / 100);
  var x = 0;
  var y = 0;

  var skills =
    [
      'Novice',
      'Advanced Novice',
      'Moderate',
      'Advanced Moderate',
      'Expert',
      'Expert Backpacker',
      'Beginner'
    ]

  var levelName = document.getElementById("skill-level");
  levelName.innerText = skills[progress - 1];
  // Get the spots
  switch (progress) {
    case 1:
      x = -35;
      y = -19;
      break;
    case 2:
      x = -20;
      y = -47;
      break;
    case 3:
      x = -65;
      y = -70;
      break;
    case 4:
      x = -50;
      y = -100;
      break;
    case 5:
      x = -70;
      y = -120;
      break;
    case 6:
      x = -82;
      y = -150;
      break;
    default:
      break;

  }


  // Update the position of the mountain climber
  climber.style.transition = "transform 0.5s ease-in-out";
  climber.style.transform = `translate(${x}px, ${y}px)`;
}

document.addEventListener('DOMContentLoaded', function () {
  // var fillButton = document.getElementById('fillButton');
  // fillButton.addEventListener('click', fillProgressBar);
  const loginContainer = document.getElementsByClassName('login-container')[0];
  const authenticatedSection = document.getElementById('authenticated-section');
  const loginForm = document.getElementById('login-form');
  const mountainSection = document.getElementById('mountain-section');
  const progressBar = document.getElementById('myProgress');
  const mountain = document.getElementById('mountain-climbing');
  const climber = document.getElementById('mountain-climber');
  const btnContainer = document.querySelector('.btn-container');
  const passwordField = document.querySelector('.password-field');
  const showPasswordCheckbox = document.getElementById('show-password-checkbox');
  const logoutButton = document.getElementById('logout-button');
  let userId = null;
  let username = "Not logged in";
  let streak = 0;

  function showProgress() {
    if (!userId) {
      console.log("Error, userId not set, defaulting to 1");
      userId = 1;
    }
    document.getElementById('username-display').innerText = `Welcome ${username}!`
    let url = `https://cinelearn.fly.dev/getUserContextProgress?episode_num=0&user_id=${userId}`
    console.log(opts)
    fetch(url, opts).then(response => response.json()).then(data => {
      authenticatedSection.style.display = 'block';
      mountainSection.style.display = 'block'; // Hide the mountain climbing elements
      progressBar.style.display = 'inline-block'; // Show the progress bar
      // btnContainer.style.display = 'inline-block'; // Show the button container
      mountain.style.display = 'inline-block'; // Show the mountain
      climber.style.display = 'inline-block'; // Show the climber
      let target = data['user_correct'] 
      if (target > 7){
        target = 7;
      }
    
      let ticks = 0;
      let progressInterval = setInterval(function () {
        fillProgressBar();
        ticks++;
        if (ticks >= target) {
          clearInterval(progressInterval);
        }
      }, 1000);
    });

  }
  handleStreaks();

  logoutButton.addEventListener('click', () => {
    chrome.storage.local.remove(['user_id', 'username'], function () {
      console.log("User Id is removed");
      console.log("Username is removed");
    });
    window.location.reload();
  });

  function daysBetween(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
}

  function handleStreaks(){
    const currentDay = new Date().getDay();
    chrome.storage.local.get(['last_login_day', 'streak'], function (result) {
      const currentDate = new Date();
      if (!result.last_login_day || !result.streak){
        streak = 1;
      } else{
        const lastLoginDate = new Date(result.last_login_day);
        if (daysBetween(lastLoginDate, currentDate) === 1){
          streak = result.streak + 1;
        } else{
          streak = 1;
        }
      }
      chrome.storage.local.set({'last_login_day': currentDate, 'streak': streak}, function () {
        console.log("Last login day is set to " + currentDate);
        console.log("Streak is set to " + streak);
      });
      document.getElementById('streak').innerText = `Your current streak is: ${streak}!`;
  });
}


  chrome.storage.local.get(['user_id', 'username'], function (result) {
    console.log(result);
    console.log('User id currently is ' + result.user_id);
    if (result.user_id && result.username) {
      username = result.username;
      userId = result.user_id;
      isAuthenticated = true;
      loginForm.style.display = 'none';
      showProgress();

    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Check if the username and password are correct (replace with your own logic)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var isAuthenticated = false;
    //Check if user_id is stored in local  storage




    var url = `https://cinelearn.fly.dev/authUser?username=${username}&hashed_password=${password}`;
    console.log(url);
    const response = await fetch(url, opts)
      .then(response => response.json())
      .then(data => {
        if (data['status'] === 'success') {
          userId = data['user_id'];
          isAuthenticated = true;
          chrome.storage.local.set({ 'user_id': userId, 'username' : username }, function () {
            console.log("User Id is set to " + userId);
            console.log("Username is set to " + username);
          });
        }
      })
      .catch(error => console.error(error));

    if (isAuthenticated) {
      showProgress();
      loginContainer.style.display = 'none';
      // loginForm.style.display = 'none';
    } else {
      alert('Incorrect username or password');
    }
  });

  showPasswordCheckbox.addEventListener('change', () => {
    // Toggle the visibility of the password field
    const passwordInput = document.getElementById('password');
    const showPasswordIcon = document.querySelector('.show-password-icon');

    if (showPasswordCheckbox.checked) {
      passwordInput.type = 'text';
      showPasswordIcon.classList.add('hide-password');
    } else {
      passwordInput.type = 'password';
      showPasswordIcon.classList.remove('hide-password');
    }
  });
  


});
