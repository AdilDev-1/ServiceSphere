import { Button } from "@/components/ui/button";
import { FileEdit, Upload, CreditCard } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-blue-100/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              Submit Your Request<br className="hidden sm:block" />
              <span className="block sm:inline text-primary">with Confidence</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Streamline your service requests with our secure, professional platform. 
              Submit forms, upload documents, and track progress all in one place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 lg:mb-16 px-4 sm:px-0">
              <Button onClick={handleLogin} size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-target">
                <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Login
              </Button>
              <Button onClick={handleLogin} variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-target">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Register
              </Button>
            </div>

            {/* 3-Step Process */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileEdit className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">1. Fill Form</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Complete our structured form with your service details and requirements.</p>
              </div>
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">2. Upload Docs</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Securely upload required documents with our easy drag-and-drop interface.</p>
              </div>
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-warning" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">3. Pay</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Once approved, complete your payment through our secure payment gateway.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
