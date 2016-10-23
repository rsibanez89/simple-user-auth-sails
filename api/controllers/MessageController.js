/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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

};
