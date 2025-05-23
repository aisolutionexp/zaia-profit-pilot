
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
  
  // Get chart data for visualization
  const getChartData = () => {
    return [
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
  };

  // Chart config for recharts
  const chartConfig = {
    compartilhado: { 
      label: "Compartilhado (WL)",
      color: "#60a5fa"
    },
    individual: { 
      label: "Individual", 
      color: "#fb923c"
    },
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
        Resultados da Simulação
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Custo Total Mensal</CardTitle>
            <CardDescription className="text-slate-300">Base para operação</CardDescription>
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

        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Faturamento Estimado</CardTitle>
            <CardDescription className="text-slate-300">Com margem aplicada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              R$ {results.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-300 mt-2">
              Preço por cliente: R$ {results.pricePerClient.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              <br />
              Margem aplicada: {results.marginPercent}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lucro Líquido</CardTitle>
            <CardDescription className="text-slate-300">Faturamento - Custo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              R$ {results.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-300 mt-2">
              Margem de lucro: {results.profitMargin.toFixed(1)}%
              {results.comparison && (
                <span className={`block mt-1 ${isCompartilhadoBetter ? 'text-blue-300' : 'text-orange-300'} font-semibold`}>
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
      <Card className="bg-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Comparativo Visual</CardTitle>
          <CardDescription className="text-slate-300">Análise gráfica dos resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 60,
                  bottom: 60,
                }}
                barGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 14, fill: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
                    />
                  } 
                />
                <Bar 
                  dataKey="compartilhado" 
                  fill="var(--color-compartilhado)" 
                  name="Compartilhado" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                />
                <Bar 
                  dataKey="individual" 
                  fill="var(--color-individual)" 
                  name="Individual" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLegend className="mt-4">
            <ChartLegendContent />
          </ChartLegend>
        </CardContent>
      </Card>

      {/* Detailed Resources Comparison */}
      <Card className="bg-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Comparativo de Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-950/70 p-6 rounded-lg">
              <h5 className="text-blue-200 font-semibold text-lg mb-4 text-center">Modelo Compartilhado</h5>
              <div className="space-y-4">
                <div>
                  <h6 className="text-blue-300 font-medium mb-2">Recursos Scale Up</h6>
                  <ul className="space-y-2">
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Agentes ilimitados
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> 20.000 créditos/agente
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> 24M caracteres para treinamento
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Integrações avançadas
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Suporte 1:1
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-blue-300 font-medium mb-2">Recursos White Label</h6>
                  <ul className="space-y-2">
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Domínio próprio
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Personalização completa
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Sua marca na plataforma
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Gestão de subcontas
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Dashboard de revenda
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-blue-300 font-medium mb-2">Gestão e Controle</h6>
                  <ul className="space-y-2">
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Distribuição de créditos
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Controle de uso por cliente
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Relatórios avançados
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-950/70 p-6 rounded-lg">
              <h5 className="text-orange-200 font-semibold text-lg mb-4 text-center">
                Plano Individual - {getPlanName(results.planType)}
              </h5>
              <div className="space-y-4">
                <div>
                  <h6 className="text-orange-300 font-medium mb-2">Recursos do Plano</h6>
                  <ul className="space-y-2">
                    {results.planType === "aceleracao" && (
                      <>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 10 agentes
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 5.000 créditos/agente
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 4.0M caracteres para treinamento
                        </li>
                        <li className="text-slate-400 flex items-center">
                          <span className="mr-2">✗</span> Integrações avançadas
                        </li>
                        <li className="text-slate-400 flex items-center">
                          <span className="mr-2">✗</span> Suporte 1:1
                        </li>
                      </>
                    )}
                    {results.planType === "growth" && (
                      <>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 40 agentes
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 10.000 créditos/agente
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 12.0M caracteres para treinamento
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> Integrações avançadas
                        </li>
                        <li className="text-slate-400 flex items-center">
                          <span className="mr-2">✗</span> Suporte 1:1
                        </li>
                      </>
                    )}
                    {results.planType === "scaleUp" && (
                      <>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> Agentes ilimitados
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 20.000 créditos/agente
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> 24.0M caracteres para treinamento
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> Integrações avançadas
                        </li>
                        <li className="text-emerald-400 flex items-center">
                          <span className="mr-2">✓</span> Suporte 1:1
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h6 className="text-orange-300 font-medium mb-2">Recursos de Marca</h6>
                  <ul className="space-y-2">
                    <li className="text-slate-400 flex items-center">
                      <span className="mr-2">✗</span> Domínio próprio
                    </li>
                    <li className="text-slate-400 flex items-center">
                      <span className="mr-2">✗</span> Personalização da marca
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Interface padrão Zaia
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-orange-300 font-medium mb-2">Gestão e Controle</h6>
                  <ul className="space-y-2">
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Gestão simplificada
                    </li>
                    <li className="text-emerald-400 flex items-center">
                      <span className="mr-2">✓</span> Suporte padrão Zaia
                    </li>
                    <li className="text-slate-400 flex items-center">
                      <span className="mr-2">✗</span> Relatórios avançados
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
