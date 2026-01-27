import { Mission } from "@/types/metas";

const missionTemplates: Record<string, string[]> = {
  viagem: ["Pesquisar destinos", "Guardar 15% da renda mensal", "Cotar passagens aéreas"],
  japão: ["Pesquisar roteiros no Japão", "Juntar para passagem", "Reservar hospedagem"],
  carro: ["Pesquisar modelos econômicos", "Guardar 20% da renda mensal", "Cotar seguros"],
  moto: ["Pesquisar modelos", "Simular financiamento", "Juntar entrada"],
  casa: ["Pesquisar bairros", "Simular financiamento", "Juntar entrada de 20%"],
  apartamento: ["Pesquisar bairros", "Simular financiamento", "Juntar entrada de 20%"],
  curso: ["Pesquisar instituições", "Comparar preços", "Reservar para matrícula"],
  mba: ["Pesquisar instituições", "Preparar documentos", "Planejar horários"],
  faculdade: ["Pesquisar cursos", "Fazer inscrição ENEM", "Guardar para mensalidades"],
  intercambio: ["Pesquisar países", "Tirar passaporte", "Estudar idioma"],
  casamento: ["Definir orçamento", "Pesquisar fornecedores", "Montar lista de convidados"],
  emergencia: ["Definir valor de reserva", "Automatizar transferência mensal", "Não tocar no dinheiro"],
  investimento: ["Estudar sobre investimentos", "Abrir conta em corretora", "Começar com aportes pequenos"],
};

export function generateMissions(title: string): Mission[] {
  const lowerTitle = title.toLowerCase();
  
  for (const [keyword, missions] of Object.entries(missionTemplates)) {
    if (lowerTitle.includes(keyword)) {
      return missions.map((missionTitle, i) => ({
        id: `${Date.now()}-${i}`,
        title: missionTitle,
        completed: false,
      }));
    }
  }

  // Missões genéricas
  return [
    { id: `${Date.now()}-0`, title: "Definir valor mensal a guardar", completed: false },
    { id: `${Date.now()}-1`, title: "Pesquisar opções", completed: false },
    { id: `${Date.now()}-2`, title: "Criar cronograma", completed: false },
  ];
}
