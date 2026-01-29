'use client'

import { createProject } from '@/actions/projects'
import { useActionState } from 'react'

const initialState = {
    error: '',
    success: false
}

type State = { error: string; success: boolean }

async function createProjectAction(prevState: State, formData: FormData) {
    const result = await createProject(formData)
    if (result?.error) {
        return { error: result.error, success: false }
    }
    return { error: '', success: true }
}

export function CreateProjectForm() {
    const [state, formAction, isPending] = useActionState(createProjectAction, initialState)

    return (
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col justify-center items-center text-center transition-colors">
            <h3 className="font-semibold text-gray-900">New Project</h3>
            <form action={formAction} className="mt-4 w-full max-w-xs flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        name="name"
                        className="flex-1 rounded-md border-gray-300 shadow-sm text-sm p-2"
                        placeholder="Project name"
                        required
                        disabled={isPending}
                    />
                    <button
                        disabled={isPending}
                        className="bg-black text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
                {state.error && <p className="text-red-500 text-xs">{state.error}</p>}
            </form>
        </div>
    )
}
