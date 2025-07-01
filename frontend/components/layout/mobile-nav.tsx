"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CalendarDays, Gift, History, Award, UserCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getUserProfile } from "@/actions/user"

interface MobileNavProps {
  children: React.ReactNode
}

interface UserProfile {
  id: string
  parentName: string
  childName: string
  childClass: string
  avatarUrl: string
}

export function MobileNav({ children }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = "user1"

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true)
      const profile = await getUserProfile(userId)
      setUserProfile(profile)
      setIsLoadingProfile(false)
    }
    loadProfile()
  }, [userId])

  const navItems = [
    { name: "プロフィール", href: "/profile", icon: UserCircle2 },
    { name: "イベント一覧", href: "/", icon: CalendarDays },
    { name: "ポイント確認/景品交換", href: "/points", icon: Gift },
    { name: "ポイント履歴確認", href: "/point-history", icon: History },
    { name: "優先権確認/使用", href: "/priority-rights", icon: Award },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-background text-foreground flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="text-foreground">メニュー</SheetTitle>
        </SheetHeader>

        {/* スクロールなしのコンテンツ領域 */}
        <div className="flex flex-col">
          {" "}
          {/* flex-1 overflow-y-auto を削除 */}
          {isLoadingProfile ? (
            <div className="p-4 text-center text-muted-foreground text-sm">プロフィール読み込み中...</div>
          ) : userProfile ? (
            <div className="p-4 flex flex-col items-center text-center">
              <Avatar className="h-14 w-14 mb-2 border-2 border-primary">
                {" "}
                {/* アイコンサイズを縮小 */}
                <AvatarImage src={userProfile.avatarUrl || "/placeholder.svg"} alt={userProfile.parentName} />
                <AvatarFallback>{userProfile.parentName.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-base">{userProfile.parentName}</p> {/* フォントサイズを縮小 */}
              <p className="text-xs text-muted-foreground">
                {" "}
                {/* フォントサイズを縮小 */}
                {userProfile.childName} ({userProfile.childClass})
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">プロフィール情報なし</div>
          )}
          <Separator className="my-2" />
          <nav className="flex flex-col gap-1 px-4">
            {" "}
            {/* gapを縮小 */}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    /* paddingとgapを縮小 */
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary/20"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" /> {/* アイコンサイズを縮小 */}
                  <span className="text-base font-medium">{item.name}</span> {/* フォントサイズを縮小 */}
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
