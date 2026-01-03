"use client"

export default function WinnerSelectionBanner() {
  return (
    <div className="fixed bottom-10 left-0 w-full flex justify-center pointer-events-none">
      <div className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-xl animate-bounce">
        Tap the Winner!
      </div>
    </div>
  )
}
