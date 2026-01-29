import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
            <p className="text-gray-600">There was an issue logging you in. The link may have expired or is invalid.</p>
            <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
                Return to Login
            </Link>
        </div>
    )
}
