import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { loginUserSchema, type LoginUser } from "@shared/schema";
import { adminLogin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Shield, Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginUser) => {
    setIsLoading(true);
    
    try {
      const result = adminLogin(data.email, data.password);
      
      if (result.success && result.user) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the Admin Panel.",
        });
        // Always navigate to admin panel after successful admin login
        navigate("/admin");
      } else {
        toast({
          title: "Admin Login Failed",
          description: result.error || "Invalid admin credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Admin Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <Card className="w-full bg-gray-800/95 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-300">
              Restricted access - Administrators only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Credentials */}
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <p className="text-xs font-medium text-red-300 mb-2">Admin Demo Credentials:</p>
              <p className="text-xs text-red-200">Email: john@gmail.com</p>
              <p className="text-xs text-red-200">Password: admin123</p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter admin email"
                    className="pl-10 py-3 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 rounded-xl"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Admin Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10 py-3 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 rounded-xl"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
              >
                {isLoading ? "Verifying Access..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Regular user?{" "}
                <button
                  onClick={() => navigate("/auth")}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  User Login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}