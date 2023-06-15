const infoRouter = require("express").Router();
const Person = require("../models/person");

infoRouter.get("/info", (request, response) => {
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

module.exports = infoRouter;