"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, User } from "lucide-react";
import Link from "next/link";

interface RoleGateProps {
  allowedRoles: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showContactAdmin?: boolean;
}

export function RoleGate({
  allowedRoles,
  children,
  fallback,
  showContactAdmin = true,
}: RoleGateProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle>Autenticação Necessária</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Precisa de estar autenticado para aceder a esta página.
          </p>
          <div className="space-x-2">
            <Button asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Registar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get user role from publicMetadata
  const userRole = user?.publicMetadata?.role as string || 'user';
  
  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Check if user has required role
  const hasAccess = rolesArray.includes(userRole);

  if (!hasAccess) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default access denied UI
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle>Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Não tem permissões para aceder a esta área. 
              É necessário ter uma das seguintes funções: <strong>{rolesArray.join(', ')}</strong>
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Função atual: <strong>{userRole}</strong></p>
            <p>Funções necessárias: <strong>{rolesArray.join(', ')}</strong></p>
          </div>

          {showContactAdmin && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Se acredita que isto é um erro, contacte o administrador.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:admin@spyportugues.com">
                  Contactar Administrador
                </Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="ghost" asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User has access, render children
  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminOnly({ 
  children, 
  fallback,
  showContactAdmin = true 
}: Omit<RoleGateProps, 'allowedRoles'>) {
  return (
    <RoleGate 
      allowedRoles="admin" 
      fallback={fallback}
      showContactAdmin={showContactAdmin}
    >
      {children}
    </RoleGate>
  );
}

export function UserOrAdmin({ 
  children, 
  fallback,
  showContactAdmin = true 
}: Omit<RoleGateProps, 'allowedRoles'>) {
  return (
    <RoleGate 
      allowedRoles={['admin', 'user']} 
      fallback={fallback}
      showContactAdmin={showContactAdmin}
    >
      {children}
    </RoleGate>
  );
}
