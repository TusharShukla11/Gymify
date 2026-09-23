const express = require("express");

const {
  create,
  getAll,
  getOne,
  update,
  deactivate,
} = require("../controllers/trainerController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const trainerController = require("../controllers/trainerController");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("ADMIN"),
  create
);

router.get(
  "/",
  authorizeRoles("ADMIN", "TRAINER"),
  getAll
);

router.get(
  "/:id",
  authorizeRoles("ADMIN", "TRAINER"),
  getOne
);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TRAINER"),
  trainerController.getTrainers
);

router.put(
  "/:id",
  authorizeRoles("ADMIN"),
  update
);

router.patch(
  "/:id/deactivate",
  authorizeRoles("ADMIN"),
  deactivate
);

module.exports = router;