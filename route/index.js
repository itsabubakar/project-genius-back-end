/**
 * @file routes for api endpoints
 * @author Simpa
 * @copyright Project Genius
 */

import { Router } from "express";
import AuthsController from "../controllers/AuthsController";
import FacultiesController from "../controllers/FacultiesController";
import UsersController from "../controllers/UsersController";
import TeamsController from "../controllers/TeamsController";
import AppController from "../controllers/AppController";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Genius!");
});

router.post("/auth/reset", AuthsController.reset);
router.post("/auth/reset/finalize", AuthsController.finalizeReset);
router.delete("/auth/disconnect", AuthsController.disconnect);
router.get("/app/dashboard/:id", AppController.dashboard);
router.get("/faculties/:id/depts", FacultiesController.getDeptsByFac);
router.get("/faculties", FacultiesController.getAll);
router.get("/teams", TeamsController.getAll);
router.post("/auth/connect", AuthsController.connect);
router.post("/users/finalize", UsersController.finalizeSignUp);
router.post("/users", UsersController.initiateSignUp);
router.put('/users/:id', UsersController.updateUser);

module.exports = router;
