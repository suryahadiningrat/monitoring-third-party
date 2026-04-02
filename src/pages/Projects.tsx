import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectForm } from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { formatIDR } from '@/utils/currency.utils';
import { useCostSummary } from '@/hooks/useCostSummary';
import { useServices } from '@/hooks/useServices';
import type { Project } from '@/types';
import { useNavigate } from 'react-router-dom';

export function Projects() {
  const { projects, deleteProject } = useProjects();
  const summary = useCostSummary();
  const { services } = useServices();
  const navigate = useNavigate();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus project ini? Layanan yang terkait dengan project ini mungkin perlu disesuaikan kembali.')) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola daftar project dan kontak notifikasi
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">Belum ada project yang ditambahkan.</p>
          <Button onClick={handleAddNew} variant="outline">
            Buat Project Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const projectCost = summary.byProject.find((p: any) => p.projectId === project.id);
            const serviceCount = services.filter((s: any) => s.projectId === project.id).length;
            
            return (
              <Card key={project.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Layanan</span>
                      <p className="font-semibold">{serviceCount} layanan</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Biaya / Bulan</span>
                      <p className="font-semibold">{formatIDR(projectCost?.monthly || 0)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Kontak Notifikasi ({project.contacts.length})
                    </span>
                    <div className="space-y-2">
                      {project.contacts.slice(0, 2).map((contact, idx) => (
                        <div key={idx} className="text-sm flex justify-between bg-muted/50 p-1.5 rounded">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-muted-foreground uppercase">{contact.role.replace('_', ' ')}</span>
                        </div>
                      ))}
                      {project.contacts.length > 2 && (
                        <p className="text-xs text-center text-muted-foreground">
                          +{project.contacts.length - 2} kontak lainnya
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4">
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => navigate(`/services?project=${project.id}`)}
                  >
                    Lihat Layanan
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        project={selectedProject} 
      />
    </div>
  );
}
