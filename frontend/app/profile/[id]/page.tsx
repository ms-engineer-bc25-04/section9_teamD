import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, School } from 'lucide-react'

interface ChildProfile {
  name: string
  className: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string
  children: ChildProfile[]
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>プロフィールが見つかりませんでした。</p>
      </div>
    )
  }

  const userProfile: UserProfile = await res.json()

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
              <AvatarImage
                src={userProfile.avatarUrl || '/placeholder.svg'}
                alt={userProfile.name}
              />
              <AvatarFallback>{userProfile?.name?.charAt(0) ?? ''}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold">{userProfile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">保護者</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {userProfile.children.map((child, index) => (
              <div key={index} className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">お子様の名前</p>
                  <p className="font-medium text-lg">{child.name}</p>
                </div>

                <School className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">クラス</p>
                  <p className="font-medium text-lg">{child.className}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
