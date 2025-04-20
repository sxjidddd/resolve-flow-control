
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageSquare, ChevronRight, CheckCheck, Shield, Gauge } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      title: "Easy Complaint Submission",
      description: "Submit and track your complaints in a few simple steps",
      icon: MessageSquare,
    },
    {
      title: "Real-time Status Updates",
      description: "Get instant notifications on the progress of your complaints",
      icon: Gauge,
    },
    {
      title: "Efficient Resolution",
      description: "Our system ensures timely resolution of your issues",
      icon: CheckCheck,
    },
    {
      title: "Data Protection",
      description: "Your information is secured with enterprise-grade encryption",
      icon: Shield,
    },
  ];

  return (
    <div className="bg-background">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">ComplaintHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="animate-fade-in space-y-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Simplify Your <span className="text-gradient">Complaint Management</span> Process
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform for submitting, tracking, and resolving complaints efficiently. Designed for businesses and customers alike.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform comes with everything you need to manage complaints effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-morphism animate-fade-in">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process to ensure your complaints are addressed promptly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold text-primary-foreground">1</span>
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit a Complaint</h3>
              <p className="text-muted-foreground">
                Fill out the complaint form with all relevant details and attachments if necessary
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold text-primary-foreground">2</span>
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor the status of your complaint in real-time as it progresses through the system
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-6 relative">
                <span className="text-xl font-bold text-primary-foreground">3</span>
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Resolution</h3>
              <p className="text-muted-foreground">
                Receive updates and communication until your complaint is resolved satisfactorily
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied users who have streamlined their complaint management process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/signup")}>
                Create Account
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ComplaintHub</span>
            </div>
            <div className="flex gap-8">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ComplaintHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
