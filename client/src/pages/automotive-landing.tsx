import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, Clock, Shield, Star, ArrowRight, CheckCircle, Phone, Mail, MapPin, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AutomotiveLanding() {
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const services = [
    {
      icon: <Wrench className="w-8 h-8 text-blue-600" />,
      title: "Oil Change",
      description: "Quick and professional oil change service",
      price: "From $45",
      time: "30 mins",
    },
    {
      icon: <Car className="w-8 h-8 text-blue-600" />,
      title: "Brake Service",
      description: "Complete brake inspection and repair",
      price: "From $85",
      time: "1 hour",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Engine Diagnostics",
      description: "Advanced computer diagnostics",
      price: "From $120",
      time: "1-2 hours",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Tire Service",
      description: "Tire rotation and balancing",
      price: "From $35",
      time: "45 mins",
    },
  ];

  const features = [
    "Expert certified technicians",
    "Quick turnaround times",
    "Competitive pricing",
    "Quality parts and service",
    "Customer satisfaction guarantee",
    "Mobile app scheduling",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AutoService Pro</h1>
                <p className="text-xs text-gray-500">Professional Automotive Care</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" ? (
                    <>
                      <Link href="/admin">
                        <Button variant="outline" className="rounded-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout} 
                        className="rounded-full text-gray-600 hover:text-gray-900"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard">
                        <Button variant="outline" className="rounded-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout} 
                        className="rounded-full text-gray-600 hover:text-gray-900"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline" className="rounded-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Professional Auto Service
                  <span className="block text-blue-200">You Can Trust</span>
                </h1>
                <p className="text-xl text-blue-100 mt-6">
                  Book your automotive service online with our certified technicians. 
                  Fast, reliable, and affordable car care solutions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">
                    Book Service Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 rounded-full px-8">
                  View Services
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-blue-200">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-blue-200">Service Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5★</div>
                  <div className="text-blue-200">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <Car className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold">Quick Service Booking</h3>
                    <p className="text-blue-100 mt-2">Get your car serviced in 3 simple steps</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <span>Choose your service</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <span>Schedule appointment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <span>Get professional service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Auto Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional automotive care with certified technicians and quality parts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Starting from</span>
                      <span className="text-lg font-semibold text-blue-600">{service.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Duration</span>
                      <span className="text-sm font-medium text-gray-900">{service.time}</span>
                    </div>
                    <Link href="/auth">
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 rounded-xl">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose AutoService Pro?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to providing the highest quality automotive service with 
                transparent pricing and exceptional customer care.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth" className="inline-block mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
                  Start Your Service
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
                <div className="text-center mb-8">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Customer Satisfaction</h3>
                  <p className="text-blue-100">See what our customers say about us</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-blue-100 mb-3">
                      "Excellent service! Quick, professional, and fair pricing. 
                      My car runs like new after their maintenance."
                    </p>
                    <p className="text-xs text-blue-200">- Sarah Johnson</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-blue-100 mb-3">
                      "Best auto service in town. They fixed my brake issue 
                      quickly and explained everything clearly."
                    </p>
                    <p className="text-xs text-blue-200">- Mike Rodriguez</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of satisfied customers who trust AutoService Pro 
            for their automotive needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 rounded-full px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AutoService Pro</h3>
                  <p className="text-sm text-gray-400">Professional Automotive Care</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted partner for professional automotive service. 
                We keep your vehicle running safely and efficiently.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">service@autoservicepro.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">123 Service Street, Auto City, AC 12345</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Oil Change</li>
                <li>Brake Service</li>
                <li>Engine Diagnostics</li>
                <li>Tire Service</li>
                <li>Transmission</li>
                <li>A/C Service</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutoService Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}