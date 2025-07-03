// import { Router } from "express";
// import {
//   createEvent,
//   getEvent,
//   updateEvent,
// } from "../controllers/event-controller";

// const router = Router();

// router.post("/events", createEvent);
// router.put("/events/:id", updateEvent);
// router.get("/events/:id", getEvent);

// export default router;

import { Router } from "express";
import { createEvent, updateEvent } from "../controllers/event-controller";

const router = Router();

router.post("/events", (req, res, next) => {
  createEvent(req, res).catch(next);
});

router.put("/events/:id", (req, res, next) => {
  updateEvent(req, res).catch(next);
});

export default router;
