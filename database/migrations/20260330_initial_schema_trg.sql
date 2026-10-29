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
