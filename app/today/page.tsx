import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { format, isPast, isToday, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import Link from 'next/link'

type Task = {
    id: string
    title: string
    status: string
    due_date: string | null
    created_at: string
    projects: { name: string } | null
    project_id: string | null
}

// Helper to check if task matches filters
function matchesFilters(task: Task, projectIdFilter?: string) {
    if (projectIdFilter && task.project_id !== projectIdFilter) return false
    return true
}

async function TaskList({ searchParams }: { searchParams: { project?: string } }) {
    const supabase = await createClient()

    const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .neq('status', 'done')
        .order('due_date', { ascending: true })

    if (error) return <div className="text-red-500">Error loading tasks</div>

    const tasks = tasksData as unknown as Task[]

    if (!tasks?.length) {
        return <div className="text-center text-gray-500 mt-10">No active tasks. You&apos;re all caught up!</div>
    }

    // Apply filters
    const filteredTasks = tasks.filter(t => matchesFilters(t, searchParams.project))

    const dueTasks = filteredTasks.filter(t => {
        if (!t.due_date) return false
        const dates = parseISO(t.due_date)
        return isPast(dates) || isToday(dates)
    })

    const otherTasks = filteredTasks.filter(t => !dueTasks.includes(t))

    if (filteredTasks.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No tasks match your filters.</div>
    }

    return (
        <div className="space-y-6 mt-6">
            {dueTasks.length > 0 && (
                <div>
                    <h2 className="font-semibold text-lg text-red-600 mb-3">Due Today & Overdue</h2>
                    <div className="space-y-2">
                        {dueTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="font-semibold text-lg text-gray-900 mb-3">{dueTasks.length > 0 ? 'Other Tasks' : 'All Tasks'}</h2>
                <div className="space-y-2">
                    {otherTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function TaskItem({ task }: { task: Task }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-card border rounded-md shadow-sm">
            <form action={async () => {
                'use server'
                const supabase = await createClient()
                await supabase.from('tasks').update({ status: 'done' }).eq('id', task.id)
                redirect('/today')
            }}>
                <button className="h-5 w-5 rounded-full border-2 border-gray-400 hover:bg-black hover:border-black transition-colors" />
            </form>
            <div className="flex-1">
                <p className={cn("font-medium", task.status === 'done' && "line-through text-gray-400")}>{task.title}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                    {task.projects?.name && (
                        <Link href={`/today?project=${task.project_id}`} className="text-blue-600 hover:underline">
                            #{task.projects.name}
                        </Link>
                    )}
                    {task.due_date && <span>{format(parseISO(task.due_date), 'MMM d')}</span>}
                </div>
            </div>
        </div>
    )
}

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
    const params = await searchParams
    const supabase = await createClient()

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Today</h1>
                <div className="flex gap-4 text-sm items-center">
                    <Link href="/search" className="text-gray-500 hover:text-gray-900 hover:underline">Search</Link>
                    <Link href="/inbox" className="text-gray-500 hover:text-gray-900 hover:underline">Inbox</Link>
                    <Link href="/projects" className="text-gray-500 hover:text-gray-900 hover:underline">Projects</Link>
                </div>
            </div>

            {params.project && (
                <div className="mb-4 flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm w-fit">
                    <span>Filtering by Project</span>
                    <Link href="/today" className="font-bold hover:text-blue-900">&times;</Link>
                </div>
            )}

            <TaskList searchParams={params} />
        </div>
    )
}
