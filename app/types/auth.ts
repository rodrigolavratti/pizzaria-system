export interface User {
  name: string;
  email: string;
}

export type SidebarPanel = "cart" | "account";

export interface AuthContextType {
  user: User | null;
  activeSidebar: SidebarPanel | null;
  isAuthModalOpen: boolean;
  authMode: "login" | "register";
  openSidebar: (panel: SidebarPanel) => void;
  closeSidebar: () => void;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
