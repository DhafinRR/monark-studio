import { Order, PortfolioProject } from "@/types";

const ORDERS_KEY = "agency_orders";
const PORTFOLIO_KEY = "agency_portfolio";

// Seed portfolio data
const SEED_PORTFOLIO: PortfolioProject[] = [
  {
    id: "1",
    title: "TokoBaju.id",
    description: "E-commerce fashion dengan sistem pembayaran terintegrasi dan manajemen inventori.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    projectUrl: "https://example.com",
    tags: ["E-Commerce", "Web App"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "KlinikSehat App",
    description: "Aplikasi booking klinik dengan fitur antrian online dan rekam medis digital.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    projectUrl: "https://example.com",
    tags: ["Mobile App", "Healthcare"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "RumahIdaman.co",
    description: "Website properti dengan virtual tour 360° dan kalkulator KPR interaktif.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    projectUrl: "https://example.com",
    tags: ["Web CMS", "Property"],
    createdAt: new Date().toISOString(),
  },
];

function getItems<T>(key: string, seed?: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  if (seed) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return [];
}

function setItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

// Orders
export function getOrders(): Order[] {
  return getItems<Order>(ORDERS_KEY);
}

export function addOrder(order: Omit<Order, "id" | "status" | "createdAt">): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  setItems(ORDERS_KEY, orders);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    setItems(ORDERS_KEY, orders);
  }
}

// Portfolio
export function getPortfolio(): PortfolioProject[] {
  return getItems<PortfolioProject>(PORTFOLIO_KEY, SEED_PORTFOLIO);
}

export function addPortfolioProject(project: Omit<PortfolioProject, "id" | "createdAt">): PortfolioProject {
  const items = getPortfolio();
  const newItem: PortfolioProject = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  setItems(PORTFOLIO_KEY, items);
  return newItem;
}

export function deletePortfolioProject(id: string) {
  const items = getPortfolio().filter((p) => p.id !== id);
  setItems(PORTFOLIO_KEY, items);
}
