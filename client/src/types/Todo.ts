export type TodosType = {
  id: number;
  body: string;
  completed: boolean;
};

export interface BodyForm {
  body?: string;
  id?: number;
}
