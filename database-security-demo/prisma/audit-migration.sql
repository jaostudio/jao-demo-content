ALTER TABLE AuditEvent ADD COLUMN outcome TEXT NOT NULL DEFAULT 'SUCCESS';
ALTER TABLE AuditEvent ADD COLUMN previousHash TEXT;
ALTER TABLE AuditEvent ADD COLUMN eventHash TEXT;
ALTER TABLE AuditEvent ADD COLUMN canonicalPayload TEXT;
CREATE INDEX IF NOT EXISTS "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditEvent_organizationId_eventHash_idx" ON "AuditEvent"("organizationId", "eventHash");
