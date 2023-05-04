//Font awesome example


/*

const checkmark = document.createElement("i");
checkmark.classList.add("fa-solid", "fa-circle-check", "checkmark");
modalContainer.appendChild(checkmark);

*/
var current_subs = [];
var elapsed_time = 0; //ms
var ref_time = 0; // ms
var max_time = 0; // ms

class Subtitle {
	constructor(start, end, sub) {
		this.start = start; // number;
		this.end = end; // number;
		this.sub = sub; // string;
	}
}

class QuestionSidebar {
	constructor(start, id, question, type, index) {
		this.index,
		this.start = start; // number;
		this.id = id; // number;
		this.question = question; //string
		this.type = type
		this.answered = false
		this.correct = null
	}
}


function getRandomValuesFromArray(arr) {
	const result = [];
	const indices = new Set();
	
	// Loop until we have 4 unique indices
	while (indices.size < 4) {
		const index = Math.floor(Math.random() * arr.length);
		// Add index to set if it's not already there
		if (!indices.has(index)) {
			indices.add(index);
			result.push(arr[index]);
		}
	}
	
	return result;
  }
spanish_words = ['alma', 'amor', 'bailar', 'beso', 'caminar', 'cansado', 'comida', 'confiar', 'contento', 'correr', 'cumpleaños', 'decir', 'despertar', 'dormir', 'escuchar', 'esperar', 'estudiar', 'feliz', 'fiesta', 'frente', 'fuerte', 'gracias', 'hablar', 'hacer', 'hermosa', 'hola', 'jugar', 'leer', 'lento', 'libro', 'lindo', 'malo', 'mañana', 'miedo', 'mirar', 'momento', 'nadar', 'nuevo', 'olvidar', 'padre', 'palabra', 'pensar', 'perdón', 'pintar', 'poder', 'preguntar', 'querer', 'rápido', 'recuerda', 'reír', 'respeto', 'saber', 'sentir', 'silencio', 'sol', 'sonrisa', 'soñar', 'tarde', 'tener', 'trabajar', 'tranquilo', 'valiente', 'venir', 'ver', 'viajar', 'vida', 'vivir', 'música', 'amigo', 'animal', 'casa', 'ciudad', 'coche', 'color', 'compartir', 'familia', 'fruta', 'gato', 'hermano', 'historia', 'libertad', 'lugar', 'madre', 'montaña', 'naturaleza', 'niño', 'pájaro', 'paisaje', 'película', 'perro', 'playa', 'pueblo', 'sonido', 'tiempo', 'árboles', 'café', 'hambre', 'lluvia', 'manzana', 'mar', 'nube', 'solitario', 'ventana', 'zapatos']
english_words = ['yes', 'no', 'maybe', 'goodbye', 'test', 'software', 'startups', 'this']


class VocabQuestion {
	constructor(id,start, english, spanish) {
		this.start = start/10000; // number;
		this.spanish = spanish; // number;
		this.english = english
		this.indexWiseWordsEnglish = this.english.split(' ')
		this.indexWiseWordsSpanish = this.spanish.split(' ')
		this.randomSpanishWords = getRandomValuesFromArray(spanish_words)
		this.randomEnglishWords = getRandomValuesFromArray(english_words)
		this.section = Math.floor(max_time/this.start)
		this.id = id
		this.type = 'vq'
	}
}

class ContextQuestion {
	constructor(id, start,english_question, spanish_question, answer_list) {
		this.english_q = english_question
		this.spanish_q = spanish_question
		this.english_choices = answer_list.map((answer) => answer[0])
		this.spanish_choices = answer_list.map((answer) => answer[1])
		this.correctIndex = 0
		answer_list.forEach((answer, idx) => {
			if (answer[2] == '1'){
				this.correctIndex = idx
			}
		})
		this.start = start/10000; // number;
		this.section = Math.floor(max_time/this.start)
		this.id = id
		this.type = 'cq'
	}
}

// Define a class to represent the quiz question
/* have proper questions integrated with backend */
class QuizQuestion {
	constructor(question, choices, correctAnswer) {
		this.question = question; // string
		this.choices = choices; // array of strings
		this.correctAnswer = correctAnswer; // index of correct answer in choices array
	}
}

// Create some sample quiz questions
var quizQuestions = [
];



let subs = [];
let subs2 = [];

var questions = []



var pause = false;
let slider_element;
var callback = function (mutationsList, observer) {
	for (const mutation of mutationsList) {
		if (mutation.target.className == "active ltr-omkt8s" ||
			mutation.target.className == "active ltr-omkt8s focus-visible") {
			// bottom bar is active //
			var slider_element = document.querySelector('[aria-label="Seek time scrubber"]');
			var play_pause = document.querySelector('[data-uia="control-play-pause-play"]');
			// play_pause.click();		
			pause = play_pause !== null && play_pause.getAttribute("aria-label") === "Play";
			// console.log(pause);
			// console.log(slider_element);
			max_time = parseInt(slider_element.getAttribute("aria-valuemax"));
			ref_time = parseInt(slider_element.getAttribute("aria-valuenow"));
			elapsed_time = 0;
		}
		if (mutation.target.className == "watch-video video-container-modifier") {
			console.log(mutation.addedNodes);
			if (mutation.addedNodes.length > 0){
				const addedNodes = mutation.addedNodes;
				// console.log(addedNodes);
				const className = addedNodes[0].getAttribute("data-uia");
				pause = 'watch-video-notification-pause' === className;
				console.log("ahh", pause);
				// bottom bar is active //
				slider_element = document.querySelector('[aria-label="Seek time scrubber"]');

				// console.log(pause);
				// console.log(slider_element);
				max_time = parseInt(slider_element.getAttribute("aria-valuemax"));
				ref_time = parseInt(slider_element.getAttribute("aria-valuenow"));
				elapsed_time = 0;
			}
		}
		if (mutation.target.className == "control-medium ltr-1evcx25"){
			// console.log(mutation);
			slider_element = document.querySelector('[aria-label="Seek time scrubber"]');

				
			// console.log(pause);
			// console.log(slider_element);
			max_time = parseInt(slider_element.getAttribute("aria-valuemax"));
			ref_time = parseInt(slider_element.getAttribute("aria-valuenow"));
			elapsed_time = 0;
		}
		// control-medium ltr-1evcx25
		// console.log(mutation.target.className);
	}
}

window.addEventListener('load', function () {
	var opts = {
		headers: {
			'mode': 'cors',
			'Access-Control-Allow-Origin': '*'
		},
	}
	fetch('https://cinelearn.fly.dev/getEnglishSubs?episode_num=0', opts)
		.then(response => response.json())
		.then(data => {
			data['english_subs'] = data['english_subs'].sort(function (a, b) {
				return parseFloat(b['start_time']) - parseFloat(a['start_time'])
			});
			subs = data['english_subs'].map((subtitle) => {
				return new Subtitle(subtitle['start_time'] / 10000, subtitle['end_time'] / 10000, subtitle['english_subtitle'])
			})
		})
		.catch(error => console.error(error));
});

	window.addEventListener('load', function() {
		var opts = {
			headers: {
			'mode':'cors',
			'Access-Control-Allow-Origin': '*'
			},
		}
		fetch('https://cinelearn.fly.dev/getSpanishSubs?episode_num=0',opts)
		.then(response => response.json())
		.then(data => {
			data['spanish_subs']= data['spanish_subs'].sort(function(a, b) {
				return parseFloat(b['start_time']) - parseFloat(a['start_time'])
			});
			subs2 = data['spanish_subs'].map((subtitle) => {
				return new Subtitle(subtitle['start_time']/10000, subtitle['end_time']/10000, subtitle['spanish_subtitle'])
			})
	
		})
		.catch(error => console.error(error));  });


let contextQuestions = []
let vocabQuestions = []

window.addEventListener('load', function () {
	var opts = {
		headers: {
			'mode': 'cors',
			'Access-Control-Allow-Origin': '*'
		},
	}
	fetch('https://cinelearn.fly.dev/getContextQuestions?episode_num=0',opts)
	.then(response => response.json())
	.then(data => {
		data['data']= data['data'].sort(function(a, b) {
			return parseFloat(b['start_time']) - parseFloat(a['start_time'])
		});
		console.log(data)
		contextQuestions = data['data'].map((question, qid) => {
			return new ContextQuestion(question['context_id'], question['start_time'],question['english_question'], question['spanish_question'], question['answer_list'])
		})
		console.log('cq', contextQuestions);
	})
	.catch(error => console.error(error)); 

});

window.addEventListener('load', function() {
	var opts = {
		headers: {
		'mode':'cors',
		'Access-Control-Allow-Origin': '*'
		},
	}
	fetch('https://cinelearn.fly.dev/getVocabQuestions?episode_num=0',opts)

	.then(response => response.json())
	.then(data => {
		data['data']= data['data'].sort(function(a, b) {
			return parseFloat(b['start_time']) - parseFloat(a['start_time'])
		});
		vocabQuestions = data['data'].map((question) => {
			return new VocabQuestion(question['vocab_id'], question['start_time'],question['english_vocab'],question['spanish_vocab'])
		});
		// declare var
		const max = 3;
		const step = 4;
	
		// choose start point
		const s = Math.floor(Math.random() * max);
		// sort data
		let temp_vq = [];
		vocabQuestions.sort((a, b) => (a.start > b.start) ? 1 : -1);
		for (let i = s; i < vocabQuestions.length; i+=step) {
			temp_vq.push(vocabQuestions[i]);
		}
		vocabQuestions = temp_vq;
		console.log(vocabQuestions);	
		})
		.catch(error => console.error(error));  });
window.video_change_observer = new MutationObserver(callback);
window.video_change_observer_config = { childList: true, subtree: true, }
window.video_change_observer.observe(document.documentElement, window.video_change_observer_config);


// reference time and iterator 
// update iterator
createSub = true;
questionMutex = 0;

function createAnswer(text, explanationText) {
	const modalBg = document.createElement("div");
	modalBg.classList.add("modal-bg");
	modalBg.className = 'modal-box';

	// Create the modal container element
	const modalContainer = document.createElement("div");
	modalContainer.classList.add("modal-container");

	// Create the question title element
	const titleElement = document.createElement("h2");
	titleElement.textContent = text;
	titleElement.classList.add("question-title")
	modalContainer.appendChild(titleElement);

	// Add icon
	const iconElement = document.createElement("i");
	if (text == 'Correct') {
		iconElement.classList.add("fa-solid", "fa-circle-check", "checkmark");

	} else {
		iconElement.classList.add("fa-solid", "fa-circle-xmark", "xmark");
	}
	modalContainer.appendChild(iconElement);

	const explanationContainer = document.createElement("div");
	explanationContainer.classList.add("explanation-container");
	const explanation = document.createElement("p");
	explanation.textContent = explanationText;
	explanation.classList.add("explanation");
	explanationContainer.appendChild(explanation);
	modalContainer.appendChild(explanationContainer);

	const continueButton = document.createElement("button");
	continueButton.classList.add("app-button", "continue", "close-button");
	continueButton.textContent = "Continue";

	continueButton.addEventListener("click", () => {
		modalBg.remove();
	});
	modalContainer.appendChild(continueButton);


	// Create the close button element
	const closeButton = document.createElement("span");
	closeButton.classList.add("close-button");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = 'absolute';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.fontSize = '20px';
	closeButton.style.cursor = 'pointer';
	modalContainer.appendChild(closeButton);

	closeButton.addEventListener("click", () => {
		modalBg.remove();
	});

	// Append the modal container to the modal background and the modal background to the body
	modalBg.appendChild(modalContainer);
	const vidDiv = document.querySelector(".watch-video--player-view");
	vidDiv.appendChild(modalBg);
}




function createVocabModal(question) {

	let finalWords = []
	finalWords = question.indexWiseWordsSpanish.concat(question.randomSpanishWords)

	let selectedValues = [];
	const modalBg = document.createElement("div");
	modalBg.classList.add("modal-bg");
	modalBg.className = 'modal-box';

	// Create the modal container element
	const modalContainer = document.createElement("div");
	modalContainer.classList.add("modal-container");

	// Create the question title element
	const titleElement = document.createElement("h2");
	titleElement.textContent = "Translate this";
	titleElement.classList.add("question-title")
	modalContainer.appendChild(titleElement);

	// Create the English element
	const questionElement = document.createElement("h2");
	questionElement.textContent = `English: ${question.english}`;
	questionElement.classList.add("question-english")
	modalContainer.appendChild(questionElement);



	const answerElement = document.createElement("h2");
	answerElement.textContent = `Spanish: ${selectedValues.join(' ')}`;
	answerElement.classList.add("question-spanish")
	modalContainer.appendChild(answerElement);
	// Create the Spanish Element
	const answerContainer = document.createElement("div");
	answerContainer.classList.add("answer-container");

	finalWords.forEach((choice, index) => {
		const answerChoice = document.createElement("button");
		answerChoice.classList.add("vocab-answer-inactive");
		answerChoice.textContent = choice


		answerChoice.addEventListener("click", () => {
			if (selectedValues.indexOf(choice) !== -1) {
				selectedValues = selectedValues.filter(function(item) {
					return item !== choice
				})	
				answerChoice.classList.add("vocab-answer-inactive");
				answerChoice.classList.remove("vocab-answer-active");
				answerElement.classList.remove('test_class')
				answerElement.classList.add('test_class')
				console.log(selectedValues)
				console.log(question.spanish)
			} else {
				selectedValues.push(choice)
				answerChoice.classList.remove("vocab-answer-inactive");
				answerChoice.classList.add("vocab-answer-active");
				answerElement.classList.remove('test_class')
				answerElement.classList.add('test_class')
				console.log(selectedValues)
			}
		});

		answerContainer.appendChild(answerChoice);
	});

	
	modalContainer.appendChild(answerContainer);

	// Create button container and submit / skip buttons

	const buttonContainer = document.createElement("div");
	buttonContainer.classList.add("button-container");

	const submitButton = document.createElement("button");
	submitButton.classList.add("submit", "app-button");
	submitButton.textContent = "Submit";
	buttonContainer.appendChild(submitButton);

	const videoSkipButton = document.createElement("button");
	videoSkipButton.classList.add("skip", "app-button");
	videoSkipButton.textContent = "Skip to Time";
	buttonContainer.appendChild(videoSkipButton);

	modalContainer.appendChild(buttonContainer);

	// Create the close button element
	const closeButton = document.createElement("span");
	closeButton.classList.add("close-button");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = 'absolute';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.fontSize = '20px';
	closeButton.style.cursor = 'pointer';
	modalContainer.appendChild(closeButton);


	let opts;
	// Add event listeners to the submit and close buttons
	submitButton.addEventListener("click", () => {
		questionMutex -= 1;
		if (selectedValues.join(' ') === question.spanish) {
			modalBg.remove();
			createAnswer("Correct!", `${question.english} translates to ${question.spanish}`);
			opts = {
				headers: {
				'mode':'cors',
				'Access-Control-Allow-Origin': '*'
				},
			}
			chrome.storage.local.get(['user_id'], function (result) {
				console.log(result);
				if (result.user_id) {
				const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
				fetch(`https://cinelearn.fly.dev/createVocabAnswer?user_id=${result.user_id}&language=0&time=${date}&question_id=${question.id}&correct=1`,opts)
	
				.then(response => response.json())
				.then(data => {})
				.catch(error => console.error(error));
			}});
			
			
		} else {
			opts = {
				headers: {
				'mode':'cors',
				'Access-Control-Allow-Origin': '*'
				},
			}
			chrome.storage.local.get(['user_id'], function (result) {
				console.log(result);
				if (result.user_id) {
				const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
				fetch(`https://cinelearn.fly.dev/createVocabAnswer?user_id=${result.user_id}&language=0&time=${date}&question_id=${question.id}&correct=0`,opts)
	
				.then(response => response.json())
				.then(data => {})
				.catch(error => console.error(error));
			}});
			modalBg.remove();
			createAnswer("You got this wrong", `${question.english} translates to ${question.spanish}`);
			}
	});

	closeButton.addEventListener("click", () => {
		questionMutex -= 1;
		modalBg.remove();
	});

	// Append the modal container to the modal background and the modal background to the body
	modalBg.appendChild(modalContainer);
	const vidDiv = document.querySelector(".watch-video--player-view");
	vidDiv.appendChild(modalBg);
}


// Define a function to create a quiz modal
function createQuizModal(question) {
	// Create the modal background element
	const modalBg = document.createElement("div");
	modalBg.classList.add("modal-bg");
	modalBg.className = 'modal-box';

	// Create the modal container element
	const modalContainer = document.createElement("div");
	modalContainer.classList.add("modal-container");

	// Create the question title element
	const titleElement = document.createElement("h2");
	titleElement.textContent = "Question";
	titleElement.classList.add("question-title")
	modalContainer.appendChild(titleElement);

	// Create the question element
	const questionElement = document.createElement("h2");
	questionElement.textContent = question.spanish_q;
	questionElement.classList.add("question")
	modalContainer.appendChild(questionElement);

	// Create the answer choice elements
	const answerContainer = document.createElement("div");
	answerContainer.classList.add("answer-container");

	question.spanish_choices.forEach((choice, index) => {
		const answerElement = document.createElement("div");
		answerElement.classList.add("answer-element");

		const labelElement = document.createElement("label");
		labelElement.textContent = choice;
		labelElement.setAttribute("for", `answer-${index}`);

		const inputElement = document.createElement("input");
		inputElement.type = "radio";
		inputElement.name = "answer";
		inputElement.id = `answer-${index}`;
		inputElement.value = index;
		answerElement.appendChild(inputElement);
		answerElement.appendChild(labelElement);
		answerContainer.appendChild(answerElement);
	});

	modalContainer.appendChild(answerContainer);

	// Create button container and submit / skip buttons

	const buttonContainer = document.createElement("div");
	buttonContainer.classList.add("button-container");

	const submitButton = document.createElement("button");
	submitButton.classList.add("submit", "app-button");
	submitButton.textContent = "Submit";
	buttonContainer.appendChild(submitButton);

	const videoSkipButton = document.createElement("button");
	videoSkipButton.classList.add("skip", "app-button");
	videoSkipButton.textContent = "Skip to Time";
	buttonContainer.appendChild(videoSkipButton);

	modalContainer.appendChild(buttonContainer);

	// Create the close button element
	const closeButton = document.createElement("span");
	closeButton.classList.add("close-button");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = 'absolute';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.fontSize = '20px';
	closeButton.style.cursor = 'pointer';
	modalContainer.appendChild(closeButton);



	// Add event listeners to the submit and close buttons
	submitButton.addEventListener("click", () => {
		const selectedAnswer = parseInt(document.querySelector('input[name="answer"]:checked').value);
		questionMutex -= 1;
		if (selectedAnswer === question.correctIndex) {
			opts = {
				headers: {
				'mode':'cors',
				'Access-Control-Allow-Origin': '*'
				},
			}
			chrome.storage.local.get(['user_id'], function (result) {
				console.log(result);
				if (result.user_id) {
				const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
				fetch(`https://cinelearn.fly.dev/createContextAnswer?user_id=${result.user_id}&language=0&time=${date}&question_id=${question.id}&correct=1`,opts)
	
				.then(response => response.json())
				.then(data => {})
				.catch(error => console.error(error));
			}});
			modalBg.remove();
			createAnswer("Correct!", 'add explanation');
			
		} else {
			opts = {
				headers: {
				'mode':'cors',
				'Access-Control-Allow-Origin': '*'
				},
			}
			chrome.storage.local.get(['user_id'], function (result) {
				console.log(result);
				if (result.user_id) {
				const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
				fetch(`https://cinelearn.fly.dev/createContextAnswer?user_id=${result.user_id}&language=0&time=${date}&question_id=${question.id}&correct=0`,opts)
	
				.then(response => response.json())
				.then(data => {})
				.catch(error => console.error(error));
			}});
			modalBg.remove();
			createAnswer("Incorrect", 'add explanation');
		}
	});

	closeButton.addEventListener("click", () => {
		questionMutex -= 1;
		modalBg.remove();
	});

	// Append the modal container to the modal background and the modal background to the body
	modalBg.appendChild(modalContainer);
	const vidDiv = document.querySelector(".watch-video--player-view");
	vidDiv.appendChild(modalBg);
}


function updateSidebar() {
	const questionContainer = document.getElementsByClassName("question-container")[0];
	const vidDiv = document.querySelector(".watch-video");

	const sidebarList = document.createElement('div');
	sidebarList.className = 'sidebar-list';
	// filter all questions that could be added
	var newCQs = contextQuestions.filter((q) => q.start <= time);
	var newVQs = vocabQuestions.filter((q) => q.start <= time);
	
	// for each newQ filter if is already in questions
	var newNewCQs = newCQs.filter((q) => questions.indexOf(q) === -1 );
	var newNewVQs = newVQs.filter((q) => questions.indexOf(q) === -1 );

	// add newQs to questions
	questions = questions.concat(newNewCQs);
	questions = questions.concat(newNewVQs);

	questions.sort((a, b) => (a.start > b.start) ? 1 : -1);

	// FIXME sort questions based on time!

	questions.forEach(question => {
		const listItem = document.createElement('div');
		listItem.classList.add('sidebar-list-item')
		if (question.correct){
			listItem.classList.add('correct' === true);
		} else if (question.correct === false){
			listItem.classList.add('incorrect');
		}
		listItem.textContent = question.type; // question.question;
		listItem.addEventListener('click', () => {
			// FIXME don't let it be clicked if question is already answered(?)
			if (questionMutex == 0) {
				if (question.type == 'cq') {
					createQuizModal(question);
				}
				else if (question.type == 'vq') {
					createVocabModal(question);
				}
				questionMutex += 1;
			}
		});
		sidebarList.appendChild(listItem);
	});
	questionContainer.innerHTML = "";
	questionContainer.appendChild(sidebarList);

	// Style the list elements with the "active" class to be square blocks that fill the sidebar
	const activeListItems = document.querySelectorAll('.sidebar-list-item.active');
	activeListItems.forEach(activeListItem => {
		activeListItem.style.width = '100%';
		activeListItem.style.height = '100%';
		activeListItem.style.display = 'inline-block';
		activeListItem.style.backgroundColor = 'blue';
	});
}

let isCreated = false;

var intervalId = window.setInterval(function () {
	// add subtitle container once //
	const wvpv = document.getElementsByClassName('watch-video--player-view');
	if (wvpv.length === 0) {
		return;
	}
	if (pause) {
		console.log('pause');
		return;
	}

	if (!isCreated) {
		const sideContainer = document.createElement('div');
		const videoCanvas = document.querySelectorAll("[data-uia='watch-video']")[0]
		wvpv[0].classList.add('player-modifier')
		videoCanvas.classList.add('video-container-modifier');
		sideContainer.classList.add('side-container');
		videoCanvas.appendChild(sideContainer);
		isCreated = true;
		sideLogo = document.createElement('img');
		sideLogo.classList.add('side-logo');
		sideLogo.src = chrome.runtime.getURL('images/logo_narrow.png');

		sideContainer.appendChild(sideLogo);
		divider = document.createElement('hr');
		divider.classList.add('solid');
		sideContainer.appendChild(divider);
		const sideTitle = document.createElement('h2');
		sideTitle.classList.add('side-title');
		sideTitle.textContent = 'Quiz Yourself!';
		sideContainer.appendChild(sideTitle);
		const questionContainer = document.createElement('div');
		questionContainer.classList.add('question-container');
		sideContainer.appendChild(questionContainer);

		divider2 = document.createElement('hr');
		divider2.classList.add('solid');
		sideContainer.appendChild(divider2);


		vocabTitle = document.createElement('h2');
		vocabTitle.classList.add('side-title');
		vocabTitle.textContent = 'General Spanish Vocab';
		sideContainer.appendChild(vocabTitle);

		const vocabContainer = document.createElement('div');
		vocabContainer.classList.add('vocab-container');
		const vocabList = document.createElement('div');
		vocabList.classList.add('vocab-list');
		vocabList.innerHTML = `
		<p class="vocab-list-item">Hola - Hello</p>
		<p class="vocab-list-item">Me Llamo - My name is</p>
		<p class="vocab-list-item">Donde Esta - Where is</p>
		<p class="vocab-list-item">Todo el mundo - All the world</p>
		<p class="vocab-list-item">Adiós - Goodbye</p>
		<p class="vocab-list-item">Por favor - Please</p>
		<p class="vocab-list-item">Gracias - Thank you</p>
		<p class="vocab-list-item">De nada - You're welcome</p>
		<p class="vocab-list-item">Sí - Yes</p>
		<p class="vocab-list-item">No - No</p>
		<p class="vocab-list-item">Buenos días - Good morning</p>
		<p class="vocab-list-item">Buenas tardes - Good afternoon</p>
		<p class="vocab-list-item">Buenas noches - Good evening/night</p>
		<p class="vocab-list-item">Hasta luego - See you later</p>
		<p class="vocab-list-item">Hasta mañana - See you tomorrow</p>
		<p class="vocab-list-item">Perdón - Excuse me</p>
		<p class="vocab-list-item">Lo siento - I'm sorry</p>
		<p class="vocab-list-item">Bienvenido/a - Welcome</p>
		<p class="vocab-list-item">Cómo estás? - How are you?</p>
		<p class="vocab-list-item">Estoy bien - I'm good</p>
		<p class="vocab-list-item">Estoy mal - I'm bad</p>
		<p class="vocab-list-item">Muy bien - Very good</p>
		<p class="vocab-list-item">Más o menos - So-so</p>
		<p class="vocab-list-item">Hablas inglés? - Do you speak English?</p>
		<p class="vocab-list-item">No hablo español - I don't speak Spanish</p>
		<p class="vocab-list-item">Entiendo - I understand</p>
		<p class="vocab-list-item">No entiendo - I don't understand</p>
		<p class="vocab-list-item">Quiero - I want</p>
		<p class="vocab-list-item">Necesito - I need</p>
		<p class="vocab-list-item">Tengo - I have</p>
		<p class="vocab-list-item">No tengo - I don't have</p>
		<p class="vocab-list-item">Dónde - Where</p>
		<p class="vocab-list-item">Cuándo - When</p>
		<p class="vocab-list-item">Quién - Who</p>
		<p class="vocab-list-item">Por qué - Why</p>
		<p class="vocab-list-item">Cómo - How</p>
		<p class="vocab-list-item">Cuánto - How much</p>
		<p class="vocab-list-item">Mucho - A lot</p>
		<p class="vocab-list-item">Poco - A little</p>
		<p class="vocab-list-item">Aquí - Here</p>
		<p class="vocab-list-item">Allí - There</p>
		<p class="vocab-list-item">Ahora - Now</p>
		<p class="vocab-list-item">Después - After</p>
		<p class="vocab-list-item">Antes - Before</p>
		<p class="vocab-list-item">Siempre - Always</p>
		<p class="vocab-list-item">Nunca - Never</p>
		<p class="vocab-list-item">Tarde - Late</p>
		<p class="vocab-list-item">Temprano - Early</p>
		<p class="vocab-list-item">Feliz - Happy</p>
		<p class="vocab-list-item">Triste - Sad</p>
		<p class="vocab-list-item">Enfermo/a - Sick</p>
		<p class="vocab-list-item">Salud - Bless you</p>
		<p class="vocab-list-item">Comida - Food</p>
		<p class="vocab-list-item">Agua - Water</p>
		<p class="vocab-list-item">Café - Coffee</p>
		<p class="vocab-list-item">Té - Tea</p>
		`
		vocabContainer.appendChild(vocabList);
		sideContainer.appendChild(vocabContainer);
	}


	if (createSub) {
		const newSubContainer = document.createElement("div");
		newSubContainer.className = 'sub-container';
		Object.assign(newSubContainer.style, {
			display: 'block',
			'white-space': 'nowrap',
			'text-align': 'center',
			position: 'absolute',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			bottom: '20%'
		});

		const subContent = [{
			id: 'sub1',
			color: '#ffffff',
			textContent: 'Hello World'
		}, {
			id: 'sub2',
			color: '#00ffff',
			textContent: 'Hello World2'
		}];

		subContent.forEach(sub => {
			const newContent = document.createElement("span");
			newContent.className = 'sub-content';
			newContent.id = sub.id;
			Object.assign(newContent.style, {
				display: 'inline-block',
				'text-align': 'center',
				'font-size': '2.5vw',
				'line-height': 'normal',
				'font-weight': 'bolder',
				'color': sub.color,
				'font-family': 'Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif'
			});
			newContent.textContent = sub.textContent;
			newSubContainer.appendChild(newContent);
			if (sub.id === 'sub2') {
				newContent.addEventListener('click', function (event) {
					// eslint-disable-next-line no-useless-escape
					let parsedWord = event.target.textContent.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, "")
					if (DICTIONARY[parsedWord]) {
						alert(`${parsedWord} translates to: ${DICTIONARY[parsedWord]}`)
					} else{
						alert(`Sorry, we don't have a translation for ${parsedWord}`)
					}
				}, false)
			}
			
			const br = document.createElement('br');
			newSubContainer.appendChild(br);
		});


		const sidebarContainer = document.createElement("div");
		sidebarContainer.className = 'sidebar-container';
		Object.assign(sidebarContainer.style, {
			display: 'block',
			position: 'absolute',
			right: '0%',
			top: '10%',
			bottom: '0%',
			width: '20%',
			background: 'rgba(0,0,0,0.6)',
			color: '#fff',
			'font-size': '16px',
			'overflow-y': 'scroll',
			'z-index': '1000'
		});

		// add list of timestamps
		// const timestampList = document.createElement("ul");
		// for (let i = 1; i <= 10; i++) {
		// 	const timestampItem = document.createElement("li");
		// 	timestampItem.textContent = "Timestamp " + i;
		// 	timestampList.appendChild(timestampItem);
		// }
		// sidebarContainer.appendChild(timestampList);

		const vidDiv = document.querySelector(".watch-video--player-view");
		vidDiv.appendChild(newSubContainer);
		// vidDiv.appendChild(sidebarContainer);
		createSub = false;
	}

	const subContainer = document.getElementsByClassName('sub-container')[0];
	const content = document.getElementsByClassName("sub-content")[0];
	const content2 = document.getElementsByClassName("sub-content")[1];

	// call your function here //
	elapsed_time += 1000;
	time = ref_time + elapsed_time;
	console.log(time);

	const currentSubs = subs.filter((sub) => sub.start <= time && time <= sub.end);
	content.innerHTML = currentSubs.map((sub) => `<span>${sub.sub.replaceAll(' ', '</span> <span>')}</span>`).join('');

	const currentSubs2 = subs2.filter((sub) => sub.start <= time && time <= sub.end);
	content2.innerHTML = currentSubs2.map((sub) => `<span>${sub.sub.replaceAll(' ', '</span> <span>')}</span>`).join('');

	updateSidebar();
}, 1000);




DICTIONARY = {
	"tiburón": "shark",
	"accidente": "accident",
	"grupo": "group",
	"vuelvo": "I return",
	"ordenaste": "you ordered",
	"desastre": "disaster",
	"inferior": "lower",
	"su": "his, her, their",
	"quién": "who",
	"ventajas": "advantages",
	"mensaje": "message",
	"hora": "hour",
	"prueben": "try",
	"acosas": "harass",
	"bien": "well",
	"vez": "time",
	"cabeza": "head",
	"distingue": "distinguishes",
	"agarro": "I grab",
	"cortejo": "courtship",
	"alteró": "altered",
	"dejar": "leave",
	"encuentra": "find",
	"sincera": "sincere",
	"tan": "so",
	"aprender": "learn",
	"étnico": "ethnic",
	"estacionamiento": "parking",
	"delito": "crime",
	"asperger": "Asperger",
	"pies": "feet",
	"declaro": "I declare",
	"nombre": "name",
	"nuestra": "our",
	"usas": "you use",
	"del": "of the",
	"comerciante": "merchant",
	"ejercer": "exercise",
	"jamás": "never",
	"empiecen": "start",
	"conocernos": "get to know each other",
	"pegues": "stick",
	"filtro": "filter",
	"palestino": "Palestinian",
	"sopa": "soup",
	"es": "is",
	"tiburones": "sharks",
	"amistad": "friendship",
	"oído": "ear",
	"esta": "this",
	"serán": "will be",
	"saben": "they know",
	"comunitaria": "community",
	"cenar": "dinner",
	"quedarme": "stay",
	"siento": "I feel",
	"parecer": "seem",
	"hablé": "I spoke",
	"llevo": "I carry",
	"sentido": "sense",
	"esquina": "corner",
	"pregunto": "I ask",
	"compartirles": "share with them",
	"niños": "children",
	"abandonaron": "abandoned",
	"haré": "I will do",
	"jeffrey": "Jeffrey",
	"adelante": "forward",
	"gracias": "thank you",
	"películas": "movies",
	"eras": "you were",
	"seis": "six",
	"arruina": "ruins",
	"pues": "well",
	"presentaré": "I will present",
	"pareces": "you look like",
	"escucharemos": "we will listen",
	"muchos": "many",
	"drogadicta": "drug addict",
	"resto": "rest",
	"noche": "night",
	"cualquiera": "any",
	"acrobacia": "acrobatics",
	"tutor": "tutor",
	"meterte": "get into",
	"dentro": "inside",
	"perdió": "lost",
	"ya": "already",
	"horario": "schedule",
	"mírenme": "look at me",
	"muerto": "dead",
	"respeto": "respect",
	"le": "to him, to her",
	"bill": "Bill",
	"bonita": "pretty",
	"quizás": "maybe",
	"retrasado": "delayed",
	"insultado": "insulted",
	"hay": "there is",
	"volver": "return",
	"entrepierna": "crotch",
	"ciencias": "sciences",
	"posible": "possible",
	"toma": "take",
	"buen": "good",
	"lástima": "pity",
	"se": "it",
	"esposa": "wife",
	"gusto": "taste",
	"amar": "love",
	"deseo": "desire",
	"hermano": "brother",
	"ojos": "eyes",
	"haciendo": "doing",
	"concentra": "concentrate",
	"espera": "wait",
	"como": "like",
	"adultos": "adults",
	"oye": "listen",
	"ver": "see",
	"genio": "genius",
	"día": "day",
	"guardaré": "I will keep",
	"dislocarse": "dislocate",
	"más": "more",
	"difícil": "difficult",
	"barra": "bar",
	"propósito": "purpose",
	"los": "the",
	"saco": "bag",
	"carrito": "cart",
	"minutos": "minutes",
	"antes": "before",
	"humanas": "human",
	"notaste": "you noticed",
	"real": "real",
	"harás": "you will do",
	"tendría": "would have",
	"pescaron": "they fished",
	"viejitos": "old people",
	"chalupas": "chalupas",
	"entrar": "enter",
	"fanfarronadas": "boasting",
	"estamos": "we are",
	"convertido": "converted",
	"única": "unique",
	"somos": "we are",
	"proteger": "protect",
	"iphone": "iPhone",
	"perdonar": "forgive",
	"calentadores": "heaters",
	"tarjeta": "card",
	"columbia": "Columbia",
	"mueble": "furniture",
	"diría": "I would say",
	"ese": "that",
	"princesita": "little princess",
	"deberían": "should",
	"conoces": "you know",
	"priorizar": "prioritize",
	"certificado": "certificate",
	"debo": "I must",
	"golf": "golf",
	"esa": "that",
	"parte": "part",
	"ven": "come",
	"reprobaré": "I will fail",
	"querer": "want",
	"era": "was",
	"muy": "very",
	"campo": "field",
	"adentro": "inside",
	"háblame": "talk to me",
	"niñera": "nanny",
	"inspirador": "inspiring",
	"futbol": "soccer",
	"cierto": "true",
	"joven": "young",
	"sexy": "sexy",
	"hablarle": "talk to him, talk to her",
	"les": "to them",
	"disculpan": "excuse",
	"fea": "ugly",
	"biblioteca": "library",
	"puede": "can",
	"días": "days",
	"baño": "bathroom",
	"vuelta": "turn",
	"tienes": "you have",
	"discurso": "speech",
	"acosaría": "would harass",
	"mí": "me",
	"vamos": "let's go",
	"con": "with",
	"adderall": "Adderall",
	"pregunta": "question",
	"galardonadas": "award-winning",
	"mariscal": "marshal",
	"piedra": "stone",
	"obtengo": "I get",
	"nos": "us",
	"triste": "sad",
	"troy": "Troy",
	"tomado": "taken",
	"10": "10",
	"pasa": "happens",
	"coqueteos": "flirting",
	"primera": "first",
	"creerán": "they will believe",
	"podemos": "we can",
	"hago": "I do",
	"sus": "their",
	"creí": "I believed",
	"y": "and",
	"ceremonia": "ceremony",
	"mis": "my",
	"será": "will be",
	"ni": "nor",
	"pensar": "think",
	"veré": "I will see",
	"suerte": "luck",
	"miedo": "fear",
	"gato": "cat",
	"convencí": "I convinced",
	"pones": "you put",
	"motivada": "motivated",
	"sido": "been",
	"descubrí": "I discovered",
	"sin": "without",
	"poco": "little",
	"hablar": "talk",
	"digo": "I say",
	"mucho": "much",
	"hoja": "leaf",
	"amable": "kind",
	"decidir": "decide",
	"extiendan": "extend",
	"dicho": "said",
	"han": "have",
	"aprendemos": "we learn",
	"pásale": "pass it",
	"aquí": "here",
	"affleck": "Affleck",
	"estás": "you are",
	"venido": "come",
	"dejó": "left",
	"jurados": "juries",
	"cartón": "cardboard",
	"12": "12",
	"voltear": "turn",
	"diseñados": "designed",
	"tanto": "so much",
	"annie": "Annie",
	"verbos": "verbs",
	"presente": "present",
	"nadie": "nobody",
	"estudiaras": "you would study",
	"quiera": "wants",
	"caliente": "hot",
	"malas": "bad",
	"golpear": "hit",
	"buenos": "good",
	"acepto": "I accept",
	"mi": "my",
	"cena": "dinner",
	"lamenta": "regrets",
	"si": "if",
	"ser": "be",
	"hermosa": "beautiful",
	"quiere": "wants",
	"hicieron": "they did",
	"duncan": "Duncan",
	"serio": "serious",
	"adelantado": "advanced",
	"arriba": "up",
	"tipos": "types",
	"decirlo": "say it",
	"acto": "act",
	"apoyo": "support",
	"espero": "I hope",
	"todo": "everything",
	"veintitantos": "twenty-something",
	"vida": "life",
	"oyen": "they hear",
	"excita": "excites",
	"cualquier": "any",
	"volveré": "I will return",
	"reprobará": "will fail",
	"billetera": "wallet",
	"leámoslo": "let's read it",
	"sinceridad": "sincerity",
	"listos": "ready",
	"leyenda": "legend",
	"tiene": "has",
	"irse": "leave",
	"moral": "moral",
	"acoso": "harassment",
	"ha": "has",
	"contacto": "contact",
	"orgullo": "pride",
	"insertan": "insert",
	"soy": "I am",
	"fuiste": "you were",
	"convierto": "I become",
	"mucha": "a lot",
	"temprana": "early",
	"gente": "people",
	"chamán": "shaman",
	"al": "to the",
	"estúpida": "stupid",
	"niña": "girl",
	"loquero": "madhouse",
	"cenamos": "we have dinner",
	"energía": "energy",
	"johnny": "Johnny",
	"vi": "I saw",
	"quería": "wanted",
	"hacer": "do",
	"usando": "using",
	"vas": "you go",
	"trabajo": "work",
	"tensión": "tension",
	"dejado": "left",
	"mientes": "you lie",
	"él": "he",
	"creo": "I believe",
	"encontré": "I found",
	"veces": "times",
	"enseñable": "teachable",
	"son": "they are",
	"divorciado": "divorced",
	"entera": "whole",
	"informarles": "inform them",
	"mientras": "while",
	"rey": "king",
	"conocerte": "meet you",
	"siéntense": "sit down",
	"ayuda": "help",
	"adjunto": "attached",
	"camino": "path",
	"llegó": "arrived",
	"greendale": "Greendale",
	"placer": "pleasure",
	"cumplido": "compliment",
	"mitad": "half",
	"uno": "one",
	"contarte": "tell you",
	"entonces": "then",
	"tus": "your",
	"estatal": "state",
	"puedes": "you can",
	"hablarme": "talk to me",
	"mejores": "best",
	"ves": "you see",
	"raya": "stripe",
	"bueno": "good",
	"integridad": "integrity",
	"ben": "Ben",
	"algo": "something",
	"mírala": "look at her",
	"situación": "situation",
	"gritar": "shout",
	"perder": "lose",
	"español": "Spanish",
	"gran": "great",
	"aburrido": "bored",
	"están": "they are",
	"clase": "class",
	"u": "or",
	"¡pltca": "pltca",
	"estar": "be",
	"sigo": "I follow",
	"tal": "such",
	"cosas": "things",
	"caes": "you fall",
	"agradable": "pleasant",
	"tiradero": "dump",
	"voy": "I go",
	"evidente": "evident",
	"asientos": "seats",
	"comunidad": "community",
	"estaba": "was",
	"400": "400",
	"1105": "1105",
	"estudio": "study",
	"porque": "because",
	"derecho": "right",
	"trabaja": "works",
	"ahí": "there",
	"forma": "shape",
	"deportista": "athlete",
	"equipo": "team",
	"recuerdas": "you remember",
	"había": "there was",
	"tarea": "task",
	"toallitas": "wipes",
	"dios": "god",
	"estados": "states",
	"imparable": "unstoppable",
	"amenaza": "threat",
	"activas": "active",
	"douglas": "Douglas",
	"necesito": "I need",
	"verdad": "truth",
	"excusa": "excuse",
	"año": "year",
	"fui": "I went",
	"fue": "was",
	"tu": "your",
	"tomarás": "you will take",
	"madre": "mother",
	"inofensivos": "harmless",
	"ahora": "now",
	"vemos": "we see",
	"allá": "there",
	"todos": "everyone",
	"comerte": "eat you",
	"dame": "give me",
	"papá": "dad",
	"maestro": "teacher",
	"cómo": "how",
	"registro": "register",
	"limpiar": "clean",
	"herramientas": "tools",
	"discutamos": "let's discuss",
	"fúmale": "smoke it",
	"sean": "be",
	"juega": "plays",
	"racista": "racist",
	"da": "gives",
	"seguridad": "security",
	"cumple": "complies",
	"cada": "each",
	"cama": "bed",
	"título": "title",
	"unidos": "united",
	"por": "by",
	"el": "the",
	"único": "only",
	"este": "this",
	"me": "me",
	"gallina": "chicken",
	"tiempo": "time",
	"acaso": "perhaps",
	"muebles": "furniture",
	"qué": "what",
	"agarriche": "grab",
	"sola": "alone",
	"compartiré": "I will share",
	"grave": "serious",
	"email": "email",
	"suspendió": "suspended",
	"primero": "first",
	"circular": "circular",
	"manteniendo": "maintaining",
	"improvisación": "improvisation",
	"ir": "go",
	"para": "for",
	"mamá": "mom",
	"pongo": "I put",
	"olvidar": "forget",
	"toda": "all",
	"ustedes": "you all",
	"certifica": "certifies",
	"nuestro": "our",
	"creen": "they believe",
	"cuando": "when",
	"decir": "to say",
	"digan": "they say",
	"preguntan": "they ask",
	"caerte": "to fall",
	"soñaría": "would dream",
	"loco": "crazy",
	"semestre": "semester",
	"decisiones": "decisions",
	"está": "is",
	"razón": "reason",
	"así": "like this",
	"listo": "ready",
	"ningún": "none",
	"mentiroso": "liar",
	"estúpido": "stupid",
	"murray": "Murray",
	"gritando": "screaming",
	"curioso": "curious",
	"calle": "street",
	"datos": "data",
	"sé": "I know",
	"sobre": "about",
	"tenemos": "we have",
	"haces": "you do",
	"escribe": "writes",
	"bender": "Bender",
	"adulta": "adult",
	"sea": "be",
	"necesitas": "you need",
	"nunca": "never",
	"pequeño": "small",
	"ti": "you",
	"media": "half",
	"gusta": "likes",
	"tardamos": "we take",
	"trastorno": "disorder",
	"entiendo": "I understand",
	"trasero": "rear",
	"creatura": "creature",
	"darle": "give",
	"audiencia": "audience",
	"promedio": "average",
	"ciudadano": "citizen",
	"examen": "exam",
	"otros": "others",
	"lápiz": "pencil",
	"escusado": "toilet",
	"pides": "you ask",
	"elizabeth": "Elizabeth",
	"dos": "two",
	"sexualmente": "sexually",
	"profesor": "teacher",
	"adquiriste": "you acquired",
	"todas": "all",
	"mal": "bad",
	"jeff": "Jeff",
	"ahorita": "right now",
	"perdón": "sorry",
	"viejo": "old",
	"revolcarte": "roll",
	"especie": "species",
	"eternidad": "eternity",
	"genial": "great",
	"divorciados": "divorced",
	"igual": "equal",
	"nada": "nothing",
	"diferencia": "difference",
	"fácil": "easy",
	"hacerlo": "do it",
	"la": "the",
	"americano": "American",
	"mío": "mine",
	"hippies": "hippies",
	"universitario": "university",
	"tomaré": "I will take",
	"entre": "between",
	"pase": "pass",
	"luego": "then",
	"familia": "family",
	"siquiera": "even",
	"simpatizar": "sympathize",
	"compasión": "compassion",
	"importante": "important",
	"preocupación": "concern",
	"perdono": "I forgive",
	"hola": "hello",
	"podrías": "could you",
	"tono": "tone",
	"cariño": "love",
	"pero": "but",
	"película": "movie",
	"abogado": "lawyer",
	"primer": "first",
	"animales": "animals",
	"debemos": "we must",
	"texto": "text",
	"izquierda": "left",
	"pueden": "can",
	"sí": "yes",
	"orientación": "orientation",
	"deja": "leaves",
	"preguntaste": "you asked",
	"oírme": "hear me",
	"nosotros": "we",
	"lo": "it",
	"último": "last",
	"interesante": "interesting",
	"amigo": "friend",
	"winger": "Winger",
	"las": "the",
	"necesitamos": "we need",
	"santo": "saint",
	"sal": "salt",
	"persona": "person",
	"reciben": "they receive",
	"das": "you give",
	"estudiando": "studying",
	"sexual": "sexual",
	"ellos": "they",
	"salón": "room",
	"estudiar": "study",
	"mejor": "better",
	"traducción": "translation",
	"dieron": "they gave",
	"debe": "must",
	"espaldas": "backs",
	"estoy": "I am",
	"encuentro": "meeting",
	"también": "also",
	"llamo": "I call",
	"especial": "special",
	"insoportable": "unbearable",
	"onda": "wave",
	"octubre": "October",
	"alcantarilla": "sewer",
	"michael": "Michael",
	"resuelta": "resolved",
	"casando": "marrying",
	"sabía": "I knew",
	"deberías": "you should",
	"tras": "after",
	"lugar": "place",
	"piel": "skin",
	"perfecto": "perfect",
	"auto": "car",
	"lección": "lesson",
	"furioso": "furious",
	"seguro": "sure",
	"hasta": "until",
	"entrenaron": "they trained",
	"segunda": "second",
	"relativismo": "relativism",
	"supón": "suppose",
	"vete": "go away",
	"escuela": "school",
	"estudiemos": "let's study",
	"edad": "age",
	"adolescente": "teenager",
	"agarró": "grabbed",
	"astetonto": "astetonto",
	"pon": "put",
	"pasas": "raisins",
	"britta": "Britta",
	"invité": "I invited",
	"hecho": "fact",
	"juego": "game",
	"o": "or",
	"desde": "from",
	"pidió": "asked",
	"haberte": "have you",
	"quisiera": "I would like",
	"eres": "you are",
	"digas": "you say",
	"cigarrillos": "cigarettes",
	"que": "that",
	"a": "to",
	"inventé": "I invented",
	"hubiera": "would have",
	"mira": "look",
	"significa": "means",
	"arrepentiremos": "we will regret",
	"fabuloso": "fabulous",
	"durante": "during",
	"estudien": "study",
	"viaje": "trip",
	"roy": "Roy",
	"invitamos": "we invite",
	"oportunidad": "opportunity",
	"sabes": "you know",
	"mano": "hand",
	"valor": "value",
	"di": "I gave",
	"hombre": "man",
	"mentes": "minds",
	"importa": "it matters",
	"hagas": "you do",
	"has": "you have",
	"lexus": "Lexus",
	"sería": "would be",
	"pone": "puts",
	"misma": "same",
	"beca": "scholarship",
	"dijo": "said",
	"adiós": "goodbye",
	"hawthorne": "Hawthorne",
	"quieres": "you want",
	"inapropiado": "inappropriate",
	"reprimido": "repressed",
	"baby": "baby",
	"en": "in",
	"alguien": "someone",
	"admitirlo": "admit it",
	"hacernos": "make us",
	"shirley": "Shirley",
	"decente": "decent",
	"navidad": "Christmas",
	"de": "of",
	"eso": "that",
	"tierra": "earth",
	"cielo": "sky",
	"sólo": "only",
	"lógica": "logic",
	"error": "error",
	"vean": "see",
	"chamarra": "jacket",
	"no": "no",
	"venir": "to come",
	"sabiduría": "wisdom",
	"28": "28",
	"conduzco": "I drive",
	"bandido": "bandit",
	"esto": "this",
	"dejen": "leave",
	"un": "a",
	"humanos": "humans",
	"pago": "payment",
	"ayudarán": "will help",
	"pierce": "pierce",
	"cerca": "near",
	"maravilla": "wonder",
	"óscar": "Oscar",
	"decano": "dean",
	"junto": "together",
	"semana": "week",
	"veo": "I see",
	"académica": "academic",
	"años": "years",
	"invento": "invention",
	"te": "you",
	"quiero": "I want",
	"veras": "you will see",
	"buscarla": "to look for her",
	"árabe": "Arabic",
	"diste": "you gave",
	"clases": "classes",
	"feliz": "happy",
	"licencia": "license",
	"tengo": "I have",
	"fría": "cold",
	"calmar": "to calm",
	"puso": "put",
	"institución": "institution",
	"respuestas": "answers",
	"incendio": "fire",
	"sigues": "you continue",
	"club": "club",
	"conectar": "to connect",
	"problema": "problem",
	"ira": "anger",
	"grupos": "groups",
	"alto": "high",
	"terminaron": "they finished",
	"cuenta": "account",
	"hace": "ago",
	"consejos": "advice",
	"puedo": "I can",
	"aun": "even",
	"relativa": "relative",
	"haga": "do",
	"abed": "abed",
	"pagaban": "they paid",
	"cinco": "five",
	"respuesta": "answer",
	"dejo": "I leave",
	"enseñables": "teachable",
	"indica": "indicates",
	"cancha": "court",
	"saber": "to know",
	"yo": "I",
	"favor": "favor",
	"llaves": "keys",
	"universidad": "university",
	"una": "one",
	"tenía": "had",
	"país": "country",
	"limpiarse": "to clean oneself",
	"baile": "dance",
	"mañana": "morning",
	"parece": "seems",
	"he": "I have",
	"muere": "dies",
	"salió": "went out",
	"justicia": "justice",
	"tú": "you",
	"palabras": "words",
	"prominente": "prominent",
	"sordo": "deaf",
	"ganado": "earned",
	"subtítulos": "subtitles",
	"merezco": "I deserve",
	"inhabilitación": "disqualification",
	"descubrieron": "they discovered",
	"voz": "voice"
}