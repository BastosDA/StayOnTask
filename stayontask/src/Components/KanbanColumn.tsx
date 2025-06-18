import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import type { Todo } from '../hooks/useTodos';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Todo[];
  color: string;
  borderColor: string;
}

export default function KanbanColumn({ id, title, tasks, color, borderColor }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${color} rounded-2xl p-6 border-2 ${borderColor} transition-all duration-300 ${
        isOver ? 'ring-4 ring-purple-300 ring-opacity-50 scale-105' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="bg-white/80 backdrop-blur-sm text-gray-700 text-sm px-3 py-1.5 rounded-full font-semibold shadow-sm">
            {tasks.length}
          </span>
          <div className={`w-3 h-3 rounded-full ${
            id === 'todo' ? 'bg-gray-400' :
            id === 'in-progress' ? 'bg-blue-400' :
            'bg-green-400'
          }`} />
        </div>
      </div>
      
      <div className="space-y-4 min-h-[600px]">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white/30">
            <div className="text-gray-500">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-medium">Aucune tâche</p>
              <p className="text-xs mt-1 opacity-75">
                {id === 'todo' ? 'Glissez des tâches ici' :
                 id === 'in-progress' ? 'Tâches en cours' :
                 'Tâches terminées'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}