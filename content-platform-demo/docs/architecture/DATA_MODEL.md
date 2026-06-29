# Data Model

## Entities

### [Entity Name]

```
Table: [table_name]
Description: [What this entity represents]

Columns:
  id            String (UUID)    @id @default(uuid())
  [field]       [Type]           [Constraints]
  [field]       [Type]           [Constraints]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

Relations:
  [Relation] → [Related Entity] [Cardinality]

Indexes:
  - [indexed field(s)]
```

### [Entity Name]

```
Table: [table_name]
Description: [What this entity represents]

Columns:
  id            String (UUID)    @id @default(uuid())
  [field]       [Type]           [Constraints]
  [field]       [Type]           [Constraints]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

Relations:
  [Relation] → [Related Entity] [Cardinality]

Indexes:
  - [indexed field(s)]
```

## Relationships

```
[Entity A] ──1:N── [Entity B]
  - [Description of relationship]

[Entity B] ──N:M── [Entity C]
  - [Via join table: table_name]
  - [Description]
```

## Migration Strategy

```
- Use ORM migrations (Prisma / Drizzle).
- Migrations are versioned and reviewed before applying to production.
- Destructive operations (column drops, table drops) require explicit approval.
- Backfill strategy for non-nullable new columns.
```

## MVP Data Model Notes

```
- [What's simplified for MVP]
- [What gets added at scale]
```
