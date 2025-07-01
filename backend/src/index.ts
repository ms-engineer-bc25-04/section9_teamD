import express, { RequestHandler } from 'express'; // ← RequestHandler を追加！
import cors from 'cors';
// ここを追加！
import { requireAuth } from './middlewares/auth-middleware';

const app = express();
app.use(cors());
app.use(express.json());

// 認証付きAPIに変更！
app.get(
  '/api/user/me',
  // TypeScriptの型エラー回避のため as unknown as RequestHandler を付けている
  requireAuth as unknown as RequestHandler,
  (req, res) => {
    // 認証されたユーザーだけがここに来る
    res.json({
      message: '認証OK！',
      uid: (req as any).user.uid,        // FirebaseのユーザーID
      email: (req as any).user.email,    // Firebaseのメールアドレス
    });
  }
);

// サーバー起動（4000番ポート、0.0.0.0でリッスン推奨）
const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
