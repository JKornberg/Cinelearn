//Font awesome example
/*

const checkmark = document.createElement("i");
checkmark.classList.add("fa-solid", "fa-circle-check", "checkmark");
modalContainer.appendChild(checkmark);

*/

/* add mixpanel tracking */
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
	constructor(start, id, question, type) {
		this.start = start; // number;
		this.id = id; // number;
		this.question = question; //string
		this.type = type
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
		this.randomSpanishWords = getRandomValuesFromArray(english_words)
		this.section = Math.floor(max_time/this.start)
		this.id = id
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
const quizQuestions = [
];

var dict = {
	"this": "pronoun\n (used to indicate a person, thing, idea, state, event, time, remark, etc., as present, near, just mentioned or pointed out, supposed to be understood, or by way of emphasis): This is my coat.",
	"is": "verb\n 3rd person singular present indicative of be.",
	"a": "indefinite article\n a certain; a particular: one at a time; two of a kind; A Miss Johnson called.",
	"test": "noun\n the trial of the quality of something: to put to the test.",
	"hola": "interjection\n hello",
	"mundo": "noun\n world"
};


let subs = [];
let subs2 = [];

const questions = [

];


var pause = false;
var callback = function (mutationsList, observer) {
	for (const mutation of mutationsList) {
		if (mutation.target.className == "active ltr-omkt8s") {
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
		// console.log(mutation);
	}
}

window.addEventListener('load', function() {
	var opts = {
		headers: {
		'mode':'cors',
		'Access-Control-Allow-Origin': '*'
		},
	}
	fetch('https://cinelearn.fly.dev/getEnglishSubs?episode_num=0',opts)
	.then(response => response.json())
	.then(data => {
		data['english_subs']= data['english_subs'].sort(function(a, b) {
			return parseFloat(b['start_time']) - parseFloat(a['start_time'])
		});
		subs = data['english_subs'].map((subtitle) => {
			return new Subtitle(subtitle['start_time']/10000, subtitle['end_time']/10000, subtitle['english_subtitle'])
		})
		console.log(subs)

	})
	.catch(error => console.error(error));  });

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
			subs = data['spanish_subs'].map((subtitle) => {
				return new Subtitle(subtitle['start_time']/10000, subtitle['end_time']/10000, subtitle['spanish_subtitle'])
			})
			console.log(subs)
	
		})
		.catch(error => console.error(error));  });


let contextQuestions = []
let vocabQuestions = []

window.addEventListener('load', function() {
	var opts = {
		headers: {
		'mode':'cors',
		'Access-Control-Allow-Origin': '*'
		},
	}
	fetch('https://cinelearn.fly.dev/getContextQuestions?episode_num=0',opts)
	.then(response => response.json())
	.then(data => {
		contextQuestions = data['data'].map((question, qid) => {
			return new ContextQuestion(qid, question['start_time'],question['english_question'], question['spanish_question'], question['answer_list'])
		})
		console.log(vocabQuestions)
	})
	.catch(error => console.error(error));  });

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
		vocabQuestions = data['data'].map((question) => {
			return new VocabQuestion(question['vocab_id'], question['start_time'],question['english_vocab'],question['spanish_vocab'])
		})	
		console.log(contextQuestions)
	})
	.catch(error => console.error(error));  });
window.video_change_observer = new MutationObserver(callback);
window.video_change_observer_config = { childList: true, subtree: true, }
window.video_change_observer.observe(document.documentElement, window.video_change_observer_config);


// reference time and iterator 
// update iterator
createSub = true;
questionMutex = 0;

function createAnswer(text) {
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
	if (text == 'Correct'){
		iconElement.classList.add("fa-solid", "fa-circle-check", "checkmark");

	} else {
		iconElement.classList.add("fa-solid", "fa-circle-xmark", "xmark");
	}
	modalContainer.appendChild(iconElement);
	
	const explanationContainer = document.createElement("div");
	explanationContainer.classList.add("explanation-container");
	const explanation = document.createElement("p");
	explanation.textContent = "This is an explanation for why the answer is correct. I hope you enjoy!";
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
	titleElement.textContent = "Question 1";
	titleElement.classList.add("question-title")
	modalContainer.appendChild(titleElement);

	// Create the question element
	const questionElement = document.createElement("h2");
	questionElement.textContent = question.question;
	questionElement.classList.add("question")
	modalContainer.appendChild(questionElement);

	// Create the answer choice elements
	const answerContainer = document.createElement("div");
	answerContainer.classList.add("answer-container");

	question.choices.forEach((choice, index) => {
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
		if (selectedAnswer === question.correctAnswer) {
			// alert("Correct!");
			modalBg.remove();
			createAnswer("Correct!");
		} else {
			// alert("Incorrect!");
			modalBg.remove();
			createAnswer("Incorrect");
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
	questions.forEach(question => {
		const listItem = document.createElement('div');
		listItem.className = 'sidebar-list-item';
		listItem.textContent = question.question;
		listItem.addEventListener('click', () => {
			console.log(question.id);
			if (questionMutex == 0) {
				createQuizModal(quizQuestions[question.id]);
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

let isCreated=false;

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
				'font-size': '3.5vw',
				'line-height': 'normal',
				'font-weight': 'bolder',
				'color': sub.color,
				'font-family': 'Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif'
			});
			newContent.textContent = sub.textContent;
			newSubContainer.appendChild(newContent);
			newContent.addEventListener('click', function (event) {
				alert(dict[event.target.textContent]);
			}, false)
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




