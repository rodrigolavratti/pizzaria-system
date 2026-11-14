import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { Pizza, PizzaInput } from "@/app/types/pizza";

const PIZZAS_COLLECTION = "pizzas";

const isPizzaInput = (value: unknown): value is PizzaInput => {
  if (typeof value !== "object" || value === null) return false;

  const pizza = value as Record<string, unknown>;

  return (
    typeof pizza.name === "string" &&
    pizza.name.trim().length > 0 &&
    typeof pizza.description === "string" &&
    typeof pizza.price === "number" &&
    Number.isFinite(pizza.price) &&
    pizza.price >= 0 &&
    typeof pizza.category === "string" &&
    pizza.category.trim().length > 0 &&
    typeof pizza.imageUrl === "string" &&
    typeof pizza.available === "boolean"
  );
};

const parsePizza = (id: string, value: unknown): Pizza => {
  if (!isPizzaInput(value)) {
    throw new Error(`O documento de pizza "${id}" tem dados inválidos.`);
  }

  return {
    id,
    name: value.name,
    description: value.description,
    price: value.price,
    category: value.category,
    imageUrl: value.imageUrl,
    available: value.available,
  };
};

const validatePizzaInput = (pizza: PizzaInput): void => {
  if (!isPizzaInput(pizza)) {
    throw new Error("Os dados da pizza são inválidos.");
  }
};

export async function listPizzas(): Promise<Pizza[]> {
  const snapshot = await getDocs(collection(db, PIZZAS_COLLECTION));
  return snapshot.docs.map((pizzaDocument) =>
    parsePizza(pizzaDocument.id, pizzaDocument.data()),
  );
}

export async function createPizza(pizza: PizzaInput): Promise<Pizza> {
  validatePizzaInput(pizza);

  const pizzaDocument = await addDoc(collection(db, PIZZAS_COLLECTION), pizza);

  return { ...pizza, id: pizzaDocument.id };
}

export async function updatePizza(
  id: string,
  pizza: PizzaInput,
): Promise<Pizza> {
  validatePizzaInput(pizza);

  await updateDoc(doc(db, PIZZAS_COLLECTION, id), pizza);
  return { ...pizza, id };
}

export async function setPizzaAvailability(
  id: string,
  available: boolean,
): Promise<void> {
  await updateDoc(doc(db, PIZZAS_COLLECTION, id), { available });
}

export async function deletePizza(id: string): Promise<void> {
  await deleteDoc(doc(db, PIZZAS_COLLECTION, id));
}
