import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card data-testid="login-card" className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900">BIOINSIGHT</h1>
          <p className="mt-1 text-sm text-slate-500">Sign In to your account</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <Input 
            id="email" 
            type="email" 
            label="Email Address" 
            placeholder="Email Address" 
            data-testid="login-email-input" 
          />
          <Input 
            id="password" 
            type="password" 
            label="Password" 
            placeholder="Password" 
            data-testid="login-password-input" 
          />

          <Button 
            type="submit" 
            data-testid="login-submit-btn" 
            className="w-full"
            onClick={() => window.location.href = '/dashboard'}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}

export { Login }