import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PlanComparison = () => {
  // Data for official Zaia plans
  const zaiaPlans = [
    {
      nome: "Aceleração",
      valor_mensal: 249,
      agentes: 10,
      creditos_por_agente: 5000,
      caracteres_treinamento: 4000000,
      integracoes_avancadas: false,
      suporte_1a1: false
    },
    {
      nome: "Growth",
      valor_mensal: 490,
      agentes: 40,
      creditos_por_agente: 10000,
      caracteres_treinamento: 12000000,
      integracoes_avancadas: true,
      suporte_1a1: false
    },
    {
      nome: "Scale Up",
      valor_mensal: 990,
      agentes: "ilimitado",
      creditos_por_agente: 20000,
      caracteres_treinamento: 24000000,
      integracoes_avancadas: true,
      suporte_1a1: true
    },
    {
      nome: "White Label",
      valor_mensal: 997,
      descricao: "Personalização completa da plataforma, domínio próprio, ideal para revendedores"
    }
  ];

  // Data for model comparison
  const comparisonData = [
    {
      aspecto: "Investimento Inicial",
      compartilhado: "R$ 1.987 (Scale Up + White Label)",
      individual: "A partir de R$ 249 por cliente"
    },
    {
      aspecto: "Escalabilidade",
      compartilhado: "Ilimitada, sem custo adicional por cliente",
      individual: "Linear, custo cresce com cada cliente"
    },
    {
      aspecto: "Gestão de Créditos",
      compartilhado: "Necessário controle e distribuição",
      individual: "Sem necessidade de gestão"
    },
    {
      aspecto: "Marca",
      compartilhado: "Sua marca na plataforma",
      individual: "Marca Zaia"
    },
    {
      aspecto: "Complexidade Operacional",
      compartilhado: "Requer mais atenção e controles",
      individual: "Simples, direto"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
        Planos Oficiais Zaia
      </h2>
      
      {/* Official Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {zaiaPlans.map((plan) => (
          <Card key={plan.nome} className="bg-slate-800/90 border-slate-700 hover:border-blue-500 transition-all duration-300 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-white">{plan.nome}</CardTitle>
              <CardDescription className="text-slate-200 text-lg font-bold">
                R$ {plan.valor_mensal}/mês
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-200">
              {plan.descricao ? (
                <p>{plan.descricao}</p>
              ) : (
                <ul className="space-y-2">
                  <li>✓ {typeof plan.agentes === 'string' ? plan.agentes : `${plan.agentes}`} agentes</li>
                  <li>✓ {plan.creditos_por_agente.toLocaleString()} créditos/agente</li>
                  <li>✓ {(plan.caracteres_treinamento / 1000000).toFixed(1)}M caracteres para treinamento</li>
                  <li className={plan.integracoes_avancadas ? "text-emerald-400" : "text-slate-500"}>
                    {plan.integracoes_avancadas ? "✓" : "✘"} Integrações avançadas
                  </li>
                  <li className={plan.suporte_1a1 ? "text-emerald-400" : "text-slate-500"}>
                    {plan.suporte_1a1 ? "✓" : "✘"} Suporte 1:1
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold my-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
        Comparativo de Modelos de Negócio
      </h2>
      
      {/* Comparison Table */}
      <Card className="bg-slate-800/90 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900">
                  <TableHead className="w-1/3 text-white font-semibold">Aspecto</TableHead>
                  <TableHead className="w-1/3 text-blue-300 font-semibold">Compartilhado (WL + Scale Up)</TableHead>
                  <TableHead className="w-1/3 text-orange-300 font-semibold">Individual (Aceleração, Growth, Scale Up)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((item, index) => (
                  <TableRow 
                    key={index}
                    className="border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <TableCell className="font-medium text-white">{item.aspecto}</TableCell>
                    <TableCell className="text-slate-200">{item.compartilhado}</TableCell>
                    <TableCell className="text-slate-200">{item.individual}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modelo Visual Comparativo */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-blue-950/90 to-blue-900/80 border border-blue-700/50 p-4 hover:scale-[1.01] transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-center text-blue-200 text-2xl">Modelo Compartilhado (White Label)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-40 w-40 bg-blue-800/40 rounded-full flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">1 Plano</div>
                <div className="text-xl text-blue-300">→</div>
                <div className="text-2xl font-bold text-blue-200">N Clientes</div>
              </div>
            </div>
            <p className="text-slate-100 text-center text-lg">
              Uma única conta com plano Scale Up + White Label que atende múltiplos clientes.
              <br />
              <span className="font-bold text-blue-200 mt-2 block">Escale horizontalmente!</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/90 to-orange-900/80 border border-orange-700/50 p-4 hover:scale-[1.01] transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-center text-orange-200 text-2xl">Modelo Individual por Cliente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-40 w-40 bg-orange-800/40 rounded-full flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-200">1 Cliente</div>
                <div className="text-xl text-orange-300">↓</div>
                <div className="text-2xl font-bold text-orange-200">1 Plano</div>
              </div>
            </div>
            <p className="text-slate-100 text-center text-lg">
              Cada cliente possui sua própria conta com um plano específico.
              <br />
              <span className="font-bold text-orange-200 mt-2 block">Simplicidade operacional!</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanComparison;
