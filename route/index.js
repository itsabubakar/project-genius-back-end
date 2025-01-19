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

router.post("/app/contact", AppController.contactUs);
router.get("/app/dashboard", AppController.dashboard);
router.post("/app/payment/hook", AppController.paymentHook);
router.post("/auth/connect", AuthsController.connect);
router.delete("/auth/disconnect", AuthsController.disconnect);
router.post("/auth/reset", AuthsController.reset);
router.post("/auth/reset/finalize", AuthsController.finalizeReset);
router.get("/faculties/:id", FacultiesController.getDeptsByFac);
router.get("/faculties", FacultiesController.getAll);
router.get("/teams", TeamsController.getAll);
router.post("/teams", TeamsController.create);
router.patch('/users/:id', UsersController.updateUser);
router.post("/users/finalize", UsersController.finalizeSignUp);
router.post("/users", UsersController.initiateSignUp);


module.exports = router;
