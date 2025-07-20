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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Submit Your Request<br />
              <span className="text-primary">with Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Streamline your service requests with our secure, professional platform. 
              Submit forms, upload documents, and track progress all in one place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-4">
                <FileEdit className="w-5 h-5 mr-2" />
                Login
              </Button>
              <Button onClick={handleLogin} variant="outline" size="lg" className="text-lg px-8 py-4">
                <Upload className="w-5 h-5 mr-2" />
                Register
              </Button>
            </div>

            {/* 3-Step Process */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileEdit className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Fill Form</h3>
                <p className="text-gray-600">Complete our structured form with your service details and requirements.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Upload Docs</h3>
                <p className="text-gray-600">Securely upload required documents with our easy drag-and-drop interface.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Pay</h3>
                <p className="text-gray-600">Once approved, complete your payment through our secure payment gateway.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
