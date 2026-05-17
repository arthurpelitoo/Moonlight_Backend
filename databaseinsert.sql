INSERT INTO user (name, email, cpf, password, type) VALUES ('DominicTorresmo', 'dominic@familia.com', '52405264005', '$2b$12$uoBWRR4eb/srXO969IGxmeoVWM9.KpJIlPa//G2Iv49If5w7KBJJ.', 'admin')
/* a senha é Familia123 */

-- ==========================================
-- 1. INSERÇÃO NA TABELA: category
-- ==========================================
INSERT INTO `category` (`id_category`, `name`, `description`, `image`) VALUES
(1, 'RPG', 'Jogos de interpretação de papéis, evolução de personagens e histórias épicas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg'),
(2, 'FPS', 'Ação intensa e precisão em jogos de tiro em primeira pessoa.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg'),
(3, 'Corrida', 'Alta velocidade, simulação e arcade sobre quatro rodas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1849540/header.jpg'),
(4, 'Ação e Aventura', 'Exploração, combate e jornadas cinematográficas inesquecíveis.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg'),
(5, 'Terror', 'Sinta o medo com experiências imersivas de horror de sobrevivência e sustos garantidos.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg'),
(6, 'Estratégia', 'Planeje cada movimento, gerencie recursos e domine seus oponentes com inteligência.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg'),
(7, 'Luta', 'Combates intensos um contra um, combos frenéticos e competições de alto nível.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg'),
(8, 'Simulação', 'Experimente a vida real ou profissões inusitadas com o máximo de realismo possível.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1250410/header.jpg'),
(9, 'Indie', 'Jogos desenvolvidos por estúdios independentes com propostas criativas e únicas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg');


-- ==========================================
-- 2. INSERÇÃO NA TABELA: game
-- ==========================================
INSERT INTO `game` (`id_game`, `title`, `description`, `price`, `image`, `banner_image`, `link`, `launch_date`, `active`) VALUES
(1, 'Elden Ring', 'Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Príncipio e se tornar um Lorde Príncipio nas Terras Intermédias.', 249.90, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_hero.jpg', '/game/elden-ring', '2022-02-25', 1),
(2, 'Counter-Strike 2', 'Por mais de duas décadas, o Counter-Strike ofereceu uma experiência competitiva de elite. Agora, o próximo capítulo da saga CS começou.', 0.00, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/730/library_hero.jpg', '/game/cs2', '2023-09-27', 1),
(3, 'Forza Horizon 5', 'Sua aventura Horizon definitiva te espera! Explore as paisagens vibrantes e em constante evolução do mundo aberto do México.', 249.00, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_hero.jpg', '/game/forza-horizon-5', '2021-11-09', 1),
(4, 'Stardew Valley', 'Você herdou a antiga fazenda do seu avô. Com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida.', 24.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/413150/library_hero.jpg', '/game/stardew-valley', '2016-02-26', 1),
(5, 'Cyberpunk 2077', 'Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.', 199.90, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_hero.jpg', '/game/cyberpunk-2077', '2020-12-10', 1),
(6, 'Hollow Knight', 'Forje seu próprio caminho em Hollow Knight! Uma aventura épica de ação através de um reino vasto e arruinado de insetos e heróis.', 27.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/367520/library_hero.jpg', '/game/hollow-knight', '2017-02-24', 0),
(7, 'Resident Evil 4', 'A sobrevivência é apenas o começo. Seis anos após o desastre biológico em Raccoon City, Leon S. Kennedy busca a filha do presidente.', 169.00, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/library_hero.jpg', '/game/re4-remake', '2023-03-24', 1),
(8, 'Street Fighter 6', 'O novo capítulo da lendária franquia de luta. Domine o Fighting Ground, explore o World Tour e brilhe no Battle Hub.', 249.00, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/library_hero.jpg', '/game/sf6', '2023-06-01', 1),
(9, 'The Witcher 3: Wild Hunt', 'Torne-se um caçador de monstros profissional e embarque em uma aventura de proporções épicas para encontrar a criança da profecia.', 129.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/292030/library_hero.jpg', '/game/witcher-3', '2015-05-18', 1),
(10, 'Baldur''s Gate 3', 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de amizade e traição, sacrifício e sobrevivência, e a atração pelo poder absoluto.', 199.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_hero.jpg', '/game/baldurs-gate-3', '2023-08-03', 1);


-- ==========================================
-- 3. INSERÇÃO NA TABELA ASSOCIATIVA: game_category
-- ==========================================
INSERT INTO `game_category` (`id_game`, `id_category`) VALUES
(1, 1), -- Elden Ring -> RPG
(1, 4), -- Elden Ring -> Ação e Aventura
(2, 2), -- Counter-Strike 2 -> FPS
(3, 3), -- Forza Horizon 5 -> Corrida
(4, 1), -- Stardew Valley -> RPG
(4, 9), -- Stardew Valley -> Indie
(5, 1), -- Cyberpunk 2077 -> RPG
(5, 2), -- Cyberpunk 2077 -> FPS
(5, 4), -- Cyberpunk 2077 -> Ação e Aventura
(6, 4), -- Hollow Knight -> Ação e Aventura
(6, 9), -- Hollow Knight -> Indie
(7, 4), -- Resident Evil 4 -> Ação e Aventura
(7, 5), -- Resident Evil 4 -> Terror
(8, 7), -- Street Fighter 6 -> Luta
(9, 1), -- The Witcher 3: Wild Hunt -> RPG
(9, 4), -- The Witcher 3: Wild Hunt -> Ação e Aventura
(10, 1), -- Baldur's Gate 3 -> RPG
(10, 6); -- Baldur's Gate 3 -> Estratégia