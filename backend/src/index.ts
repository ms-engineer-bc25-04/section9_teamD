import express, { RequestHandler } from "express";
import cors from "cors";
import { requireAuth } from "./middlewares/auth-middleware";
import rewardsRouter from "./routes/rewards";
import eventsRouter from "./routes/events";
import pointsRouter from "./routes/points";
import privilegesRouter from "./routes/privileges";
import type { ErrorRequestHandler } from "express";


const app = express();
app.use(cors());
app.use(express.json());

// 認証付きAPIに変更！
app.get(
  "/api/user/me",
  // TypeScriptの型エラー回避のため as unknown as RequestHandler を付けている
  requireAuth as unknown as RequestHandler,
  (req, res) => {
    // 認証されたユーザーだけがここに来る
    res.json({
      message: "認証OK！",
      uid: (req as any).user.uid, // FirebaseのユーザーID
      email: (req as any).user.email, // Firebaseのメールアドレス
    });
  }
);

app.use("/api/rewards", rewardsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/points", pointsRouter);
app.use("/api/privileges", privilegesRouter);

// サーバー起動（4000番ポート、0.0.0.0でリッスン推奨）
app.listen(4000, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:4000`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Expressサーバーのトップページです！（APIサーバー本体）');
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);
