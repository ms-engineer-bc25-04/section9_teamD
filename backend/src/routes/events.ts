import { Router } from "express";
import { createEvent, updateEvent,applyEvent, cancelEvent} from "../controllers/event-controller";

const router = Router();

router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.post("/events/:eventId/apply", applyEvent);
router.post("/events/:eventId/cancel", cancelEvent);


export default router;
