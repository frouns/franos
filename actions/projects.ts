'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function convertNoteToProject(noteId: string, name: string) {
    const supabase = await createClient()

    const { error: projError } = await supabase.from('projects').insert({
        name,
        description: 'Converted from note'
        // could copy note content to description if desired
    })

    if (projError) return { error: projError.message }

    const { error: noteError } = await supabase
        .from('notes')
        .update({ is_archived: true })
        .eq('id', noteId)

    if (noteError) return { error: noteError.message }

    revalidatePath('/inbox')
    revalidatePath('/projects')
    return { success: true }
}

export async function createProject(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    if (!name) return { error: 'Name is required' }

    const { error } = await supabase.from('projects').insert({ name })

    if (error) return { error: error.message }

    revalidatePath('/projects')
    return { success: true }
}
