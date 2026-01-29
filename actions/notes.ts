'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNote(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string

    if (!content || content.trim().length === 0) {
        return { error: 'Content cannot be empty' }
    }

    const { error } = await supabase.from('notes').insert({ content })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/inbox')
    return { success: true }
}

export async function deleteNote(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/inbox')
    return { success: true }
}
