'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTag(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const color = formData.get('color') as string || '#94a3b8' // default slate-400

    if (!name || name.trim().length === 0) {
        return { error: 'Name cannot be empty' }
    }

    const { error } = await supabase.from('tags').insert({ name, color })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/tags')
    return { success: true }
}

export async function deleteTag(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('tags').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/tags')
    return { success: true }
}
