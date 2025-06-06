/**
 * @file routes for api endpoints
 * @author Simpa
 * @copyright Project Genius
 */

import { Router } from "express";
import AuthsController from "../controllers/AuthsController";
import UsersController from "../controllers/UsersController";
import TeamsController from "../controllers/TeamsController";
import AppController from "../controllers/AppController";
import { signup } from "../controllers/AuthController";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Genius!");
});

router.post("/app/contact", AppController.contactUs);
router.get("/app/dashboard", AppController.dashboard);
router.post("/app/payment-hook", AppController.paymentHook);
router.get("/app/verify-payment/:ref", AppController.verifyPayment);
router.get("/app/payment/paid", AppController.paymentStatus);
router.post("/auth/connect", signup);
router.delete("/auth/disconnect", AuthsController.disconnect);
router.post("/auth/reconfirm", AuthsController.resendConfirmation);
router.post("/auth/reset", AuthsController.reset);
router.patch("/auth/reset/finalize", AuthsController.finalizeReset);
router.post("/teams", TeamsController.create);
router.post("/teams/solutions", TeamsController.makeSubmission);
router.patch("/users/team", TeamsController.join);
router.patch("/users", UsersController.updateContestant);
router.post("/users", UsersController.SignUp);
// router.get("/app/payment", AppController.makePayment);

module.exports = router;
