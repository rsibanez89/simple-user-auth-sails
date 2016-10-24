# Example application to learn how to authenticate users in sails by using sails-auth
Simple Nodejs + Sailsjs application that allows to post messages to authenticated users.

![Build Status](https://travis-ci.org/rsibanez89/simple-user-auth-sails.svg?branch=master)

## Runing the example
1. Clon the repository

2. Install the project dependencies

	```sh
	$ cd simple-user-auth-sails
	$ npm install
	```
3. Start the app

	```sh
	$ sails lift
	```

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

We can check the console output and see that **marlinspike** is loading Models, Controllers and Policies that we didn't create.

	...
	debug: marlinspike (auth): loading Models...
	debug: marlinspike (auth): loading Controllers...
	debug: marlinspike (auth): loading Policies...
	...

For example, if we go to http://localhost:1337/user	we have a user controller. We can create, delete, update users.

That controller is defined in "/node_modules/sails-auth/api/controllers/"

In older version of **sails-auth**, there used to be a **generator** instead of **marlinspike**.

The **generator** used to copy all the necesary files in our project but now if we need to change something we have to override the original methods.

### Creating users
1. Remove all the content form the "view/homepage.ejs", we are not going to need it. Add the following HTML code.

	```html
	<div id="registerNewUser">
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
	
2. Start the app and go to http://localhost:1337/ to create new users.

### Authenticating users
1. Modify the "view/homepage.ejs" to allow users to login. Add the following HTML code.

	```html
	<div id="loginUser">
	  <h1>Login</h1>

	  <form action="/auth/local" method="post">
		<div class="field-wrap">
		  <label>Email <span class="req">* </span></label>
		  <input name="identifier" type="text" required />
		</div>

		<div class="field-wrap">
		  <label>Password <span class="req">* </span></label>
		  <input name="password" type="password">
		</div>

		<button type="submit" class="button"/>Login</button>
	  </form>

	</div>
	```

Then, wrap all the contet of the "view/homepage.ejs" inside the following HTML code.

	<% if(session.authenticated) { %>
		<h1> Authenticated User </h1>
	<% } else { %>
		// CONTENT
	<% } %>

Now we can login and if we go to the **homepage** we will see that we are authenticated.

### Creating the logic for posting messages

1. Follow the steps described in [posting messages](https://github.com/rsibanez89/simple-post-messages-sails#posting-messages) but don't modify the "view/homepage.ejs"

2. Now, modify the "view/homepage.ejs" to show the stored messages and the post form instead of showing the message "Authenticated User".

	```html
	<% if(session.authenticated) { %>
		// MODIFY THIS SECTION
	<% } else { %>
		// CONTENT
	<% } %>
	```

3. Now, modify the "api/controllers/MessageController.js". The variable **req.user** contain the logged user.

	```js
	create: function(req, res){
		console.log("MessageController.create  was called");
		var messagesJSON = {
			author: req.user.username,
			email: req.user.email,
			content: req.param('content'),
		}

		Message.create(messagesJSON, function(err, message) {
			if (err) {
				console.log(err);
			}
			return res.redirect('homepage');
		});
	},

	destroy: function  (req, res, next) {
		console.log("MessageController.destroy  was called");
		Message.findOne(req.param('id')).exec(function (err, message){
  			if (err) {
    			console.log(err);
  			}
			if (message.email != req.user.email) {
					return res.status(403).json({ error: 'You can remove just your own messages '});
			}
			Message.destroy(req.param('id'), function(err) {
				if(err){
					console.log(err);
				}
				res.redirect('homepage');
			});
		});
	}
	```

4. Now, modify the "config/policies.js" to allow just autenticated users to post and remove messages.

	```js
	'*': ['passport'],

	MessageController: {
	'*': ['passport', 'sessionAuth'],
	}
	```

### Redirecting after registering and loging users
1. For redirectic after login modify the "view/homepage.ejs". Change the action of the login form.

	```html
	<form action="/auth/local?next=/" method="post">
	```

Now, for redirectic after registering we have to override the **UserController** defined by sails-auth.

1. Create the **UserController** controller

	```sh
	$ sails generate controller user
	```
	
2. Remove all the content of the "api/controllers/UserController.js" and put the following code.

	```js
	var _ = require('lodash');
	var _super = require('sails-auth/api/controllers/UserController');

	_.merge(exports, _super);
	_.merge(exports, {

		// Extend with custom logic here by adding additional fields, methods, etc.

		create: function (req, res, next) {
			console.log("UserController.create  was called");

			// the register method is defined in sails-auth/services/protocols/local.js
			sails.services.passport.protocols.local.register(req.body, function (err, user) {
			  if (err)
				return res.negotiate(err);

			  return res.view('homepage',
					  {
						  'registerd': user.username
					  });
			});

		},

	});
	```

Now we have overriden the **create** method defined in "/node_modules/sails-auth/api/controllers/UserController.js".

3. Install **lodash**

	```sh
	$ npm install lodash --save
	```
	
4. Finally modify the "view/homepage.ejs" to show the registerd user after the registration.
