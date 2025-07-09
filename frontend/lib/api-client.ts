export type Participant = {
    id: string
    name: string
    email: string
    role: string
  }
  
  export type Event = {
    id: string
    title: string
    date: string
    capacity: number
    description: string
    deadline: string
    point: number
    applicationsCount: number 
  }

  export type PointTransaction = {
    id: string
    userId: string
    type: "earn" | "spend"
    amount: number
    description: string
    date: string
  }
  
  
  // イベント一覧
  export async function getEvents(): Promise<Event[]> {
    const res = await fetch('http://localhost:4000/api/events', { cache: 'no-store' })
    if (!res.ok) throw new Error('イベント一覧取得失敗')
    return await res.json() // ← もう events でラップされてないからそのまま
  }
  

  // ポイント確認
  export async function getUserPoints(token: string, userId: string): Promise<number> {
    console.log("DEBUG getUserPoints dummy:", token, userId)
    return 250
  }
    

    // const res = await fetch("http://localhost:4000/api/points", {
    //   cache: "no-store",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    // if (!res.ok) throw new Error("ポイント取得失敗")
    // const data = await res.json()
    // return data.balance
  // }
  
  export async function getPointHistory(userId: string): Promise<PointTransaction[]> {
    console.log("DEBUG getPointHistory dummy:", userId)
    return [] // 仮で空配列を返す
  }
  
  // export async function getPointHistory(userId: string, token: string): Promise<PointTransaction[]> {
  //   const res = await fetch(`http://localhost:4000/api/points/${userId}/history`, {
  //     cache: "no-store",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   if (!res.ok) throw new Error("履歴取得失敗")
  //   return res.json()
  // }
  
  export async function spendPoints(rewardId: string, token: string) {
    const res = await fetch(`http://localhost:4000/api/rewards/${rewardId}/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
    if (!res.ok) return { success: false, message: "交換に失敗しました" }
    return { success: true, message: "交換が完了しました！" }
  }
  