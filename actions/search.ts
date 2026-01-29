'use server'

import { createClient } from '@/utils/supabase/server'

export type SearchResult = {
    type: 'note' | 'task' | 'project'
    id: string
    title: string
    subtitle?: string
    url: string
}

export async function searchGlobal(query: string): Promise<{ results: SearchResult[], error?: string }> {
    if (!query || query.length < 2) return { results: [] }

    const supabase = await createClient()
    const term = `%${query}%`

    // Parallel queries
    const [notesRes, tasksRes, projectsRes] = await Promise.all([
        supabase.from('notes').select('id, content, created_at').ilike('content', term).limit(5),
        supabase.from('tasks').select('id, title, created_at').ilike('title', term).limit(5),
        supabase.from('projects').select('id, name, description').ilike('name', term).limit(5)
    ])

    const results: SearchResult[] = []

    if (notesRes.data) {
        results.push(...notesRes.data.map(n => ({
            type: 'note' as const,
            id: n.id,
            title: n.content.substring(0, 50) + (n.content.length > 50 ? '...' : ''),
            subtitle: 'Note',
            url: '/inbox' // Ideally jump to note, but inbox is fine
        })))
    }

    if (tasksRes.data) {
        results.push(...tasksRes.data.map(t => ({
            type: 'task' as const,
            id: t.id,
            title: t.title,
            subtitle: 'Task',
            url: '/today' // Or project context
        })))
    }

    if (projectsRes.data) {
        results.push(...projectsRes.data.map(p => ({
            type: 'project' as const,
            id: p.id,
            title: p.name,
            subtitle: 'Project',
            url: `/projects/${p.id}`
        })))
    }

    return { results }
}
