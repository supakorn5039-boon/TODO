import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BodyForm, TodosType } from '../types/Todo';
import { useForm } from 'react-hook-form';
import ToastAlert from '../chakra/Toast';

export function GetTodosService() {
  const { data: todos, isLoading } = useQuery<TodosType[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/todos`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Failed to fetch data: ${errorDetails}`);
        }
        const result = await res.json();
        return result;
      } catch (error) {
        console.error('Error fetching todos:', (error as Error).message);
        throw new Error((error as Error).message);
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    todos,
    isLoading,
  };
}
export function CreateTodosService() {
  const queryClient = useQueryClient();
  const TodoCreateData = useForm<BodyForm>({
    defaultValues: {
      body: '',
    },
  });
  const { mutateAsync: CreateData, isPending } = useMutation<BodyForm>({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/todos`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              body: TodoCreateData.watch('body'),
            }),
          },
        );
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Failed to fetch data: ${errorDetails}`);
        }
        const result = await res.json();
        return result;
      } catch (error) {
        console.error('Error fetching todos:', (error as Error).message);
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      TodoCreateData.reset();
    },
  });
  return { CreateData, isPending, TodoCreateData };
}
export function UpdateTodosService() {
  const queryClient = useQueryClient();
  const TodoUpdateData = useForm<BodyForm>({
    defaultValues: {
      id: 0,
    },
  });
  const { mutateAsync: UpdateData, isPending: isUpdating } =
    useMutation<BodyForm>({
      mutationFn: async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/todos/${TodoUpdateData.watch('id')}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          if (!res.ok) {
            const errorDetails = await res.text();
            throw new Error(`Failed to fetch data: ${errorDetails}`);
          }
          const result = await res.json();
          return result;
        } catch (error) {
          console.error('Error fetching todos:', (error as Error).message);
          throw new Error((error as Error).message);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        ToastAlert('success', 'Update Success');
      },
    });
  return { UpdateData, TodoUpdateData, isUpdating };
}

export function DeleteTodosService() {
  const queryClient = useQueryClient();
  const TodoDelete = useForm<BodyForm>({
    defaultValues: {
      id: 0,
    },
  });
  const { mutateAsync: DeleteData, isPending: isDeleting } =
    useMutation<BodyForm>({
      mutationFn: async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/todos/${TodoDelete.watch('id')}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          if (!res.ok) {
            const errorDetails = await res.text();
            throw new Error(`Failed to fetch data: ${errorDetails}`);
          }
          const result = await res.json();
          return result;
        } catch (error) {
          console.error('Error fetching todos:', (error as Error).message);
          throw new Error((error as Error).message);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        ToastAlert('success', 'Delete Success');
      },
    });
  return { DeleteData, TodoDelete, isDeleting };
}
