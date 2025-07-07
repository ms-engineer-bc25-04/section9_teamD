'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CalendarCheck, UserCheck, Award } from 'lucide-react'
// dummy-data.ts からイベントと保護者データをインポート
import { dummyEventsData, dummyParentsData } from '@/lib/dummy-data'

export default function PointsManagement() {
  const router = useRouter()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [pointsToAward, setPointsToAward] = useState<{ [key: string]: string }>({})
  const [selectedOfficerUser, setSelectedOfficerUser] = useState<string | null>(null)
  const officerPoints = 90 // 役員ポイント

  // イベントデータを日付順にソートして useState で管理
  const [events, setEvents] = useState(() => {
    return [...dummyEventsData].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  })

  // 保護者データを useState で管理
  const [allParents, setAllParents] = useState(dummyParentsData)

  const selectedEvent = useMemo(() => {
    return events.find((event) => event.id === selectedEventId)
  }, [selectedEventId, events])

  const handleAwardPoints = (
    userId: string,
    userName: string,
    eventTitle: string,
    slot: string
  ) => {
    const key = `${userId}-${slot}` // ユーザーIDと時間帯を組み合わせたキー
    const points = pointsToAward[key]
    const pointsNum = Number.parseInt(points)

    if (!points || pointsNum <= 0) {
      alert('有効なポイント数を入力してください。')
      return
    }

    // 保護者のポイントを更新
    setAllParents((prevParents) =>
      prevParents.map((parent) =>
        parent.id === userId
          ? {
              ...parent,
              currentPoints: parent.currentPoints + pointsNum,
              totalPoints: parent.totalPoints + pointsNum,
            }
          : parent
      )
    )

    alert(
      `${userName}さんに${pointsNum}ポイントを付与しました (イベント: ${eventTitle}, 時間帯: ${slot})`
    )
    setPointsToAward((prev) => ({ ...prev, [key]: '' })) // 付与後に入力フィールドをクリア
  }

  const handleAwardOfficerPoints = () => {
    if (!selectedOfficerUser) {
      alert('役員を選択してください。')
      return
    }

    const officerName = allParents.find((p) => p.id === selectedOfficerUser)?.name

    // 役員のポイントを更新
    setAllParents((prevParents) =>
      prevParents.map((parent) =>
        parent.id === selectedOfficerUser
          ? {
              ...parent,
              currentPoints: parent.currentPoints + officerPoints,
              totalPoints: parent.totalPoints + officerPoints,
            }
          : parent
      )
    )

    alert(`${officerName}さんに役員ポイントとして${officerPoints}ポイントを付与しました。`)
    setSelectedOfficerUser(null) // 付与後に入力フィールドをクリア
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "#fcf6ea" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/menu')}
            className="mr-4 text-[#3C2A1E] hover:bg-[#C3B2F7]/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理ダッシュボードへ
          </Button>
          <h1 className="text-2xl font-bold text-[#3C2A1E]">ポイント付与</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* イベント選択 */}
          <Card className="lg:col-span-2 bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3C2A1E] flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-[#7EB8F6]" />
                イベント参加者へのポイント付与
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="event-select" className="text-[#3C2A1E]">対象イベントを選択 *</Label>
                <Select onValueChange={setSelectedEventId} value={selectedEventId || ''}>
                  <SelectTrigger className="border-[#C3B2F7] focus:border-[#7EB8F6]">
                    <SelectValue placeholder="イベントを選択してください" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border border-[#ccc] shadow-xl">
                    {events.map((event) => (
                       <SelectItem
                        key={event.id}
                        value={event.id}
                        className="bg-white text-[#3C2A1E] hover:bg-[#f9f8ff] cursor-pointer"
                      >
                        {event.title} ({event.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedEvent && (
                <div className="mt-4 p-3 rounded-lg text-sm text-[#3C2A1E]" style={{ background: "#EAF6FF" }}>
                  <p><b>所要時間:</b> {selectedEvent.durationMinutes}分</p>
                  <p><b>推奨ポイント:</b> {selectedEvent.totalPoints}pt</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 参加者一覧とポイント付与 (時間帯別) */}
          <Card className="lg:col-span-2 bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3C2A1E] flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-[#FCE98E]" />
                {selectedEvent ? `${selectedEvent.title} の参加者` : 'イベント参加者一覧'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedEvent ? (
                <div className="text-center text-[#3C2A1E]/70 py-8">
                  <p>上記からイベントを選択すると、参加者一覧が表示されます。</p>
                </div>
              ) : selectedEvent.timeSlots.every((slot) => slot.participants.length === 0) ? (
                <div className="text-center text-[#3C2A1E]/70 py-8">
                  <p>このイベントにはまだ参加者がいません。</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {selectedEvent.timeSlots.map((timeSlot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="border rounded-lg p-4"
                      style={{ borderColor: "#7EB8F6", background: "#EAF6FF" }}
                    >
                      <h3 className="text-lg font-semibold text-[#7EB8F6] mb-3">
                        {timeSlot.slot} の参加者
                      </h3>
                      {timeSlot.participants.length === 0 ? (
                        <p className="text-[#3C2A1E]/70 text-sm">
                          この時間帯には参加者がいません。
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {timeSlot.participants.map((participant) => {
                            const currentParent = allParents.find((p) => p.id === participant.id)
                            const displayCurrentPoints = currentParent
                              ? currentParent.currentPoints
                              : 0

                            return (
                              <div
                                key={participant.id}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-[#f9f1ff]"
                                style={{ borderColor: "#C3B2F7" }}
                              >
                                <div className="mb-2 sm:mb-0">
                                  <div className="font-semibold text-[#3C2A1E]">
                                    {participant.name}
                                  </div>
                                  <div className="text-sm text-[#3C2A1E]/70">
                                    {participant.email}
                                  </div>
                                  <Badge className="bg-[#7EB8F6] text-white mt-1">
                                    現在: {displayCurrentPoints}pt
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <Input
                                    type="number"
                                    placeholder="付与ポイント"
                                    value={
                                      pointsToAward[`${participant.id}-${timeSlot.slot}`] || ''
                                    }
                                    onChange={(e) =>
                                      setPointsToAward((prev) => ({
                                        ...prev,
                                        [`${participant.id}-${timeSlot.slot}`]: e.target.value,
                                      }))
                                    }
                                    className="w-32 border-[#C3B2F7] focus:border-[#7EB8F6]"
                                  />
                                  <Button
                                    size="sm"
                                    className="bg-[#FCE98E] hover:bg-[#ffe58a] text-[#3C2A1E] font-bold"
                                    onClick={() =>
                                      handleAwardPoints(
                                        participant.id,
                                        participant.name,
                                        selectedEvent.title,
                                        timeSlot.slot
                                      )
                                    }
                                    disabled={
                                      !pointsToAward[`${participant.id}-${timeSlot.slot}`] ||
                                      Number.parseInt(
                                        pointsToAward[`${participant.id}-${timeSlot.slot}`]
                                      ) <= 0
                                    }
                                  >
                                    付与
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 役員ポイント付与セクション */}
          <Card className="lg:col-span-2 bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3C2A1E] flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#F8BEDF]" />
                役員ポイント付与 (固定 {officerPoints}pt)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="officer-select" className="text-[#3C2A1E]">対象役員を選択 *</Label>
                <Select onValueChange={setSelectedOfficerUser} value={selectedOfficerUser || ''}>
                  <SelectTrigger className="border-[#C3B2F7] focus:border-[#F8BEDF]">
                    <SelectValue placeholder="役員を選択してください" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#ccc] shadow-xl">
                    {allParents.map((parent) => (
                      <SelectItem
                        key={parent.id}
                        value={parent.id}
                        className="bg-white text-[#3C2A1E] hover:bg-[#fff0f5] cursor-pointer"
                      >
                        {parent.name} (現在: {parent.currentPoints}pt)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAwardOfficerPoints}
                className="w-full bg-[#F8BEDF] hover:bg-[#ffcce4] text-[#3C2A1E] mt-4"
                disabled={!selectedOfficerUser}
              >
                役員ポイントを付与
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 最近のポイント付与履歴 */}
        <Card className="mt-6 bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3C2A1E]">最近のポイント付与履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allParents
                .filter((p) => p.totalPoints > 0)
                .sort((a, b) => b.totalPoints - a.totalPoints)
                .slice(0, 5)
                .map((parent, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg"
                    style={{ borderColor: "#C3B2F7", background: "#F8F7FA" }}
                  >
                    <div>
                      <div className="font-semibold text-[#3C2A1E]">{parent.name}</div>
                      <div className="text-sm text-[#3C2A1E]/70">合計獲得ポイント</div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[#FCE98E] text-[#3C2A1E]">
                        +{parent.totalPoints}pt
                      </Badge>
                      <div className="text-xs text-[#3C2A1E]/70 mt-1">
                        更新日: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              {allParents.filter((p) => p.totalPoints > 0).length === 0 && (
                <div className="text-center text-[#3C2A1E]/70 py-4">
                  <p>まだポイント付与履歴がありません。</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



// 'use client'

// import { useState, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Badge } from '@/components/ui/badge'
// import { ArrowLeft, CalendarCheck, UserCheck, Award } from 'lucide-react'
// import { dummyEventsData, dummyParentsData } from '@/lib/dummy-data'

// export default function PointsManagement() {
//   const router = useRouter()
//   const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
//   const [pointsToAward, setPointsToAward] = useState<{ [key: string]: string }>({})
//   const [selectedOfficerUser, setSelectedOfficerUser] = useState<string | null>(null)
//   const officerPoints = 90

//   const [events, setEvents] = useState(() => {
//     return [...dummyEventsData].sort((a, b) => {
//       const dateA = new Date(a.date).getTime()
//       const dateB = new Date(b.date).getTime()
//       return dateA - dateB
//     })
//   })

//   const [allParents, setAllParents] = useState(dummyParentsData)

//   const selectedEvent = useMemo(() => {
//     return events.find((event) => event.id === selectedEventId)
//   }, [selectedEventId, events])

//   const handleAwardPoints = (
//     userId: string,
//     userName: string,
//     eventTitle: string,
//     slot: string
//   ) => {
//     const key = `${userId}-${slot}`
//     const points = pointsToAward[key]
//     const pointsNum = Number.parseInt(points)

//     if (!points || pointsNum <= 0) {
//       alert('有効なポイント数を入力してください。')
//       return
//     }

//     setAllParents((prevParents) =>
//       prevParents.map((parent) =>
//         parent.id === userId
//           ? {
//               ...parent,
//               currentPoints: parent.currentPoints + pointsNum,
//               totalPoints: parent.totalPoints + pointsNum,
//             }
//           : parent
//       )
//     )

//     alert(
//       `${userName}さんに${pointsNum}ポイントを付与しました (イベント: ${eventTitle}, 時間帯: ${slot})`
//     )
//     setPointsToAward((prev) => ({ ...prev, [key]: '' }))
//   }

//   const handleAwardOfficerPoints = () => {
//     if (!selectedOfficerUser) {
//       alert('役員を選択してください。')
//       return
//     }

//     const officerName = allParents.find((p) => p.id === selectedOfficerUser)?.name

//     setAllParents((prevParents) =>
//       prevParents.map((parent) =>
//         parent.id === selectedOfficerUser
//           ? {
//               ...parent,
//               currentPoints: parent.currentPoints + officerPoints,
//               totalPoints: parent.totalPoints + officerPoints,
//             }
//           : parent
//       )
//     )

//     alert(`${officerName}さんに役員ポイントとして${officerPoints}ポイントを付与しました。`)
//     setSelectedOfficerUser(null)
//   }

//   return (
//     <div className="min-h-screen p-4 bg-[#fdf8ec]">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.push('/')}
//             className="mr-4 text-main-text hover:bg-point-purple/10"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             管理ダッシュボードへ
//           </Button>
//           <h1 className="text-2xl font-bold text-main-text">ポイント付与</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* イベント選択 */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-main-text flex items-center">
//                 <CalendarCheck className="h-5 w-5 mr-2 text-point-blue" />
//                 イベント参加者へのポイント付与
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <Label htmlFor="event-select">対象イベントを選択 *</Label>
//                 {/* ここにbg-whiteで透け防止＋relativeで重なりを調整 */}
//                 <div className="relative bg-white rounded-md shadow-sm z-10">
//                   <Select onValueChange={setSelectedEventId} value={selectedEventId || ''}>
//                     <SelectTrigger className="border-point-purple/30 focus:border-point-blue bg-white">
//                       <SelectValue placeholder="イベントを選択してください" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white z-50">
//                       {events.map((event) => (
//                         <SelectItem key={event.id} value={event.id}>
//                           {event.title} ({event.date})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               {selectedEvent && (
//                 <div className="mt-4 p-3 bg-point-blue/10 rounded-lg text-sm text-main-text">
//                   <p>**所要時間:** {selectedEvent.durationMinutes}分</p>
//                   <p>**推奨ポイント:** {selectedEvent.totalPoints}pt</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* 参加者一覧とポイント付与 (時間帯別) */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-main-text flex items-center">
//                 <UserCheck className="h-5 w-5 mr-2 text-point-yellow" />
//                 {selectedEvent ? `${selectedEvent.title} の参加者` : 'イベント参加者一覧'}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {!selectedEvent ? (
//                 <div className="text-center text-main-text/70 py-8">
//                   <p>上記からイベントを選択すると、参加者一覧が表示されます。</p>
//                 </div>
//               ) : selectedEvent.timeSlots.every((slot) => slot.participants.length === 0) ? (
//                 <div className="text-center text-main-text/70 py-8">
//                   <p>このイベントにはまだ参加者がいません。</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6 max-h-96 overflow-y-auto">
//                   {selectedEvent.timeSlots.map((timeSlot, slotIndex) => (
//                     <div key={slotIndex} className="border rounded-lg border-point-blue/20 p-4 bg-[#eaf5ff]">
//                       <h3 className="text-lg font-semibold text-point-blue mb-3">
//                         {timeSlot.slot} の参加者
//                       </h3>
//                       {timeSlot.participants.length === 0 ? (
//                         <p className="text-main-text/70 text-sm">
//                           この時間帯には参加者がいません。
//                         </p>
//                       ) : (
//                         <div className="space-y-3">
//                           {timeSlot.participants.map((participant) => {
//                             const currentParent = allParents.find((p) => p.id === participant.id)
//                             const displayCurrentPoints = currentParent
//                               ? currentParent.currentPoints
//                               : 0

//                             return (
//                               <div
//                                 key={participant.id}
//                                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg border-point-purple/20 hover:bg-point-purple/5 bg-white"
//                               >
//                                 <div className="mb-2 sm:mb-0">
//                                   <div className="font-semibold text-main-text">
//                                     {participant.name}
//                                   </div>
//                                   <div className="text-sm text-main-text/70">
//                                     {participant.email}
//                                   </div>
//                                   <Badge className="bg-point-blue text-white mt-1">
//                                     現在: {displayCurrentPoints}pt
//                                   </Badge>
//                                 </div>
//                                 {/* 付与ポイント入力にラベル追加＆フォーム背景も白で透け防止 */}
//                                 <div className="flex items-end gap-2 w-full sm:w-auto bg-white p-2 rounded">
//                                   <div className="flex flex-col">
//                                     <Label
//                                       htmlFor={`input-${participant.id}-${timeSlot.slot}`}
//                                       className="text-xs text-main-text mb-1"
//                                     >
//                                       付与ポイント
//                                     </Label>
//                                     <Input
//                                       id={`input-${participant.id}-${timeSlot.slot}`}
//                                       type="number"
//                                       placeholder="付与ポイント"
//                                       value={
//                                         pointsToAward[`${participant.id}-${timeSlot.slot}`] || ''
//                                       }
//                                       onChange={(e) =>
//                                         setPointsToAward((prev) => ({
//                                           ...prev,
//                                           [`${participant.id}-${timeSlot.slot}`]: e.target.value,
//                                         }))
//                                       }
//                                       className="w-28 border-point-purple/30 focus:border-point-blue bg-white"
//                                     />
//                                   </div>
//                                   <Button
//                                     size="sm"
//                                     className="bg-point-yellow hover:bg-point-yellow/90 text-main-text"
//                                     onClick={() =>
//                                       handleAwardPoints(
//                                         participant.id,
//                                         participant.name,
//                                         selectedEvent.title,
//                                         timeSlot.slot
//                                       )
//                                     }
//                                     disabled={
//                                       !pointsToAward[`${participant.id}-${timeSlot.slot}`] ||
//                                       Number.parseInt(
//                                         pointsToAward[`${participant.id}-${timeSlot.slot}`]
//                                       ) <= 0
//                                     }
//                                   >
//                                     付与
//                                   </Button>
//                                 </div>
//                               </div>
//                             )
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* 役員ポイント付与セクション */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-main-text flex items-center">
//                 <Award className="h-5 w-5 mr-2 text-point-pink" />
//                 役員ポイント付与 (固定 {officerPoints}pt)
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <Label htmlFor="officer-select">対象役員を選択 *</Label>
//                 <div className="relative bg-white rounded-md shadow-sm z-10">
//                   <Select onValueChange={setSelectedOfficerUser} value={selectedOfficerUser || ''}>
//                     <SelectTrigger className="border-point-purple/30 focus:border-point-blue bg-white">
//                       <SelectValue placeholder="役員を選択してください" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white z-50">
//                       {allParents.map((parent) => (
//                         <SelectItem key={parent.id} value={parent.id}>
//                           {parent.name} (現在: {parent.currentPoints}pt)
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <Button
//                 onClick={handleAwardOfficerPoints}
//                 className="w-full bg-point-pink hover:bg-point-pink/90 text-white mt-4"
//                 disabled={!selectedOfficerUser}
//               >
//                 役員ポイントを付与
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* 最近のポイント付与履歴 (変更なし) */}
//         <Card className="mt-6">
//           <CardHeader>
//             <CardTitle className="text-main-text">最近のポイント付与履歴</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {allParents
//                 .filter((p) => p.totalPoints > 0)
//                 .sort((a, b) => b.totalPoints - a.totalPoints)
//                 .slice(0, 5)
//                 .map((parent, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center p-3 border rounded-lg border-point-purple/20 bg-white"
//                   >
//                     <div>
//                       <div className="font-semibold text-main-text">{parent.name}</div>
//                       <div className="text-sm text-main-text/70">合計獲得ポイント</div>
//                     </div>
//                     <div className="text-right">
//                       <Badge className="bg-point-yellow text-main-text">
//                         +{parent.totalPoints}pt
//                       </Badge>
//                       <div className="text-xs text-main-text/70 mt-1">
//                         更新日: {new Date().toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               {allParents.filter((p) => p.totalPoints > 0).length === 0 && (
//                 <div className="text-center text-main-text/70 py-4">
//                   <p>まだポイント付与履歴がありません。</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
