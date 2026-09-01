'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button, Card, ErrorAlert } from '@/components/ui';
import { Brain, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await login({ email: email.trim(), password });
      router.replace('/dashboard');
    } catch (err: any) {
      setServerError(err?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('alex@cognibloom.com');
    setPassword('password123');
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 mb-2">
          <Brain className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to Cognibloom
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          Sign in to continue your adaptive learning sessions and track your mastery.
        </p>
      </div>

      {/* Login Card */}
      <Card className="p-8 shadow-card border-slate-200/90 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <ErrorAlert
              title="Authentication Error"
              message={serverError}
              onDismiss={() => setServerError(null)}
            />
          )}

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
            autoFocus
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
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 font-semibold shadow-sm text-sm"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Account
          </Button>
        </form>

        {/* Demo Credentials Autofill */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Seed Demo Credentials (alex@cognibloom.com)</span>
          </button>
        </div>
      </Card>

      {/* Switch to Register */}
      <p className="text-center text-xs sm:text-sm text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
