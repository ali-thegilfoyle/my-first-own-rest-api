const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// port
const port = 3000;

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//! note the comment.
mongoose.connect("add url of mongodb local host/database for storing articles", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// write schema for article collection.
const articleSchema = {
  name: String,
  content: String,
};

// create a model for above schema.
const Article = mongoose.model("Article", articleSchema);

// home route.
app.get("/", function (req, res) {
  res.send("hello world");
});

// articles route.
app
  .route("/articles")
  // get route.
  .get(function (req, res) {
    Article.find(function (error, foundArticles) {
      if (error) {
        res.send(error);
      } else {
        res.send(foundArticles);
      }
    });
  })
  // post route.
  .post(function (req, res) {
    // add new article document to Article collection.
    const newArticle = new Article({
      name: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (error) {
      if (error) {
        res.send(error);
      } else {
        res.send("Successfully added to the articles.");
      }
    });
  })
  // delete route.
  .delete(function (req, res) {
    Article.deleteMany(function (error) {
      if (error) {
        res.send(error);
      } else {
        res.send("Successfully deleted all the documents.");
      }
    });
  });

// route for the specific article.
app
  .route("/articles/:articleTitle")
  // get route for specific article.
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (error, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article matched with that title.");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      {
        title: req.body.title,
        content: req.body.content,
      },
      //   we externally say to mongoose to overwrite the previous record. so it will change the sturcture of document as well.
      { overwrite: true },
      function (error) {
        if (error) {
          res.send(error);
        } else {
          res.send("Updated successfully!");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      // req.body will be the javaScript object containning the parameters passed in the request body.
      { $set: req.body },
      function (error) {
        if (error) {
          res.send(error);
        } else {
          res.send("Updated successfully!");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (error) {
      if (error) {
        res.send(error);
      } else {
        res.send("Deleted successfully!");
      }
    });
  });

app.listen(port, function () {
  console.log(`Server is started at : http://localhost:${port}`);
});
