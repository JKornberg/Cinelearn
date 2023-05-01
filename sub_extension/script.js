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
});
