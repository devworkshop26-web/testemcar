// types/vehicule.ts
export type CategoryAl = {
  id: string;
  nom: string;
  parent?: string | null; // id de la catégorie parente
  parent_data?: Category | null; // données complètes de la catégorie parente
  children: Category[]; // sous-catégories
};
export type Category = {
  id: string;
  nom: string;
  parent?: string | null; // id de la catégorie parente
  parent_data?: CategoryAl | null; // données complètes de la catégorie parente
  children?: CategoryAl[]; // sous-catégories
};

export type CreateCategoryPayload = {
  nom: string;
  parent: string;
};

export type UpdateCategoryPayload = {
  nom?: string;
};
