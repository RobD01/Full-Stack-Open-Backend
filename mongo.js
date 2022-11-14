// View database : enter command [ npm run mongo <password> ]
// Add person: enter command [ npm run mongo <password> <name> <number>]

const mongoose = require("mongoose");

// Environment variables

if (process.argv.length < 1) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Authentication
const password = process.argv[2];

const url = `mongodb+srv://rob:${password}@cluster0.n56um24.mongodb.net/phonebook?retryWrites=true&w=majority`;

// Item model, schema

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

// Database entry

//   Get all names
if (!process.argv[3]) {
  mongoose.connect(url).then((result) => {
    console.log("connected");

    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
  });
}

//   New data
else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name,
        number,
      });

      return person.save();
    })

    .then(() => {
      console.log(`Added name: ${name} | number : ${number} to phonebook`);
      return mongoose.connection.close();
    })

    .catch((err) => console.log(err));
}
