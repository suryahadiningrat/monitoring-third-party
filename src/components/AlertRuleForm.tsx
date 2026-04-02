import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { Service, AlertRule, AlertThreshold } from '@/types';
import { useServicesStore } from '@/store/services.store';

interface AlertRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

const defaultRules: AlertRule[] = [
  { threshold: 50, enabled: false },
  { threshold: 80, enabled: true },
  { threshold: 100, enabled: true },
];

export function AlertRuleForm({ open, onOpenChange, service }: AlertRuleFormProps) {
  const { updateService } = useServicesStore();
  const [rules, setRules] = useState<AlertRule[]>([]);

  useEffect(() => {
    if (open && service) {
      if (service.alertRules && service.alertRules.length > 0) {
        setRules([...service.alertRules]);
      } else {
        setRules([...defaultRules]);
      }
    }
  }, [open, service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (service) {
      updateService(service.id, { alertRules: rules });
    }
    onOpenChange(false);
  };

  const toggleRule = (threshold: AlertThreshold, enabled: boolean) => {
    setRules(rules.map(rule => 
      rule.threshold === threshold ? { ...rule, enabled } : rule
    ));
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Alert Rules - {service.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure when to send notifications based on budget usage percentage.
            </p>
            
            <div className="space-y-3">
              {[50, 80, 100].map((threshold) => {
                const rule = rules.find(r => r.threshold === threshold) || { threshold: threshold as AlertThreshold, enabled: false };
                
                return (
                  <div key={threshold} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">At {threshold}% Usage</Label>
                      <p className="text-xs text-muted-foreground">
                        {threshold === 50 && "Half of the budget is used."}
                        {threshold === 80 && "Approaching the budget limit."}
                        {threshold === 100 && "Budget has been fully used."}
                      </p>
                    </div>
                    {/* Simplified switch if component doesn't exist */}
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={rule.enabled}
                      onChange={(e) => toggleRule(threshold as AlertThreshold, e.target.checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Rules</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
