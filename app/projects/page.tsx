import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreateProjectForm } from './create-project-form'

export default async function ProjectsPage() {
    const supabase = await createClient()

    const { data: projects, error: _error } = await supabase
        .from('projects')
        .select('*, tasks(count)')
        .order('name', { ascending: true })

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <div className="flex gap-4 text-sm">
                    <Link href="/search" className="text-gray-500 hover:text-gray-900 hover:underline">Search</Link>
                    <Link href="/inbox" className="text-gray-500 hover:text-gray-900 hover:underline">Inbox</Link>
                    <Link href="/today" className="text-gray-500 hover:text-gray-900 hover:underline">Today</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CreateProjectForm />

                {projects?.map(project => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block group">
                        <div className="h-full p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-lg group-hover:underline">{project.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{project.description || 'No description'}</p>
                            <div className="mt-4 text-xs font-medium text-gray-400">
                                {project.tasks?.[0]?.count ?? 0} active tasks
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
