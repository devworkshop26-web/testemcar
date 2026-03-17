import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Router from "./routes/router";
import ScrollToTopButton from "./components/ScrollToTopButton";

// const queryClient = new QueryClient();


// app page
const App = () => (
    <TooltipProvider>
      <LanguageProvider>
        
        <Toaster />
        <Sonner />
        <Router />
        <ScrollToTopButton />
      </LanguageProvider>
    </TooltipProvider>
);

export default App;
