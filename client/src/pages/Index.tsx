
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-secondary/95 to-secondary/70 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
      
      {/* Circular grid patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,196,60,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] z-0 opacity-30"></div>
      
      {/* Left column - Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 relative z-10">
        <div className="max-w-lg mx-auto md:mx-0">
          <div className="mb-6 inline-block p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-secondary font-bold text-3xl">B</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white leading-tight">
            <span className="text-primary">Bridge</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white/90">
            Build stronger connections
          </h2>
          
          <div className="space-y-6 text-white/80">
            <p className="text-lg">
              The intelligent relationship platform that helps you maintain meaningful connections.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary">✓</span>
                </div>
                <p>Personalized insights</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary">✓</span>
                </div>
                <p>AI-powered memory</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary">✓</span>
                </div>
                <p>Emotional tracking</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary">✓</span>
                </div>
                <p>Adaptive strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-md">
          <LoginForm />
          
          <div className="mt-8 text-center text-sm text-white/70">
            <p>
              By signing in, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom wave design */}
      <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="#FFC43C" fillOpacity="1" d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,186.7C672,213,768,235,864,229.3C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Index;
