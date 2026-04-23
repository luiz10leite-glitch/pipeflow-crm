export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <span className="text-sm font-bold text-white">P</span>
        </div>
        <span className="text-lg font-semibold text-white">PipeFlow</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
