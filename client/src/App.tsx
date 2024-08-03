import { Container, Stack } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { BASE_URL } from './config';

function App() {
  console.log('Base URL:', BASE_URL); // Log to check the value

  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        <TodoForm />
        <TodoList />
      </Container>
    </Stack>
  );
}

export default App;
