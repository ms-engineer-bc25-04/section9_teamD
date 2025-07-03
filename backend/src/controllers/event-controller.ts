import { Request, Response } from "express";
import prisma from "../../prisma/client";

// GET イベント一覧取得
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // prismaを使ってイベント一覧を取得
    const events = await prisma.event.findUnique({
      where: { id },
    });

    if (!events) {
      return res.status(404).json({ error: "イベントが見つかりません" });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "イベントの取得に失敗しました" });
  }
};

// POST 新規イベント作成
export const createEvent = async (req: Request, res: Response) => {
  try {
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
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        deadline: deadline ? new Date(deadline) : null,
        pointReward: Number(pointReward),
        privilegeAllowed:
          privilegeAllowed === "true" || privilegeAllowed === true,
        createdById,

        // 任意項目は条件付きで含める。存在するときだけ含める
        ...(requiredItems && { requiredItems }),
        ...(specialNotes && { specialNotes }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
      },
    });

    return res.status(201).json(newEvent);
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
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
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

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "イベント更新に失敗しました" });
  }
};
