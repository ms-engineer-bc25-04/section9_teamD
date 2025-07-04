import { Router } from "express";

import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventParticipants,
    applyEvent,
    cancelEvent
  } from "../controllers/event-controller";
import prisma from "../../prisma/client";

const router = Router();

// GET イベント一覧取得
router.get("/", async (req, res, next) => {
  try {
    await getEvents(req, res);
  } catch (err) {
    next(err);
  }
});

// GET 特定のイベント取得
router.get("/:id", async (req, res, next) => {
  try {
    await getEventById(req, res);
  } catch (err) {
    next(err);
  }
});

// GET イベント参加者取得
router.get("/:id/participants", async (req, res, next) => {
  try {
    await getEventParticipants(req, res);
  } catch (err) {
    next(err);
  }
});

// POST 新規イベント作成
router.post("/", async (req, res, next) => {
  try {
    await createEvent(req, res);
  } catch (err) {
    next(err);
  }
});

// PUT イベント更新
router.put("/:id", async (req, res, next) => {
  try {
    await updateEvent(req, res);
  } catch (err) {
    next(err);
  }
});

// DELETE イベント削除
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteEvent(req, res);
  } catch (err) {
    next(err);
  }
});

// POST イベント申込
router.post("/:eventId/apply", async (req, res, next) => {
  try {
    await applyEvent(req, res);
  } catch (err) {
    next(err);
  }
});

// POST イベントキャンセル
router.post("/:eventId/cancel", async (req, res, next) => {
  try {
    await cancelEvent(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;