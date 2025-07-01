import { Request, Response } from "express";
import prisma from "../../prisma/client";

// POST 新規イベント作成
export const createEvent = async (req: Request, res: Response) => {
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

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        deadline: new Date(deadline),
        pointReward: Number(pointReward),
        privilegeAllowed: Boolean(privilegeAllowed),
        createdById,

        // 任意項目は条件付きで含める。存在するときだけ含める
        ...(requiredItems && { requiredItems }),
        ...(specialNotes && { specialNotes }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "イベント更新に失敗しました" });
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
