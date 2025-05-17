const express = require("express");

const hostRouter = express.Router();
const multer = require("multer");

const hostController = require("../controllers/hostController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

hostRouter.get("/host/host-page", hostController.getHostPage);

hostRouter.get("/host/add-page", hostController.getAddPage);

hostRouter.get("/host/edit-page", hostController.getEditPage);

hostRouter.get("/host/delete-page", hostController.getDeletePage);

hostRouter.post(
  "/host/add-home",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  hostController.postAddHome
);

hostRouter.get("/host/edit-home/:homeId", hostController.getEditHome);

hostRouter.post(
  "/host/edit-home/:homeId",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  hostController.postEditHome
);

hostRouter.get("/host/delete-home/:homeId", hostController.getDeleteHome);

module.exports = hostRouter;
