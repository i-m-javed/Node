const Home = require("../models/home");
const fs = require("fs");
const path = require("path");
exports.getHostPage = (req, res) => {
  res.render("host/host-page", {
    pageTitle: "Host",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};
exports.getAddPage = (req, res) => {
  res.render("host/addPage", {
    pageTitle: "Add-Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditPage = (req, res) => {
  Home.find()
    .then((homes) => {
      res.render("host/edit&deletePage", {
        homes: homes,
        pageTitle: "Edit-Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => {
      return res.status(404).render("404Page", {
        pageTitle: "Page Not Found",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
};

exports.getDeletePage = (req, res) => {
  Home.find()
    .then((homes) => {
      res.render("host/edit&deletePage", {
        homes: homes,
        pageTitle: "Delete-Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("404Page", {
        pageTitle: "Page Not Found",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
};

exports.postAddHome = (req, res) => {
  const { name, location, description, price, rating } = req.body;

  if (!req.files || !req.files["photo"] || req.files["photo"].length === 0) {
    return res.status(400).send({ message: "Please upload an image" });
  }

  const photo = req.files["photo"] ? req.files["photo"][0].path : null;
  const rulesPdf = req.files["pdf"] ? req.files["pdf"][0].path : null;
  

  const addHome = new Home({
    name,
    location,
    description,
    price,
    rating,
    photo,
    rules: rulesPdf,
  });

  addHome.save().then(() => {
    console.log("Home Added");
  });
  res.render("host/homeAdded", {
    pageTitle: "Home-Added",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        res.status(404).render("404Page", {
          pageTitle: "Page Not Found",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      } else {
        res.render("host/homeEdit", {
          pageTitle: "Home-Edit",
          home: home,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("404Page", {
        pageTitle: "Error",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
};

exports.postEditHome = (req, res) => {
  const { name, location, description, price, rating, id } = req.body;

  Home.findById(id)
    .then((home) => {
      if (!home) {
        return res.status(404).render("404Page", {
          pageTitle: "Page Not Found",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }

      // Check if a new photo is uploaded
      if (req.files && req.files["photo"] && req.files["photo"].length > 0) {
        const newPhotoPath = req.files["photo"][0].path;

        // Delete the old photo
        if (home.photo) {
          const oldPhotoPath = path.join(__dirname, "..", home.photo);
          fs.unlink(oldPhotoPath, (err) => {
            if (err) {
              console.log("Failed to delete old photo:", err);
            } else {
              console.log("Old photo deleted successfully");
            }
          });
        }

        home.photo = newPhotoPath;
      }
      // Check if a new rules PDF is uploaded
      if (req.files && req.files["pdf"] && req.files["pdf"].length > 0) {
        const newRulesPath = req.files["pdf"][0].path;

        // Delete the old rules PDF
        if (home.rules) {
          const oldRulesPath = path.join(__dirname, "..", home.rules);
          fs.unlink(oldRulesPath, (err) => {
            if (err) {
              console.log("Failed to delete old rules PDF:", err);
            } else {
              console.log("Old rules PDF deleted successfully");
            }
          });
        }

        home.rules = newRulesPath;
      }
      // Update other fields

      home.name = name;
      home.location = location;
      home.description = description;
      home.price = price;
      home.rating = rating;
      return home.save();
    })
    .then(() => {
      Home.find()
        .then((homes) => {
          res.render("host/edit&deletePage", {
            homes: homes,
            pageTitle: "Edit-Home",
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(404).render("404Page", {
            pageTitle: "Page Not Found",
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.getDeleteHome = (req, res) => {
  const homeId = req.params.homeId;

  Home.findByIdAndDelete(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).render("404Page", {
          pageTitle: "Page Not Found",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }

      if (home.photo) {
        const photoPath = path.join(__dirname, "..", home.photo);
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.log("Failed to delete photo:", err);
          } else {
            console.log("Photo deleted successfully");
          }
        });
      }

      if (home.rules) {
        const rulesPath = path.join(__dirname, "..", home.rules);

        fs.unlink(rulesPath, (err) => {
          if (err) {
            console.log("Failed to delete rules PDF:", err);
          } else {
            console.log("Rules PDF deleted successfully");
          }
        });
      }

      // Render updated home list
      Home.find()
        .then((homes) => {
          res.render("host/edit&deletePage", {
            homes: homes,
            pageTitle: "Delete-Home",
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
          });
        })
        .catch((err) => {
          console.error("Error fetching homes after deletion:", err);
          return res.status(404).render("404Page", {
            pageTitle: "Page Not Found",
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
          });
        });
    })
    .catch((err) => {
      console.error("Error deleting home:", err);
      return res.status(404).render("404Page", {
        pageTitle: "Page Not Found",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
};
