'use client'

import { createTag } from '@/actions/tags'
import { useActionState } from 'react'

const initialState = {
    error: '',
    success: false
}

type State = { error: string; success: boolean }

async function createTagAction(prevState: State, formData: FormData) {
    const result = await createTag(formData)
    if (result?.error) {
        return { error: result.error, success: false }
    }
    return { error: '', success: true }
}

export function CreateTagForm() {
    const [state, formAction, isPending] = useActionState(createTagAction, initialState)

    return (
        <form action={formAction} className="space-y-4 mb-8 p-4 bg-muted/50 rounded-lg">
            <h2 className="text-sm font-semibold mb-2">New Tag</h2>
            <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <label htmlFor="name" className="sr-only">Tag Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        disabled={isPending}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2 disabled:opacity-50"
                        placeholder="e.g., Work, Personal, Ideas"
                        required
                    />
                    {state.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
                </div>
                <div className="w-20">
                    <label htmlFor="color" className="sr-only">Color</label>
                    <input type="color" name="color" className="h-9 w-full rounded cursor-pointer border p-0.5" defaultValue="#94a3b8" disabled={isPending} />
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black whitespace-nowrap disabled:opacity-50"
                >
                    {isPending ? 'Adding...' : 'Add Tag'}
                </button>
            </div>
        </form>
    )
}
