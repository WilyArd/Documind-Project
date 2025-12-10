"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, FolderOpen, Wrench, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const navLinks = [
    { href: "/dashboard", label: "My Docs", icon: FolderOpen },
    { href: "/tools/merge", label: "Tools", icon: Wrench },
];

export function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                DocuMind
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted hover:text-foreground hover:bg-primary/5"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    {user.user_metadata.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border border-border"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-2 border-b border-border">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/account"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-3 rounded-lg transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted hover:text-foreground hover:bg-primary/5"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 mb-2">
                                        {user.user_metadata.avatar_url ? (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full border border-border"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{user.email?.split('@')[0]}</span>
                                            <span className="text-xs text-muted truncate max-w-[150px]">{user.email}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-muted hover:text-foreground hover:bg-primary/5 transition-all"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3"
                                >
                                    <Button variant="primary" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
