
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");


app.use(cors());
app.use(express.json());
app.use(express.static("build"));


const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

app.use(requestLogger);

//list all
app.get("/api/persons", (request, response) => {
	Person.find({}).then(pers => {
		response.json(pers);
	});
});

//get just one
app.get("/api/persons/:id", (request, response,next) => {
	Person.findById(request.params.id).then(pers => {
		if (pers){
			response.json(pers);
		} else {
			response.status(404).end();
		}
	}).catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name,number } = request.body;

	Person.findByIdAndUpdate(request.params.id, { name,number }, { new: true, runValidators: true, context: "query" })
		.then(updatedPers => {
			response.json(updatedPers);
		})
		.catch(error => next(error));
});

//delete
app.delete("/api/persons/:id",(request,response,next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

//create
app.post("/api/persons/",(request,response,next) => {
	const body = request.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number
	});

	newPerson.save().then(saved => {
		response.json(saved);
	}).catch(error => next(error));

});

//overall info
app.get("/info", (request, response) => {
	let dateObj = new Date();
	let month = dateObj.getUTCMonth() + 1; //months from 1-12
	let day = dateObj.getUTCDate();
	let hours = (dateObj.getUTCHours()+2)%24;
	let minutes = dateObj.getUTCMinutes();
	let seconds = dateObj.getUTCSeconds();
	let year = dateObj.getUTCFullYear();

	let newdate = "The request was received at " + hours + ":" + minutes + ":" + seconds + "UTC+2 - " + day + "/" + month + "/" + year;

	let countPersons = 0;

	Person.countDocuments().then(function (models) {
		countPersons = models;
		response.send("<a href=\"/\">home</a><br/><p>The phonebook has info for " + countPersons +  " people<br/><br/>"  + newdate  + "</p>");
	});

});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "It seems that you got lost :(" });
};


app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});