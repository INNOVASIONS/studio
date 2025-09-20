
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
import { User } from '@/lib/types';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type MockUserStore = {
  email: string;
  password?: string;
  id: number;
};

// This component now simulates a user database and session management.
export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // We use localStorage to persist the mock user database across reloads.
  const [registeredUsers, setRegisteredUsers] = useState<MockUserStore[]>([]);

  useEffect(() => {
    // Initialize users from localStorage or with a default user.
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    } else {
      const defaultUser: MockUserStore = { id: 1, email: 'yourhandle@example.com', password: 'password' };
      setRegisteredUsers([defaultUser]);
      localStorage.setItem('registeredUsers', JSON.stringify([defaultUser]));
    }
  }, []);

  const handleLogin = () => {
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );
    
    const isPasswordCorrect = user && user.password === loginPassword;

    if (user && isPasswordCorrect) {
      // Simulate session by storing user ID in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email }));
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/');
      router.refresh();
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
    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Please enter your name, email and password.',
      });
      return;
    }

    if (registeredUsers.some(u => u.email.toLowerCase() === signupEmail.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: 'An account with this email already exists.',
        });
        return;
    }

    // Create a new user with a unique ID
    const newUserId = registeredUsers.length > 0 ? Math.max(...registeredUsers.map(u => u.id)) + 1 : 1;
    const newUser: MockUserStore = { id: newUserId, email: signupEmail, password: signupPassword };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Also add to the main user list in mock-data.
    const mainUserList: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const newUserProfile: User = {
        id: newUserId,
        name: signupName,
        handle: `@${signupName.toLowerCase().replace(/\s+/g, '')}`,
        email: signupEmail,
        avatarUrl: `https://picsum.photos/seed/${newUserId}/100/100`,
        bio: 'Welcome to WanderLens! Click "Edit Profile" to tell us about yourself.',
    };
    localStorage.setItem('users', JSON.stringify([...mainUserList, newUserProfile]));


    toast({
      title: 'Account Created!',
      description: "You've been successfully signed up. Please log in.",
    });

    setLoginEmail(signupEmail);
    setLoginPassword('');
    setActiveTab('login');
    // Clear signup form
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
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
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
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
