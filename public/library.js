var gamesData;

// Function to get data from the server on which games the user has added to their library
async function getGames() {
	try {
		// Get game data from server
		let response = await fetch('/library/data');
		gamesData = await response.json();

		let contentDiv = document.getElementById('content');

		// Check if users game list is empty
		if (gamesData.games.length === 0) {
			contentDiv.innerHTML = "<h1>Your library</h1>" + "There are no games in your library.";
			return;
		}

		// Iterate through the list of games and add display them for the using as well as giving a button to remove game from the library
		for (let i = 0; i < gamesData.games.length; i++) {
			let newDiv = document.createElement("div");
			newDiv.className = "gameImg";
			newDiv.id = gamesData.games[i] + "Div";

			// Create image box
			let newImg = document.createElement('img');
			newImg.className = "gameImg";
			newImg.src = 'https://cdn.akamai.steamstatic.com/steam/apps/' + gamesData.games[i] + '/header.jpg';
			newImg.style = "padding: 15px; display: inline-block; justify-content: center; align-items: center;";

			// Create remove button
			let newButton = document.createElement("button");
			newButton.className = "removeButton";
			newButton.id = gamesData.games[i];
			newButton.onclick = function () { removeFuntion(newButton); };
			newButton.innerHTML = "Remove from Library";

			newDiv.appendChild(newImg);
			newDiv.appendChild(newButton);

			contentDiv.appendChild(newDiv);
		}
	} catch (error) {
		console.error('Error', error);
	}
}

// Remove a game from clients library
function removeFuntion(button) {
	let data = { appid: button.id };

	// Send a POST request to the server with appid of the game
	fetch("/games/removegame", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(responseData => {
		// Check if removing the games makes the library empty
		let deleteThis = document.getElementById(button.id + "Div");
		deleteThis.remove();

		let index = gamesData.games.indexOf(button.id);
		gamesData.games.splice(index, 1);

		if (gamesData.games.length === 0) {
			document.getElementById('content').innerHTML = "<h1>Your library</h1>" + "There are no games in your library.";
		}
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