'use client'

import { searchGlobal, type SearchResult } from '@/actions/search'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchInterface() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSearch = useDebouncedCallback((term: string) => {
        if (term.length < 2) {
            setResults([])
            return
        }

        startTransition(async () => {
            const { results } = await searchGlobal(term)
            setResults(results || [])
        })
    }, 300)

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>

            <div className="relative">
                <input
                    type="text"
                    className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-lg sm:leading-6 pl-4"
                    placeholder="Search notes, tasks, projects..."
                    onChange={(e) => {
                        setQuery(e.target.value)
                        handleSearch(e.target.value)
                    }}
                    autoFocus
                />
                {isPending && (
                    <div className="absolute right-3 top-3.5">
                        <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full" />
                    </div>
                )}
            </div>

            <div className="mt-6 space-y-2">
                {results.map((result) => (
                    <Link
                        key={`${result.type}-${result.id}`}
                        href={result.url}
                        className="block p-4 rounded-lg border hover:border-black transition-colors bg-card"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">{result.title}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{result.subtitle}</p>
                            </div>
                            <span className="text-gray-400">&rarr;</span>
                        </div>
                    </Link>
                ))}

                {query.length >= 2 && !isPending && results.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">No results found.</p>
                )}
            </div>
        </div>
    )
}
