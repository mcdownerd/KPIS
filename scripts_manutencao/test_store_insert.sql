-- Test Insert Directly in SQL
-- This will help us understand if the issue is with the app or the database

-- Try to insert a test store directly
INSERT INTO stores (name, location) 
VALUES ('Teste Loja SQL', 'Lisboa')
RETURNING *;

-- Check if it was created
SELECT * FROM stores WHERE name = 'Teste Loja SQL';

-- If successful, delete the test
DELETE FROM stores WHERE name = 'Teste Loja SQL';
