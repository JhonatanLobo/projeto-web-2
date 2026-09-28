# Catálogo de jogos

API REST simples feita com Node.js e Express. Os jogos e os registros de requisição ficam em memória e são apagados ao reiniciar o servidor.

## Executar

```sh
npm install
npm start
```

Por padrão, a API fica em `http://localhost:3000`. Para usar outra porta, defina a variável de ambiente `PORT`.

## Rotas

| Método | Rota | Resultado |
| --- | --- | --- |
| `GET` | `/jogos` | Lista os jogos cadastrados. |
| `POST` | `/jogos` | Cadastra um jogo e gera seu código. |
| `GET` | `/jogos/:codigo` | Pesquisa um jogo pelo código. |
| `DELETE` | `/jogos/:codigo` | Exclui um jogo pelo código. |
| `GET` | `/requisicoes?data=YYYY-MM-DD` | Lista os registros daquela data. |
| `GET` | `/jogos/pdf` | Baixa o catálogo no arquivo `jogos.pdf`. |

O corpo de `POST /jogos` deve ser JSON com `title`, `price` e `genre`. Por exemplo:

```json
{
  "title": "Hades",
  "price": 49.9,
  "genre": "Ação"
}
```

O código é gerado no formato `G001`, `G002` e assim por diante. O preço deve ser um número não negativo com até duas casas decimais. Campos extras, incluindo um `code` enviado pelo cliente, são ignorados.

A API permite acesso de segunda a sexta-feira, conforme o fuso `America/Fortaleza`. Todas as requisições são registradas com horário, método e caminho. As respostas e mensagens de erro são em JSON; tentativas no fim de semana recebem `403` e também ficam registradas.

## Testes

```sh
npm test
```
