// Function to fetch peak this week in concurrent players games data from the server
async function fetchGameData2() {
	let contentDiv = document.getElementById('content');

	try {
		// Call server to get list of games
		let response = await fetch('/home/data2');
		let jsonData = await response.json();
		ranking = jsonData.response.ranks;

		// Iterate through list of games and display them while adding button to add games to users library
		for (let i = 0; i < 100; i++) {
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
			newButton.id = ranking[i].appid;
			newButton.onclick = function(){ addFuntion(newButton); };
			newButton.innerHTML = "Add to Library";

			newDiv.appendChild(newImg);
			newDiv.appendChild(newButton);

			contentDiv.appendChild(newDiv);
		}
	} catch (error) {
		console.error('Error');
	}
}


function addFuntion(button) {
	let data = {appid: button.id};
	
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
window.addEventListener('load', fetchGameData2);