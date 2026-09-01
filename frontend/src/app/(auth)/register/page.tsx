'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button, Card, ErrorAlert } from '@/components/ui';
import { Brain, Lock, Mail, User as UserIcon, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/dashboard');
    } catch (err: any) {
      setServerError(err?.message || 'Registration failed. Please try a different email or username.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 mb-2">
          <Brain className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          Start mastering subjects through intelligent AI discussions on Cognibloom.
        </p>
      </div>

      {/* Register Card */}
      <Card className="p-8 shadow-card border-slate-200/90 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <ErrorAlert
              title="Registration Error"
              message={serverError}
              onDismiss={() => setServerError(null)}
            />
          )}

          <Input
            label="Username"
            type="text"
            placeholder="e.g. sarah_coder"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            error={errors.username}
            leftIcon={<UserIcon className="w-4 h-4" />}
            disabled={isSubmitting}
            autoComplete="username"
            autoFocus
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled={isSubmitting}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            disabled={isSubmitting}
            autoComplete="new-password"
            helperText="Must be at least 6 characters long."
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 font-semibold shadow-sm text-sm"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>
      </Card>

      {/* Switch to Login */}
      <p className="text-center text-xs sm:text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
        >
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
