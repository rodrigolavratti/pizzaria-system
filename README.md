# Pizzaria System

Aplicação da **Pizzaria System**, desenvolvida com Next.js, TypeScript e Firebase. O cardápio público lê as pizzas disponíveis no Firestore; o painel administrativo permite gerenciar os produtos.

## Funcionalidades

- Apresentação da pizzaria, depoimentos, endereço e contato.
- Cardápio dinâmico com pizzas disponíveis no Firestore.
- Painel administrativo com cadastro, edição, disponibilidade e exclusão de pizzas.
- Imagens servidas localmente a partir de `public/images/`.
- Carrinho e preparação de pedido para envio pelo WhatsApp.
- Layout responsivo.

## Tecnologias

- [Next.js](https://nextjs.org/) com App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Authentication e Firestore](https://firebase.google.com/)

## Configuração do Firebase

É necessário ter um projeto Firebase com Authentication (provedor E-mail/senha) e Firestore habilitados. Crie `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

No Firestore, cadastre a conta administrativa na coleção `admins`, usando o UID do usuário autenticado como ID do documento. O painel verifica a existência desse documento para autorizar o administrador.

As regras versionadas estão em `firestore.rules`. Depois de autenticar o Firebase CLI e selecionar o projeto correto, publique-as com:

```bash
firebase deploy --project SEU_PROJECT_ID --only firestore:rules
```

As regras permitem leitura pública das pizzas para o cardápio e limitam gravações às contas com documento em `admins/{uid}`.

Os documentos da coleção `pizzas` usam os campos `name`, `description`, `price`, `category`, `imageUrl` e `available`. Para associar uma imagem, adicione o arquivo pelo editor à pasta `public/images/` e informe no painel um caminho como `/images/pizza-calabresa.jpeg`. O painel não envia arquivos para a nuvem.

## Como executar

### Pré-requisitos

- Node.js
- npm

### Instalação e desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação.

## Scripts disponíveis

| Comando         | Descrição                                    |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento.        |
| `npm run build` | Gera a versão de produção.                   |
| `npm run start` | Inicia a aplicação de produção após o build. |
| `npm run lint`  | Executa o ESLint.                            |

## Conteúdo do projeto

- `app/`: páginas, estilos, componentes, tipos e integrações.
- `firestore.rules`: regras de acesso do Firestore.
- `public/images/`: imagens usadas em outras partes da interface.
