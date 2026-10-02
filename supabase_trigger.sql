-- 1. Create a trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, address, role)
  VALUES (
    new.id, 
    -- If using metadata, we could extract name, but for now just use a default or handle it in the app
    COALESCE(new.raw_user_meta_data->>'name', 'Pengguna Baru'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    '',
    'Customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
