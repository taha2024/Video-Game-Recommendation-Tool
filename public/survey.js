let genresArray = [
	'Action', 'Adventure',
	'Animation & Modeling', 'Audio Production',
	'Casual', 'Design & Illustration',
	'Early Access', 'Free to Play',
	'Indie', 'Massively Multiplayer',
	'Photo Editing', 'RPG',
	'Racing', 'Simulation',
	'Sports', 'Strategy',
	'Utilities'
];

let userGenres = [];
let userGenrePreferences = {};

let step = 1;


let gamesData;

// Function to get data from the server on which games the user has added to their library
async function getGames() {
	try {
		// Get game data from server
		let response = await fetch('/survey/data');
		gamesData = await response.json();
		
		let contentDiv = document.getElementById('content');

		// Check if users game list is empty
		if (gamesData.games.length === 0) {
			contentDiv.innerHTML = "Please complete the survey for recommendations.";
			return;
		}

		// Iterate through the list of games and add display them for the using as well as giving a button to add game to the library
		for (let i = 0; i < gamesData.games.length; i++) {
			let newDiv = document.createElement("div");
			newDiv.className = "gameImg";
			newDiv.id = gamesData.games[i].appid + "Div";

			// Create image box
			let newImg = document.createElement('img');
			newImg.className = "gameImg";
			newImg.src = 'https://cdn.akamai.steamstatic.com/steam/apps/' + gamesData.games[i].appid + '/header.jpg';
			newImg.style = "padding: 15px; display: inline-block; justify-content: center; align-items: center;";

			// Create add button
			let newButton = document.createElement("button");
			newButton.className = "addButton";
			newButton.id = gamesData.games[i].appid;
			newButton.onclick = function () { addFuntion(newButton); };
			newButton.innerHTML = "Add to Library";

			// Create percentage label
			let newLabel = document.createElement("label");
			newLabel.className = "percentage";
			newLabel.innerHTML = gamesData.games[i].recommendationScore.toFixed(2);

			newDiv.appendChild(newImg);
			newDiv.appendChild(newButton);
			newDiv.appendChild(newLabel);

			contentDiv.appendChild(newDiv);
		}
	} catch (error) {
		console.error('Error', error);
	}
}


// Function to create the survey
function createSurvey() {
	let surveyDiv = document.getElementById('genres');
	surveyDiv.innerHTML = '';

	for (let i = 0; i < genresArray.length; i++) {
		// Create add button
		let newButton = document.createElement("button");
		newButton.className = "addGenre";
		newButton.id = genresArray[i];
		newButton.onclick = function () { addGenre(newButton); };
		newButton.innerHTML = genresArray[i];
		newButton.style.marginLeft = "15px";
		newButton.style.marginRight = "15px";

		surveyDiv.appendChild(newButton);
	}
}


function addGenre(button) {
	if (userGenres.length < 3) {
		let genre = button.id;
		button.remove();

		let index = genresArray.indexOf(genre);
		genresArray.splice(index, 1);

		userGenres.push(genre);
		userGenres.sort();

		updateUserGenres();
	} else {
		alert('You already have 3 genres selected.');
	}
}


function updateUserGenres() {
	let surveyDiv = document.getElementById('usergenres');
	surveyDiv.innerHTML = '';

	for (let i = 0; i < userGenres.length; i++) {
		// Create add button
		let newButton = document.createElement("button");
		newButton.id = userGenres[i];
		newButton.onclick = function () { removeGenre(newButton); };
		newButton.innerHTML = userGenres[i];
		newButton.style.marginLeft = "15px";
		newButton.style.marginRight = "15px";

		surveyDiv.appendChild(newButton);
	}
}


function removeGenre(button) {
	let genre = button.id;
	button.remove();

	let index = userGenres.indexOf(genre);
	userGenres.splice(index, 1);

	genresArray.push(genre);
	genresArray.sort();

	createSurvey();
}


function addFuntion(button) {
	let data = { appid: button.id };

	// Send a POST request to the server with appid of the game
	fetch("/games/addgame", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(responseData => {
		//console.log("Request processed:", responseData);
	});
}


function submitSurvey() {
	if (step === 1 && userGenres.length === 3) {
		step = 2;
		showGenrePreferences();
	} else {
		let surveyDiv = document.getElementById('survey');
		let paragraph = document.createElement('p');
		paragraph.textContent = 'Thank you for submitting your preference!';
		paragraph.style.marginLeft = "15px";
		surveyDiv.innerHTML = '';
		surveyDiv.appendChild(paragraph);
		sendSurvey();
	}
}


function showGenrePreferences(selectedGenres) {
	let surveyDiv = document.getElementById('survey');
	surveyDiv.innerHTML = '';
	let preferenceDiv = document.createElement('div');
	let lineBreak = document.createElement('br');

	userGenres.forEach((genre) => {
		userGenrePreferences[genre] = null;
		let label = document.createElement('label');
		label.appendChild(document.createTextNode(`How much do you like ${genre}?`));
		label.style.marginLeft = "15px";

		preferenceDiv.appendChild(label);

		for (let i = 1; i <= 5; i++) {
			let radio = document.createElement('input');
			radio.type = 'radio';
			radio.name = `${genre}Preference`;
			radio.value = i;

			radio.addEventListener('change', function () {
				userGenrePreferences[genre] = i;
			});

			let radioLabel = document.createElement('label');
			radioLabel.appendChild(document.createTextNode(i));

			preferenceDiv.appendChild(radio);
			preferenceDiv.appendChild(radioLabel);
			preferenceDiv.appendChild(lineBreak);
		}
	});

	surveyDiv.appendChild(preferenceDiv);
	surveyDiv.appendChild(lineBreak);
	surveyDiv.appendChild(lineBreak);

	let button = document.createElement('button');
	button.id = 'submitSurvey';
	button.textContent = 'Submit Genres';
	button.style.display = 'block';
	button.style.margin = '0 auto';

	button.onclick = function () {
		submitSurvey();
	};

	surveyDiv.appendChild(button);
}


function sendSurvey() {
	
	fetch("/sendsurvey", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userGenrePreferences)
	}).then(response => {
		if (response.ok) {
			console.log("Survey data successfully sent to the server.");
			// Reload the page only if the response status is 200
			if (response.status === 200) {
				window.location.reload();
			}
		} else {
			console.error("Failed to send survey data to the server.");
		}
	})
		.catch(error => {
			console.error("Error:", error);
		});
}


// Function to sign out of users account
function signOut() {
	// Ask the user for confirmation
	let confirmSignOut = confirm("Are you sure you want to sign out?");

	if (confirmSignOut) {
		// Send a POST request to the server to sign out
		fetch("/signout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((response) => {
				if (response.ok) {
					// Sign-out was successful, refresh the page
					window.location.reload();
				} else {
					// Handle any errors here, such as displaying an error message
					console.error("Sign-out failed");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	} else {
		// User canceled sign-out
		console.log("Sign-out canceled");
	}
}





window.addEventListener('load', getGames);
window.addEventListener('load', createSurvey);