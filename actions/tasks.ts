'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function convertNoteToTask(noteId: string, title: string, projectId?: string) {
    const supabase = await createClient()

    // 1. Create Transaction-like logic (Supabase doesn't support multi-table tx via JS client easily, so we do it serially)
    // Ideally this would be an RPC but for MVP JS is fine.

    const { error: taskError } = await supabase.from('tasks').insert({
        title,
        origin_note_id: noteId,
        project_id: projectId || null
    })

    if (taskError) return { error: taskError.message }

    // 2. Archive the note
    const { error: noteError } = await supabase
        .from('notes')
        .update({ is_archived: true })
        .eq('id', noteId)

    if (noteError) return { error: noteError.message }

    revalidatePath('/inbox')
    revalidatePath('/today')
    return { success: true }
}

export async function createTask(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const dueDate = formData.get('dueDate') as string

    if (!title) return { error: 'Title is required' }

    const { error } = await supabase.from('tasks').insert({
        title,
        due_date: dueDate || null
    })

    if (error) return { error: error.message }

    revalidatePath('/today')
    return { success: true }
}
