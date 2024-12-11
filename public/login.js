function login() {
	let username = document.getElementById('loginUsername').value;
	let password = document.getElementById('loginPassword').value;

	if (username && password) {
		let data = { uName: username, pWord: password };

		// Send a POST request to the server with appid of the game
		fetch("/login/loginInfo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(response => {
            if (response.ok) {
                // Check if the response is a redirect
                if (response.redirected) {
                    // Redirect to the specified URL
                    window.location.href = response.url;
                } else {
                    alert('Login successful'); // You can replace this with a suitable notification
                }
            } else {
                alert('Login failed');
            }
        });
	}
}


function signUp() {
	let username = document.getElementById('signupUsername').value;
	let password = document.getElementById('signupPassword').value;

	if (username && password) {
		let data = { uName: username, pWord: password };

		// Send a POST request to the server with appid of the game
		fetch("/login/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(response => {
            if (response.ok) {
                // Check if the response is a redirect
                if (response.redirected) {
                    // Redirect to the specified URL
                    window.location.href = response.url;
                } else {
                    alert('Sign successful'); // You can replace this with a suitable notification
                }
            } else {
                alert('Signup failed. Username might already exist in the system.');
            }
        });
	}
}





/*
	<div style="text-align: center;">
		<h2>Login</h2>
		<form action="#" method="post">
			<input type="text" id="loginUsername" name="loginUsername" placeholder="Username" required><br><br>
			<input type="password" id="loginPassword" name="loginPassword" placeholder="Password" required><br><br>
			<button type="submit" onclick="login()">Login</button>
		</form>
		<br /><br />
		<p>Don't have an account?</p>
	</div>

	<div id="signup" style="text-align: center;">
		<h2>Sign Up</h2>
		<form action="#" method="post">
			<input type="text" id="signupUsername" name="signupUsername" placeholder="Username" required><br><br>
			<input type="password" id="signupPassword" name="signupPassword" placeholder="Password" required><br><br>
			<button type="submit" onclick="signUp()">Sign Up</button>
		</form>
	</div>*/