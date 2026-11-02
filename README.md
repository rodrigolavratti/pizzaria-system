# Pizzaria System

Landing page institucional da **Pizzaria System**, desenvolvida com Next.js e TypeScript. O projeto apresenta a pizzaria, seu cardápio e informações para que clientes conheçam a marca e encontrem formas de contato.

## Funcionalidades

- Apresentação da pizzaria em uma seção de destaque.
- Cardápio com pizzas, descrições, preços e imagens.
- Depoimentos de clientes.
- Informações de endereço, horário de funcionamento e contato.
- Layout responsivo para diferentes tamanhos de tela.

> Este projeto é uma interface de apresentação. Recursos como pedidos online, carrinho funcional e integração com serviços externos não estão implementados.

## Tecnologias

- [Next.js](https://nextjs.org/) com App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

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

- `app/`: páginas, layout, estilos, componentes, tipos e dados do cardápio.
- `public/images/`: imagens utilizadas na interface.

Os dados das pizzas ficam em `app/constants/` e suas imagens devem estar disponíveis em `public/images/`.
