// Function to fetch most current concurrent player count games data from the server
async function fetchGameData1() {
	let contentDiv = document.getElementById('currTopGames');

	try {
		// Call server to get list of games
		let response = await fetch('/home/data1');
		let jsonData = await response.json();
		ranking = jsonData.response.ranks;

		// Iterate through list of games and display them in the respective div while adding button to add games to users library
		for (let i = 0; i < 10; i++) {
			let newDiv = document.createElement("div");
			newDiv.className = "gameImg";

			// Create image box
			let newImg = document.createElement('img');
			newImg.className = "gameImg";
			newImg.src = 'https://cdn.akamai.steamstatic.com/steam/apps/' + ranking[i].appid + '/header.jpg';
			newImg.style = "padding: 15px; display: inline-block; justify-content: center; align-items: center;";

			// Create add button
			let newButton = document.createElement("button");
			newButton.className = "addButton";
			newButton.id = ranking[i].appid + "Div1";
			newButton.onclick = function () { addFuntion(newButton); };
			newButton.innerHTML = "Add to Library";

			newDiv.appendChild(newImg);
			newDiv.appendChild(newButton);

			contentDiv.appendChild(newDiv);
		}
	} catch (error) {
		console.error('Error');
	}
}

// Function to fetch peak this week in concurrent players games data from the server
async function fetchGameData2() {
	let contentDiv = document.getElementById('weekTopGames');

	try {
		// Call server to get list of games
		let response = await fetch('/home/data2');
		let jsonData = await response.json();
		ranking = jsonData.response.ranks;

		// Iterate through list of games and display them in the respective div while adding button to add games to users library
		for (let i = 0; i < 10; i++) {
			let newDiv = document.createElement("div");
			newDiv.className = "gameImg";

			// Create image box
			let newImg = document.createElement('img');
			newImg.className = "gameImg";
			newImg.src = 'https://cdn.akamai.steamstatic.com/steam/apps/' + ranking[i].appid + '/header.jpg';
			newImg.style = "padding: 15px; display: inline-block; justify-content: center; align-items: center;";

			// Create add button
			let newButton = document.createElement("button");
			newButton.className = "addButton";
			newButton.id = ranking[i].appid + "Div2";
			newButton.onclick = function () { addFuntion(newButton); };
			newButton.innerHTML = "Add to Library";

			newDiv.appendChild(newImg);
			newDiv.appendChild(newButton);

			contentDiv.appendChild(newDiv);
		}
	} catch (error) {
		console.error('Error');
	}
}

// Function to fetch most popular games of past three months data from the server
async function fetchGameData3() {
	try {
		// Call server to get list of games
		let response = await fetch('/home/data3');
		let jsonData = await response.json();
		let gameInfo = jsonData.response.pages;

		// Iterate through list of games and display them in the respective div while adding button to add games to users library
		for (let i = 0; i < 3; i++) {
			// Create section for each month
			let contentDiv = document.getElementById('mnthTopGames' + i);
			let newHead = document.getElementById("mnthH" + i);
			newHead.innerHTML = gameInfo[i].name;

			for (let j = 0; j < 10; j++) {
				let newDiv = document.createElement("div");
				newDiv.className = "gameImg";

				// Create image box
				let newImg = document.createElement('img');
				newImg.className = "gameImg";
				newImg.src = 'https://cdn.akamai.steamstatic.com/steam/apps/' + gameInfo[i].item_ids[j].appid + '/header.jpg';
				newImg.style = "padding: 15px; display: inline-block; justify-content: center; align-items: center;";

				// Create add button
				let newButton = document.createElement("button");
				newButton.className = "addButton";
				newButton.id = gameInfo[i].item_ids[j].appid + "Div3";
				newButton.onclick = function () { addFuntion(newButton); };
				newButton.innerHTML = "Add to Library";

				newDiv.appendChild(newImg);
				newDiv.appendChild(newButton);

				contentDiv.appendChild(newDiv);
			}

		}
	} catch (error) {
		console.error('Error');
	}
}

// Add game to users library
function addFuntion(button) {
	let buttonid = button.id.match(/(.*)Div/)[1];
	let data = { appid: buttonid };

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








// Call the fetchGameData function when the page loads
window.addEventListener('load', fetchGameData1);
window.addEventListener('load', fetchGameData2);
window.addEventListener('load', fetchGameData3);