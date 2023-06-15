require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url)

	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		validate: {
			validator: function(v) {
				return /^[A-Za-z\s-]+$/.test(v);
			},
			message: props => `${props.value} is incorrect. Only letters, spaces and dashes are allowed!`
		},
		required: [true, "A name is required"]
	},
	number: {
		type: String,
		validate: {
			validator: function(v) {
				return /\d{2}[- ]{0,1}\d{2}[- ]{0,1}\d{2}[- ]{0,1}\d{2}[- ]{0,1}\d{2}/.test(v);
			},
			message: props => `${props.value} is not 10 numbers long, spaced with nothing, whitespace or dashes!`
		},
		required: [true, "A number is required"]
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});


module.exports = mongoose.model("Person", personSchema);