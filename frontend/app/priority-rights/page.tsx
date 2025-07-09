"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header" // 正しいパスに修正
import { MobileNav } from "@/components/layout/mobile-nav" // 正しいパスに修正
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // 正しいパスに修正
import { Award, Info, Clock, CheckCircle } from "lucide-react" // lucide-reactからインポート
import { getUserPriorityRights } from "@/actions/priority-rights" // 正しいパスに修正
import type { PriorityRight } from "@/actions/priority-rights" // actions/priority-rightsから型をインポート

export default function PriorityRightsPage() {
  const router = useRouter()
  const [userPriorityRights, setUserPriorityRights] = useState<PriorityRight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = "user1"

  // 優先権情報をロード
  // useEffect(() => {
  //   const loadPriorityRights = async () => {
  //     setIsLoading(true)
  //     const rights = await getUserPriorityRights(userId)
  //     setUserPriorityRights(rights)
  //     setIsLoading(false)
  //   }
  //   loadPriorityRights()
  // }, [userId])

useEffect(() => {
  setIsLoading(true)
  // 本来は getUserPriorityRights(userId) を呼ぶが、ダミーデータで上書き
  setTimeout(() => {
    setUserPriorityRights([
      {
        id: "demo-1",
        userId: userId,
        name: "発表会の前列席 優先権",
        description: "100ポイントと交換した、発表会の前列席の優先権です。",
        status: "未使用",
        expirationDate: "2025-08-31",
        dateUsed: undefined,
        dateAcquired: "2025-07-22",
        // pointsUsed: 100,
      }
    ])
    setIsLoading(false)
  }, 600) // 読み込み演出のため0.6秒待機
}, [userId])


  const getStatusColor = (status: "未使用" | "使用済み" | "期限切れ") => {
    switch (status) {
      case "未使用":
        return "bg-accent text-accent-foreground" // ピンク
      case "使用済み":
        return "bg-secondary/50 text-secondary-foreground" // 変更: より目立つセカンダリカラーの薄いバージョン
      case "期限切れ":
        return "bg-destructive text-destructive-foreground" // 赤
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="優先権確認" /> {/* タイトルを修正 */}
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="mb-6 border-border bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">あなたの優先権</CardTitle>
            <Award className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">優先権を読み込み中...</p>
            ) : userPriorityRights.length === 0 ? (
              <p className="text-center text-muted-foreground">現在、お持ちの優先権はありません。</p>
            ) : (
              <div className="space-y-4">
                {userPriorityRights.map((right) => (
                  <div key={right.id} className="border-b pb-3 last:border-b-0 last:pb-0 border-border">
                    <h3 className="font-semibold text-lg mb-1">{right.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{right.description}</p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(right.status)}`}
                      >
                        {right.status === "使用済み" && <CheckCircle className="h-3 w-3" />}{" "}
                        {/* 使用済みの場合にアイコンを追加 */}
                        {right.status}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {right.status === "使用済み" && right.dateUsed && <span>使用日: {right.dateUsed}</span>}
                        {right.expirationDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            期限: {right.expirationDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-medium">優先権について</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-5 w-5 flex-shrink-0 text-[hsl(var(--color-yellow))] mt-1" />
            <p>
              優先権は、PTA活動への貢献度に応じて付与されます。
              特定のイベントでの優遇や、特別な体験にご利用いただけます。 優先権の使用状況は園側で管理されます。
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
