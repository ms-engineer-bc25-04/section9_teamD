import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  applyEvent,
  cancelEvent,
} from "../controllers/event-controller";
import {
  requireAuth,
  requireStaff,
  requireAdmin,
} from "../middlewares/auth-middleware";

const router = Router();

// ＊＊一般公開OK＊＊
// GET イベント一覧取得
router.get("/", getEvents);
// GET 特定のイベント取得
router.get("/:id", getEventById);

// ＊＊ログインしたユーザーだけアクセスできる＊＊
// イベント参加申込
router.post("/:eventId/apply", requireAuth, applyEvent);
// イベントキャンセル
router.post("/:eventId/cancel", requireAuth, cancelEvent);
// イベント参加者一覧取得
router.get("/:id/participants", requireAuth, getEventParticipants);

// ＊＊管理者のみアクセスできる＊＊
// POST 新規イベント作成
router.post("/", requireAuth, requireAdmin, createEvent);
// PUT イベント更新
router.put("/:id", requireAuth, requireStaff, updateEvent);
// DELETE イベント削除
router.delete("/:id", requireAuth, requireStaff, deleteEvent);

export default router;

// // GET イベント一覧取得
// router.get("/", async (req, res, next) => {
//   try {
//     await getEvents(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET 特定のイベント取得
// router.get("/:id", async (req, res, next) => {
//   try {
//     await getEventById(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET イベント参加者取得
// router.get("/:id/participants", async (req, res, next) => {
//   try {
//     await getEventParticipants(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // POST 新規イベント作成
// router.post("/", async (req, res, next) => {
//   try {
//     await createEvent(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // PUT イベント更新
// router.put("/:id", async (req, res, next) => {
//   try {
//     await updateEvent(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // DELETE イベント削除
// router.delete("/:id", async (req, res, next) => {
//   try {
//     await deleteEvent(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // POST イベント申込
// router.post("/:eventId/apply", async (req, res, next) => {
//   try {
//     await applyEvent(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// // POST イベントキャンセル
// router.post("/:eventId/cancel", async (req, res, next) => {
//   try {
//     await cancelEvent(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;
