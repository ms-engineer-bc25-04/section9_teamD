import prisma from "../../prisma/client";

interface ChildProfile {
  name: string;
  className: string;
}

interface UserProfile {
  id: string;
  parentName: string;
  avatarUrl: string;
  children: ChildProfile[];
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    // ユーザーIDに基づいてプロフィール情報を取得
    // 必要なフィールドのみを選択
    where: { id: userId },
    include: {
      // 子供の情報も含める
      children: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    parentName: user.name,
    children: user.children.map((child) => ({
      name: child.name,
      className: child.className,
    })),
    avatarUrl: user.profileImageUrl ?? "", // プロフィール画像URLが設定されていない場合は空文字列
  };
}
