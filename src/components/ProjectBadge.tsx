import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';

interface ProjectBadgeProps {
  project?: Project;
  className?: string;
}

const colors = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
];

export function ProjectBadge({ project, className = '' }: ProjectBadgeProps) {
  if (!project) {
    return <Badge variant="outline" className={`text-muted-foreground ${className}`}>Unknown Project</Badge>;
  }

  // Generate consistent color based on project ID length or characters
  const colorIndex = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <Badge variant="outline" className={`border-transparent ${colorClass} ${className}`}>
      {project.name}
    </Badge>
  );
}
