import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

type WeeklyReview = {
    id: string
    week_start_date: string
    highlights: string
    challenges: string
    metrics: { completedTasks: number, capturedNotes: number }
    created_at: string
}

export default async function ReviewsPage() {
    const supabase = await createClient()

    const { data: reviewsData, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .order('week_start_date', { ascending: false })

    if (error) return <div className="text-red-500">Error loading reviews</div>

    const reviews = reviewsData as unknown as WeeklyReview[]

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                <div className="flex gap-4 text-sm items-center">
                    <Link href="/search" className="text-gray-500 hover:text-gray-900 hover:underline">Search</Link>
                    <Link href="/inbox" className="text-gray-500 hover:text-gray-900 hover:underline">Inbox</Link>
                    <Link href="/reviews/new" className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">Start Review</Link>
                </div>
            </div>

            {!reviews?.length && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No reviews yet.</p>
                    <Link href="/reviews/new" className="text-blue-600 hover:underline">Complete your first Weekly Review</Link>
                </div>
            )}

            <div className="space-y-6">
                {reviews?.map(review => (
                    <div key={review.id} className="p-6 bg-card border rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg">
                                Week of {format(parseISO(review.week_start_date), 'MMM d, yyyy')}
                            </h3>
                            <div className="flex gap-4 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                <span>{review.metrics?.completedTasks ?? 0} Tasks</span>
                                <span>|</span>
                                <span>{review.metrics?.capturedNotes ?? 0} Notes</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-1">Highlights</h4>
                                <p className="whitespace-pre-wrap text-sm">{review.highlights}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-1">Challenges</h4>
                                <p className="whitespace-pre-wrap text-sm">{review.challenges}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
