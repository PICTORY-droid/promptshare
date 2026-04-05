import CreatePromptForm from '@/app/components/CreatePromptForm'

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-blue-600">PromptShare</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <CreatePromptForm />
      </div>
    </main>
  )
}
