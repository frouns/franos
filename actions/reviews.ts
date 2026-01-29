'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'

export async function getWeeklyStats() {
    const supabase = await createClient()
    const now = new Date()
    const start = startOfWeek(now, { weekStartsOn: 1 }).toISOString()
    const end = endOfWeek(now, { weekStartsOn: 1 }).toISOString()

    // Count completed tasks this week
    const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')
        .gte('created_at', start) // Approximation (should be completed_at ideally, but created_at is fine for MVP)
        .lte('created_at', end)

    // Count notes captured
    const { count: capturedNotes } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', start)
        .lte('created_at', end)

    return {
        completedTasks: completedTasks || 0,
        capturedNotes: capturedNotes || 0
    }
}

export async function createReview(formData: FormData) {
    const supabase = await createClient()

    const highlights = formData.get('highlights') as string
    const challenges = formData.get('challenges') as string
    const weekStart = formData.get('weekStart') as string
    const statsStr = formData.get('stats') as string

    const metrics = statsStr ? JSON.parse(statsStr) : {}

    const { error } = await supabase.from('weekly_reviews').insert({
        week_start_date: weekStart,
        highlights,
        challenges,
        metrics
    })

    if (error) return { error: error.message }

    revalidatePath('/reviews')
    return { success: true }
}
