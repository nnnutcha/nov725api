'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log('UserList API Server is running on port ' + port);
});

mongoose.connect('mongodb+srv://nsirichaiporn:1234@fullstackwebdevelopment.lwdut.mongodb.net/UserList', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log('UserList API Server is running on port ' + port);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id: { type: Number, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Username: { type: String, unique: true }
});

const Users = mongoose.model('User', userSchema);

const router = express.Router();
app.use('/api/users', router);

router.route("/").get((req, res) => {
    console.log("Fetching all users...");
    Users.find()
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
    console.log(req.params.id);
    const id = Number(req.params.id);
     Users.findOne({ Id: id })
        .then((user) => res.json(user)) 
        .catch((err) => res.status(400).json("Error: " + err)); 
});


router.route("/add").post((req, res) => {
    const Id = parseInt(req.query.Id, 10); 
    const { Email, Username } = req.query; 
    const newUser = new Users({
         Id, Email, Username
    });
    
    newUser.save()
        .then(() => res.json("User added!")) 
        .catch((err) => res.status(400).json("Error: " + err)); 
});

router.route("/update/:id").put((req, res) => {
    const id = Number(req.params.id);
    Users.findOne({ Id: id })
        .then((user) => {
            user.Email = req.query.Email;
            user.Username = req.query.Username;

            user.save() 
                .then(() => res.json("User updated!"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
    const id = Number(req.params.id);
    Users.findOneAndDelete({ Id: id })
        .then(() => res.json("User deleted.")) 
        .catch((err) => res.status(400).json("Error: " + err)); 
});