
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type UserCredentials = {
  email: string;
  password?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // Simulate a user database. Start with the default mock user.
  const [registeredUsers, setRegisteredUsers] = useState<UserCredentials[]>([
    { email: 'yourhandle@example.com' }, // Default user doesn't need a password check
  ]);

  const handleLogin = () => {
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );
    
    // For the default user, we only check for email. For new users, we check password.
    const isPasswordCorrect = user && (user.password === undefined || user.password === loginPassword);

    if (user && isPasswordCorrect) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description:
          'Invalid credentials. Please check your email and password, or sign up if you are a new user.',
      });
    }
  };

  const handleSignUp = () => {
    if (!signupEmail || !signupPassword) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Please enter both an email and a password.',
      });
      return;
    }

    // Check if user already exists
    if (registeredUsers.some(u => u.email.toLowerCase() === signupEmail.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: 'This email is already registered. Please log in.',
        });
        return;
    }

    // "Register" the new user in our state
    setRegisteredUsers([...registeredUsers, { email: signupEmail, password: signupPassword }]);

    toast({
      title: 'Account Created!',
      description: "You've been successfully signed up. Please log in.",
    });

    // Switch to login tab and pre-fill email
    setLoginEmail(signupEmail);
    setLoginPassword(''); // Clear password field for login
    setActiveTab('login');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-md"
      >
        <div className="text-center mb-4">
          <Camera className="mx-auto h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary mt-2">
            Welcome to WanderLens
          </h1>
          <p className="text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="yourhandle@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground"
              >
                Forgot your password?
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to start sharing your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="yourhandle@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSignUp}>
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
