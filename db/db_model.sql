-- Table Definition ----------------------------------------------
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  password text,
  rol integer
);
-- Indices -------------------------------------------------------
CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);

-- Table Definition ----------------------------------------------
CREATE TABLE subuser (
  id SERIAL PRIMARY KEY,
  user_id SERIAL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  admin_id SERIAL REFERENCES users(id)
);
-- Indices -------------------------------------------------------
CREATE UNIQUE INDEX subuser_pkey ON subuser(id int4_ops);
CREATE UNIQUE INDEX subuser_user_id_key ON subuser(user_id int4_ops);