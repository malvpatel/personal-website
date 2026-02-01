# Family Tree Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    user {
        INTEGER id PK
        TEXT email UK
        TEXT name
        TEXT avatar_url
        TEXT created_at
        TEXT updated_at
    }

    tree {
        INTEGER id PK
        TEXT name
        TEXT description
        INTEGER created_by FK
        TEXT created_at
        TEXT updated_at
    }

    tree_member {
        INTEGER id PK
        INTEGER tree_id FK
        INTEGER user_id FK
        TEXT role "owner, editor, viewer"
        TEXT invited_at
        TEXT accepted_at
    }

    person {
        INTEGER id PK
        INTEGER tree_id FK
        TEXT first_name
        TEXT last_name
        TEXT maiden_name
        TEXT gender "M, F, O, U"
        INTEGER is_living "0 or 1"
        TEXT notes
        TEXT avatar_url
        TEXT created_at
        TEXT updated_at
    }

    union {
        INTEGER id PK
        INTEGER tree_id FK
        INTEGER partner1_id FK
        INTEGER partner2_id FK "nullable"
        TEXT union_type "marriage, partnership, unknown"
        TEXT status "active, divorced, widowed, separated"
        TEXT start_date
        TEXT end_date
        TEXT created_at
        TEXT updated_at
    }

    parent_child {
        INTEGER id PK
        INTEGER parent_id FK
        INTEGER child_id FK
        TEXT relationship_type "biological, adopted, step, foster"
        TEXT created_at
    }

    event {
        INTEGER id PK
        INTEGER tree_id FK
        INTEGER person_id FK "nullable"
        INTEGER union_id FK "nullable"
        TEXT event_type "birth, death, marriage, divorce, immigration, graduation, military, custom"
        TEXT event_date
        TEXT place_name
        TEXT description
        TEXT created_at
        TEXT updated_at
    }

    media {
        INTEGER id PK
        INTEGER tree_id FK
        INTEGER uploaded_by FK
        TEXT filename
        TEXT url
        TEXT mime_type
        TEXT caption
        TEXT created_at
    }

    person_media {
        INTEGER id PK
        INTEGER person_id FK
        INTEGER media_id FK
        INTEGER is_primary "0 or 1"
        TEXT created_at
    }

    audit_log {
        INTEGER id PK
        INTEGER tree_id FK
        INTEGER user_id FK
        TEXT table_name
        INTEGER record_id
        TEXT action "INSERT, UPDATE, DELETE"
        TEXT old_values "JSON"
        TEXT new_values "JSON"
        TEXT changed_at
    }

    user ||--o{ tree : creates
    user ||--o{ tree_member : has
    user ||--o{ media : uploads
    user ||--o{ audit_log : performs

    tree ||--o{ tree_member : has
    tree ||--o{ person : contains
    tree ||--o{ union : contains
    tree ||--o{ event : contains
    tree ||--o{ media : contains
    tree ||--o{ audit_log : tracks

    person ||--o{ parent_child : "is parent"
    person ||--o{ parent_child : "is child"
    person ||--o{ event : has
    person ||--o{ person_media : has

    union ||--o{ event : has
    union }o--|| person : partner1
    union }o--o| person : partner2

    media ||--o{ person_media : linked
```

## Tables Summary

| Table          | Purpose                                            |
| -------------- | -------------------------------------------------- |
| `user`         | User account                                       |
| `tree`         | Family tree container                              |
| `tree_member`  | User access to tree (roles: owner, editor, viewer) |
| `person`       | Individual in tree                                 |
| `union`        | Partnership between 1-2 people                     |
| `parent_child` | Parent to child link                               |
| `event`        | Life events (birth, death, marriage, etc.)         |
| `media`        | Photos, documents                                  |
| `person_media` | Person to media join table                         |
| `audit_log`    | Change history for all tables                      |

## Design Decisions

1. **Multi-tree support** - Each tree is isolated, users can belong to multiple trees
2. **Role-based access** - owner, editor, viewer roles per tree
3. **Flexible relationships** - parent_child supports biological, adopted, step, foster
4. **Union model** - Handles marriages, partnerships, divorces, remarriages cleanly
5. **Event-based history** - Extensible event types instead of fixed columns
6. **Hard deletes with audit log** - No soft deletes, full history in audit_log
7. **SQLite/D1 compatible** - Uses only TEXT, INTEGER, REAL, BLOB, NULL types
