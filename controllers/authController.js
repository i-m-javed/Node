const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLoginPage = (req, res, next) => {
  res.render("auth/loginPage", {
    pageTitle: "Login",
    isLoggedIn: false,
    errors: [],
    oldInputs: {},
    user: {},
  });
};

exports.postLoginPage = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (user && isPasswordMatched) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/");
  } else {
    res.render("auth/loginPage", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: ["Invalid email or password."],
      oldInputs: email,
      user: {},
    });
  }
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy(); // destroy is a async call
  res.redirect("/");
};

exports.getSignUpPage = (req, res) => {
  res.render("auth/signUpPage", {
    pageTitle: "SignUp",
    isLoggedIn: req.session.isLoggedIn,
    errors: [],
    oldInputs: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    user: {},
  });
};

exports.postSignUpPage = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isAlpha()
    .withMessage("First name must contain only letters.")
    .isLength({ min: 2, max: 20 })
    .withMessage("First name must be between 2 and 20 characters."),

  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isAlpha()
    .withMessage("Last name must contain only letters.")
    .isLength({ min: 2, max: 20 })
    .withMessage("Last name must be between 2 and 20 characters."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*)."
    )
    .matches(/^\S*$/)
    .withMessage("Password must not contain spaces."),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type.")
    .isIn(["guest", "host"])
    .withMessage("Please select a valid user type."),

  check("terms").equals("on").withMessage("You must accept the terms."),

  async (req, res) => {
    const { firstName, lastName, email, userType, password, confirmPassword } =
      req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).render("auth/signUpPage", {
        pageTitle: "SignUp",
        isLoggedIn: req.session.isLoggedIn,
        errors: error.array().map((err) => err.msg),
        oldInputs: {
          firstName,
          lastName,
          email,
          userType,
          password,
          confirmPassword,
        },
        user: {},
      });
    }

    try {
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        userType,
      });

      await user.save();
      res.redirect("/login");
    } catch (err) {
      return res.status(422).render("auth/signUpPage", {
        pageTitle: "SignUp",
        isLoggedIn: req.session.isLoggedIn,
        errors: [err.message],
        oldInputs: {
          firstName,
          lastName,
          email,
          userType,
          password,
          confirmPassword,
        },
        user: {},
      });
    }
  },
];

exports.getTermsAndConditions = (req, res) => {
  res.render("auth/terms&conditions", {
    pageTitle: "Terms&Conditions",
    isLoggedIn: req.session.isLoggedIn,
    user: {},
  });
};
