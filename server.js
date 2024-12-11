const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;



// Connect to databse
const db = new sqlite3.Database('./database/recommendationTool.sqlite', (err) => {
	if (err) {
		console.error('Database connection error:', err.message);
	} else {
		console.log('Connected to the database');
	}
});

let userLoggedIn = false;
let currUser;



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the files from the 'misc' directory
app.use(express.static(path.join(__dirname, 'misc')));

// Middleware to parse JSON request bodies
app.use(express.json());



// HTML pages request
app.get('/', homePage);
app.get('/home', homePage);
app.get('/games', gamesPage);
app.get('/library', libraryPage);
app.get('/survey', surveyPage);
app.get('/login', loginPage);

// Javascript requests
app.get('/home.js', homeJS);
app.get('/games.js', gamesJS);
app.get('/library.js', libraryJS);
app.get('/survey.js', surveyJS);
app.get('/login.js', loginJS);

// Data requests
app.get('/home/data1', getHomeData1);
app.get('/home/data2', getHomeData2);
app.get('/home/data3', getHomeData3);
app.get('/library/data', getLibraryData);
app.get('/survey/data', sendRecommended);

// Post requests
app.post('/games/addgame', addGame);
app.post('/games/removegame', removeGame);
app.post('/login/loginInfo', checkLogin);
app.post('/login/signup', signUp);
app.post('/signout', signOut);
app.post('/sendsurvey', surveyRetrieved);



// Home page handler
async function homePage(req, res) {
	if (userLoggedIn) {
		res.sendFile(path.join(__dirname, 'public', 'home.html'));
	} else {
		res.redirect("http://localhost:3000/login");
	}

}

// Games page handler
async function gamesPage(req, res) {
	if (userLoggedIn) {
		res.sendFile(path.join(__dirname, 'public', 'games.html'));
	} else {
		res.redirect("http://localhost:3000/login");
	}
}

// Library page handler
async function libraryPage(req, res) {
	if (userLoggedIn) {
		res.sendFile(path.join(__dirname, 'public', 'library.html'));
	} else {
		res.redirect("http://localhost:3000/login");
	}
}

// User page handler
async function surveyPage(req, res) {
	if (userLoggedIn) {
		res.sendFile(path.join(__dirname, 'public', 'survey.html'));
	} else {
		res.redirect("http://localhost:3000/login");
	}
}

// Login page handler
async function loginPage(req, res) {
	if (userLoggedIn) {
		res.redirect("http://localhost:3000/");
	} else {
		res.sendFile(path.join(__dirname, 'public', 'login.html'));
	}
}



// JavaScript file handler, set the Content-Type header to 'application/javascript', send the JavaScript file to the client
async function homeJS(req, res) {
	res.set('Content-Type', 'application/javascript');
	res.sendFile(path.join(__dirname, 'public', 'home.js'));
}

async function gamesJS(req, res) {
	res.set('Content-Type', 'application/javascript');
	res.sendFile(path.join(__dirname, 'public', 'games.js'));
}

async function libraryJS(req, res) {
	res.set('Content-Type', 'application/javascript');
	res.sendFile(path.join(__dirname, 'public', 'library.js'));
}

async function surveyJS(req, res) {
	res.set('Content-Type', 'application/javascript');
	res.sendFile(path.join(__dirname, 'public', 'survey.js'));
}

async function loginJS(req, res) {
	res.set('Content-Type', 'application/javascript');
	res.sendFile(path.join(__dirname, 'public', 'login.js'));
}




// Send games with highest current concurrent player count to client
async function getHomeData1(req, res) {
	try {
		let response = await axios.get('https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=AD880D962E2E1B8218FC43EC50CF8E38');
		let jsonData = response.data;
		res.json(jsonData);
	} catch (error) {
		console.error('Error:');
		res.status(500).send('Error fetching data.');
	}
}

// Send games with highest player count in past week to client
async function getHomeData2(req, res) {
	try {
		let response = await axios.get('https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?key=AD880D962E2E1B8218FC43EC50CF8E38');
		let jsonData = response.data;
		res.json(jsonData);
	} catch (error) {
		console.error('Error:');
		res.status(500).send('Error fetching data.');
	}
}

// Send top releases of past 3 months
async function getHomeData3(req, res) {
	try {
		let response = await axios.get('https://api.steampowered.com/ISteamChartsService/GetTopReleasesPages/v1/?key=AD880D962E2E1B8218FC43EC50CF8E38');
		let jsonData = response.data;
		res.json(jsonData);
	} catch (error) {
		console.error('Error:');
		res.status(500).send('Error fetching data.');
	}
}

// Send top releases of past 3 months
async function getLibraryData(req, res) {
	try {
		db.get('SELECT game_library FROM users WHERE username = ?', [currUser], (err, row) => {
			if (err) {
				console.error('Error querying the database:', err.message);
				res.status(500).json({ error: 'Database error' }); // Handle the error response
			} else {
				if (row) {
					let games = JSON.parse(row.game_library);
					res.json({ games }); // Send the game library as JSON
				} else {
					res.status(404).json({ error: 'User not found' }); // Handle the user not found response
				}
			}
		});
	} catch (error) {
		console.error('Error:');
		res.status(500).send('Error fetching data.');
	}
}


async function sendRecommended(req, res) {
	try {
		db.get('SELECT recommended_games FROM users WHERE username = ?', [currUser], (err, row) => {
			if (err) {
				console.error('Error querying the database:', err.message);
				res.status(500).json({ error: 'Database error' }); // Handle the error response
			} else {
				if (row) {
					let games = JSON.parse(row.recommended_games);
					res.status(200).json({ games }); 
				} else {
					res.status(404).json({ error: 'User not found' }); 
				}
			}
		});
	} catch (error) {
		console.error('Error:');
		res.status(500).send('Error fetching data.');
	}
}


// Get data from client and store it 
function addGame(req, res) {
	let updateLibrary;

	// Get users library of games
	db.get('SELECT game_library FROM users WHERE username = ?', [currUser], (err, row) => {
		if (err) {
			console.error('Error querying the database:', err.message);
			res.status(500).json({ error: 'Database error' }); // Handle the error response
		} else {
			if (row) {
				updateLibrary = JSON.parse(row.game_library);

				if (!updateLibrary.includes(req.body.appid)) {
					updateLibrary.push(req.body.appid);
				}

				let updatedGameLibraryJSON = JSON.stringify(updateLibrary);

				// Update the user's record with the modified game library
				db.run('UPDATE users SET game_library = ? WHERE username = ?', [updatedGameLibraryJSON, currUser], (err) => {
					if (err) {
						console.error('Error updating the database: ', err.message);
					} else {
						console.log('Game library updated for ', currUser);
						res.json({ response: "Data received." });
					}
				});
			} else {
				res.status(404).json({ error: 'User not found' }); // Handle the user not found response
			}
		}
	});
}

// Remove game from clients library
function removeGame(req, res) {
	let updateLibrary;

	// Get users library of games
	db.get('SELECT game_library FROM users WHERE username = ?', [currUser], (err, row) => {
		if (err) {
			console.error('Error querying the database:', err.message);
			res.status(500).json({ error: 'Database error' }); // Handle the error response
		} else {
			if (row) {
				updateLibrary = JSON.parse(row.game_library);

				let index = updateLibrary.indexOf(req.body.appid);
				updateLibrary.splice(index, 1);

				let updatedGameLibraryJSON = JSON.stringify(updateLibrary);

				// Update the user's record with the modified game library
				db.run('UPDATE users SET game_library = ? WHERE username = ?', [updatedGameLibraryJSON, currUser], (err) => {
					if (err) {
						console.error('Error updating the database: ', err.message);
					} else {
						console.log('Game library updated for ', currUser);
						res.json({ response: "Game removed." });
					}
				});
			} else {
				res.status(404).json({ error: 'User not found' }); // Handle the user not found response
			}
		}
	});
}


function checkLogin(req, res) {
	let user = req.body.uName;
	let pass = req.body.pWord;

	db.get('SELECT * FROM users WHERE username = ?', [user], (err, row) => {
		if (err) {
			console.error('Error searching for user:', err.message);
			res.status(401).json({ message: "Login failed. Invalid credentials." });
		} else {
			if (row) {
				console.log('Login successful.');
				userLoggedIn = true;
				currUser = row.username;
				res.redirect("http://localhost:3000/");
			} else {
				res.status(401).json({ message: "Login failed. Invalid credentials." });
			}
		}
	});
}

function checkLogin(req, res) {
	let user = req.body.uName;
	let pass = req.body.pWord;

	db.get('SELECT * FROM users WHERE username = ?', [user], (err, row) => {
		if (err) {
			console.error('Error searching for user:', err.message);
			res.status(401).json({ message: "Login failed. Invalid credentials." });
		} else {
			if (row) {
				// Check if the password matches
				if (pass === row.password) {
					console.log('Login successful.');
					userLoggedIn = true;
					currUser = row.username;
					res.redirect("http://localhost:3000/");
				} else {
					res.status(401).json({ message: "Login failed. Invalid credentials." });
				}
			} else {
				res.status(401).json({ message: "Login failed. Invalid credentials." });
			}
		}
	});
}



function signUp(req, res) {
	let user = req.body.uName;
	let pass = req.body.pWord;

	const newUser = {
		username: user,
		password: pass,
		game_library: [],
		recommended_games: [],
	};

	db.run(`INSERT INTO users (username, password, game_library, recommended_games)
				  VALUES (?, ?, ?, ?)`, [newUser.username, newUser.password, JSON.stringify(newUser.game_library), JSON.stringify(newUser.recommended_games)], (err) => {
		if (err) {
			console.error('Error inserting new user:', err.message);
			res.status(401).json({ message: "Sign up failed." });
		} else {
			console.log('New user inserted successfully');
			userLoggedIn = true;
			currUser = newUser.username;
			res.redirect("http://localhost:3000/");
		}
	});
}


function surveyRetrieved(req, res) {
	let userData = req.body;
	let username = currUser;

	// Create a SQL update query
	let query = `
    UPDATE users
    SET genres = ?
    WHERE username = ?
  	`;

	// Execute the query with the user's data and username
	db.run(query, [JSON.stringify(userData), username], (err) => {
		if (err) {
			console.error('Error updating genres:', err.message);
			res.status(500).json({ error: 'Internal Server Error' });
		} else {
			computeRecommendations(userData, res);

			console.log(`Genres updated for user: ${username}`);
		}
	});
}


function queryDatabase(query, params) {
	return new Promise((resolve, reject) => {
		db.all(query, params, (err, rows) => {
			if (err) {
				console.error(err.message);
				reject(err);
				return;
			}

			resolve(rows);
		});
	});
}

async function getGamesByGenre(genresObject) {
	let genres = Object.keys(genresObject);

	// Create a list of conditions for each genre
	let conditions = genres.map(genre => `',' || genre || ',' LIKE ?`).join(' OR ');

	// Build the SQL query with the conditions
	let query = `SELECT * FROM games WHERE ${conditions}`;

	// Create an array of LIKE patterns for each genre
	let likePatterns = genres.map(genre => `%,${genre},%`);

	try {
		const rows = await queryDatabase(query, likePatterns);
		let filteredGames = rows.map(row => ({
			rank: row.rank,
			appid: row.appid,
			genres: row.genre,
		}));
		return filteredGames;
	} catch (error) {
		throw error;
	}
}


async function computeRecommendations(genres, res) {
	let games = await getGamesByGenre(genres);

	// Normalize user preferences
	let totalPreference = Object.values(genres).reduce((a, b) => a + b, 0);
	let normalizedPreferences = {};

	for (let genre in genres) {
		normalizedPreferences[genre] = genres[genre] / totalPreference;
	}


	// Calculate recommendation scores for each game
	let gamesWithScores = games.map(game => {
		let genreScore = game.genres.split(',').reduce((score, genre) => {
			let trimmedGenre = genre.trim();
			return score + (normalizedPreferences[trimmedGenre] || 0);
		}, 0);
		let popularityScore = game.rank;

		// Calculate the recommendation score (you can adjust the weighting)
		game.recommendationScore = genreScore + popularityScore;
		return game;
	});

	// Sort games by recommendation score
	let sortedGames = gamesWithScores.sort((a, b) => b.recommendationScore - a.recommendationScore);

	// Return the top 10 recommended games
	let topRecommendations = sortedGames.slice(0, 10);

	let recGames = JSON.stringify(topRecommendations);

	// SQL statement to update the 'recommended_games' column
	let newQuery = `UPDATE users SET recommended_games = ? WHERE username = ?`;

	// Execute the update statement
	db.run(newQuery, [recGames, currUser], function (err) {
		if (err) {
			console.error('Error updating recommended games:', err.message);
		} else {
			console.log(`Updated recommended games for user with ID ${currUser}`);
			res.status(200).json({ message: 'Genres updated successfully' });
		}
	});
}


function signOut(req, res) {
	userLoggedIn = false;
	currUser = null;
	res.status(200).json({ message: "Sign-out successful" });
}





// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});