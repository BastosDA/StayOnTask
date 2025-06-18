import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './pages/Home';
import Todo from './pages/ToDo';
// import Kanban from './pages/Kanban';
import Pomodoro from './pages/Pomodoro';
import Kanban from './pages/Kanban';
// import Pomodoro from './pages/Pomodoro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="todo" element={<Todo />} />
          {/* <Route path="kanban" element={<Kanban />} />*/
          <Route path="pomodoro" element={<Pomodoro />} /> }
          <Route path="kanban" element={<Kanban />} />
          {/* <Route path="pomodoro" element={<Pomodoro />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;