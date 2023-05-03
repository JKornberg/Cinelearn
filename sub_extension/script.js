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

document.addEventListener('DOMContentLoaded', function() {
  var fillButton = document.getElementById('fillButton');
  fillButton.addEventListener('click', fillProgressBar);

  const loginForm = document.getElementById('login-form');
  const mountainSection = document.getElementById('mountain-section');
  const progressBar = document.getElementById('myProgress');
  const mountain = document.getElementById('mountain-climbing');
  const climber = document.getElementById('mountain-climber');
  const btnContainer = document.querySelector('.btn-container');
  const passwordField = document.querySelector('.password-field');
  const showPasswordCheckbox = document.getElementById('show-password-checkbox');


  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Check if the username and password are correct (replace with your own logic)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var isAuthenticated = (username === 'exampleuser' && password === 'examplepassword');
    chrome.storage.local.set({ key: username }).then(() => {
      console.log("Value is set to " + username);
    });

    var opts = {
      headers: {
      'mode':'cors',
      'Access-Control-Allow-Origin': '*'
      },
    }
    var url = `https://cinelearn.fly.dev/authUser?username=${username}&hashed_password=${password}`;
    // console.log(url);
    const response = await fetch(url,opts)
    .then(response => response.json())
    .then(data => {
      isAuthenticated = data['status'] === 'success';
    })
    .catch(error => console.error(error));

	  if (isAuthenticated) {
		  mountainSection.style.display = 'block'; // Hide the mountain climbing elements
		  progressBar.style.display = 'inline-block'; // Show the progress bar
		  btnContainer.style.display = 'inline-block'; // Show the button container
		  mountain.style.display = 'inline-block'; // Show the mountain
		  climber.style.display = 'inline-block'; // Show the climber

		  loginForm.style.display = 'none';
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
