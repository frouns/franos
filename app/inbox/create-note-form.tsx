'use client'

import { createNote } from '@/actions/notes'
import { useActionState } from 'react'

const initialState = {
    error: '',
    success: false
}

// Wrapper to match useActionState signature
type State = { error: string; success: boolean }

async function createNoteAction(prevState: State, formData: FormData) {
    const result = await createNote(formData)
    if (result?.error) {
        return { error: result.error, success: false }
    }
    return { error: '', success: true }
}

export function CreateNoteForm() {
    const [state, formAction, isPending] = useActionState(createNoteAction, initialState)

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="content" className="sr-only">Note Content</label>
                <textarea
                    name="content"
                    id="content"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2 disabled:opacity-50"
                    placeholder="Capture a thought..."
                    required
                    disabled={isPending}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.currentTarget.form?.requestSubmit()
                        }
                    }}
                />
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm">
                    {state.error && <span className="text-red-500">{state.error}</span>}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
                >
                    {isPending ? 'Capturing...' : 'Capture'}
                </button>
            </div>
        </form>
    )
}
