'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Warehouses page error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                <p className="text-gray-600 mb-4">Failed to load warehouses data.</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
