'use client'

import { createReview } from '@/actions/reviews'
import { useActionState } from 'react'

const initialState = {
    error: '',
    success: false
}

type State = { error: string; success: boolean }

// Wrapper for type safety
async function createReviewAction(prevState: State, formData: FormData) {
    const result = await createReview(formData)
    if (result?.error) {
        return { error: result.error, success: false }
    }
    return { error: '', success: true }
}

type Props = {
    stats: {
        completedTasks: number
        capturedNotes: number
    }
    weekStart: string
}

export function CreateReviewForm({ stats, weekStart }: Props) {
    const [state, formAction, isPending] = useActionState(createReviewAction, initialState)

    return (
        <form action={formAction} className="space-y-6 max-w-xl">
            <input type="hidden" name="weekStart" value={weekStart} />
            <input type="hidden" name="stats" value={JSON.stringify(stats)} />

            <div className="bg-gray-100 p-4 rounded-lg flex gap-8 justify-around text-center">
                <div>
                    <span className="block text-3xl font-bold">{stats.completedTasks}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Tasks Done</span>
                </div>
                <div>
                    <span className="block text-3xl font-bold">{stats.capturedNotes}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Notes Added</span>
                </div>
            </div>

            <div>
                <label htmlFor="highlights" className="block text-sm font-medium leading-6 text-gray-900">Highlights of the Week</label>
                <div className="mt-2">
                    <textarea
                        id="highlights"
                        name="highlights"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2"
                        placeholder="What went well?"
                        required
                        disabled={isPending}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="challenges" className="block text-sm font-medium leading-6 text-gray-900">Challenges & Blockers</label>
                <div className="mt-2">
                    <textarea
                        id="challenges"
                        name="challenges"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 pl-2"
                        placeholder="What got in the way?"
                        required
                        disabled={isPending}
                    />
                </div>
            </div>

            {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Complete Review'}
                </button>
            </div>
        </form>
    )
}
