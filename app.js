const express = require("express");
const exphbs = require("express-handlebars");
const { Pool } = require("pg");
const config = require("./config");
const Todo = require("./schema");
const { default: mongoose } = require("mongoose");

const app = express();
// const pool = new Pool(config.database);

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://malnikast:Lnforte00@senecaweb.aklwkdq.mongodb.net/Todos?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected successfullsy");
  })
  .catch((err) => {
    console.log(err);
  });
// Routes
app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.render("index", { todos, layout: false });
});

app.post("/add", async (req, res) => {
  const task = req.body.task;

  if (task) {
    const todoItem = new Todo({ todo: task });
    await todoItem.save();
  }

  res.redirect("/");
});

app.post("/complete/:id", async (req, res) => {
  const id = req.params.id;

  if (id) {
    const updateItem = await Todo.findOneAndUpdate(
      { id },
      {
        completed: true,
      }
    );
  }

  res.redirect("/");
});

// app.get("/edit/:id", async (req, res) => {
//   const id = req.params.id;

//   if (id) {
//     const client = await pool.connect();
//     const result = await client.query("SELECT * FROM todos WHERE id = $1", [
//       id,
//     ]);
//     const todo = result.rows[0];
//     client.release();

//     res.render("edit", { todo, layout: false });
//   } else {
//     res.redirect("/");
//   }
// });

// app.post("/update/:id", async (req, res) => {
//   const id = req.params.id;
//   const task = req.body.task;

//   if (id && task) {
//     const client = await pool.connect();
//     await client.query("UPDATE todos SET task = $1 WHERE id = $2", [task, id]);
//     client.release();
//   }

//   res.redirect("/");
// });

// Add this route after the existing routes
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;

  if (id) {
    const deleteItem = await Todo.findOneAndDelete({ id });
    if (deleteItem) res.json("Succesfully deleted item");
  }

  res.redirect("/");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
