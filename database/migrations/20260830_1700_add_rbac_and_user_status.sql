-- 20260830_add_rbac_and_user_status.sql

-- 1. Colunas novas no user
ALTER TABLE user
  ADD COLUMN permission_version INT NOT NULL DEFAULT 1,
  ADD COLUMN account_status ENUM('active','banned','suspended','pending_deletion') NOT NULL DEFAULT 'active' COMMENT 'Status da conta',
  ADD COLUMN deletion_scheduled_at DATETIME NULL COMMENT 'Prazo pra recuperação de conta, se account_status = pending_deletion';

-- 2. Tabelas do RBAC
CREATE TABLE role (
  id_role INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT 'Nome do Cargo'
);

CREATE TABLE permission (
  id_permission BIGINT PRIMARY KEY AUTO_INCREMENT,
  action ENUM('create','read','update','delete') NOT NULL COMMENT 'Nome da ação',
  resource VARCHAR(50) NOT NULL COMMENT 'Recurso: game, category, order, user...',
  UNIQUE KEY uq_resource_action (resource, action)
);

CREATE TABLE user_roles (
  id_user BIGINT NOT NULL,
  id_role INT NOT NULL,
  PRIMARY KEY (id_user, id_role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE
);

CREATE TABLE role_permissions (
  id_role INT NOT NULL,
  id_permission BIGINT NOT NULL,
  PRIMARY KEY (id_role, id_permission),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE,
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (id_permission) REFERENCES permission(id_permission) ON DELETE CASCADE
);

-- 3. Seed: roles e permissions base
INSERT INTO role (name) VALUES ('admin'), ('customer');

INSERT INTO permission (resource, action) VALUES
  ('game', 'create'), ('game', 'read'), ('game', 'update'), ('game', 'delete'),
  ('category', 'create'), ('category', 'read'), ('category', 'update'), ('category', 'delete'),
  ('order', 'read'), ('order', 'update'),
  ('user', 'create'), ('user', 'read'), ('user', 'update'), ('user', 'delete');

-- admin recebe todas as permissions
INSERT INTO role_permissions (id_role, id_permission)
SELECT
    (SELECT id_role FROM role WHERE name = 'admin'),
    id_permission FROM permission;

-- customer só lê catálogo e vê/edita o próprio pedido/perfil (a regra de "só o dele" fica na aplicação)
INSERT INTO role_permissions (id_role, id_permission)
SELECT
    (SELECT id_role FROM role WHERE name = 'customer'),
    id_permission FROM permission WHERE
      (resource IN ('game','category') AND action = 'read')
   OR (resource = 'order' AND action = 'read')
   OR (resource = 'user' AND action IN ('read','update'));

-- Dominic: dá a role admin pra ele
INSERT INTO user_roles (id_user, id_role)
SELECT u.id_user, r.id_role
FROM user u, role r
WHERE u.email = 'dominic@familia.com' AND r.name = 'admin';
