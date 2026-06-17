-- Migration number: 0001 	 2026-02-23T05:25:00.270Z
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

CREATE INDEX idx_users_email ON users (email);

CREATE TRIGGER users_updated_at AFTER
UPDATE ON users FOR EACH ROW BEGIN
UPDATE users
SET
    updated_at = datetime ('now')
WHERE
    id = OLD.id;

END;