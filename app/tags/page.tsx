import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { deleteTag } from '@/actions/tags'
import { CreateTagForm } from './create-tag-form'

async function TagList() {
    const supabase = await createClient()
    const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })

    if (error) return <div className="text-red-500">Error loading tags</div>

    if (!tags?.length) {
        return <div className="text-center text-gray-500 mt-10">No tags yet. Create one!</div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {tags.map((tag) => (
                <div key={tag.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: tag.color }} />
                    <span className="font-medium ml-2">{tag.name}</span>
                    <form action={async () => {
                        'use server'
                        await deleteTag(tag.id)
                    }}>
                        <button className="text-gray-400 hover:text-red-500 transition-colors text-sm" title="Delete Tag">×</button>
                    </form>
                </div>
            ))}
        </div>
    )
}

export default async function TagsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
                <div className="flex gap-4 text-sm">
                    <a href="/inbox" className="text-gray-500 hover:text-gray-900 hover:underline">
                        Inbox
                    </a>
                    <form action="/auth/signout" method="post">
                        <button className="text-gray-500 hover:text-gray-900 border-none bg-transparent p-0 cursor-pointer">Sign Out</button>
                    </form>
                </div>
            </div>

            <CreateTagForm />
            <TagList />
        </div>
    )
}
