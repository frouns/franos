import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateNoteForm } from './create-note-form'
import { NoteItem } from './note-item'
import Link from 'next/link'

async function NoteList() {
    const supabase = await createClient()
    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })

    if (error) return <div className="text-red-500">Error loading notes</div>

    if (!notes?.length) {
        return <div className="text-center text-gray-500 mt-10">No notes yet. Capture something!</div>
    }

    return (
        <div className="space-y-4 mt-6">
            {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
            ))}
        </div>
    )
}

export default async function InboxPage() {

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                <div className="flex gap-4 text-sm">
                    <Link href="/search" className="text-gray-500 hover:text-gray-900 hover:underline">Search</Link>
                    <Link href="/tags" className="text-gray-500 hover:text-gray-900 hover:underline">
                        Tags
                    </Link>
                </div>
            </div>

            <CreateNoteForm />
            <NoteList />
        </div>
    )
}
