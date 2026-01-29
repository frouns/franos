import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'

async function ProjectTasks({ projectId }: { projectId: string }) {
    const supabase = await createClient()
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .neq('status', 'done')
        .order('created_at', { ascending: false })

    if (!tasks?.length) return <div className="text-gray-500 mt-4 italic">No active tasks in this project.</div>

    return (
        <div className="space-y-2 mt-4">
            {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-card border rounded-md">
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.from('tasks').update({ status: 'done' }).eq('id', task.id)
                        redirect(`/projects/${projectId}`)
                    }}>
                        <button className="h-5 w-5 rounded-full border-2 border-gray-400 hover:bg-black hover:border-black" />
                    </form>
                    <span className="flex-1">{task.title}</span>
                    {task.due_date && <span className="text-xs text-gray-400">{format(parseISO(task.due_date), 'MMM d')}</span>}
                </div>
            ))}
        </div>
    )

}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !project) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link href="/projects" className="text-sm text-gray-500 hover:underline mb-4 inline-block">&larr; Back to Projects</Link>
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-gray-500 mt-2">{project.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="text-sm font-semibold mb-2">Add Task to Project</h3>
                <form action={async (formData) => {
                    'use server'
                    const title = formData.get('title') as string
                    if (!title) return
                    const supabase = await createClient()
                    await supabase.from('tasks').insert({ title, project_id: id })
                    redirect(`/projects/${id}`)
                }} className="flex gap-2">
                    <input name="title" className="flex-1 rounded-md border-gray-300 text-sm" placeholder="New task..." required />
                    <button className="bg-black text-white px-3 py-2 rounded-md text-sm font-medium">Add</button>
                </form>
            </div>

            <h2 className="text-lg font-semibold border-b pb-2">Tasks</h2>
            <ProjectTasks projectId={id} />
        </div>
    )
}

import Link from 'next/link'
