"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Users,
  Clock,
  Calendar,
  MapPin,
  Award,
  ThumbsUp,
  Handshake,
  Sparkles,
  XCircle,
  AlertCircle,
  ClipboardList,
  MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { addStamp, getStampsForEvent } from "@/actions/stamps"
import {
  applyForEvent,
  cancelParticipation,
  getEventTimeSlotCapacity,
  getUserParticipations,
  getEventParticipantsList,
} from "@/actions/participations"

import { getEventById } from "@/actions/events"
import type { Event } from "@/data/events"

// デモ用のユーザーID (実際には認証システムから取得)
const currentUserId = "user1"

// 日本語の日付文字列をDateオブジェクトにパースするヘルパー関数 (再利用)
const parseJapaneseDate = (dateString: string): Date | null => {
  const match = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (match) {
    const year = Number.parseInt(match[1], 10)
    const month = Number.parseInt(match[2], 10) - 1 // 月は0-indexed
    const day = Number.parseInt(match[3], 10)
    return new Date(year, month, day)
  }
  return null
}

// Next.js 15 params Promise対応
import * as React from "react"
type ParamsType = { id: string }
export default function EventDetailPage({ params }: { params: Promise<ParamsType> }) {
  const router = useRouter()
  const [showParticipationDialog, setShowParticipationDialog] = useState(false)
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false)
  const [cancelTimeSlot, setCancelTimeSlot] = useState<string | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [stamps, setStamps] = useState<{ type: string; count: number }[]>([])
  const [isStampPending, setIsStampPending] = useState(false)
  const [isParticipationPending, setIsParticipationPending] = useState(false)
  const [eventData, setEventData] = useState<Event | null>(null) // イベントデータをnullで初期化
  const [isLoadingEvent, setIsLoadingEvent] = useState(true) // ロード状態を追加
  const [timeSlotCapacities, setTimeSlotCapacities] = useState<
    Record<string, { current: number; max: number; participants: string[] }>
  >({})
  const [userParticipatedSlots, setUserParticipatedSlots] = useState<string[]>([])
  const [allParticipantsList, setAllParticipantsList] = useState<{ id: string; name: string; avatar: string }[]>([])

  // params Promise対応
  const { id: eventId } = React.use(params)

  // ❶ ────────── KEEP ALL HOOK CALLS BEFORE ANY CONDITIONAL RETURN ──────────
  // 参加申請の時間帯を生成
  const timeSlots = useMemo(() => {
    if (!eventData?.time) return []

    const slots: {
      value: string
      label: string
      isFull: boolean
      isParticipated: boolean
    }[] = []

    const [startHour, startMinute] = eventData.time.split(" - ")[0].split(":").map(Number)
    const [endHour, endMinute] = eventData.time.split(" - ")[1].split(":").map(Number)

    let current = new Date(2000, 0, 1, startHour, startMinute)
    const end = new Date(2000, 0, 1, endHour, endMinute)

    while (current.getTime() < end.getTime()) {
      const next = new Date(current.getTime() + 30 * 60 * 1000)
      if (next.getTime() > end.getTime()) break

      const fmt = (d: Date) =>
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`

      const slotValue = `${fmt(current)} - ${fmt(next)}`
      const slotInfo = timeSlotCapacities[slotValue] || { current: 0, max: 0, participants: [] }
      const isFull = slotInfo.max > 0 && slotInfo.current >= slotInfo.max
      const isParticipated = userParticipatedSlots.includes(slotValue)

      // ラベルに「(10pt)」を追加
      slots.push({
        value: slotValue,
        label: `${slotValue} (10pt) (${slotInfo.current}/${slotInfo.max}人)${isFull ? " (満員)" : ""}`,
        isFull,
        isParticipated,
      })
      current = next
    }
    return slots
  }, [eventData?.time, timeSlotCapacities, userParticipatedSlots])

  // イベント全体の現在の参加者数を計算
  const totalCurrentParticipants = useMemo(
    () => Object.values(timeSlotCapacities).reduce((sum, s) => sum + s.current, 0),
    [timeSlotCapacities],
  )

  // 定員関連フラグ
  const maxParticipants = eventData?.maxParticipants ?? 0
  const isFullEvent = maxParticipants > 0 && totalCurrentParticipants >= maxParticipants
  const isRecruiting = eventData?.status === "募集中"

  // データフェッチ
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingEvent(true)
      const fetchedEvent = await getEventById(eventId)
      if (fetchedEvent) {
        setEventData(fetchedEvent)
        const capacities = await getEventTimeSlotCapacity(eventId)
        setTimeSlotCapacities(capacities)

        const userParticipations = await getUserParticipations(eventId, currentUserId)
        setUserParticipatedSlots(userParticipations)

        const participantsList = await getEventParticipantsList(eventId)
        setAllParticipantsList(participantsList)

        const eventStamps = await getStampsForEvent(eventId)
        const stampCounts = eventStamps.reduce(
          (acc, stamp) => {
            acc[stamp.type] = (acc[stamp.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )
        setStamps(Object.entries(stampCounts).map(([type, count]) => ({ type, count })))
      } else {
        // イベントが見つからない場合の処理 (例: 404ページへリダイレクト)
        router.replace("/404")
      }
      setIsLoadingEvent(false)
    }
    fetchData()
  }, [eventId, router])

  const handleCancelConfirm = useCallback((timeSlot: string) => {
    setCancelTimeSlot(timeSlot)
    setShowCancelConfirmDialog(true)
  }, [])

  const handleCancelParticipation = useCallback(async () => {
    if (!cancelTimeSlot) return

    setIsParticipationPending(true)
    setShowCancelConfirmDialog(false)
    const result = await cancelParticipation(eventId, currentUserId, cancelTimeSlot)
    if (result.success) {
      const capacities = await getEventTimeSlotCapacity(eventId)
      setTimeSlotCapacities(capacities)
      const userParticipations = await getUserParticipations(eventId, currentUserId)
      setUserParticipatedSlots(userParticipations)
      const participantsList = await getEventParticipantsList(eventId)
      setAllParticipantsList(participantsList)
    }
    setIsParticipationPending(false)
    setCancelTimeSlot(null)
  }, [eventId, currentUserId, cancelTimeSlot])

  const navigateToEventListMonth = useCallback(() => {
    setShowParticipationDialog(false)
    // eventDataがnullでないことを確認してからアクセス
    const eventDateObj = eventData ? parseJapaneseDate(eventData.date) : null
    if (eventDateObj) {
      const year = eventDateObj.getFullYear()
      const month = eventDateObj.getMonth() + 1
      router.push(`/?year=${year}&month=${month}`)
    } else {
      router.push("/")
    }
  }, [eventData, router]) // 依存配列を eventData に変更

  // ❷ ────────── CONDITIONAL EARLY RETURN ──────────
  if (isLoadingEvent || !eventData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>イベント詳細を読み込み中...</p>
      </div>
    )
  }

  const handleCheckboxChange = (slotValue: string, checked: boolean) => {
    setSelectedTimeSlots((prev) => (checked ? [...prev, slotValue] : prev.filter((s) => s !== slotValue)))
  }

  const handleParticipate = async () => {
    if (selectedTimeSlots.length === 0) {
      alert("参加希望時間を選択してください。")
      return
    }

    const fullSlots = selectedTimeSlots.filter((slot) => {
      const slotInfo = timeSlotCapacities[slot]
      return slotInfo && slotInfo.current >= slotInfo.max
    })

    if (fullSlots.length > 0) {
      alert(`以下の時間帯は満員です: ${fullSlots.join(", ")}。別の時間帯を選択してください。`)
      return
    }

    setIsParticipationPending(true)
    const result = await applyForEvent(eventId, currentUserId, selectedTimeSlots)
    if (result.success) {
      setShowParticipationDialog(true)
      setSelectedTimeSlots([])
      const capacities = await getEventTimeSlotCapacity(eventId)
      setTimeSlotCapacities(capacities)
      const userParticipations = await getUserParticipations(eventId, currentUserId)
      setUserParticipatedSlots(userParticipations)
      const participantsList = await getEventParticipantsList(eventId)
      setAllParticipantsList(participantsList)
    } else {
      alert(result.message)
    }
    setIsParticipationPending(false)
  }

  const handleAddStamp = async (stampType: "ありがとう" | "お疲れ様" | "素晴らしい") => {
    setIsStampPending(true)
    const result = await addStamp(eventId, currentUserId, stampType)
    if (result.success) {
      setStamps((prev) => {
        const existingStamp = prev.find((s) => s.type === stampType)
        if (existingStamp) {
          return prev.map((s) => (s.type === stampType ? { ...s, count: s.count + 1 } : s))
        } else {
          return [...prev, { type: stampType, count: 1 }]
        }
      })
    }
    setIsStampPending(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="イベント詳細" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{eventData.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-base">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>日付: {eventData.date}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>時間: {eventData.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>場所: {eventData.location}</span>
            </div>
            {/* 持ち物項目を追加 */}
            <div className="flex items-start gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="font-medium">持ち物:</span>{" "}
                <span className="text-sm text-muted-foreground">{eventData.itemsToBring}</span>
              </div>
            </div>
            {/* 特記事項項目を追加 */}
            <div className="flex items-start gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="font-medium">特記事項:</span>{" "}
                <span className="text-sm text-muted-foreground">{eventData.specialNotes}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 font-medium text-primary">
              <Award className="h-4 w-4 text-primary" />
              <span>獲得ポイント: {eventData.points}pt</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{eventData.description}</p>

            {/* 参加者アイコン表示 */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                参加者 ({totalCurrentParticipants}/{maxParticipants}名)
              </h3>
              <div className="flex flex-wrap gap-2">
                {allParticipantsList.map((p) => (
                  <Avatar key={p.id} className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={p.avatar || "/placeholder.svg"} alt={p.name} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {/* 残りの枠をプレースホルダーで表示 */}
                {Array.from({ length: Math.max(0, maxParticipants - totalCurrentParticipants) }).map((_, index) => (
                  <Avatar key={`empty-${index}`} className="h-10 w-10 border-2 border-dashed border-muted">
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            {/* 感謝スタンプ機能 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-accent" />
                感謝スタンプ
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddStamp("ありがとう")}
                  disabled={isStampPending}
                  className="flex items-center gap-1 border-accent text-accent hover:bg-accent/10"
                >
                  <Handshake className="h-4 w-4" />
                  ありがとう ({stamps.find((s) => s.type === "ありがとう")?.count || 0})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddStamp("お疲れ様")}
                  disabled={isStampPending}
                  className="flex items-center gap-1 border-secondary text-secondary hover:bg-secondary/10"
                >
                  <Sparkles className="h-4 w-4" />
                  お疲れ様 ({stamps.find((s) => s.type === "お疲れ様")?.count || 0})
                </Button>
                {/* 他のスタンプも追加可能 */}
              </div>
            </div>

            {isRecruiting && !isFullEvent && (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-foreground">参加希望時間 (複数選択可)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <div key={slot.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`slot-${slot.value}`}
                          checked={selectedTimeSlots.includes(slot.value)}
                          onCheckedChange={(checked) => handleCheckboxChange(slot.value, checked as boolean)}
                          disabled={slot.isFull || slot.isParticipated}
                        />
                        <Label
                          htmlFor={`slot-${slot.value}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            slot.isFull || slot.isParticipated ? "text-muted-foreground" : ""
                          }`}
                        >
                          {slot.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleParticipate}
                  disabled={selectedTimeSlots.length === 0 || isParticipationPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isParticipationPending ? "申込み中..." : "選択した時間帯で参加を申し込む"}
                </Button>
              </>
            )}
            {isFullEvent && (
              <Button disabled className="w-full bg-muted text-muted-foreground">
                イベント全体の定員に達しました
              </Button>
            )}
            {!isRecruiting && eventData.status === "募集前" && (
              <Button disabled className="w-full bg-secondary text-secondary-foreground">
                募集開始前です
              </Button>
            )}
            {!isRecruiting && eventData.status === "終了" && (
              <Button disabled className="w-full bg-muted text-muted-foreground">
                イベントは終了しました
              </Button>
            )}

            {/* ユーザーの参加状況とキャンセルボタン */}
            {userParticipatedSlots.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  あなたの参加状況
                </h3>
                <div className="space-y-2">
                  {userParticipatedSlots.map((slot) => (
                    <div key={slot} className="flex items-center justify-between p-3 rounded-lg bg-secondary/10">
                      <span className="font-medium">{slot}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelConfirm(slot)}
                        disabled={isParticipationPending}
                        className="flex items-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        キャンセル
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Button
          variant="outline"
          onClick={navigateToEventListMonth}
          className="mt-4 w-full border-primary text-primary hover:bg-primary/10"
        >
          イベント一覧に戻る
        </Button>
      </main>

      {/* 参加申込み完了ダイアログ */}
      <Dialog open={showParticipationDialog} onOpenChange={setShowParticipationDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-accent mb-4" />
            <DialogTitle className="text-2xl font-bold">参加申込み完了！</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-lg">
            <p className="mb-2">{eventData.title}への参加申込みが完了しました。</p>
            <p>ご協力ありがとうございます！</p>
            {selectedTimeSlots.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">希望時間: {selectedTimeSlots.join(", ")}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={navigateToEventListMonth}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              イベント一覧に戻る
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* キャンセル確認ダイアログ */}
      <Dialog open={showCancelConfirmDialog} onOpenChange={setShowCancelConfirmDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader className="flex flex-col items-center text-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <DialogTitle className="text-2xl font-bold">参加をキャンセルしますか？</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {cancelTimeSlot} の参加をキャンセルします。この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirmDialog(false)}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
            >
              いいえ
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelParticipation}
              disabled={isParticipationPending}
              className="w-full sm:w-auto"
            >
              {isParticipationPending ? "キャンセル中..." : "はい、キャンセルします"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}