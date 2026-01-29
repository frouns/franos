import Link from 'next/link'
import SearchInterface from './search-interface'

export default function SearchPage() {
    return (
        <div>
            <div className="max-w-2xl mx-auto p-6 pb-0">
                <Link href="/inbox" className="text-sm text-gray-500 hover:underline mb-4 inline-block">&larr; Back to Inbox</Link>
            </div>
            <SearchInterface />
        </div>
    )
}
