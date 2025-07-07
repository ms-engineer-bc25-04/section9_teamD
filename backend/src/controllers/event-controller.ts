import e, { Request, Response } from "express";
import prisma from "../../prisma/client";
import { app } from "firebase-admin";

// GET イベント一覧取得
export const getEvents = async (req: Request, res: Response) => {
  const { year, month } = req.query;

  const now = new Date()
  const targetYear = year ?? now.getFullYear()
  const targetMonth = month ?? now.getMonth() + 1

  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(`${targetYear}-${targetMonth}-01`),
          lt: new Date(`${targetYear}-${Number(targetMonth) + 1}-01`),
        },
      },
      include: {
        applications: true, // 参加者数を取得
      },
      orderBy: { date: "asc" },
    });

    const now = new Date();
    // 過去のイベントを除外
    const formattedEvents = events.map((event) => {
      let status = "募集中";

      if (event.capacity && event.applications.length >= event.capacity) {
        status = "満員";
      } else if (event.date < now) {
        status = "終了";
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split("T")[0], // YYYY-MM-DD形式
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        requiredItems: event.requiredItems,
        specialNotes: event.specialNotes,
        capacity: event.capacity,
        deadline: event.deadline
          ? event.deadline.toISOString().split("T")[0]
          : null, // YYYY-MM-DD形式
        pointReward: event.pointReward,
        privilegeAllowed: event.privilegeAllowed,
        createdById: event.createdById,
        status, // イベントのステータスを追加
        applicationsCount: event.applications.length, // 参加者数を追加
      };
    });

    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "イベントの取得に失敗しました" });
  }
};

// GET 特定のイベント取得
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const events = await prisma.event.findUnique({
      where: { id },
    });

    if (!events) {
      return res.status(404).json({ error: "イベントが見つかりません" });
    }
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "イベントの取得に失敗しました" });
  }
};

// POST 新規イベント作成
export const createEvent = async (req: Request, res: Response) => {
  // リクエストボディから必要なデータを取得
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    requiredItems,
    specialNotes,
    capacity,
    deadline,
    pointReward,
    privilegeAllowed,
    createdById,
  } = req.body;

  // バリデーション: 必須項目のチェック
  if (
    !title ||
    !description ||
    !date ||
    !startTime ||
    !endTime ||
    !location ||
    !createdById
  ) {
    return res.status(400).json({ error: "必須項目が不足しています" });
  }

  // バリデーション: 日付と時間のフォーマットチェック
  if (isNaN(new Date(date).getTime())) {
    return res
      .status(400)
      .json({ error: "開催日のフォーマットが正しくありません" });
  }

  if (deadline && isNaN(new Date(deadline).getTime())) {
    return res
      .status(400)
      .json({ error: "締切日のフォーマットが正しくありません" });
  }

  // prismaを使ってイベントを作成
  try {
    const newEventById = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        deadline: deadline ? new Date(deadline) : null,
        pointReward: Number(pointReward) || 0, // デフォルト値を0に設定
        privilegeAllowed:
          privilegeAllowed === "true" || privilegeAllowed === true,
        createdById,

        // 任意項目は条件付きで含める。存在するときだけ含める
        ...(requiredItems && { requiredItems }),
        ...(specialNotes && { specialNotes }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
      },
    });
    res.status(201).json(newEventById);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "イベント作成に失敗しました" });
  }
};

// PUT イベント更新（送った項目だけ更新）
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    requiredItems,
    specialNotes,
    capacity,
    deadline,
    pointReward,
    privilegeAllowed,
  } = req.body;

  try {
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "イベントが見つかりません" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(location && { location }),
        ...(requiredItems && { requiredItems }),
        ...(specialNotes && { specialNotes }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(pointReward !== undefined && { pointReward: Number(pointReward) }),
        ...(privilegeAllowed !== undefined && {
          privilegeAllowed: Boolean(privilegeAllowed),
        }),
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "イベント更新に失敗しました" });
  }
};

// DELETE イベント削除
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "削除に失敗しました", error: err });
  }
};

// GET イベントの参加者一覧取得
export const getEventParticipants = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const applications = await prisma.eventApplication.findMany({
      where: { eventId: id, status: "applied" },
      include: {
        user: true,
        slot: true,
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching event participants:", error);
    res.status(500).json({ error: "参加者の取得に失敗しました" });
  }
};

// イベント参加申込
export const applyEvent = async (req: Request, res: Response) => {
  console.log("applyEventに到達した");
  // 必要な情報を取得
  const { eventId } = req.params;
  const userId = req.body.userId; // 本当は認証から取るのが理想
 // slotIdも必須なら取得
 const slotId = req.body.slotId || ""; // 必要なら

 try {
   // 申込データをDBへ保存
   const application = await prisma.eventApplication.create({
     data: {
       eventId,
       userId,
       slotId: slotId || undefined, // 空文字ならundefinedにする
       status: "applied",
       appliedAt: new Date(),
       createdAt: new Date(),
     },
   });
   res.status(201).json({ message: "申込OK", application });
 } catch (error) {
   console.error("申込失敗", error);
   res.status(500).json({ error: "申込失敗" });
 }
};

// イベント参加キャンセル　【未検証】
export const cancelEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.body.userId;

  try {
    await prisma.eventApplication.updateMany({
      where: { eventId, userId },
      data: { status: "cancelled" }
    });
    res.status(200).json({ message: "キャンセルOK", eventId, userId });
  } catch (error) {
    console.error("キャンセル失敗", error);
    res.status(500).json({ error: "キャンセル失敗" });
  }
}
