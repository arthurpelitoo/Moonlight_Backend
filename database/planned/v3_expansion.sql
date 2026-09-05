CREATE TABLE `login_history` (
  `id_login` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user` BIGINT COMMENT 'Null se a tentativa nao achar email valido',
  `ip_address` VARCHAR(45) NOT NULL COMMENT 'Suporta IPv4 e IPv6',
  `user_agent` VARCHAR(255) COMMENT 'Plataforma de onde esta fazendo login',
  `login_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `success` boolean NOT NULL
);

CREATE TABLE `promotion` (
  `id_promotion` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_created_by` BIGINT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255),
  `discount_percentage` DECIMAL(5,2) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `active` boolean NOT NULL DEFAULT false
);

CREATE TABLE `game_promotion` (
  `id_game` BIGINT NOT NULL,
  `id_promotion` BIGINT NOT NULL,
  PRIMARY KEY (`id_game`, `id_promotion`)
);

CREATE TABLE `refund_request` (
  `id_refund` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_order` BIGINT NOT NULL,
  `id_user` BIGINT NOT NULL COMMENT 'id_user do cliente que abriu o reembolso',
  `id_user_who_resolved` BIGINT COMMENT 'Quem resolveu é o admin(usa id_user dele)',
  `reason` VARCHAR(255) NOT NULL,
  `status` ENUM ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `requested_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `resolved_at` DATETIME
);

CREATE TABLE `wishlist` (
  `id_user` BIGINT NOT NULL,
  `id_game` BIGINT NOT NULL,
  `added_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id_user`, `id_game`)
);

CREATE TABLE `review` (
  `id_review` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user` BIGINT NOT NULL,
  `id_game` BIGINT NOT NULL,
  `recommended` boolean NOT NULL COMMENT '1 = recomendado, 0 = nao recomendado',
  `comment` VARCHAR(500),
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME COMMENT 'Preenchido só na primeira edicao'
);

CREATE TABLE `game_media` (
  `id_game_media` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_game` BIGINT NOT NULL,
  `media_url` VARCHAR(255) NOT NULL,
  `type` ENUM ('screenshot', 'gif', 'video') NOT NULL COMMENT 'Tipo de midia',
  `display_order` int NOT NULL DEFAULT 0 COMMENT 'Ordem de exibicao'
);

CREATE TABLE `payment_method` (
  `id_payment_method` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT 'Nome do metodo de pagamento: credit_card, pix, boleto'
);

CREATE TABLE `studio` (
  `id_studio` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_owner_user` BIGINT,
  `name` VARCHAR(50) NOT NULL COMMENT 'Nome da empresa, companhia e estudio: SEGA, ATLUS',
  `country` VARCHAR(50) COMMENT 'Pais da empresa, companhia e estudio: Japao, Estados Unidos',
  `has_dedicated_page` boolean NOT NULL DEFAULT false
);

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
  `action` ENUM ('create', 'read', 'update', 'delete', 'approve') NOT NULL COMMENT 'Nome da ação: create, read, update, delete',
  `resource` VARCHAR(50) NOT NULL COMMENT 'Recurso a ser interagido: game, category, order, user...'
);

CREATE TABLE `user` (
  `id_user` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nome do usuário',
  `email` VARCHAR(150) UNIQUE NOT NULL COMMENT 'Único (login)',
  `cpf` VARCHAR(11) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'Quando foi criado',
  `role_version` int NOT NULL DEFAULT 1 COMMENT 'verifica se usuario tem role nova ou se perdeu, se tiver aumenta um numero',
  `permission_version` int NOT NULL DEFAULT 1 COMMENT 'verifica se usuario tem permissions novas ou se perdeu com base na role, se tiver aumenta um numero',
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
  `id_developer_studio` BIGINT,
  `id_publisher_studio` BIGINT,
  `title` VARCHAR(255) NOT NULL COMMENT 'Nome do jogo',
  `description` VARCHAR(255) COMMENT 'Texto descritivo',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'Preço do jogo',
  `image` VARCHAR(255) COMMENT 'Caminho/URL imagem do card',
  `banner_image` VARCHAR(255) COMMENT 'Caminho/URL imagem do banner',
  `link` VARCHAR(255) COMMENT 'Caminho/URL do arquivo (ou null)',
  `launch_date` DATE NOT NULL COMMENT 'Data de lançamento',
  `active` boolean NOT NULL COMMENT 'Se o jogo está a mostra, 1 é true(aparece) e 0 é false(oculto)',
  `review_status` ENUM ('draft', 'pending_review', 'approved', 'rejected') NOT NULL DEFAULT 'draft' COMMENT 'Fluxo de aprovação: draft -> pending_review -> approved/rejected',
  `rejection_reason` VARCHAR(255) COMMENT 'Motivo da rejeicao no fluxo de aprovar jogo de estudios, preenchido pelo admin ao rejeitar; limpo ao reenviar pra revisao'
);

CREATE TABLE `game_category` (
  `id_game` BIGINT NOT NULL,
  `id_category` BIGINT NOT NULL,
  PRIMARY KEY (`id_game`, `id_category`)
);

CREATE TABLE `order` (
  `id_order` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_payment_method` BIGINT NOT NULL,
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
  `id_altered_by_user` BIGINT COMMENT 'id de quem fez a alteracao no preco'
);

CREATE UNIQUE INDEX `review_index_0` ON `review` (`id_user`, `id_game`);

CREATE UNIQUE INDEX `permission_index_0` ON `permission` (`resource`, `action`);

ALTER TABLE `login_history` ADD CONSTRAINT `fk_login_history_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

ALTER TABLE `promotion` ADD CONSTRAINT `fk_promotion_created_by` FOREIGN KEY (`id_created_by`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

ALTER TABLE `game_promotion` ADD CONSTRAINT `fk_game_promotion_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game_promotion` ADD CONSTRAINT `fk_game_promotion_promotion` FOREIGN KEY (`id_promotion`) REFERENCES `promotion` (`id_promotion`) ON DELETE CASCADE;

ALTER TABLE `refund_request` ADD CONSTRAINT `fk_refund_request_user` FOREIGN KEY (`id_user_who_resolved`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

ALTER TABLE `refund_request` ADD CONSTRAINT `fk_refund_request_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `refund_request` ADD CONSTRAINT `fk_refund_request_order` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE;

ALTER TABLE `wishlist` ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `wishlist` ADD CONSTRAINT `fk_wishlist_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `review` ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `review` ADD CONSTRAINT `fk_review_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game_media` ADD CONSTRAINT `fk_game_media_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game` ADD CONSTRAINT `fk_game_developer_studio` FOREIGN KEY (`id_developer_studio`) REFERENCES `studio` (`id_studio`) ON DELETE SET NULL;

ALTER TABLE `game` ADD CONSTRAINT `fk_game_publisher_studio` FOREIGN KEY (`id_publisher_studio`) REFERENCES `studio` (`id_studio`) ON DELETE SET NULL;

ALTER TABLE `studio` ADD CONSTRAINT `fk_studio_owner_user` FOREIGN KEY (`id_owner_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE CASCADE;

ALTER TABLE `user_roles` ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `user_roles` ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE;

ALTER TABLE `role_permissions` ADD CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE;

ALTER TABLE `role_permissions` ADD CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id_permission`) ON DELETE CASCADE;

ALTER TABLE `order` ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `order` ADD CONSTRAINT `fk_order_payment_method` FOREIGN KEY (`id_payment_method`) REFERENCES `payment_method` (`id_payment_method`) ON DELETE RESTRICT;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_order` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE RESTRICT;

ALTER TABLE `price_audit` ADD CONSTRAINT `fk_price_audit_altered_by_user` FOREIGN KEY (`id_altered_by_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

ALTER TABLE `price_audit` ADD CONSTRAINT `fk_price_audit_games` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;
