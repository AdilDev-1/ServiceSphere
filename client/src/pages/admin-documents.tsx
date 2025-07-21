import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDocuments() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, user, isLoading, toast]);

  if (!isAuthenticated || isLoading || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto ml-64">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Document Review</CardTitle>
                <p className="text-gray-600">Review and verify uploaded documents</p>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Document review functionality will be implemented here.
                  This would include file viewing, verification controls, and approval workflows.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
