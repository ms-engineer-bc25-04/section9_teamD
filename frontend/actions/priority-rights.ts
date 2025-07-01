"use server"

// --- 簡易的なインメモリデータベースのシミュレーション ---
// 実際にはデータベース（Supabase, Neonなど）を使用します

interface PriorityRight {
  id: string
  userId: string
  name: string
  status: "未使用" | "使用済み" | "期限切れ" // 期限切れを追加
  description: string
  dateAcquired: string // 取得日
  dateUsed?: string // 使用日 (使用済みの場合のみ)
  expirationDate?: string // 期限日を追加
}

// 初期データ
const priorityRights: PriorityRight[] = [
  {
    id: "pr1",
    userId: "user1",
    name: "運動会席優先権",
    status: "未使用",
    description: "次回の運動会で、観覧席を優先的に確保できます。",
    dateAcquired: "2025/06/01",
    expirationDate: "2025/10/31", // 期限日を追加
  },
  {
    id: "pr2",
    userId: "user1",
    name: "個人面談時間優先選択権",
    status: "使用済み",
    description: "個人面談の希望時間を優先的に選択できます。",
    dateAcquired: "2025/05/10",
    dateUsed: "2025/05/20",
    expirationDate: "2025/05/31", // 期限日を追加
  },
  {
    id: "pr3",
    userId: "user1",
    name: "発表会リハーサル見学権",
    status: "未使用",
    description: "発表会のリハーサルを優先的に見学できます。",
    dateAcquired: "2025/07/01",
    expirationDate: "2025/07/15", // 期限日を追加 (期限切れになるように設定)
  },
  {
    id: "pr4",
    userId: "user1",
    name: "PTA総会資料事前閲覧権",
    status: "未使用",
    description: "次回のPTA総会資料を事前に閲覧できます。",
    dateAcquired: "2025/06/20",
    expirationDate: "2025/06/24", // 期限日を追加 (期限切れになるように設定)
  },
]

// ヘルパー関数：優先権を取得
async function findPriorityRight(rightId: string): Promise<PriorityRight | undefined> {
  return priorityRights.find((right) => right.id === rightId)
}

// --- シミュレーションここまで ---

/**
 * ユーザーの優先権リストを取得するServer Action
 * @param userId ユーザーID
 * @returns 優先権の配列
 */
export async function getUserPriorityRights(userId: string): Promise<PriorityRight[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 日付のみで比較するため時間をリセット

  // 取得日順にソートし、期限切れを判定
  return priorityRights
    .filter((right) => right.userId === userId)
    .map((right) => {
      if (right.status === "未使用" && right.expirationDate) {
        const expirationDateObj = new Date(right.expirationDate)
        expirationDateObj.setHours(0, 0, 0, 0) // 日付のみで比較するため時間をリセット
        if (expirationDateObj < today) {
          return { ...right, status: "期限切れ" }
        }
      }
      return right
    })
    .sort((a, b) => new Date(b.dateAcquired).getTime() - new Date(a.dateAcquired).getTime())
}
