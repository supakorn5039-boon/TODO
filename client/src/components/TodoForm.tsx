import { Button, Flex, Input, Spinner } from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';
import { CreateTodosService } from '../services/Todo.service';
import { toast } from 'react-toastify';

const TodoForm = () => {
  const { isPending, CreateData, TodoCreateData } = CreateTodosService();

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await toast.promise(CreateData(), {
        pending: 'Waiting...',
        success: 'Todo created successfully!',
        error: 'Could not create todo.',
      });
      TodoCreateData.reset();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={createTodo}>
      <Flex gap={2}>
        <Input
          type="text"
          value={TodoCreateData.watch('body')}
          onChange={(e) => {
            TodoCreateData.setValue('body', e.target.value);
          }}
          placeholder="Enter a new todo"
        />
        <Button
          mx={2}
          type="submit"
          _active={{
            transform: 'scale(.97)',
          }}
          isDisabled={isPending}
        >
          {isPending ? <Spinner size={'xs'} /> : <IoMdAdd size={30} />}
        </Button>
      </Flex>
    </form>
  );
};

export default TodoForm;
