import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarIcon, TagIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useTodos } from '../hooks/useTodos';
import type { Todo } from '../hooks/useTodos';

interface KanbanCardProps {
  task: Todo;
  isDragging?: boolean;
}

export default function KanbanCard({ task, isDragging = false }: KanbanCardProps) {
  const { updateStatus } = useTodos();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done') => {
    updateStatus(task.id, newStatus);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 cursor-grab active:cursor-grabbing ${
        isSortableDragging || isDragging 
          ? 'shadow-2xl scale-105 rotate-2 z-50' 
          : 'hover:shadow-xl hover:scale-102'
      } ${isOverdue ? 'ring-2 ring-red-300' : ''}`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{task.title}</h3>
          {isOverdue && (
            <div className="flex items-center text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
              <ClockIcon className="w-3 h-3 mr-1" />
              En retard
            </div>
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{task.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            task.priority === 'high' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' :
            'bg-green-100 text-green-800 ring-1 ring-green-200'
          }`}>
            {task.priority === 'high' ? '🔴 Haute' :
             task.priority === 'medium' ? '🟡 Moyenne' :
             '🟢 Faible'}
          </span>
          
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold ring-1 ring-purple-200">
            <TagIcon className="w-3 h-3" />
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
          
          {task.dueDate && (
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
              isOverdue 
                ? 'bg-red-100 text-red-800 ring-red-200' 
                : 'bg-orange-100 text-orange-800 ring-orange-200'
            }`}>
              <CalendarIcon className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as 'todo' | 'in-progress' | 'done')}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
          >
            <option value="todo">📋 À faire</option>
            <option value="in-progress">⚡ En cours</option>
            <option value="done">✅ Terminé</option>
          </select>
        </div>
      </div>
    </div>
  );
}