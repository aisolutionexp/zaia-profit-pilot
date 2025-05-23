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
  
  // Normalize data for chart to prevent extremely tall bars
  const getChartData = () => {
    // Get the maximum value to help with normalization
    const maxCost = Math.max(
      results.modelType === "compartilhado" ? (results.baseMonthlyPrice || 0) : (results.totalCost || 0),
      results.modelType === "individual" ? (results.totalCost || 0) : (results.comparison?.totalCost || 0)
    );
    
    const maxRevenue = Math.max(
      results.totalRevenue,
      results.comparison?.totalRevenue || 0
    );
    
    const maxProfit = Math.max(
      results.profit,
      results.comparison?.profit || 0
    );

    return [
      {
        name: "Custo Mensal",
        compartilhado: results.modelType === "compartilhado" ? results.baseMonthlyPrice : results.comparison?.totalCost,
        individual: results.modelType === "individual" ? results.totalCost : results.comparison?.totalCost,
        maxValue: maxCost
      },
      {
        name: "Faturamento",
        compartilhado: results.modelType === "compartilhado" ? results.totalRevenue : results.comparison?.totalRevenue,
        individual: results.modelType === "individual" ? results.totalRevenue : results.comparison?.totalRevenue,
        maxValue: maxRevenue
      },
      {
        name: "Lucro",
        compartilhado: results.modelType === "compartilhado" ? results.profit : results.comparison?.profit,
        individual: results.modelType === "individual" ? results.profit : results.comparison?.profit,
        maxValue: maxProfit
      }
    ];
  };

  // Chart config for recharts
  const chartConfig = {
    compartilhado: { 
      label: "Compartilhado (WL)",
      color: "#60a5fa"  // Lighter blue for better contrast
    },
    individual: { 
      label: "Individual", 
      color: "#fb923c"  // Lighter orange for better contrast
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
            <CardDescription className="text-slate-200">Base para operação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {results.modelType === "compartilhado" ? 
                `R$ ${results.baseMonthlyPrice?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 
                `R$ ${results.totalCost?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            </div>
            <p className="text-slate-200 mt-2">
              {results.modelType === "compartilhado" ? 
                `White Label + Scale Up para ${results.clientCount} clientes` : 
                `${results.clientCount} contas do plano ${getPlanName(results.planType)}`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Faturamento Estimado</CardTitle>
            <CardDescription className="text-slate-200">Com margem aplicada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              R$ {results.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-200 mt-2">
              Preço por cliente: R$ {results.pricePerClient.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              <br />
              Margem aplicada: {results.marginPercent}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lucro Líquido</CardTitle>
            <CardDescription className="text-slate-200">Faturamento - Custo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              R$ {results.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <p className="text-slate-200 mt-2">
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
      <Card className="bg-slate-800/90 border-slate-700 pb-0">
        <CardHeader>
          <CardTitle className="text-white">Comparativo Visual</CardTitle>
          <CardDescription className="text-slate-200">Análise gráfica dos resultados</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <div 
            className="recharts-wrapper" 
            style={{
              position: 'relative',
              cursor: 'default',
              width: '100%',
              height: '100%',
              maxHeight: '500px',
              maxWidth: '500px'
            }}
          >
            <ChartContainer
              config={chartConfig}
            >
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
                  style={{ maxWidth: '500px' }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 16, fill: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 16, fill: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                    domain={[0, dataMax => Math.ceil(dataMax * 1.2)]}
                    dx={-10}
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
          </div>
          <ChartLegend className="mt-6 text-base font-medium">
            <ChartLegendContent />
          </ChartLegend>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <div className="mt-8">
        <Card className={`bg-slate-900/80 p-6 rounded-md`}>
          <CardHeader>
            <CardTitle className="text-white text-center">
              Comparativo de Recursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-950/70 p-4 rounded-md">
                <h5 className="text-blue-200 font-semibold text-lg mb-3 text-center">Modelo Compartilhado</h5>
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

              <div className="bg-orange-950/70 p-4 rounded-md">
                <h5 className="text-orange-200 font-semibold text-lg mb-3 text-center">
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
                            <span className="mr-2">✓</span> 4M caracteres para treinamento
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
                            <span className="mr-2">✓</span> 12M caracteres para treinamento
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
                            <span className="mr-2">✓</span> 24M caracteres para treinamento
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
    </div>
  );
};

export default SimulationResults;
