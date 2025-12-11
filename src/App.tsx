import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Utilities from "./pages/Utilities";
import DeliveryCashSheet from "./pages/DeliveryCashSheet";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import StoreDashboard from "./pages/StoreDashboard";
import ShiftManagement from "./pages/ShiftManagement";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute requireStore><StoreDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute requireStore><Index /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute requireStore><Products /></ProtectedRoute>} />
            <Route path="/utilities" element={<ProtectedRoute requireStore><Utilities /></ProtectedRoute>} />
            <Route path="/cash-register" element={<ProtectedRoute requireStore><DeliveryCashSheet /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/shift-management" element={<ProtectedRoute requireStore><ShiftManagement /></ProtectedRoute>} />
            <Route path="/shift-management.html" element={<Navigate to="/shift-management" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
