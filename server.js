let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();
let uuid = require("uuid");

app.use(express.static('public'));

app.use(morgan("dev"));

let blogPosts = [
	{
		id: uuid.v4(),
		title: "first post",
		content: "this is the first one",
		author: "me",
		publishDate: "23/10/2019"
	},
	{
		id: uuid.v4(),
		title: "second post",
		content: "this is the second one",
		author: "juan",
		publishDate: "23/10/2019"
	},
	{
		id: uuid.v4(),
		title: "third post",
		content: "this is the third one",
		author: "pedro",
		publishDate: "23/10/2019"
	}
];

app.get("/blog-posts", (req, res, next) =>{
	return res.status(200).json(blogPosts);
});

app.get("/blog-post", (req, res, next) =>{
	if (!req.query.author){
		res.statusMessage = "Author is missing in params";
		return res.status(406).json({
			status: 406,
			message: "Author is missing in params"
		});
	}

	for (let post of blogPosts) {
		if (post.author == req.query.author){
			return res.status(200).json(post);
		}
	}

	res.statusMessage = "Name of author doesn't exist";
	return res.status(404).json({
		status: 404,
		message: "Name of author doesn't exist"
	});

});

app.post("/blog-posts", jsonParser, (req, res) =>{
	let newPost = {
		id: uuid.v4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}

	if (newPost.title == "" || newPost.content  == "" || newPost.author  == "" || newPost.publishDate  == "") {
		res.statusMessage = "Missing parameter(s)";
		return res.status(406).json({
			status: 406,
			message: "Missing parameter(s)"
		});
	}

	blogPosts.push(newPost);
	res.statusMessage = "Post added successfully";
	return res.status(201).json({
		status: 201,
		message: "Post added successfully"
	})
});

app.delete("/blog-posts/:id", (req, res) =>{
	let id = req.params.id;

	for (let i=0; i<blogPosts.length; i++) {
		if (blogPosts[i].id == id) {
			blogPosts.splice(i, 1);

			res.statusMessage = "Post deleted successfully";
			return res.status(200).json({
				status: 200,
				message: "Post deleted successfully"
			});
		}
	}

	res.statusMessage = "ID not found";
	return res.status(404).json({
		status: 404,
		message: "ID not found"
	});
});

app.put("/blog-posts/:id", jsonParser, (req, res) =>{
	if (!req.body.id) {
		res.statusMessage = "Missing Id in body";
		return res.status(406).json({
			status: 406,
			message: "Missing Id in body"
		});
	}

	if (req.body.id != req.params.id) {
		res.statusMessage = "Id in params doesn't match the one in the body";
		return res.status(409).json({
			status: 409,
			message: "Id in params doesn't match the one in the body"
		});
	}

	let newPost = {
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}

	for (let i=0; i<blogPosts.length; i++) {
		if (blogPosts[i].id == req.body.id) {
			if(newPost.title == "")
				newPost.title = blogPosts[i].title;
			if(newPost.author == "")
				newPost.author = blogPosts[i].author;
			if(newPost.content == "")
				newPost.content = blogPosts[i].content;
			if(newPost.publishDate == "")
				newPost.publishDate = blogPosts[i].publishDate;
			blogPosts.splice(i, 1, newPost);

			res.statusMessage = "Successfully updated passed parameters";
			return res.status(202).json(newPost);
		}
	}

	res.statusMessage = "ID not found";
	return res.status(404).json({
		status: 404,
		message: "ID not found"
	});

});

app.listen("8080", ()=> {
	console.log("Something is going on on port 8080");
});
