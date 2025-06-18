import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function Kanban() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'À faire', tasks: [] },
    { id: 'in-progress', title: 'En cours', tasks: [] },
    { id: 'done', title: 'Terminé', tasks: [] }
  ]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tableau Kanban</h1>
          <p className="text-lg text-gray-600">Organisez vos tâches visuellement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-gray-300 text-gray-700 text-sm px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              
              <div className="space-y-3 min-h-[400px]">
                {column.tasks.map((task) => (
                  <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                ))}
                
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Ajouter une tâche
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}