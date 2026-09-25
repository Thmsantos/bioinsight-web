import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(email?: string, password?: string){
    if(!email || !password){
      alert('Fill all fields!')
      return;
    }
    setLoading(true);

    const response = await authService.login(email, password)
      
    if(response){
      navigate('/dashboard');
    } else {
      alert('Invalid credentials!')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card data-testid="login-card" className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900">BIOINSIGHT</h1>
          <p className="mt-1 text-sm text-slate-500">Sign In to your account</p>
        </div>

        <form className="space-y-4">
          <Input 
            id="email" 
            type="email" 
            label="Email Address" 
            placeholder="Email Address" 
            data-testid="login-email-input" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            id="password" 
            type="password" 
            label="Password" 
            placeholder="Password" 
            data-testid="login-password-input"
            onChange={(e) => setPassword(e.target.value)} 
          />

          <Button 
            type="submit" 
            data-testid="login-submit-btn" 
            className="w-full"
            onClick={async () => await handleLogin(email!, password!)}
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}

export { Login }