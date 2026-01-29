import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getWeeklyStats } from '@/actions/reviews'
import { CreateReviewForm } from '../create-review-form'
import { startOfWeek, format } from 'date-fns'
import Link from 'next/link'

export default async function NewReviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const stats = await getWeeklyStats()
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <Link href="/reviews" className="text-sm text-gray-500 hover:underline mb-4 inline-block">&larr; Back to Reviews</Link>
                <h1 className="text-3xl font-bold tracking-tight">Weekly Review</h1>
                <p className="text-gray-500 mt-2">Week of {format(weekStart, 'MMM d, yyyy')}</p>
            </div>

            <CreateReviewForm stats={stats} weekStart={weekStart.toISOString()} />
        </div>
    )
}
