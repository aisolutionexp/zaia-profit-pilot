
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  const isCompartilhadoBetter = results.comparison ? 
    (results.modelType === "compartilhado" && results.comparison.profitDifference > 0) || 
    (results.modelType === "individual" && results.comparison.profitDifference < 0) : 
    false;
  
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
          📊 Análise de Rentabilidade
        </h2>
        <p className="text-slate-300 text-lg">
          Resultados detalhados para {results.clientCount} clientes
        </p>
      </div>
      
      {/* Cards de Resultados Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              💰 Investimento Mensal
            </CardTitle>
            <CardDescription className="text-slate-300">
              Custo total de operação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">
              R$ {results.modelType === "compartilhado" ? 
                results.baseMonthlyPrice?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : 
                results.totalCost?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div className="text-sm text-slate-400">
              {results.modelType === "compartilhado" ? 
                "White Label + Scale Up" : 
                `${results.clientCount}x ${getPlanName(results.planType)}`}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-600 hover:border-emerald-500 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              📈 Faturamento Bruto
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Receita total estimada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-emerald-300 mb-2">
              R$ {results.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div className="text-sm text-emerald-200">
              R$ {results.pricePerClient.toLocaleString('pt-BR', {minimumFractionDigits: 2})} por cliente
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-600 hover:border-blue-500 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              🎯 Lucro Líquido
            </CardTitle>
            <CardDescription className="text-blue-200">
              Margem: {results.profitMargin.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">
              R$ {results.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            {results.comparison && (
              <div className={`text-sm font-semibold ${isCompartilhadoBetter ? 'text-blue-300' : 'text-orange-300'}`}>
                {isCompartilhadoBetter ? 
                  '✅ Compartilhado mais lucrativo!' : 
                  '✅ Individual mais lucrativo!'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Comparação */}
      <Card className="bg-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-center text-xl">
            📊 Comparativo Visual dos Modelos
          </CardTitle>
          <CardDescription className="text-slate-300 text-center">
            Análise lado a lado dos custos, faturamento e lucros
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 60,
                  bottom: 20,
                }}
                barGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#e2e8f0' }}
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
                  maxBarSize={60}
                />
                <Bar 
                  dataKey="individual" 
                  fill="var(--color-individual)" 
                  name="Individual" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLegend className="mt-4">
            <ChartLegendContent />
          </ChartLegend>
        </CardContent>
      </Card>

      {/* Detalhes dos Recursos */}
      <Card className="bg-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-center text-xl">
            ⚖️ Comparativo Detalhado de Recursos
          </CardTitle>
          <CardDescription className="text-slate-300 text-center">
            Vantagens e limitações de cada modelo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Modelo Compartilhado */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">
                  🏢 Modelo Compartilhado
                </h3>
                <p className="text-blue-200 text-sm">
                  White Label + Scale Up para distribuição
                </p>
              </div>

              <div className="bg-blue-950/50 p-6 rounded-lg border border-blue-800">
                <h4 className="text-blue-200 font-semibold mb-4 flex items-center gap-2">
                  🚀 Recursos Scale Up
                </h4>
                <ul className="space-y-3">
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Agentes ilimitados</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>20.000 créditos por agente</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>24M caracteres para treinamento</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Integrações avançadas</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Suporte premium 1:1</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-950/50 p-6 rounded-lg border border-blue-800">
                <h4 className="text-blue-200 font-semibold mb-4 flex items-center gap-2">
                  🎨 Recursos White Label
                </h4>
                <ul className="space-y-3">
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Domínio próprio personalizado</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Marca e identidade visual própria</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Gestão completa de subcontas</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Dashboard de administração</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Relatórios detalhados de uso</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modelo Individual */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-300 mb-2">
                  👤 Modelo Individual
                </h3>
                <p className="text-orange-200 text-sm">
                  Plano {getPlanName(results.planType)} por cliente
                </p>
              </div>

              <div className="bg-orange-950/50 p-6 rounded-lg border border-orange-800">
                <h4 className="text-orange-200 font-semibold mb-4 flex items-center gap-2">
                  📦 Recursos do Plano
                </h4>
                <ul className="space-y-3">
                  {results.planType === "aceleracao" && (
                    <>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>10 agentes por conta</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>5.000 créditos por agente</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>4M caracteres para treinamento</span>
                      </li>
                      <li className="text-red-300 flex items-center gap-2">
                        <span className="text-red-400">❌</span> 
                        <span>Integrações limitadas</span>
                      </li>
                      <li className="text-red-300 flex items-center gap-2">
                        <span className="text-red-400">❌</span> 
                        <span>Suporte padrão apenas</span>
                      </li>
                    </>
                  )}
                  {results.planType === "growth" && (
                    <>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>40 agentes por conta</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>10.000 créditos por agente</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>12M caracteres para treinamento</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>Integrações avançadas</span>
                      </li>
                      <li className="text-red-300 flex items-center gap-2">
                        <span className="text-red-400">❌</span> 
                        <span>Suporte padrão apenas</span>
                      </li>
                    </>
                  )}
                  {results.planType === "scaleUp" && (
                    <>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>Agentes ilimitados</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>20.000 créditos por agente</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>24M caracteres para treinamento</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>Integrações avançadas</span>
                      </li>
                      <li className="text-emerald-300 flex items-center gap-2">
                        <span className="text-emerald-400">✅</span> 
                        <span>Suporte premium 1:1</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-orange-950/50 p-6 rounded-lg border border-orange-800">
                <h4 className="text-orange-200 font-semibold mb-4 flex items-center gap-2">
                  🏷️ Recursos de Marca
                </h4>
                <ul className="space-y-3">
                  <li className="text-red-300 flex items-center gap-2">
                    <span className="text-red-400">❌</span> 
                    <span>Domínio próprio</span>
                  </li>
                  <li className="text-red-300 flex items-center gap-2">
                    <span className="text-red-400">❌</span> 
                    <span>Personalização da marca</span>
                  </li>
                  <li className="text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">✅</span> 
                    <span>Interface padrão Zaia</span>
                  </li>
                  <li className="text-red-300 flex items-center gap-2">
                    <span className="text-red-400">❌</span> 
                    <span>Gestão centralizada</span>
                  </li>
                  <li className="text-red-300 flex items-center gap-2">
                    <span className="text-red-400">❌</span> 
                    <span>Relatórios consolidados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resumo da Recomendação */}
          <div className="mt-8 p-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600">
            <h4 className="text-white font-bold text-lg mb-3 text-center">
              💡 Resumo da Análise
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-300 font-medium">Melhor para poucos clientes:</span>
                <span className="text-orange-300 ml-2">Modelo Individual</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Melhor para escala:</span>
                <span className="text-blue-300 ml-2">Modelo Compartilhado</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Maior flexibilidade:</span>
                <span className="text-blue-300 ml-2">White Label</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Menor complexidade:</span>
                <span className="text-orange-300 ml-2">Planos Individuais</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
