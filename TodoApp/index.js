// created using tutorial from https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-1-c645c7a27583

// require dependencies
const express = require("express");     //#dependencies
const app = express();      //#dependencies
const dotenv = require('dotenv');       
const mongoose = require('mongoose');

//models
const TodoTask = require("./models/TodoTask");      //#dependencies

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_CONNECT).then(()=> {
    console.log("Connected to db!");        //#IO
    app.listen(3000, () => console.log("Server Up and running"));
});

app.set("view engine", "ejs");

// GET METHOD (read from db) -- #CRUD
app.get("/", (req, res) => {
        TodoTask.find({}, (err, tasks) => {
            res.render("todo.ejs", { todoTasks: tasks });
        });
    });

//POST METHOD (add to db) -- #CRUD
app.post('/',async (req, res) => {
        const todoTask = new TodoTask({
            content: req.body.content
        });
        try {       //#controlflow
            await todoTask.save();
            res.redirect("/");
        } catch (err) {
            res.redirect("/");
        }
    });

//UPDATE (change in db) -- #CRUD
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;       //#variable
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });       //#render
        });
    })
    .post((req, res) => {
        const id = req.params.id;       //#parameters
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);     //#controlflow
            res.redirect("/");
        });
    });

//DELETE (delete from db) -- #CRUD
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;       //#parameters
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});