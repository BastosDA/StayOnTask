import { useTodos } from '../hooks/useTodos';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/solid';

export default function Kanban() {
  const { todos, updateStatus } = useTodos();

  const todoTasks = todos.filter(todo => todo.status === 'todo');
  const inProgressTasks = todos.filter(todo => todo.status === 'in-progress');
  const doneTasks = todos.filter(todo => todo.status === 'done');

  const columns = [
    { id: 'todo', title: 'À faire', tasks: todoTasks, color: 'bg-gray-100' },
    { id: 'in-progress', title: 'En cours', tasks: inProgressTasks, color: 'bg-blue-50' },
    { id: 'done', title: 'Terminé', tasks: doneTasks, color: 'bg-green-50' }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleStatusChange = (taskId: number, newStatus: 'todo' | 'in-progress' | 'done') => {
    updateStatus(taskId, newStatus);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tableau Kanban</h1>
          <p className="text-lg text-gray-600">Organisez vos tâches visuellement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
                  {column.tasks.length}
                </span>
              </div>
              
              <div className="space-y-3 min-h-[500px]">
                {column.tasks.map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                          <TagIcon className="w-3 h-3" />
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as 'todo' | 'in-progress' | 'done')}
                        className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                      >
                        <option value="todo">À faire</option>
                        <option value="in-progress">En cours</option>
                        <option value="done">Terminé</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucune tâche</p>
                    <p className="text-xs mt-1">Créez des tâches dans la page Todo</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}