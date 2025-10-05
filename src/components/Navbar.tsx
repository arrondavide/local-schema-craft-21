import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              Schema Generator
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              asChild
            >
              <Link to="/">Medical Schema</Link>
            </Button>
            
            <Button 
              variant={location.pathname === '/business' ? 'default' : 'ghost'} 
              asChild
            >
              <Link to="/business">Business Schema</Link>
            </Button>
            
            <Button 
              variant={location.pathname === '/service' ? 'default' : 'ghost'} 
              asChild
            >
              <Link to="/service">Service Schema</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
