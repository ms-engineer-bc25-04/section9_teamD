'use server'
import type { Event } from '@/data/events'

export async function getEventById(id: string): Promise<Event | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return undefined
  return res.json()
}
