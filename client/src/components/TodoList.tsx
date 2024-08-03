import { Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import TodoItem from './TodoItem';
import { GetTodosService } from '../services/Todo.service';

const TodoList = () => {
  const { todos, isLoading } = GetTodosService();
  return (
    <>
      <Text
        fontSize={'4xl'}
        textTransform={'uppercase'}
        fontWeight={'bold'}
        textAlign={'center'}
        my={2}
        bgGradient="linear(to-l , #0b85f8 , #00ffff)"
        bgClip="text"
      >
        Today's Tasks
      </Text>
      {isLoading && (
        <Flex justifyContent={'center'} my={4}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {!isLoading && todos === null && (
        <Stack alignItems={'center'} gap="3">
          <Text fontSize={'xl'} textAlign={'center'} color={'gray.500'}>
            All tasks completed! 🤞
          </Text>
          <img src="/go.png" alt="Go logo" width={70} height={70} />
        </Stack>
      )}
      {todos !== null && (
        <Stack gap={3}>
          {todos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
        </Stack>
      )}
    </>
  );
};
export default TodoList;
