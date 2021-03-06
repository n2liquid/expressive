var post = require('../post');

module.exports = function (app) {
	app.post('/post/comment', function (req, res) {
		if (req.session.user) {
			req.body.name = req.session.user.name;
		}

		if(process.env.DISABLE_COMMENTS) {
			res.push_message('danger', 'Sorry, but comments are currently disabled, boo! :(');
			res.redirect('/');

			return;
		}

		if(req.body['damn-robots'].trim().toLowerCase() !== 'yellow') {
			res.push_message('danger', "Sorry, but that's not this blog's header color...");
			res.redirect('/');

			return;
		}

		post.comment(req.body.post_id, req.body.name, req.body.body, function (err) {
			if (err) {
				res.push_error_object(err);
				res.redirect('/');

				return;
			}

			res.push_message('success', 'Comment published. Thanks!');

			res.redirect('/');
		});
	});
};
