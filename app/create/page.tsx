import CreatePromptForm from '@/app/components/CreatePromptForm'

export default function CreatePage() {
  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <CreatePromptForm />
      </div>
    </main>
  )
}