export interface ICategoryResponse {
  id: number;
  title: string;
  description?: string;
  parent?: ICategoryResponse; // Recursive reference to the parent category
  children?: ICategoryResponse[]; // Recursive reference to the child categories
}
