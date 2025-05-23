
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center glass-morphism">
      <div className="text-9xl font-bold mb-4 text-gradient">404</div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Home Page
        </Button>
      </div>
    </div>
  );
}
