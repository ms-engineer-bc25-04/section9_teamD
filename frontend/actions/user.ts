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
  parentName: "中村　あやか",
  childName: "中村 はな",
  childClass: "ひまわり組",
  avatarUrl: "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/72412.jpg", // プレースホルダー画像
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
