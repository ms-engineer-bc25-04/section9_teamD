import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// サーバー起動時に一度だけ初期化（すでに初期化済みならskip）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // 改行コード注意！
    }),
  });
}

// ログイン必須ミドルウェア
// async function requireAuth ... だったのを、asyncを外してPromise型を避ける！
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const idToken = authHeader.split(" ")[1];
  // Promise型で返さず .then().catch() で記述するのがポイント！
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // req.userに認証情報をセット
      (req as any).user = decodedToken;
      next();
    })
    .catch((err) => {
      res.status(401).json({ error: "Invalid or expired token" });
    });
}

// ロール（職員かどうか）確認用ミドルウェア例
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user?.role === "staff" || user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: staff only" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user?.role === "admin" || user?.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ error: "管理者専用です" });
  }
}
