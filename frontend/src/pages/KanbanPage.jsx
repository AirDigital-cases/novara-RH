import PipelineBoard from "../components/PipelineBoard";
import SectionCard from "../components/SectionCard";
import { pipelineColumns } from "../lib/mockData";

export default function KanbanPage() {
  return (
    <SectionCard
      eyebrow="Funil"
      title="Kanban de contratacao"
      description="Estrutura preparada para a movimentacao de etapas com `PATCH /api/v1/candidates/:id/status`."
    >
      <PipelineBoard columns={pipelineColumns} />
    </SectionCard>
  );
}
