# Example application to learn how to authenticate users in sails
Simple Nodejs + Sailsjs application that allows to post messages to authenticated users.

## Doing it yourself
### Setting up the environment
1. Install nodejs (https://nodejs.org/)
2. Install sails (remember to use admin rights when open CMD, I'm using windows)

	```sh
	$ npm -g install sails
	```
	
3. Create a new sails project

	```sh
	$ sails new simple-user-auth-sails
	```
	
4. Start the app

	```sh
	$ cd simple-user-auth-sails
	$ sails lift
	```

5. Go to http://localhost:1337/

Nothing new, that is the staring guide from sails (http://sailsjs.org/get-started)

### Installing sails-auth in your project
1. Install sails-auth

	```sh
	$ npm install sails-auth --save
	```

2.	Start the app

	```sh
	$ sails lift
	```

We can check the console and see that **marlinspike** is loading Models, Controllers and Policies that we didn't create.

	```sh
	...
	debug: marlinspike (auth): loading Models...
	debug: marlinspike (auth): loading Controllers...
	debug: marlinspike (auth): loading Policies...
	...
	```

For example, if we go to http://localhost:1337/user	we have a user controller. We can create, delete, update users.
That controller is defined in \node_modules\sails-auth\api\controllers

3. Remove all the content form the "view/homepage.ejs", we are not going to need it. Add the following HTML code.

	```html
	<div id="newUser">
	  <h1>Register</h1>

	  <form action="/user" method="post">
		<div class="field-wrap">
		  <label>Username <span class="req">* </span></label>
		  <input name="username" type="text" required />
		</div>

		<div class="field-wrap">
		  <label>Email Address <span class="req">* </span></label>
		  <input name="email" type="email" required />
		</div>

		<div class="field-wrap">
		  <label>Password <span class="req">* </span></label>
		  <input name="password" type="password">
		</div>

		<button type="submit" class="button"/>Register</button>
	  </form>

	</div>
	```
	
4. Start the app and go to http://localhost:1337/ to create new users.
