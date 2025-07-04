import { Router } from "express";
import { createEvent, updateEvent,applyEvent, cancelEvent} from "../controllers/event-controller";
import prisma from "../../prisma/client";

const router = Router();

// GET イベント一覧取得
router.get("/", async (req, res) => {
    try {
      const events = await prisma.event.findMany();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "イベント一覧の取得に失敗しました" });
    }
  });

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.post("/:eventId/apply", applyEvent);
router.post("/:eventId/cancel", cancelEvent);


export default router;
