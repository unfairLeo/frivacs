 import { cn } from "@/lib/utils";
 import { TrendingUp } from "lucide-react";
 import { ResponsiveContainer, LineChart, Line } from "recharts";
 
 interface WealthWidgetProps {
   patrimony?: number;
   monthlyChange?: number;
   className?: string;
 }
 
 export function WealthWidget({
   patrimony = 0,
   monthlyChange = 0,
   className,
 }: WealthWidgetProps) {
   // Mock sparkline data - will come from database in the future
   const sparklineData = [
     { value: 10 },
     { value: 15 },
     { value: 12 },
     { value: 18 },
     { value: 22 },
     { value: 20 },
     { value: 25 },
   ];
 
   const formatCurrency = (value: number) => {
     return value.toLocaleString("pt-BR", {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
     });
   };
 
   return (
     <div
       className={cn(
         "glass-card p-6 relative overflow-hidden",
         className
       )}
     >
       {/* Background glow effect */}
       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
 
       <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         {/* Left side - Patrimony value */}
         <div>
           <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
             <TrendingUp className="w-4 h-4" />
             Patrimônio Estimado
           </p>
           <p className="text-3xl md:text-4xl font-sans font-bold text-foreground tracking-tight">
             <span className="text-primary text-glow-emerald">R$</span>{" "}
             <span>{formatCurrency(patrimony)}</span>
           </p>
         </div>
 
         {/* Right side - Sparkline and badge */}
         <div className="flex items-center gap-4">
           {/* Mini Sparkline - hidden on very small screens */}
           <div className="w-24 h-12 hidden sm:block">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={sparklineData}>
                 <Line
                   type="monotone"
                   dataKey="value"
                   stroke="hsl(160 84% 45%)"
                   strokeWidth={2}
                   dot={false}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
 
           {/* Monthly change badge */}
           <div
             className={cn(
               "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1",
               monthlyChange >= 0
                 ? "bg-primary/20 text-primary"
                 : "bg-destructive/20 text-destructive"
             )}
           >
             <span>
               {monthlyChange >= 0 ? "+" : ""}
               {monthlyChange}%
             </span>
             <span className="text-xs text-muted-foreground">este mês</span>
           </div>
         </div>
       </div>
     </div>
   );
 }