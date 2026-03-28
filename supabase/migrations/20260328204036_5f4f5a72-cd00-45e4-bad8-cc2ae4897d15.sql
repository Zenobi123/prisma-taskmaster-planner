
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Add missing DELETE policy for authenticated users
CREATE POLICY "Enable delete access for authenticated users"
ON tasks FOR DELETE TO authenticated
USING (true);
