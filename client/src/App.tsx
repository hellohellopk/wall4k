/**
 * Tactile Terminal Atelier — the app is a single focused creative workbench.
 * Dark theme maintains the ink-and-paper studio atmosphere defined in ideas.md.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const routeBase = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function AppRouter() {
  return <WouterRouter base={routeBase}><Switch><Route path="/" component={Home} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></WouterRouter>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><AppRouter /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
