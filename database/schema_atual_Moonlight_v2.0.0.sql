CREATE TABLE `role` (
  `id_role` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT 'Nome do Cargo'
);

CREATE TABLE `user_roles` (
  `id_user` BIGINT NOT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id_user`, `id_role`)
);

CREATE TABLE `role_permissions` (
  `id_role` int NOT NULL,
  `id_permission` BIGINT NOT NULL,
  PRIMARY KEY (`id_role`, `id_permission`)
);

CREATE TABLE `permission` (
  `id_permission` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `action` ENUM ('create', 'read', 'update', 'delete') NOT NULL COMMENT 'Nome da ação: create, read, update, delete',
  `resource` VARCHAR(50) NOT NULL COMMENT 'Recurso a ser interagido: game, category, order, user...'
);

CREATE TABLE `user` (
  `id_user` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nome do usuário',
  `email` VARCHAR(150) UNIQUE NOT NULL COMMENT 'Único (login)',
  `cpf` VARCHAR(11) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'Quando foi criado',
  `type` ENUM ('customer', 'admin') NOT NULL DEFAULT 'customer',
  `permission_version` int NOT NULL DEFAULT 1,
  `account_status` ENUM ('active', 'banned', 'suspended', 'pending_deletion') NOT NULL DEFAULT 'active' COMMENT 'Status da conta',
  `deletion_scheduled_at` DATETIME COMMENT 'Se o status for de recuperação de conta, vai ter até um certo tempo pra pedir de volta'
);

CREATE TABLE `category` (
  `id_category` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) COMMENT 'Caminho/URL da imagem da categoria'
);

CREATE TABLE `game` (
  `id_game` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT 'Nome do jogo',
  `description` VARCHAR(255) COMMENT 'Texto descritivo',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'Preço do jogo',
  `image` VARCHAR(255) COMMENT 'Caminho/URL imagem do card',
  `banner_image` VARCHAR(255) COMMENT 'Caminho/URL imagem do banner',
  `link` VARCHAR(255) COMMENT 'Caminho/URL do arquivo (ou null)',
  `launch_date` DATE NOT NULL COMMENT 'Data de lançamento',
  `active` boolean NOT NULL COMMENT 'Se o jogo está a mostra, 1 é true(aparece) e 0 é false(oculto)'
);

CREATE TABLE `game_category` (
  `id_game` BIGINT NOT NULL,
  `id_category` BIGINT NOT NULL,
  PRIMARY KEY (`id_game`, `id_category`)
);

CREATE TABLE `order` (
  `id_order` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user` BIGINT NOT NULL,
  `order_date` DATETIME NOT NULL COMMENT 'Data da compra',
  `total` DECIMAL(10,2) NOT NULL COMMENT 'Valor total para o usuário',
  `preference_id` VARCHAR(50) NOT NULL COMMENT 'id do mercado pago',
  `external_reference` VARCHAR(50) NOT NULL COMMENT 'id pro mercado pago encontrar e notificar',
  `status` ENUM ('pending', 'approved', 'canceled') NOT NULL DEFAULT 'pending'
);

CREATE TABLE `purchased_items` (
  `id_order` BIGINT NOT NULL,
  `id_game` BIGINT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id_order`, `id_game`)
);

CREATE TABLE `price_audit` (
  `id_audiprice` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `id_game` BIGINT NOT NULL,
  `price_old` DECIMAL(10,2) NOT NULL,
  `price_new` DECIMAL(10,2) NOT NULL,
  `altered_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `altered_byUser` VARCHAR(50) NOT NULL
);

CREATE UNIQUE INDEX `permission_index_0` ON `permission` (`resource`, `action`);

ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE CASCADE;

ALTER TABLE `user_roles` ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `user_roles` ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE;

ALTER TABLE `role_permissions` ADD CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE;

ALTER TABLE `role_permissions` ADD CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id_permission`) ON DELETE CASCADE;

ALTER TABLE `order` ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_order` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE RESTRICT;

ALTER TABLE `price_audit` ADD CONSTRAINT `fk_price_audit_games` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `role` ADD CONSTRAINT `uq_role_name` UNIQUE (name);
