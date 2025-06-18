import { useState } from 'react';
import { PlusIcon, TrashIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/solid';
import { useTodos } from '../hooks/useTodos';
import type { Priority, Status } from '../hooks/useTodos';

export default function TodoList() {
  const { todos, addTodo, updateStatus, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo({
        title: newTodo,
        description,
        priority,
        status: 'todo',
        category,
        dueDate
      });
      setNewTodo('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            ToDo List
          </h1>
          <p className="text-lg text-gray-600">Liste de tâches à accomplir, structurée par ordre de priorité, qui permet d'organiser son temps de manière efficace</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Qu'est-ce que vous devez faire ?"
              className="w-full text-lg border-0 border-b-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-purple-500 bg-transparent placeholder-gray-400 transition-colors"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajouter une description à votre tâche..."
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 bg-transparent placeholder-gray-400 transition-colors h-24 resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-transparent border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="low">Priorité faible</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Priorité haute</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="work">Travail</option>
                <option value="personal">Personnel</option>
                <option value="shopping">Achat</option>
                <option value="health">Santé</option>
                <option value="education">Ecole</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleAddTodo}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-6 py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
                    {todo.description && (
                      <p className="text-gray-600 mt-2">{todo.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                    aria-label="Delete task"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    todo.status === 'done' ? 'bg-green-100 text-green-800' :
                    todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {todo.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                    <TagIcon className="w-4 h-4" />
                    {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                  </span>
                  {todo.dueDate && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                      <CalendarIcon className="w-4 h-4" />
                      Due: {formatDate(todo.dueDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Créer le : {formatDate(todo.createdAt)}
                  </span>
                  <select
                    value={todo.status}
                    onChange={(e) => updateStatus(todo.id, e.target.value as Status)}
                    className="bg-transparent border-2 border-gray-100 rounded-xl px-4 py-1.5 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">En Cours</option>
                    <option value="done">Fait</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Pas encore de tâches</h3>
              <p className="text-gray-600">Ajouter une tâche pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}