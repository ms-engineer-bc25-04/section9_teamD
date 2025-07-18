import express, { Response, Request } from "express";
import prisma from "../../prisma/client";

const router = express.Router();

// 全ユーザー一覧
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "ユーザー取得失敗", detail: err });
  }
});

// Firebase UIDで取得
router.get("/by-firebase-uid/:uid", async (req: Request, res: Response) => {
  const firebaseUid = req.params.uid;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid }, // ← MySQLにこのカラムある前提
      include: { children: true },
    });

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    const profile = {
      id: user.id,
      parentName: user.name,
      avatarUrl: user.profileImageUrl ?? "",
      children: user.children.map((child) => ({
        name: child.name,
        className: child.className,
      })),
    };

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

// ユーザープロフィール取得（子供情報含む）
router.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        children: true, // 子供の情報も含める
      },
    });

    if (!user) {
      res.status(404).json({ error: "ユーザー情報が見つかりません" });
      return;
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      children: user.children.map((child) => ({
        name: child.name,
        className: child.className,
      })),
      avatarUrl: user.profileImageUrl ?? "",
    };
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "プロフィール取得失敗" });
  }
});

export default router;
