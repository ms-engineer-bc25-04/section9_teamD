"use server"

interface UserProfile {
  id: string
  parentName: string
  childName: string
  childClass: string
  avatarUrl: string
}

// デモ用のユーザープロフィールデータ
const userProfileData: UserProfile = {
  id: "user1",
  parentName: "山田 太郎",
  childName: "山田 花子",
  childClass: "ひまわり組",
  avatarUrl: "/placeholder.svg?height=80&width=80", // プレースホルダー画像
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
