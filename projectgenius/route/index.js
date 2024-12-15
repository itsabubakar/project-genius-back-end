/**
 * @file routes for api endpoints
 * @author Simpa
 * @copyright Project Genius
 */

import { Router } from "express";
import AuthsController from "../controllers/AuthsController";
import FacultiesController from "../controllers/facultiesController";
import UsersController from "../controllers/usersController";
import TeamsController from "../controllers/teamsController";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Genius!");
});

router.get("/faculties/:id/depts", FacultiesController.getDeptsByFac);
router.get("/faculties", FacultiesController.getAll);
router.get("/teams", TeamsController.getAll);
router.post("/auth/connect", AuthsController.connect);
router.post("/users/finalize", UsersController.finalizeSignUp);
router.post("/users", UsersController.initiateSignUp);

module.exports = router;
