"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, School } from "lucide-react"
import { getUserProfile } from "@/actions/user"

interface UserProfile {
  id: string
  parentName: string
  childName: string
  childClass: string
  avatarUrl: string
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userId = "user1" // デモ用のユーザーID

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      const profile = await getUserProfile(userId)

      // ✅ S3画像URLを強制上書き（デモ用）
      if (profile) {
        profile.avatarUrl = "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/72412.jpg"
      }

      setUserProfile(profile)
      setIsLoading(false)
    }
    loadProfile()
  }, [userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>プロフィールを読み込み中...</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>プロフィールが見つかりませんでした。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="プロフィール" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="flex flex-col items-center text-center pb-4">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage src={userProfile.avatarUrl || "/placeholder.svg"} alt={userProfile.parentName} />
              <AvatarFallback>{userProfile.parentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold">{userProfile.parentName}</CardTitle>
            <p className="text-sm text-muted-foreground">保護者</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">お子様の名前</p>
                <p className="font-medium text-lg">{userProfile.childName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">クラス</p>
                <p className="font-medium text-lg">{userProfile.childClass}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
