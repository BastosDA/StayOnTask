import { useState, useEffect } from 'react';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  dueDate: string;
  createdAt: string;
}

const STORAGE_KEY = 'stayontask-todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateStatus = (id: number, status: Status) => {
    updateTodo(id, { status });
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    updateStatus
  };
}