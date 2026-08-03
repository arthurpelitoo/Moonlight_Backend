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
(9, 'Indie', 'Jogos desenvolvidos por estúdios independentes com propostas criativas e únicas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg'),
(10, 'Plataforma', 'Pulos precisos, fases desafiadoras e ação em 2D ou 3D.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/304430/header.jpg'),
(11, 'Puzzle', 'Desafie sua mente com quebra-cabeças e mecânicas inteligentes.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/header.jpg'),
(12, 'Sobrevivência', 'Gerencie recursos, construa abrigos e sobreviva em ambientes hostis.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/219740/header.jpg'),
(13, 'Mundo Aberto', 'Explore vastos mundos livres para descobrir no seu próprio ritmo.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg'),
(14, 'Esporte', 'Simulações e arcades das suas modalidades esportivas favoritas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1811260/header.jpg'),
(15, 'Roguelike', 'Runs procedurais, permadeath e progressão entre tentativas.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/250900/header.jpg');


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
(10, 'Baldur''s Gate 3', 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de amizade e traição, sacrifício e sobrevivência, e a atração pelo poder absoluto.', 199.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_hero.jpg', '/game/baldurs-gate-3', '2023-08-03', 1),
(11, 'Portal', 'Resolva quebra-cabeças mortais usando o Portal Gun neste clássico de puzzle em primeira pessoa da Aperture Science.', 9.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/400/library_hero.jpg', '/game/portal', '2007-10-10', 1),
(12, 'Portal 2', 'A sequência aclamada do clássico de puzzle, agora com modo cooperativo e uma história ainda mais ambiciosa.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/620/library_hero.jpg', '/game/portal-2', '2011-04-19', 1),
(13, 'Half-Life', 'O clássico que redefiniu os jogos de tiro em primeira pessoa. Ajude Gordon Freeman a escapar do complexo Black Mesa.', 9.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/70/library_hero.jpg', '/game/half-life', '1998-11-19', 1),
(14, 'Undertale', 'Um RPG onde você pode vencer sem matar ninguém. Suas escolhas moldam completamente a história.', 18.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/391540/header.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/391540/library_hero.jpg', '/game/undertale', '2015-09-15', 1),
(15, 'Vampire Survivors', 'Sobreviva a hordas infinitas de inimigos neste roguelike viciante de ação e progressão.', 14.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1794680/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/1794680/library_hero.jpg', '/game/vampire-survivors', '2022-10-20', 1),
(16, 'Papers, Please', 'Como inspetor de imigração de uma nação fictícia, decida quem entra e quem é barrado na fronteira.', 14.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/239030/header.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/239030/library_hero.jpg', '/game/papers-please', '2013-08-08', 1),
(17, 'Braid', 'Um jogo de plataforma e puzzle sobre manipulação do tempo, com uma narrativa poética e intrigante.', 9.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/26800/header.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/26800/library_hero.jpg', '/game/braid', '2008-08-06', 1),
(18, 'Limbo', 'Um garoto entra em Limbo em busca de sua irmã, atravessando um mundo sombrio e perigoso em preto e branco.', 14.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/48000/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/48000/library_hero.jpg', '/game/limbo', '2010-07-21', 1),
(19, 'Inside', 'Um menino é atraído para o coração sombrio de um projeto misterioso neste jogo de plataforma atmosférico.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/304430/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/304430/library_hero.jpg', '/game/inside', '2016-06-29', 1),
(20, 'Hotline Miami', 'Ação frenética em vista superior, trilha sonora synthwave e violência estilizada nas ruas de Miami.', 9.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/219150/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/219150/library_hero.jpg', '/game/hotline-miami', '2012-10-23', 1),
(21, 'FTL: Faster Than Light', 'Gerencie uma nave espacial e sua tripulação em batalhas táticas e decisões de vida ou morte em tempo real.', 14.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/212680/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/212680/library_hero.jpg', '/game/ftl', '2012-09-14', 1),
(22, 'The Binding of Isaac: Rebirth', 'Desça a um porão infinito de horrores em um roguelike com centenas de itens e combinações malucas.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/250900/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/250900/library_hero.jpg', '/game/binding-of-isaac-rebirth', '2014-11-04', 1),
(23, 'Enter the Gungeon', 'Um roguelike frenético de tiro em que você mergulha na Gungeon para encontrar a arma que mata o passado.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/311690/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/311690/library_hero.jpg', '/game/enter-the-gungeon', '2016-04-05', 1),
(24, 'Human: Fall Flat', 'Um jogo de física cooperativo e caótico onde você guia bonecos desengonçados por puzzles surreais.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/477160/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/477160/library_hero.jpg', '/game/human-fall-flat', '2016-07-22', 1),
(25, 'SUPERHOT', 'O tempo só se move quando você se move. Um FPS minimalista e inovador que reinventa a ação em primeira pessoa.', 19.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/322500/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/322500/library_hero.jpg', '/game/superhot', '2016-02-25', 1),
(26, 'Don''t Starve', 'Sobreviva o máximo possível em um mundo sombrio e caprichoso, coletando recursos e fugindo de criaturas bizarras.', 16.99, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/219740/hero_capsule.jpg', 'https://cdn.akamai.steamstatic.com/steam/apps/219740/library_hero.jpg', '/game/dont-starve', '2013-04-23', 1);

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
(10, 6), -- Baldur's Gate 3 -> Estratégia
(11, 11), -- Portal -> Puzzle
(11, 10), -- Portal -> Plataforma
(12, 11), -- Portal 2 -> Puzzle
(13, 2),  -- Half-Life -> FPS
(13, 4),  -- Half-Life -> Ação e Aventura
(14, 1),  -- Undertale -> RPG
(14, 9),  -- Undertale -> Indie
(15, 15), -- Vampire Survivors -> Roguelike
(15, 9),  -- Vampire Survivors -> Indie
(16, 8),  -- Papers, Please -> Simulação
(16, 9),  -- Papers, Please -> Indie
(17, 10), -- Braid -> Plataforma
(17, 11), -- Braid -> Puzzle
(17, 9),  -- Braid -> Indie
(18, 10), -- Limbo -> Plataforma
(18, 9),  -- Limbo -> Indie
(19, 10), -- Inside -> Plataforma
(19, 4),  -- Inside -> Ação e Aventura
(19, 9),  -- Inside -> Indie
(20, 4),  -- Hotline Miami -> Ação e Aventura
(20, 9),  -- Hotline Miami -> Indie
(21, 6),  -- FTL -> Estratégia
(21, 15), -- FTL -> Roguelike
(21, 9),  -- FTL -> Indie
(22, 15), -- Binding of Isaac Rebirth -> Roguelike
(22, 4),  -- Binding of Isaac Rebirth -> Ação e Aventura
(22, 9),  -- Binding of Isaac Rebirth -> Indie
(23, 15), -- Enter the Gungeon -> Roguelike
(23, 4),  -- Enter the Gungeon -> Ação e Aventura
(23, 9),  -- Enter the Gungeon -> Indie
(24, 11), -- Human: Fall Flat -> Puzzle
(24, 8),  -- Human: Fall Flat -> Simulação
(24, 9),  -- Human: Fall Flat -> Indie
(25, 2),  -- SUPERHOT -> FPS
(25, 11), -- SUPERHOT -> Puzzle
(25, 9),  -- SUPERHOT -> Indie
(26, 12), -- Don't Starve -> Sobrevivência
(26, 6),  -- Don't Starve -> Estratégia
(26, 9);  -- Don't Starve -> Indie
