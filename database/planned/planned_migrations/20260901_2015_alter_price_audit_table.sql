ALTER TABLE price_audit MODIFY COLUMN altered_byUser BIGINT NULL;
ALTER TABLE price_audit RENAME COLUMN altered_byUser TO altered_by_user;
ALTER TABLE price_audit ADD CONSTRAINT fk_price_audit_altered_by_user
  FOREIGN KEY (altered_by_user) REFERENCES user(id_user) ON DELETE SET NULL;
DROP TRIGGER IF EXISTS trg_audit_game_price;
