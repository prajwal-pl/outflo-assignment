import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Outflo</h1>
          <nav className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium">Campaign Management</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}