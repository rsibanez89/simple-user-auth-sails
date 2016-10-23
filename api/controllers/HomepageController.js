/**
 * HomepageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next) {
    console.log("HomepageController  was called");
		Message.find(function messagesFounded(err, messages) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.view('homepage',
            {
                'messages': messages
            });
        });
	}

};
