import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import React from 'react';
import { registerService } from '@/services/registerService';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  async function handleRegister(email?: string, password?: string){
    if(!email || !password){
      alert('Fill all fields!')
      return;
    }
    setLoading(true);

    const response = await registerService.register(email, password)
      
    if(response){
      navigate('/login');
    } else {
      alert('Error creating user!')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card data-testid="register-card" className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900">BIOINSIGHT</h1>
          <p className="mt-1 text-sm text-slate-500">Create your account</p>
        </div>

        <form className="space-y-4">
          <Input 
            id="email" 
            type="email" 
            label="Email Address" 
            placeholder="Email Address" 
            data-testid="register-email-input" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            id="password" 
            type="password" 
            label="Password" 
            placeholder="Password" 
            data-testid="register-password-input"
            onChange={(e) => setPassword(e.target.value)} 
          />

          <Button 
            type="submit" 
            data-testid="register-submit-btn" 
            className="w-full"
            onClick={async () => await handleRegister(email!, password!)}
            isLoading={loading}
          >
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}

export { Register }