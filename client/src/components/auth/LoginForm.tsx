
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { AtSign, Lock, LogIn } from 'lucide-react';
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithGoogle();
      toast({ title: "Welcome back", description: "Successfully logged in with Google!" });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Google login failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/dashboard');
      toast({
        title: "Welcome back",
        description: "You've successfully logged in",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl p-8 backdrop-blur-xl animate-scale-in bg-secondary/75">
      <div className="space-y-6">
        <div className="space-y-2 text-center mb-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-white/80">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-primary" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="pl-11 h-12 bg-secondary/30 border-white/20 text-white placeholder:text-white/60 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                disabled={isLoading}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-11 h-12 bg-secondary/30 border-white/20 text-white placeholder:text-white/60 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-white/40 bg-secondary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-white/80 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-secondary font-medium flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <LogIn className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-white/70 bg-secondary/80">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-secondary/40 border-white/20 text-white hover:bg-secondary/60 hover:text-white"
          >
            Microsoft
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="bg-secondary/40 border-white/20 text-white hover:bg-secondary/60 hover:text-white"
          >
            Google
          </Button>
        </div>

        <div className="text-center text-sm text-white/70">
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Contact administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
