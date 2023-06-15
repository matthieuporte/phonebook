const mongoose = require("mongoose");

if (process.argv.length<3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url =
    "mongodb+srv://matthiru:JOaYa1wed2Su8NwW@cluster0.mzq3y2t.mongodb.net/phoneBook?retryWrites=true&w=majority";

mongoose.set("strictQuery",false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);



if (process.argv.length === 3){
	Person.find({}).then(result => {
		result.forEach(pers => {
			console.log(pers);
		});
		mongoose.connection.close();
	});
}
else if (process.argv.length === 5){
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(result => {
		console.log(person.name + " has been successfully saved to the phonebook!");
		mongoose.connection.close();
	});

}
else{
	console.log("wrong number of arguments");
	process.exit(1);
}
