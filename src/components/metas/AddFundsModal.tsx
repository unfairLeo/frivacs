import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Sparkles } from "lucide-react";
import { Meta } from "@/types/metas";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: Meta | null;
  onAddFunds: (metaId: string, amount: number) => void;
}

export function AddFundsModal({
  isOpen,
  onClose,
  meta,
  onAddFunds,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meta && amount) {
      const numericAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      if (numericAmount > 0) {
        onAddFunds(meta.id, numericAmount);
        setAmount("");
        onClose();
      }
    }
  };

  const quickAmounts = [100, 500, 1000, 2500];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const remaining = meta ? meta.targetValue - meta.currentValue : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl">
            <div className="p-2 rounded-lg bg-primary/20">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            Adicionar ao Cofre
          </DialogTitle>
        </DialogHeader>

        {meta && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">
                Meta: {meta.title}
              </p>
              <p className="text-lg font-semibold">
                Faltam{" "}
                <span className="text-primary">{formatCurrency(remaining)}</span>
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount">Valor a adicionar</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-lg font-semibold bg-input border-border"
                />
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="flex-1 min-w-[70px]"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {formatCurrency(quickAmount).replace("R$", "").trim()}
                </Button>
              ))}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!amount}
              >
                <Sparkles className="w-4 h-4" />
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
