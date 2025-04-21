
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NavbarProfileMenu = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    // redirect to login page or home
    navigate('/');
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} aria-label="Profile">
        <User className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default NavbarProfileMenu;
