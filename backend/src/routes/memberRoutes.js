const express = require("express");

const {
  create,
  getAll,
  getOne,
  update,
  deactivate,
  getMembers
} = require("../controllers/memberController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const memberController = require("../controllers/memberController");

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
  memberController.getMembers
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