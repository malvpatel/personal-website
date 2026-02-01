-- Migration number: 0001 	 2026-02-01T04:09:07.368Z
------------------------------------------------------------
-- USERS
------------------------------------------------------------
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

------------------------------------------------------------
-- TREES (multi-tenant container)
------------------------------------------------------------
CREATE TABLE tree (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES user (id),
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

------------------------------------------------------------
-- TREE MEMBERS (access control)
------------------------------------------------------------
CREATE TABLE tree_member (
    id INTEGER PRIMARY KEY,
    tree_id INTEGER NOT NULL REFERENCES tree (id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES user (id) ON DELETE CASCADE,
    "role" TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    invited_at TEXT NOT NULL DEFAULT (datetime ('now')),
    accepted_at TEXT
);

------------------------------------------------------------
-- PERSONS (people in a tree)
------------------------------------------------------------
CREATE TABLE person (
    id INTEGER PRIMARY KEY,
    tree_id INTEGER NOT NULL REFERENCES tree (id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    maiden_name TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F', 'O', 'U')),
    is_living INTEGER NOT NULL DEFAULT 1,
    date_of_birth TEXT,
    date_of_death TEXT,
    notes TEXT,
    avatar_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

------------------------------------------------------------
-- UNIONS (marriages, partnerships)
------------------------------------------------------------
CREATE TABLE "union" (
    id INTEGER PRIMARY KEY,
    tree_id INTEGER NOT NULL REFERENCES tree (id) ON DELETE CASCADE,
    partner1_id INTEGER NOT NULL REFERENCES person (id),
    partner2_id INTEGER REFERENCES person (id),
    union_type TEXT NOT NULL DEFAULT 'marriage' CHECK (
        union_type IN ('marriage', 'partnership', 'unknown')
    ),
    "status" TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'divorced', 'widowed', 'separated')
    ),
    "start_date" TEXT,
    end_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

------------------------------------------------------------
-- PARENT-CHILD RELATIONSHIPS
------------------------------------------------------------
CREATE TABLE parent_child (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER NOT NULL REFERENCES person (id) ON DELETE CASCADE,
    child_id INTEGER NOT NULL REFERENCES person (id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL DEFAULT 'biological' CHECK (
        relationship_type IN ('biological', 'adopted', 'step', 'foster')
    ),
    created_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------
-- Unique constraints (prevent duplicates)
CREATE UNIQUE INDEX idx_user_email ON user (email);

CREATE UNIQUE INDEX idx_tree_member_unique ON tree_member (tree_id, user_id);

CREATE UNIQUE INDEX idx_parent_child_unique ON parent_child (parent_id, child_id);

-- Foreign key lookups (speed up JOINs and WHERE clauses)
CREATE INDEX idx_tree_created_by ON tree (created_by);

CREATE INDEX idx_tree_member_tree ON tree_member (tree_id);

CREATE INDEX idx_tree_member_user ON tree_member (user_id);

CREATE INDEX idx_person_tree ON person (tree_id);

CREATE INDEX idx_union_tree ON "union" (tree_id);

CREATE INDEX idx_union_partner1 ON "union" (partner1_id);

CREATE INDEX idx_union_partner2 ON "union" (partner2_id);

CREATE INDEX idx_parent_child_parent ON parent_child (parent_id);

CREATE INDEX idx_parent_child_child ON parent_child (child_id);