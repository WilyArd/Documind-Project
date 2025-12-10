"use client";

import { User, Mail, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

            <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your account information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                            <Mail className="w-5 h-5 text-muted" />
                            <div>
                                <p className="text-xs text-muted">Email</p>
                                <p className="text-sm font-medium text-foreground">
                                    {user?.email || "Not signed in"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                            <Shield className="w-5 h-5 text-muted" />
                            <div>
                                <p className="text-xs text-muted">Account ID</p>
                                <p className="text-sm font-medium text-foreground font-mono">
                                    {user?.id?.slice(0, 8) || "N/A"}...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>Your subscription details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                            <div>
                                <p className="font-semibold text-foreground">Free Plan</p>
                                <p className="text-sm text-muted">Basic PDF tools with limited AI queries</p>
                            </div>
                            <Button variant="outline" size="sm">
                                Upgrade
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                {user && (
                    <Card className="border-error/20">
                        <CardHeader>
                            <CardTitle className="text-error">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-foreground">Sign out</p>
                                    <p className="text-sm text-muted">Sign out of your account on this device</p>
                                </div>
                                <Button variant="outline" onClick={() => signOut()}>
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
