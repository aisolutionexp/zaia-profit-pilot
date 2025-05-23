
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SimulationResultsProps {
  results: {
    modelType: "compartilhado" | "individual";
    baseMonthlyPrice?: number;
    clientCount: number;
    marginPercent: number;
    pricePerClient: number;
    totalRevenue: number;
    profit: number;
    profitMargin: number;
    planType?: string;
    planPrice?: number;
    totalCost?: number;
    comparison?: {
      totalRevenue: number;
      totalCost: number;
      profit: number;
      profitDifference: number;
    };
  };
}

const getPlanName = (planType: string | undefined) => {
  switch(planType) {
    case "aceleracao": return "Aceleração";
    case "growth": return "Growth";
    case "scaleUp": return "Scale Up";
    default: return "Aceleração";
  }
};

const SimulationResults = ({ results }: SimulationResultsProps) => {
  // Determine which model is better based on profit
  const isCompartilhadoBetter = results.comparison ? 
    (results.modelType === "compartilhado" && results.comparison.profitDifference > 0) || 
    (results.modelType === "individual" && results.comparison.profitDifference < 0) : 
    false;
  
  // Create chart data
  const chartData = [
    {
      name: "Custo Mensal",
      compartilhado: results.modelType === "compartilhado" ? results.baseMonthlyPrice : results.comparison?.totalCost,
      individual: results.modelType === "individual" ? results.totalCost : results.comparison?.totalCost,
    },
    {
      name: "Faturamento",
      compartilhado: results.modelType === "compartilhado" ? results.totalRevenue : results.comparison?.totalRevenue,
      individual: results.modelType === "individual" ? results.totalRevenue : results.comparison?.totalRevenue,
    },
    {
      name: "Lucro",
      compartilhado: results.modelType === "compartilhado" ? results.profit : results.comparison?.profit,
      individual: results.modelType === "individual" ? results.profit : results.comparison?.profit,
    }
  ];

  // Chart config for recharts
  const chartConfig = {
    compartilhado: { 
      label: "Compartilhado (WL)",
      color: "#3b82f6"  // Blue
    },
    individual: { 
      label: "Individual", 
      color: "#f97316"  // Orange
    },
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
        Resultados da Simulação
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Custo Total Mensal</CardTitle>
            <CardDescription>Base para operação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {results.modelType === "compartilhado" ? 
                `R$ ${results.baseMonthlyPrice?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 
                `R$ ${results.totalCost?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            </div>
            <p className="text-slate-300 mt-2">
              {results.modelType === "compartilhado" ? 
                `White Label + Scale Up para ${results.clientCount} clientes` : 
                `${results.clientCount} contas do plano ${getPlanName(results.planType)}`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Faturamento Estimado</CardTitle>
            <CardDescription>Com margem aplicada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              R$ {results.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-300 mt-2">
              Preço por cliente: R$ {results.pricePerClient.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              <br />
              Margem aplicada: {results.marginPercent}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Lucro Líquido</CardTitle>
            <CardDescription>Faturamento - Custo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              R$ {results.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-300 mt-2">
              Margem de lucro: {results.profitMargin.toFixed(1)}%
              {results.comparison && (
                <span className={`block mt-1 ${isCompartilhadoBetter ? 'text-blue-400' : 'text-orange-400'}`}>
                  {isCompartilhadoBetter ? 
                    '✓ Plano Compartilhado mais lucrativo!' : 
                    '✓ Plano Individual mais lucrativo!'}
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Comparison */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Comparativo Visual</CardTitle>
          <CardDescription>Análise gráfica dos resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={chartConfig}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                  <YAxis 
                    tick={{ fill: '#94a3b8' }} 
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip />
                  <Bar dataKey="compartilhado" fill="var(--color-compartilhado)" name="Compartilhado" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="individual" fill="var(--color-individual)" name="Individual" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ChartLegend className="mt-4">
              <ChartLegendContent />
            </ChartLegend>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className={`${isCompartilhadoBetter ? 'bg-blue-900/30 border-blue-700/50' : 'bg-orange-900/30 border-orange-700/50'}`}>
        <CardHeader>
          <CardTitle className={`${isCompartilhadoBetter ? 'text-blue-300' : 'text-orange-300'}`}>
            Nossa Recomendação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCompartilhadoBetter ? (
            <div className="space-y-4">
              <p className="text-xl font-medium text-blue-100">
                Para sua operação, recomendamos o <span className="font-bold">Modelo Compartilhado (White Label)</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-950/50 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-300 mb-2">Vantagens para você:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-200">
                    <li>Maior lucratividade a longo prazo</li>
                    <li>Controle total sobre os preços</li>
                    <li>Escalabilidade horizontal ilimitada</li>
                    <li>Marca própria na plataforma</li>
                  </ul>
                </div>
                <div className="bg-blue-950/50 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-300 mb-2">Considerações:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-200">
                    <li>Requer mais gestão de créditos</li>
                    <li>Investimento inicial maior</li>
                    <li>Necessidade de automações para alertas</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl font-medium text-orange-100">
                Para sua operação, recomendamos o <span className="font-bold">Modelo Individual por Cliente</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-orange-950/50 p-4 rounded-md">
                  <h4 className="font-semibold text-orange-300 mb-2">Vantagens para você:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-200">
                    <li>Menor complexidade operacional</li>
                    <li>Investimento inicial reduzido</li>
                    <li>Zero gestão de créditos</li>
                    <li>Faturamento proporcional ao crescimento</li>
                  </ul>
                </div>
                <div className="bg-orange-950/50 p-4 rounded-md">
                  <h4 className="font-semibold text-orange-300 mb-2">Considerações:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-200">
                    <li>Margem de lucro potencialmente menor</li>
                    <li>Cliente vinculado à marca Zaia</li>
                    <li>Funcionalidades limitadas ao plano escolhido</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
