import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plane, Home, GraduationCap, Car, Target, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Meta, MetaFormData } from "@/types/metas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const iconOptions = [
  { value: "plane", label: "Avião", icon: Plane },
  { value: "home", label: "Casa", icon: Home },
  { value: "graduation", label: "Formatura", icon: GraduationCap },
  { value: "car", label: "Carro", icon: Car },
  { value: "target", label: "Genérico", icon: Target },
] as const;

interface MetaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MetaFormData) => void;
  editingMeta: Meta | null;
}

export function MetaFormModal({ isOpen, onClose, onSave, editingMeta }: MetaFormModalProps) {
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [icon, setIcon] = useState<Meta["icon"]>("target");

  useEffect(() => {
    if (editingMeta) {
      setTitle(editingMeta.title);
      setTargetValue(editingMeta.targetValue.toString());
      setCurrentValue(editingMeta.currentValue.toString());
      setDeadline(editingMeta.deadline || undefined);
      setIcon(editingMeta.icon);
    } else {
      setTitle("");
      setTargetValue("");
      setCurrentValue("");
      setDeadline(undefined);
      setIcon("target");
    }
  }, [editingMeta, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: MetaFormData = {
      title: title.trim(),
      targetValue: parseFloat(targetValue) || 0,
      currentValue: parseFloat(currentValue) || 0,
      deadline: deadline || null,
      icon,
    };

    onSave(data);
    onClose();
  };

  const isEditing = !!editingMeta;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 backdrop-blur-xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-display">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-emerald">
              {isEditing ? (
                <Pencil className="w-5 h-5 text-primary" />
              ) : (
                <Plus className="w-5 h-5 text-primary" />
              )}
            </div>
            {isEditing ? "Editar Meta" : "Nova Meta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-muted-foreground">
              Título da Meta
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para o Japão"
              className="bg-muted/50 border-border/50 focus:border-primary/50"
              required
            />
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue" className="text-muted-foreground">
                Valor Total (R$)
              </Label>
              <Input
                id="targetValue"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="25000"
                className="bg-muted/50 border-border/50 focus:border-primary/50"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue" className="text-muted-foreground">
                Valor Guardado (R$)
              </Label>
              <Input
                id="currentValue"
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="5000"
                className="bg-muted/50 border-border/50 focus:border-primary/50"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Prazo */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Prazo Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-muted/50 border-border/50 hover:bg-muted",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP", { locale: ptBR }) : "Selecionar data..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Categoria/Ícone */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Categoria</Label>
            <Select value={icon} onValueChange={(value) => setIcon(value as Meta["icon"])}>
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-emerald"
            >
              {isEditing ? "Salvar" : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
