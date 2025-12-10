"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    const { signUpWithEmail, signInWithGoogle, verifyOtp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error } = await signUpWithEmail(email, password);

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        await signInWithGoogle();
    };

    const handleOtpVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error } = await verifyOtp(email, otp);

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            // OTP verified, usually Supabase logs them in automatically
            router.push("/dashboard");
        }
    };

    if (success) {
        return (
            <Card variant="glass" className="w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-success to-primary shadow-lg">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Verify your email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleOtpVerification} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full pl-4 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-center tracking-widest text-lg font-mono placeholder:font-sans placeholder:tracking-normal placeholder:text-sm"
                                maxLength={6}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Verify Code
                        </Button>
                        <button
                            type="button"
                            onClick={() => setSuccess(false)}
                            className="text-sm text-primary hover:underline mt-4"
                        >
                            Change Email
                        </button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="glass" className="w-full">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                </div>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                    Join DocuMind and start managing your documents smarter
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleEmailSignup} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted">Must be at least 6 characters</p>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignup}
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </Button>
            </CardContent>

            <CardFooter className="justify-center">
                <p className="text-sm text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
