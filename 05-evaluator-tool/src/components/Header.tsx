export function Header({ backendOk }: { backendOk: boolean | null }) {
  return (
    <header className="bg-white border-b border-google-gray-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Google Ads AI Evaluator</h1>
        <p className="text-sm text-google-gray mt-0.5">
          Evaluate AI support assistant responses against the LLM judge rubric
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            backendOk === null
              ? 'bg-gray-300'
              : backendOk
              ? 'bg-google-green'
              : 'bg-google-red'
          }`}
        />
        <span className="text-sm text-google-gray">
          {backendOk === null ? 'Checking backend…' : backendOk ? 'Backend connected' : 'Backend offline'}
        </span>
      </div>
    </header>
  )
}
