import { KanbanBoard } from '@/components/pipeline/kanban-board'

export default function PipelinePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pipeline</h2>
        <p className="text-sm text-muted-foreground">
          Arraste os deals entre os estágios para atualizar o pipeline.
        </p>
      </div>
      <KanbanBoard />
    </div>
  )
}
