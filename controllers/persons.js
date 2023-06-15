const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response) => {
	Person.find({}).then(pers => {
		response.json(pers);
	});
});

//get just one
personsRouter.get("/:id", (request, response,next) => {
	Person.findById(request.params.id).then(pers => {
		if (pers){
			response.json(pers);
		} else {
			response.status(404).end();
		}
	}).catch(error => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
	const { name,number } = request.body;

	Person.findByIdAndUpdate(request.params.id, { name,number }, { new: true, runValidators: true, context: "query" })
		.then(updatedPers => {
			response.json(updatedPers);
		})
		.catch(error => next(error));
});

//delete
personsRouter.delete("/:id",(request,response,next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

//create
personsRouter.post("/",(request,response,next) => {
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


module.exports = personsRouter;