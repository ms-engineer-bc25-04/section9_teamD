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
  
  export async function getEvents(): Promise<Event[]> {
    const res = await fetch('http://localhost:4000/api/events', { cache: 'no-store' })
    if (!res.ok) throw new Error('イベント一覧取得失敗')
    return await res.json() // ← もう events でラップされてないからそのまま
  }
  
  