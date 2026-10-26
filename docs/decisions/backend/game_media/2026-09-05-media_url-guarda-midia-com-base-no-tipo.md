# game_media.media_url guarda caminho interno OU URL externa, conforme type

**Status:** Aceito
**Data:** 2026-09-04

## Contexto
Hospedar vídeo próprio (transcodificação, streaming, storage,
banda) é ordem de grandeza mais caro/complexo que hospedar imagem,
inviável para o escopo e hosting do projeto.

## Decisão
media_url guarda caminho interno (via endpoint de upload) quando
type é 'screenshot'/'gif', e URL externa completa (YouTube/Vimeo)
quando type é 'video'. Nenhum arquivo de vídeo passa pelo Multer
ou é salvo em disco próprio.

## Consequências
A montagem de URL no frontend precisa ser condicional por type,
já que uma URL externa não deve ser prefixada com a base da API.
Vídeo não pode ser validado por MIME type no upload (não existe
upload) — validação vira checagem de formato de URL apenas.
