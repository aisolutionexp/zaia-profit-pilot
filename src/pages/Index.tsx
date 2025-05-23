
import { useState } from "react";
import PlanComparison from "@/components/PlanComparison";
import PlanSimulator from "@/components/PlanSimulator";
import SimulationResults from "@/components/SimulationResults";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>("comparison");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="container mx-auto py-8 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500 mb-4">
            Compare, Escale e Lucre com Inteligência
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6">
            Escolha o Melhor Modelo para Agentes de IA com Zaia
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button
              variant={activeSection === "comparison" ? "default" : "outline"}
              onClick={() => setActiveSection("comparison")}
              className={`rounded-l-md ${
                activeSection === "comparison"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Comparar Planos
            </Button>
            <Button
              variant={activeSection === "simulator" ? "default" : "outline"}
              onClick={() => setActiveSection("simulator")}
              className={`rounded-r-md ${
                activeSection === "simulator"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Simulador de Lucro
            </Button>
          </div>
        </div>

        {/* Plan Comparison Section */}
        {activeSection === "comparison" && (
          <div className="animate-fade-in">
            <PlanComparison />
          </div>
        )}

        {/* Simulator Section */}
        {activeSection === "simulator" && (
          <div className="animate-fade-in">
            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardContent className="pt-6">
                <PlanSimulator setResults={setSimulationResults} />
              </CardContent>
            </Card>
            
            {/* Simulation Results */}
            {simulationResults && (
              <div className="animate-scale-in mt-8">
                <SimulationResults results={simulationResults} />
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Descubra qual modelo é ideal para sua operação com IA e comece a escalar agora!
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
              size="lg"
            >
              Quero vender com White Label
            </Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white"
              size="lg"
            >
              Prefiro oferecer planos individuais
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-500 text-white hover:bg-slate-700"
              size="lg"
            >
              Falar com um Especialista em Escalabilidade
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
