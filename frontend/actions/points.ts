"use server"

import { revalidatePath } from "next/cache"

// --- 簡易的なインメモリデータベースのシミュレーション ---
// 実際にはデータベース（Supabase, Neonなど）を使用します

interface User {
  id: string
  points: number
}

interface PointTransaction {
  id: string
  userId: string
  type: "earn" | "spend"
  amount: number
  description: string
  date: string
}

// 初期データ
const users: User[] = [{ id: "user1", points: 290 }] // 現在の獲得ポイントを290ptに設定
const pointTransactions: PointTransaction[] = [
  { id: "ph1", userId: "user1", type: "earn", date: "2025/07/10", description: "運動会準備ボランティア", amount: 50 },
  { id: "ph2", userId: "user1", type: "earn", date: "2025/06/25", description: "バザー品作成", amount: 80 },
  { id: "ph3", userId: "user1", type: "earn", date: "2025/06/15", description: "園内清掃", amount: 40 },
  { id: "ph4", userId: "user1", type: "earn", date: "2025/05/20", description: "入学式お手伝い", amount: 70 },
  { id: "ph5", userId: "user1", type: "earn", date: "2025/04/05", description: "PTA総会参加", amount: 20 },
]

// ヘルパー関数：ユーザーを取得
async function findUser(userId: string): Promise<User | undefined> {
  // 実際のDBでは await db.users.findUnique({ where: { id: userId } }) のようになる
  return users.find((user) => user.id === userId)
}

// ヘルパー関数：ユーザーのポイントを更新
async function updateUserPoints(userId: string, newPoints: number): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.id === userId)
  if (userIndex !== -1) {
    users[userIndex].points = newPoints
    return true
  }
  return false
}

// ヘルパー関数：ポイント取引を記録
async function recordTransaction(transaction: PointTransaction): Promise<void> {
  pointTransactions.push(transaction)
}
// --- シミュレーションここまで ---

/**
 * ユーザーの現在のポイントを取得するServer Action
 * @param userId ユーザーID
 * @returns 現在のポイント数
 */
export async function getUserPoints(userId: string): Promise<number> {
  const user = await findUser(userId)
  return user ? user.points : 0
}

/**
 * ユーザーのポイント履歴を取得するServer Action
 * @param userId ユーザーID
 * @returns ポイント取引の配列
 */
export async function getPointHistory(userId: string): Promise<PointTransaction[]> {
  // 最新の取引が上に来るようにソート
  return pointTransactions
    .filter((tx) => tx.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * ユーザーにポイントを追加するServer Action
 * @param userId ユーザーID
 * @param amount 追加するポイント数
 * @param description ポイント獲得理由
 * @returns 成功/失敗とメッセージ
 */
export async function addPoints(
  userId: string,
  amount: number,
  description: string,
): Promise<{ success: boolean; message: string }> {
  if (amount <= 0) {
    return { success: false, message: "追加するポイントは正の数である必要があります。" }
  }

  const user = await findUser(userId)
  if (!user) {
    return { success: false, message: "ユーザーが見つかりません。" }
  }

  const newPoints = user.points + amount
  const updated = await updateUserPoints(userId, newPoints)

  if (updated) {
    await recordTransaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type: "earn",
      amount,
      description,
      date: new Date()
        .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\//g, "/"),
    })
    revalidatePath("/points") // ポイント確認画面を再検証
    revalidatePath("/point-history") // ポイント履歴画面を再検証
    return { success: true, message: `${amount}ポイントを獲得しました！` }
  } else {
    return { success: false, message: "ポイントの追加に失敗しました。" }
  }
}

/**
 * ユーザーのポイントを消費するServer Action
 * @param userId ユーザーID
 * @param amount 消費するポイント数
 * @param description ポイント消費理由
 * @returns 成功/失敗とメッセージ
 */
export async function spendPoints(
  userId: string,
  amount: number,
  description: string,
): Promise<{ success: boolean; message: string }> {
  if (amount <= 0) {
    return { success: false, message: "消費するポイントは正の数である必要があります。" }
  }

  const user = await findUser(userId)
  if (!user) {
    return { success: false, message: "ユーザーが見つかりません。" }
  }

  if (user.points < amount) {
    return { success: false, message: "ポイントが不足しています。" }
  }

  // 景品交換の制限チェック
  // "1家庭1回まで" の景品は、説明文にその旨が含まれると仮定
  const oneTimeExchangeItems = ["運動会前列スペース 秋", "発表会前列スペース", "卒園式前列スペース 冬"]
  const isOneTimeItem = oneTimeExchangeItems.some((item) => description.includes(item))

  if (isOneTimeItem) {
    const userSpentOnThisItem = pointTransactions.some(
      (tx) => tx.userId === userId && tx.type === "spend" && tx.description === description,
    )
    if (userSpentOnThisItem) {
      return { success: false, message: "この景品は1家庭1回までしか交換できません。" }
    }
  }

  const newPoints = user.points - amount
  const updated = await updateUserPoints(userId, newPoints)

  if (updated) {
    await recordTransaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type: "spend",
      amount,
      description,
      date: new Date()
        .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\//g, "/"),
    })
    revalidatePath("/points") // ポイント確認画面を再検証
    revalidatePath("/point-history") // ポイント履歴画面を再検証
    return { success: true, message: `${amount}ポイントを消費しました。` }
  } else {
    return { success: false, message: "ポイントの消費に失敗しました。" }
  }
}
