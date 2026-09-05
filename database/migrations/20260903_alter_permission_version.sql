-- 20260902_rename_permission_version_to_role_version.sql
ALTER TABLE user CHANGE COLUMN permission_version role_version INT NOT NULL DEFAULT 1;
