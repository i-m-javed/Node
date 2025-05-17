const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res) => {
  const user = req.session.user;
  if (!user || !req.session.isLoggedIn) {
    res.render("store/index", {
      pageTitle: "Home - page",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } else if (user.userType === "host") {
    res.render("host/indexHost", {
      pageTitle: "Home - page",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } else if (user.userType === "guest") {
    res.render("store/indexGuest", {
      pageTitle: "Home - page",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.getHome = (req, res) => {
  Home.find()
    .then((addedHome) =>
      res.render("store/home-list", {
        homes: addedHome,
        pageTitle: "Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getFavorites = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favorites");
  res.render("store/favorite-list", {
    homes: user.favorites,
    pageTitle: "favorites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddFavorites = async (req, res) => {
  const HomeId = req.body.id;

  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.favorites.includes(HomeId)) {
    user.favorites.push(HomeId);
    await user.save();
  }

  res.redirect("/favorites");
};

exports.postRemoveFavorites = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favorites.includes(homeId)) {
    user.favorites.pull(homeId);
    await user.save();
  }
  res.redirect("/favorites");
};

exports.getReserve = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("reserves");

  res.render("store/reserve", {
    homes: user.reserves,
    pageTitle: "Reserve",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddReserves = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;

  const user = await User.findById(userId);

  if (!user.reserves.includes(homeId)) {
    user.reserves.push(homeId);
    await user.save();
  }
  res.redirect("/reserve");
};

exports.postRemoveReserves = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;

  const user = await User.findById(userId);

  if (user.reserves.includes(homeId)) {
    user.reserves.pull(homeId);
    await user.save();
  }
  res.redirect("/reserve");
};

exports.get404Page = (req, res) => {
  res.status(404).render("404Page", {
    pageTitle: "Page Not Found",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getBookings = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("booked");
  res.render("store/bookings", {
    homes: user.booked,
    pageTitle: "Bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postBooking = async (req, res) => {
  const HomeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.booked.includes(HomeId)) {
    user.booked.push(HomeId);
    await user.save();
  }

  if (user.favorites.includes(HomeId)) {
    user.favorites.pull(HomeId);
    await user.save();
  }
  res.redirect("/bookings");
};

exports.getClearBookings = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("booked");

  res.render("store/clearBookings", {
    homes: user.booked,
    pageTitle: "Bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postClearBookings = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.booked.includes(homeId)) {
    user.booked.pull(homeId);
    await user.save();
  }
  res.redirect("/clearBookings");
};

exports.getHomeDetails = (req, res) => {
  const homeID = req.params.homeID;
  Home.findById(homeID)
    .then((home) => {
      if (home) {
        res.render("store/home-detail", {
          pageTitle: "Home Details",
          home: home,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      } else {
        res.status(404).render("404Page", {
          pageTitle: "Page Not Found",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }
    })
    .catch((err) => console.log(err));
};
