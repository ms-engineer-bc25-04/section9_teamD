import { Router } from "express";
import { createEvent, updateEvent } from "../controllers/event-controller";

const router = Router();

router.post("/events", createEvent);
router.put("/events/:id", updateEvent);

export default router;
