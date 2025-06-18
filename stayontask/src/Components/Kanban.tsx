import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTodos } from '../hooks/useTodos';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import type { Todo } from '../hooks/useTodos';

export default function Kanban() {
  const { todos, updateStatus } = useTodos();
  const [activeTask, setActiveTask] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const todoTasks = todos.filter(todo => todo.status === 'todo');
  const inProgressTasks = todos.filter(todo => todo.status === 'in-progress');
  const doneTasks = todos.filter(todo => todo.status === 'done');

  const columns = [
    { 
      id: 'todo', 
      title: 'À faire', 
      tasks: todoTasks, 
      color: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200'
    },
    { 
      id: 'in-progress', 
      title: 'En cours', 
      tasks: inProgressTasks, 
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'done', 
      title: 'Terminé', 
      tasks: doneTasks, 
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200'
    }
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = todos.find(todo => todo.id === Number(active.id));
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    // Si pas de zone de dépôt valide, on ne fait rien (la tâche reste à sa place)
    if (!over) {
      return;
    }

    // Vérifier que la zone de dépôt est une colonne valide
    const validColumns = ['todo', 'in-progress', 'done'];
    if (!validColumns.includes(over.id as string)) {
      return;
    }

    const taskId = Number(active.id);
    const newStatus = over.id as 'todo' | 'in-progress' | 'done';
    
    // Trouver la tâche actuelle
    const currentTask = todos.find(todo => todo.id === taskId);
    
    // Si la tâche est déplacée vers une nouvelle colonne
    if (currentTask && currentTask.status !== newStatus) {
      updateStatus(taskId, newStatus);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Tableau Kanban
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organisez vos tâches visuellement en les déplaçant entre les colonnes par glisser-déposer
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {columns.map((column) => (
              <SortableContext
                key={column.id}
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  id={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  color={column.color}
                  borderColor={column.borderColor}
                />
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-3 opacity-90">
                <KanbanCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {todos.length === 0 && (
          <div className="text-center py-16 mt-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Aucune tâche</h3>
              <p className="text-gray-600 mb-6">Créez des tâches dans la page Todo pour commencer à utiliser le tableau Kanban</p>
              <a
                href="/todo"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Créer une tâche
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}