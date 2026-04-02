import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Project, AlertContact } from '@/types';
import { useProjects } from '@/hooks/useProjects';
import { Trash2, Plus } from 'lucide-react';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

const DEFAULT_CONTACT: AlertContact = { name: '', role: 'pm', waNumber: '' };

export function ProjectForm({ open, onOpenChange, project }: ProjectFormProps) {
  const { addProject, updateProject } = useProjects();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState<AlertContact[]>([{ ...DEFAULT_CONTACT }]);

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description || '');
        setContacts(project.contacts?.length > 0 ? project.contacts : [{ ...DEFAULT_CONTACT }]);
      } else {
        setName('');
        setDescription('');
        setContacts([{ ...DEFAULT_CONTACT }]);
      }
    }
  }, [open, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter valid contacts
    const validContacts = contacts.filter(c => c.name.trim() && c.waNumber.trim());

    if (project) {
      updateProject(project.id, {
        name,
        description,
        contacts: validContacts,
      });
    } else {
      addProject({
        name,
        description,
        contacts: validContacts,
      });
    }
    onOpenChange(false);
  };

  const updateContact = (index: number, field: keyof AlertContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([...contacts, { ...DEFAULT_CONTACT }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monitoring System"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional project description..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Alert Contacts</Label>
              <Button type="button" variant="outline" size="sm" onClick={addContact} className="h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add Contact
              </Button>
            </div>
            
            {contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start border p-3 rounded-md bg-muted/20">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name</Label>
                  <Input 
                    value={contact.name} 
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                    placeholder="John Doe"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Role</Label>
                  <Select value={contact.role} onValueChange={(val: any) => updateContact(index, 'role', val)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm">Project Manager</SelectItem>
                      <SelectItem value="tech_lead">Tech Lead</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">WA Number</Label>
                  <Input 
                    value={contact.waNumber} 
                    onChange={(e) => updateContact(index, 'waNumber', e.target.value)}
                    placeholder="628xxx"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="pt-6">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeContact(index)}
                    disabled={contacts.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
