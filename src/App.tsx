import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/PageTransition";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancel } from "./pages/PaymentCancel";
import { Dashboard } from "./pages/Dashboard";
import { Conversations } from "./pages/Conversations";
import { CustomersPage } from "./features/customers";
import { DocumentsPage } from "./features/documents";
import { AppointmentsPage } from "./features/appointments";
import { ProductsPage } from "./features/products";
import { ConfigurationPage } from "./features/configuration";
import { OrdersPage } from "./features/orders";
import { StatisticsPage } from "./features/statistics";
import { ServicesPage } from "./features/services";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/conversations"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Conversations />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/customers"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <CustomersPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/documents"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <DocumentsPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/appointments"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <AppointmentsPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/products"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <ProductsPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/orders"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <OrdersPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/configuration"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <ConfigurationPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/statistics"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <StatisticsPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/services"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <ServicesPage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
