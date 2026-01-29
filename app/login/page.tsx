'use client'

import { login } from '@/actions/auth'
import { useState } from 'react'
import { cn } from '@/utils/cn'

export default function LoginPage() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)
        setError(null)

        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setMessage(result.success)
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">FranOS</h1>
                    <p className="mt-2 text-sm text-gray-500">Sign in to your personal operating system</p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={cn(
                                    "relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300",
                                    "placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6",
                                    "px-3"
                                )}
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending link...' : 'Send Magic Link'}
                        </button>
                    </div>

                    {message && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
