-- Creation du compte comptable : comptableprisma@gmail.com
-- Role: comptable | Mot de passe: pgcomptable-987

-- Etape 1: Creer l'utilisateur dans auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'comptableprisma@gmail.com',
  crypt('pgcomptable-987', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false
);

-- Etape 2: Creer l'identite email associee
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at,
  last_sign_in_at
)
SELECT
  gen_random_uuid(),
  id,
  jsonb_build_object('sub', id::text, 'email', email),
  'email',
  id::text,
  now(),
  now(),
  now()
FROM auth.users
WHERE email = 'comptableprisma@gmail.com';

-- Etape 3: Inserer dans la table public.users avec le role 'comptable'
INSERT INTO public.users (id, email, role)
SELECT id, email, 'comptable'
FROM auth.users
WHERE email = 'comptableprisma@gmail.com';
