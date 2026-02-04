import * as React from "react";
import { useState } from "react";
import { Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meta, MetaFormData } from "@/types/metas";
import { MetaFormModal } from "@/components/metas/MetaFormModal";
import { MetaVaultCard } from "@/components/metas/MetaVaultCard";
import { AddFundsModal } from "@/components/metas/AddFundsModal";
import { TimeMachineSimulator } from "@/components/metas/TimeMachineSimulator";
import { generateMissions } from "@/lib/missionGenerator";

// Mock data inicial
const initialMetas: Meta[] = [
  {
    id: "1",
    title: "Viagem Japão",
    targetValue: 25000,
    currentValue: 15750,
    icon: "plane",
    deadline: new Date("2025-12-01"),
    missions: [
      { id: "1a", title: "Economizar R$500/mês", completed: true },
      { id: "1b", title: "Vender itens usados", completed: true },
      { id: "1c", title: "Reservar passagem", completed: false },
      { id: "1d", title: "Definir roteiro", completed: false },
    ],
  },
  {
    id: "2",
    title: "Entrada Apartamento",
    targetValue: 80000,
    currentValue: 32000,
    icon: "home",
    deadline: new Date("2027-06-01"),
    missions: [
      { id: "2a", title: "Abrir conta poupança", completed: true },
      { id: "2b", title: "Investir em CDB", completed: true },
      { id: "2c", title: "Cortar gastos supérfluos", completed: false },
    ],
  },
  {
    id: "3",
    title: "Curso de MBA",
    targetValue: 45000,
    currentValue: 45000,
    icon: "graduation",
    deadline: null,
    missions: [
      { id: "3a", title: "Pesquisar instituições", completed: true },
      { id: "3b", title: "Fazer inscrição", completed: true },
      { id: "3c", title: "Pagar matrícula", completed: true },
    ],
  },
  {
    id: "4",
    title: "Trocar de Carro",
    targetValue: 60000,
    currentValue: 52000,
    icon: "car",
    deadline: new Date("2026-01-01"),
    missions: [
      { id: "4a", title: "Vender carro atual", completed: true },
      { id: "4b", title: "Pesquisar financiamento", completed: true },
      { id: "4c", title: "Juntar entrada", completed: false },
    ],
  },
];

export function MetasView() {
  const [metas, setMetas] = useState<Meta[]>(initialMetas);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [selectedMetaForFunds, setSelectedMetaForFunds] = useState<Meta | null>(null);

  const handleOpenCreate = () => {
    setEditingMeta(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (meta: Meta) => {
    setEditingMeta(meta);
    setIsFormModalOpen(true);
  };

  const handleOpenAddFunds = (meta: Meta) => {
    setSelectedMetaForFunds(meta);
    setIsAddFundsModalOpen(true);
  };

  const handleSave = (data: MetaFormData) => {
    if (editingMeta) {
      setMetas((prev) =>
        prev.map((meta) =>
          meta.id === editingMeta.id ? { ...meta, ...data } : meta
        )
      );
    } else {
      const newMeta: Meta = {
        id: Date.now().toString(),
        ...data,
        missions: generateMissions(data.title),
      };
      setMetas((prev) => [newMeta, ...prev]);
    }
  };

  const handleAddFunds = (metaId: string, amount: number) => {
    setMetas((prev) =>
      prev.map((meta) => {
        if (meta.id !== metaId) return meta;
        const newValue = Math.min(meta.currentValue + amount, meta.targetValue);
        return { ...meta, currentValue: newValue };
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-primary/20 neon-glow-emerald">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Meus Cofres
            </h1>
          </div>
          <p className="text-muted-foreground">
            Guarde dinheiro e alcance suas metas financeiras
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-emerald"
        >
          <Plus className="w-5 h-5" />
          Novo Cofre
        </Button>
      </header>

      {/* Metas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metas.map((meta) => (
          <MetaVaultCard
            key={meta.id}
            meta={meta}
            onEdit={handleOpenEdit}
            onAddFunds={handleOpenAddFunds}
          />
        ))}
      </div>

      {/* Empty State */}
      {metas.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
            <Target className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Nenhum cofre criado
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece criando seu primeiro cofre para guardar dinheiro
          </p>
          <Button
            onClick={handleOpenCreate}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Cofre
          </Button>
        </div>
      )}

      {/* Time Machine Simulator */}
      <TimeMachineSimulator />

      {/* Form Modal */}
      <MetaFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        editingMeta={editingMeta}
      />

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        meta={selectedMetaForFunds}
        onAddFunds={handleAddFunds}
      />
    </div>
  );
}
