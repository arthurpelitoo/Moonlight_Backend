

CREATE TABLE `user` (
  `id_user` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nome do usuário',
  `email` VARCHAR(150) UNIQUE NOT NULL COMMENT 'Único (login)',
  `cpf` VARCHAR(11) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'Quando foi criado',
  `type` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer'
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
  `image` VARCHAR(255) COMMENT 'Caminho/URL da capa',
  `link` VARCHAR(255) COMMENT 'Caminho/URL do arquivo (ou null)',
  `launch_date` DATE NOT NULL COMMENT 'Data de lançamento',
  `active` boolean NOT NULL COMMENT 'Se o jogo está a mostra, 1 é true(aparece) e 0 é false(oculto)',
  `stock_available` INT NOT NULL COMMENT 'Se o jogo tem estoque'
);

CREATE TABLE `game_category` (
  `id_game` BIGINT NOT NULL,
  `id_category` BIGINT NOT NULL,
  PRIMARY KEY (`id_game`, `id_category`)
);

CREATE TABLE `game_key` (
  `id_key` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `id_game` BIGINT NOT NULL,
  `activation_key` VARCHAR(255) UNIQUE NOT NULL,
  `status` ENUM('available', 'reserved', 'sold', 'out_of_stock') NOT NULL DEFAULT 'available',
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `order` (
  `id_order` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user` BIGINT NOT NULL,
  `order_date` DATETIME NOT NULL COMMENT 'Data da compra',
  `total` DECIMAL(10,2) NOT NULL COMMENT 'Valor total para o usuário',
  `preference_id` VARCHAR(50) NOT NULL COMMENT 'id do mercado pago',
  `external_reference` VARCHAR(50) NOT NULL COMMENT 'id pro mercado pago encontrar e notificar',
  `status` ENUM('pending', 'approved', 'canceled') NOT NULL DEFAULT 'pending'
);

CREATE TABLE `purchased_items` (
  `id_order` BIGINT NOT NULL,
  `id_game` BIGINT NOT NULL,
  `id_key` BIGINT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id_order`, `id_game`, `id_key`)
);

CREATE TABLE `favorite` (
  `id_user` BIGINT NOT NULL,
  `id_game` BIGINT NOT NULL,
  `fav_star` INT NOT NULL,
  PRIMARY KEY (`id_user`, `id_game`)
);

CREATE TABLE `price_audit` (
  `id_audiprice` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `id_game` BIGINT NOT NULL,
  `price_old` DECIMAL(10,2) NOT NULL,
  `price_new` DECIMAL(10,2) NOT NULL,
  `altered_at` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `altered_byUser` VARCHAR(50) NOT NULL 
);


CREATE TRIGGER trg_audit_game_price
AFTER UPDATE ON game
FOR EACH ROW
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO price_audit (
            id_game,
            price_old,
            price_new,
            altered_byUser
        )
        VALUES (
            NEW.id_game,
            OLD.price,
            NEW.price,
            COALESCE(@usuario_logado, USER())
        );
    END IF;
END



CREATE TRIGGER trg_update_stock
AFTER UPDATE ON game_key
FOR EACH ROW
BEGIN
    IF OLD.status = 'available' AND NEW.status <> 'available' THEN
        UPDATE game
        SET stock_available = stock_available - 1
        WHERE id_game = NEW.id_game;
    END IF;

    IF OLD.status <> 'available' AND NEW.status = 'available' THEN
        UPDATE game
        SET stock_available = stock_available + 1
        WHERE id_game = NEW.id_game;
    END IF;
END


ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `game_category` ADD CONSTRAINT `fk_game_category_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE CASCADE;

ALTER TABLE `game_key` ADD CONSTRAINT `fk_game_key_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `order` ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_order` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE RESTRICT;

ALTER TABLE `purchased_items` ADD CONSTRAINT `fk_purchased_items_game_key` FOREIGN KEY (`id_key`) REFERENCES `game_key` (`id_key`) ON DELETE RESTRICT;

ALTER TABLE `favorite` ADD CONSTRAINT `fk_favorite_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `favorite` ADD CONSTRAINT `fk_favorite_game` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;

ALTER TABLE `price_audit` ADD CONSTRAINT `fk_price_audit_games` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE;
