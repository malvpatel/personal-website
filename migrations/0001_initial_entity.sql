-- Migration number: 0001 	 2026-01-05T10:02:12.340Z
--------------------------------------------------------------------
--  FAMILY TREE DATABASE SCHEMA - MIGRATION
--  Purpose: Store entities (people) and their relationships
--  Notes:
--    • Parent/child is directional (one record per parent→child)
--    • Spousal relationships are pair-normalized to avoid duplicates
--    • Remarriage between the same two people is allowed
--    • Cycles still require application-level checks
--------------------------------------------------------------------
--------------------------------------------------------------------
--  CORE TABLE: entities
--  Stores each person or entity in the family tree.
--------------------------------------------------------------------
CREATE TABLE
  entities (
    -- Unique identifier for each entity
    id INTEGER PRIMARY KEY,
    -- Person's first name
    first_name TEXT NOT NULL,
    -- Person's last name
    last_name TEXT NOT NULL,
    -- Optional gender value with controlled allowed values
    gender TEXT CHECK (
      gender IN ('male', 'female', 'nonbinary', 'unknown')
    ) DEFAULT 'unknown',
    -- Optional ISO-8601 dates (YYYY-MM-DD)
    birth_date TEXT,
    death_date TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    -- Free-form notes (biography, sources, etc.)
    notes TEXT,
    -- Timestamps (created defaults to now; updated_at auto-updates via trigger)
    created_at TEXT DEFAULT (datetime ('now')),
    updated_at TEXT DEFAULT (datetime ('now'))
  );

-- Trigger to auto-update updated_at timestamp on entity changes
CREATE TRIGGER trg_entities_updated_at AFTER
UPDATE ON entities FOR EACH ROW BEGIN
UPDATE entities
SET
  updated_at = datetime ('now')
WHERE
  id = NEW.id;

END;

--------------------------------------------------------------------
--  CORE TABLE: parentages
--  PARENT ↔ CHILD RELATIONSHIPS
--  Each row states that "parent_id is a parent of child_id".
--  Directional — meaning a child with 2 parents produces 2 rows.
--------------------------------------------------------------------
CREATE TABLE
  parentages (
    parent_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    relationship_type TEXT CHECK (
      relationship_type IN (
        'biological',
        'adopted',
        'step',
        'foster',
        'other'
      )
    ) DEFAULT 'biological',
    -- Timestamps (created defaults to now; updated_at auto-updates via trigger)
    created_at TEXT DEFAULT (datetime ('now')),
    updated_at TEXT DEFAULT (datetime ('now')),
    -- Composite primary key prevents duplicate rows
    PRIMARY KEY (parent_id, child_id),
    -- Enforce that referenced IDs must exist in entities
    FOREIGN KEY (parent_id) REFERENCES entities (id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES entities (id) ON DELETE CASCADE,
    -- Prevent a person being recorded as their own parent
    CHECK (parent_id <> child_id)
  );

-- Index to speed up lookups of children by parent
CREATE INDEX idx_parentages_parent ON parentages (parent_id);

-- Index to speed up lookups of parents by child
CREATE INDEX idx_parentages_child ON parentages (child_id);

-- Trigger to auto-update updated_at timestamp on parentages changes
CREATE TRIGGER trg_parentages_updated_at AFTER
UPDATE ON parentages FOR EACH ROW BEGIN
UPDATE parentages
SET
  updated_at = datetime ('now')
WHERE
  parent_id = NEW.parent_id
  AND child_id = NEW.child_id;

END;

--------------------------------------------------------------------
--  SPOUSAL RELATIONSHIPS
--  Each row represents one marriage/partnership.
--
--  Design decisions:
--    • spouse1_id < spouse2_id ensures each pair is stored once
--    • Partial unique index allows one NULL-dated marriage per pair
--    • Multiple dated marriages between same pair are prevented
--    • Remarriage with different dates is supported
--------------------------------------------------------------------
CREATE TABLE
  spouses (
    id INTEGER PRIMARY KEY,
    -- Ordered spouse IDs to normalize the pair
    spouse1_id INTEGER NOT NULL,
    spouse2_id INTEGER NOT NULL,
    -- Optional relationship start/end dates (e.g., marriage/divorce)
    start_date TEXT,
    end_date TEXT,
    -- Timestamps (created defaults to now; updated_at auto-updates via trigger)
    created_at TEXT DEFAULT (datetime ('now')),
    updated_at TEXT DEFAULT (datetime ('now')),
    -- Referential integrity back to entities
    FOREIGN KEY (spouse1_id) REFERENCES entities (id) ON DELETE CASCADE,
    FOREIGN KEY (spouse2_id) REFERENCES entities (id) ON DELETE CASCADE,
    -- Prevent the same person being both spouses in a record
    CHECK (spouse1_id <> spouse2_id),
    -- Enforce consistent ordering of spouse IDs
    CHECK (spouse1_id < spouse2_id)
  );

-- Prevent duplicate dated marriages, allow one NULL-dated marriage per pair
CREATE UNIQUE INDEX idx_spouses_unique ON spouses (spouse1_id, spouse2_id, start_date)
WHERE
  start_date IS NOT NULL;

-- Index to speed up spouse lookups from spouse1_id
CREATE INDEX idx_spouses_1 ON spouses (spouse1_id);

-- Index to speed up spouse lookups from spouse2_id
CREATE INDEX idx_spouses_2 ON spouses (spouse2_id);

-- Trigger to auto-update updated_at timestamp on spouses changes
CREATE TRIGGER trg_spouses_updated_at AFTER
UPDATE ON spouses FOR EACH ROW BEGIN
UPDATE spouses
SET
  updated_at = datetime ('now')
WHERE
  id = NEW.id;

END;