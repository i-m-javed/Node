const express = require("express");

const storeRouter = express.Router();

const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/home", storeController.getHome);
storeRouter.get("/homes/:homeID", storeController.getHomeDetails);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favorites", storeController.getFavorites);
storeRouter.post("/add-favorites", storeController.postAddFavorites);
storeRouter.post("/remove-favorites", storeController.postRemoveFavorites);
storeRouter.get("/reserve", storeController.getReserve);
storeRouter.post("/add-reserves", storeController.postAddReserves);
storeRouter.post("/remove-reserve", storeController.postRemoveReserves);
storeRouter.post("/book", storeController.postBooking);
storeRouter.get("/clearBookings", storeController.getClearBookings);
storeRouter.post("/clearBookings", storeController.postClearBookings);

module.exports = storeRouter;
