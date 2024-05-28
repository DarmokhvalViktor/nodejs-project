import {Router} from "express";
import {
    createRegistration,
    getRegistrations,
    registrationCounts
} from "../controller/RegistrationController";

const router = Router();

router.post("/registration", createRegistration);
router.get("/registration", getRegistrations);
router.post("/registration/_counts", registrationCounts);

export default router;