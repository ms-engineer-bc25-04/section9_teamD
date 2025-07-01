// localhost:3000/profile

'use client'

import { useEffect, useState } from 'react'
// import { Header } from "@/components/header"
// import { MobileNav } from "@/components/layout/mobile-nav"
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardHeader,
  ProfileCardTitle,
} from '../../components/ui/profile-card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { User, School } from 'lucide-react' // アイコンをインポート
//import { getUserProfile } from "@/actions/user" // Server Actionをインポート

interface UserProfile {
  id: string
  parentName: string
  childName: string
  childClass: string
  avatarUrl: string
}
// デモ用のユーザープロフィールデータ
const userProfileData: UserProfile = {
  id: 'user1',
  parentName: '山田 太郎',
  childName: '山田 花子',
  childClass: 'ひまわり組',
  avatarUrl: '/placeholder.svg?height=80&width=80', // プレースホルダー画像
}

/**
 * ユーザーのプロフィール情報を取得するServer Action
 * @param userId ユーザーID
 * @returns ユーザープロフィールオブジェクト
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // 実際にはデータベースからユーザーIDに基づいてプロフィール情報をフェッチします
  if (userId === userProfileData.id) {
    return userProfileData
  }
  return null
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = 'user1'

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      const profile = await getUserProfile(userId)
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
      {/* <MobileNav>
        <Header title="プロフィール" />
      </MobileNav> */}

      <main className="p-4 max-w-md mx-auto">
        <ProfileCard className="border-border bg-card text-card-foreground">
          <ProfileCardHeader className="flex flex-col items-center text-center pb-4">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage
                src={userProfile.avatarUrl || '/placeholder.svg'}
                alt={userProfile.parentName}
              />
              <AvatarFallback>{userProfile.parentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <ProfileCardTitle className="text-2xl font-bold">
              {userProfile.parentName}
            </ProfileCardTitle>
            <p className="text-sm text-muted-foreground">保護者</p>
          </ProfileCardHeader>
          <ProfileCardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">子供の名前</p>
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
          </ProfileCardContent>
        </ProfileCard>
      </main>
    </div>
  )
}
