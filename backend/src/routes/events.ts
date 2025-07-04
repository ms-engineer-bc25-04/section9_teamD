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
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
} from "../controllers/event-controller";

const router = Router();

// GET イベント一覧取得
router.get("/", (req, res, next) => {
  getEvents(req, res).catch(next);
});

// GET 特定のイベント取得
router.get("/:id", (req, res, next) => {
  getEventById(req, res).catch(next);
});

// GET イベント参加者取得
router.get("/:id/participants", (req, res, next) => {
  getEventParticipants(req, res).catch(next);
});

// POST 新規イベント作成
router.post("/", (req, res, next) => {
  createEvent(req, res).catch(next);
});

// PUT イベント更新
router.put("/:id", (req, res, next) => {
  updateEvent(req, res).catch(next);
});

// DELETE イベント削除
router.delete("/:id", (req, res, next) => {
  deleteEvent(req, res).catch(next);
});

export default router;
