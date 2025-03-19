
export const mockSupabaseSelect = jest.fn();
export const mockSupabaseInsert = jest.fn();
export const mockSupabaseUpdate = jest.fn();
export const mockSupabaseDelete = jest.fn();
export const mockSupabaseEq = jest.fn();
export const mockSupabaseSingle = jest.fn();
export const mockSupabaseMaybeSingle = jest.fn();

export const supabaseMock = {
  from: jest.fn().mockReturnThis(),
  select: mockSupabaseSelect.mockReturnThis(),
  insert: mockSupabaseInsert.mockReturnThis(),
  update: mockSupabaseUpdate.mockReturnThis(),
  delete: mockSupabaseDelete.mockReturnThis(),
  eq: mockSupabaseEq.mockReturnThis(),
  single: mockSupabaseSingle,
  maybeSingle: mockSupabaseMaybeSingle,
};

// Réinitialiser tous les mocks avant chaque test
export const resetSupabaseMock = () => {
  jest.clearAllMocks();
};
