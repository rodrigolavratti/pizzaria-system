import { Pizza } from "@/app/types";

export const pizzas: Pizza[] = [
  {
    id: crypto.randomUUID(),
    nome: "Pizza de Calabresa",
    descricao:
      "Peça nossa clássica pizza de calabresa com molho e massa de sua escolha.",
    preco: 32.99,
    imagemAlt: "Pizza de Calabresa Clássica",
    imagem: "/images/pizza-calabresa.jpeg",
    review: 4.8,
  },
  {
    id: crypto.randomUUID(),
    nome: "Pizza de Bacon",
    descricao:
      "Peça nossa clássica pizza de bacon com molho e massa de sua escolha.",
    preco: 34.99,
    imagemAlt: "Pizza de Bacon Clássica",
    imagem: "/images/pizza-qualquer.jpg",
    review: 4.5,
  },
  {
    id: crypto.randomUUID(),
    nome: "Pizza Portuguesa",
    descricao:
      "Molho de Tomate, Mozzarella, Pimento Verde, Cebola, Cogumelos Frescos, Tomate e Azeitonas Pretas.",
    preco: 29.99,
    imagemAlt: "Pizza Portuguesa com Cogumelos e Azeitonas",
    imagem: "/images/pizza-calabresa.jpeg",
    review: 2.5,
  },
  {
    id: crypto.randomUUID(),
    nome: "Pizza de Calabresa",
    descricao:
      "Peça nossa clássica pizza de calabresa com molho e massa de sua escolha.",
    preco: 32.99,
    imagemAlt: "Pizza de Calabresa Clássica",
    imagem: "/images/pizza-calabresa.jpeg",
    review: 3.8,
  },
  {
    id: crypto.randomUUID(),
    nome: "Pizza de Bacon",
    descricao:
      "Peça nossa clássica pizza de bacon com molho e massa de sua escolha.",
    preco: 34.99,
    imagemAlt: "Pizza de Bacon Clássica",
    imagem: "/images/pizza-qualquer.jpg",
    review: 5.0,
  },
  {
    id: crypto.randomUUID(),
    nome: "Pizza Portuguesa",
    descricao:
      "Molho de Tomate, Mozzarella, Pimento Verde, Cebola, Cogumelos Frescos, Tomate e Azeitonas Pretas.",
    preco: 29.99,
    imagemAlt: "Pizza Portuguesa com Cogumelos e Azeitonas",
    imagem: "/images/pizza-calabresa.jpeg",
    review: 3.3,
  },
];
