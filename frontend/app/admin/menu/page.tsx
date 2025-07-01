'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardHeader,
  ProfileCardTitle,
} from '../../../components/ui/profile-card'
import { Badge } from '../../../components/ui/badge'
import { Calendar, Plus, Award, CreditCard, LogOut, Bell, Users, Star } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()

  const menuItems = [
    {
      title: 'イベント作成', // 1番目
      description: '新しいイベントを作成する',
      icon: Plus,
      color: 'bg-point-pink',
      href: '/admin/events/create',
    },
    {
      title: 'イベント管理', // 2番目
      description: 'PTA活動やボランティアイベントの作成・編集',
      icon: Calendar,
      color: 'bg-point-blue',
      href: '/admin/events',
      count: 8,
      countLabel: 'アクティブ',
    },
    {
      title: 'ポイント付与', // 3番目
      description: '参加者にポイントを付与・管理',
      icon: Award,
      color: 'bg-point-yellow',
      href: '/admin/points',
      count: 15,
      countLabel: '今月付与',
    },
    {
      title: '優先権管理', // 4番目
      description: '特定の保護者の優先権ステータスを確認・管理',
      icon: Star,
      color: 'bg-point-yellow',
      href: '/admin/priority-holders',
    },
    {
      title: '決済管理', // 5番目
      description: 'アプリ利用料金の支払い設定',
      icon: CreditCard,
      color: 'bg-point-purple',
      href: '/admin/payment',
    },
  ]

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-main-text mb-2">管理ダッシュボード</h1>
            <p className="text-main-text/70">PTA活動管理システム - さくら保育園</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-point-purple text-point-purple hover:bg-point-purple hover:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              通知
              <Badge className="ml-2 bg-point-pink text-white">3</Badge>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-point-pink text-point-pink hover:bg-point-pink hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインメニュー */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-main-text mb-4">管理メニュー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <ProfileCard
                  key={index}
                  className="cursor-pointer border-2 border-point-purple/30 hover:border-point-purple/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => router.push(item.href)}
                >
                  <ProfileCardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${item.color}`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <ProfileCardTitle className="text-main-text text-lg font-semibold">
                          {item.title}
                        </ProfileCardTitle>
                      </div>
                      {item.count && (
                        <Badge className="bg-point-purple text-white text-sm px-3 py-1 rounded-full">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  </ProfileCardHeader>
                  <ProfileCardContent className="px-4 pt-0 pb-4">
                    <ProfileCardDescription className="text-main-text/70 text-sm leading-relaxed">
                      {item.description}
                    </ProfileCardDescription>
                    {item.countLabel && (
                      <div className="text-xs text-main-text/50 mt-2">{item.countLabel}</div>
                    )}
                  </ProfileCardContent>
                </ProfileCard>
              ))}
            </div>
          </div>

          {/* サイドバー - 今日の予定 */}
          <div>
            <h2 className="text-xl font-bold text-main-text mb-4">今日の予定</h2>
            <ProfileCard>
              <ProfileCardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-point-blue/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-point-blue" />
                    <div>
                      <div className="font-semibold text-main-text text-sm">PTA定例会議</div>
                      <div className="text-main-text/70 text-xs">19:00 - 会議室A</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-point-pink/10 rounded-lg">
                    <Users className="h-4 w-4 text-point-pink" />
                    <div>
                      <div className="font-semibold text-main-text text-sm">
                        ボランティア募集締切
                      </div>
                      <div className="text-main-text/70 text-xs">運動会準備 - 23:59まで</div>
                    </div>
                  </div>
                </div>
              </ProfileCardContent>
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  )
}
