'use client'

export default function WorkError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <p className="text-[15px] text-fog-gray">Could not load this work.</p>
      <button onClick={reset} className="btn btn-accent btn-sm">Try again</button>
    </div>
  )
}
