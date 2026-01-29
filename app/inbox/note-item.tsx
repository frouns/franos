'use client'

import { useState } from 'react'
import { deleteNote } from '@/actions/notes'
import { convertNoteToTask } from '@/actions/tasks'
import { convertNoteToProject } from '@/actions/projects'

type Note = {
    id: string
    content: string
    created_at: string
}

export function NoteItem({ note }: { note: Note }) {
    const [mode, setMode] = useState<'view' | 'convert_task' | 'convert_project'>('view')
    const [loading, setLoading] = useState(false)

    // Task Form State
    const [taskTitle, setTaskTitle] = useState(note.content)

    // Project Form State
    const [projectName, setProjectName] = useState(note.content)

    async function handleConvertTask() {
        setLoading(true)
        const result = await convertNoteToTask(note.id, taskTitle)
        setLoading(false)
        if (result?.error) {
            alert(result.error)
        }
        // If success, the component will unmount/refresh via server action revalidation
    }

    async function handleConvertProject() {
        setLoading(true)
        const result = await convertNoteToProject(note.id, projectName)
        setLoading(false)
        if (result?.error) {
            alert(result.error)
        }
    }

    if (mode === 'convert_task') {
        return (
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <h3 className="font-semibold text-sm">Convert to Task</h3>
                <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task Title"
                    disabled={loading}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => setMode('view')}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConvertTask}
                        disabled={loading}
                        className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </div>
        )
    }

    if (mode === 'convert_project') {
        return (
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <h3 className="font-semibold text-sm">Convert to Project</h3>
                <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project Name"
                    disabled={loading}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => setMode('view')}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConvertProject}
                        disabled={loading}
                        className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-3 group">
            <p className="whitespace-pre-wrap">{note.content}</p>

            <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-transparent group-hover:border-border/50">
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('convert_task')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                    >
                        To Task
                    </button>
                    <button
                        onClick={() => setMode('convert_project')}
                        className="text-xs font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
                    >
                        To Project
                    </button>
                </div>

                <form action={async () => {
                    const res = await deleteNote(note.id)
                    if (res?.error) alert(res.error)
                }}>
                    <button className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 transition-colors">Delete</button>
                </form>
            </div>
        </div>
    )
}
