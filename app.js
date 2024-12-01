const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//index route to show files.

app.get("/", (req, res) => {
  fs.readdir("./files", function (err, files) {
    if (err) throw err;
    else res.render("index", { files });
  });
});

//creating route
app.get("/create", (req, res) => {
  res.render("create");
});
//writing content in given filename.

app.post("/writefile", (req, res) => {
  const currentDate = new Date();
  var date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}.txt`;

  fs.writeFile(`./files/${date}`, req.body.filedata || "", function (err) {
    if (err) {
      console.error("File Write Error:", err);
      return res.send("Something went wrong while creating the file.");
    } else res.redirect("/");
  });
});
//reading particular file and render it to hisaab.ejs file.

app.get("/hisaab/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.send(err);
    else res.render("hisaab", { data, filename: req.params.filename });
  });
});
//taking filename to edit particular content of that file and render to edit.ejs file.

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.send("Cannot able to read File");
    else res.render("edit", { data, filename: req.params.filename });
  });
});

//now rewrite the edited contant of that particular date and redirect to index page.

app.post("/edited/:filename", (req, res) => {
  fs.writeFile(
    `./files/${req.params.filename}`,
    req.body.editdata,
    function (err) {
      if (err) return res.send("Not able to edit this file");
      else res.redirect("/");
    }
  );
});

//here delete the particular file that we want to delete.

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) return req.send("Not able to delete this file.");
    else res.redirect("/");
  });
});

app.listen(3000);
