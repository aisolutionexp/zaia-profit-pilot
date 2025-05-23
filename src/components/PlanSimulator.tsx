
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Schema for form validation
const formSchema = z.object({
  modelType: z.enum(["compartilhado", "individual"]),
  
  // Shared plan specific fields
  numClientesCompartilhado: z.string().transform(val => val ? parseInt(val, 10) : 0),
  creditosPorClienteCompartilhado: z.string().transform(val => val ? parseInt(val, 10) : 0),
  margemPorClienteCompartilhado: z.string().transform(val => val ? parseInt(val, 10) : 0),
  
  // Individual plan specific fields
  planType: z.enum(["aceleracao", "growth", "scaleUp"]).optional(),
  numClientesIndividual: z.string().transform(val => val ? parseInt(val, 10) : 0),
  margemPorClienteIndividual: z.string().transform(val => val ? parseInt(val, 10) : 0),
});

// Define the raw form input type (before transformation)
type FormInputs = {
  modelType: "compartilhado" | "individual";
  numClientesCompartilhado: string;
  creditosPorClienteCompartilhado: string;
  margemPorClienteCompartilhado: string;
  planType?: "aceleracao" | "growth" | "scaleUp";
  numClientesIndividual: string;
  margemPorClienteIndividual: string;
};

// Define the transformed values type (after zod transform)
type FormValues = z.infer<typeof formSchema>;

interface PlanSimulatorProps {
  setResults: (results: any) => void;
}

const PlanSimulator = ({ setResults }: PlanSimulatorProps) => {
  const [modelType, setModelType] = useState<"compartilhado" | "individual">("compartilhado");

  // Set up form with default values
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelType: "compartilhado",
      numClientesCompartilhado: "10",
      creditosPorClienteCompartilhado: "2500",
      margemPorClienteCompartilhado: "60",
      planType: "aceleracao",
      numClientesIndividual: "10",
      margemPorClienteIndividual: "40",
    },
  });

  // Watch for model type changes to update the form UI
  const watchModelType = form.watch("modelType");
  
  // Handle form submission
  function onSubmit(data: FormInputs) {
    try {
      // Use Zod to transform the string values to numbers
      const values = formSchema.parse(data);
      
      // Get plan price based on selection
      const getPlanPrice = (planType: string | undefined) => {
        switch(planType) {
          case "aceleracao": return 249;
          case "growth": return 490;
          case "scaleUp": return 990;
          default: return 249;
        }
      };

      // Calculate results for shared model
      if (values.modelType === "compartilhado") {
        const baseMonthlyPrice = 1987; // Scale Up (990) + White Label (997)
        const clientCount = values.numClientesCompartilhado;
        const creditsPerClient = values.creditosPorClienteCompartilhado;
        const marginPercent = values.margemPorClienteCompartilhado;
        
        const pricePerClient = (baseMonthlyPrice / clientCount) * (1 + marginPercent / 100);
        const totalRevenue = pricePerClient * clientCount;
        const profit = totalRevenue - baseMonthlyPrice;
        const profitMargin = (profit / totalRevenue) * 100;

        const results = {
          modelType: "compartilhado",
          baseMonthlyPrice,
          clientCount,
          creditsPerClient,
          marginPercent,
          pricePerClient: Math.round(pricePerClient * 100) / 100,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          profitMargin: Math.round(profitMargin * 10) / 10,
          comparison: null
        };

        // Check if individual plan results exist to add comparison
        const individualPlanPrice = getPlanPrice(values.planType);
        if (values.numClientesIndividual && values.margemPorClienteIndividual) {
          const individualClientCount = values.numClientesIndividual;
          const individualMarginPercent = values.margemPorClienteIndividual;
          
          const individualPricePerClient = individualPlanPrice * (1 + individualMarginPercent / 100);
          const individualTotalRevenue = individualPricePerClient * individualClientCount;
          const individualTotalCost = individualPlanPrice * individualClientCount;
          const individualProfit = individualTotalRevenue - individualTotalCost;
          
          results.comparison = {
            totalRevenue: Math.round(individualTotalRevenue * 100) / 100,
            totalCost: Math.round(individualTotalCost * 100) / 100,
            profit: Math.round(individualProfit * 100) / 100,
            profitDifference: Math.round((results.profit - individualProfit) * 100) / 100
          };
        }

        setResults(results);
      } 
      // Calculate results for individual model
      else {
        const planPrice = getPlanPrice(values.planType);
        const clientCount = values.numClientesIndividual;
        const marginPercent = values.margemPorClienteIndividual;
        
        const pricePerClient = planPrice * (1 + marginPercent / 100);
        const totalRevenue = pricePerClient * clientCount;
        const totalCost = planPrice * clientCount;
        const profit = totalRevenue - totalCost;
        const profitMargin = (profit / totalRevenue) * 100;

        const results = {
          modelType: "individual",
          planType: values.planType,
          planPrice,
          clientCount,
          marginPercent,
          pricePerClient: Math.round(pricePerClient * 100) / 100,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCost: Math.round(totalCost * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          profitMargin: Math.round(profitMargin * 10) / 10,
          comparison: null
        };

        // Check if shared plan results exist to add comparison
        if (values.numClientesCompartilhado && values.margemPorClienteCompartilhado) {
          const baseMonthlyPrice = 1987;
          const sharedClientCount = values.numClientesCompartilhado;
          const sharedMarginPercent = values.margemPorClienteCompartilhado;
          
          const sharedPricePerClient = (baseMonthlyPrice / sharedClientCount) * (1 + sharedMarginPercent / 100);
          const sharedTotalRevenue = sharedPricePerClient * sharedClientCount;
          const sharedProfit = sharedTotalRevenue - baseMonthlyPrice;
          
          results.comparison = {
            totalRevenue: Math.round(sharedTotalRevenue * 100) / 100,
            totalCost: baseMonthlyPrice,
            profit: Math.round(sharedProfit * 100) / 100,
            profitDifference: Math.round((sharedProfit - results.profit) * 100) / 100
          };
        }

        setResults(results);
      }
      
      toast({
        title: "Simulação calculada com sucesso!",
        description: "Confira os resultados abaixo.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error calculating simulation:", error);
      toast({
        title: "Erro ao calcular simulação",
        description: "Verifique os valores inseridos e tente novamente.",
        variant: "destructive",
      });
    }
  }

  // Handle model type change
  const handleModelTypeChange = (value: string) => {
    if (value === "compartilhado" || value === "individual") {
      setModelType(value);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-500">
        Simulador de Lucratividade
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Model Selection */}
          <FormField
            control={form.control}
            name="modelType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg">Escolha o Modelo de Negócio:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleModelTypeChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 bg-blue-950/30 p-4 rounded-md border border-blue-800/50 w-full md:w-1/2">
                      <FormControl>
                        <RadioGroupItem value="compartilhado" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        <span className="block text-blue-400 font-semibold">Plano Compartilhado</span>
                        <span className="text-sm text-slate-300">White Label + Scale Up</span>
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 bg-orange-950/30 p-4 rounded-md border border-orange-800/50 w-full md:w-1/2">
                      <FormControl>
                        <RadioGroupItem value="individual" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        <span className="block text-orange-400 font-semibold">Plano Individual</span>
                        <span className="text-sm text-slate-300">Um plano por cliente</span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shared Plan Fields */}
            <div className={`space-y-4 p-6 bg-blue-900/20 rounded-lg border border-blue-800/30 ${watchModelType !== "compartilhado" ? "opacity-50" : ""}`}>
              <h3 className="text-xl font-semibold text-blue-400">Configuração Plano Compartilhado</h3>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-950/50 px-3 py-2 rounded-md">
                  <span className="block text-sm text-slate-300">Plano Scale Up</span>
                  <span className="font-semibold text-white">R$ 990</span>
                </div>
                <div className="bg-blue-950/50 px-3 py-2 rounded-md">
                  <span className="block text-sm text-slate-300">White Label</span>
                  <span className="font-semibold text-white">R$ 997</span>
                </div>
                <div className="bg-blue-950/50 px-3 py-2 rounded-md">
                  <span className="block text-sm text-slate-300">Total Fixo</span>
                  <span className="font-semibold text-white">R$ 1.987</span>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="numClientesCompartilhado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Clientes:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        min="1"
                        {...field}
                        disabled={watchModelType !== "compartilhado"}
                      />
                    </FormControl>
                    <FormDescription>
                      Número de contas que utilizarão o plano compartilhado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="creditosPorClienteCompartilhado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos por Cliente:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 2500"
                        min="1000"
                        step="500"
                        {...field}
                        disabled={watchModelType !== "compartilhado"}
                      />
                    </FormControl>
                    <FormDescription>
                      Média de créditos que cada cliente irá consumir
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="margemPorClienteCompartilhado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sua Margem por Cliente (%):</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 60"
                        min="0"
                        max="500"
                        {...field}
                        disabled={watchModelType !== "compartilhado"}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual de lucro que você aplicará
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Individual Plan Fields */}
            <div className={`space-y-4 p-6 bg-orange-900/20 rounded-lg border border-orange-800/30 ${watchModelType !== "individual" ? "opacity-50" : ""}`}>
              <h3 className="text-xl font-semibold text-orange-400">Configuração Plano Individual</h3>
              
              <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano Ofertado ao Cliente:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={watchModelType !== "individual"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aceleracao">Aceleração - R$ 249</SelectItem>
                        <SelectItem value="growth">Growth - R$ 490</SelectItem>
                        <SelectItem value="scaleUp">Scale Up - R$ 990</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Plano que você irá revender para seus clientes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numClientesIndividual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Clientes:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        min="1"
                        {...field}
                        disabled={watchModelType !== "individual"}
                      />
                    </FormControl>
                    <FormDescription>
                      Número de clientes que assinarão o plano
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="margemPorClienteIndividual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margem Adicionada por Plano (%):</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 40"
                        min="0"
                        max="500"
                        {...field}
                        disabled={watchModelType !== "individual"}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual de lucro que você aplicará sobre o preço original
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-6 text-lg"
              size="lg"
            >
              Calcular Comparação de Lucro 🚀
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlanSimulator;
