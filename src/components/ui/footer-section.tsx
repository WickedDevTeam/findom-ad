"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react";
function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return <footer className="relative z-10 border-t border-white/10 bg-findom-dark/95 backdrop-blur-md text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 bg-zinc-950">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
              Stay Connected
            </h2>
            <p className="mb-6 text-findom-gray">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative">
              <Input type="email" placeholder="Enter your email" className="pr-12 bg-findom-dark/80 border-white/10 text-white placeholder:text-findom-gray/80" />
              <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full transition-transform hover:scale-105 bg-slate-50 text-gray-950 font-bold">
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-findom-purple/5 blur-2xl pointer-events-none" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block text-findom-gray hover:text-findom-purple transition-colors">
                Home
              </a>
              <a href="#" className="block text-findom-gray hover:text-findom-purple transition-colors">
                About Us
              </a>
              <a href="#" className="block text-findom-gray hover:text-findom-purple transition-colors">
                Services
              </a>
              <a href="#" className="block text-findom-gray hover:text-findom-purple transition-colors">
                Products
              </a>
              <a href="#" className="block text-findom-gray hover:text-findom-purple transition-colors">
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-findom-gray">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@example.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-findom-purple hover:text-white transition">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-findom-purple hover:text-white transition">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-findom-purple hover:text-white transition">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-findom-purple hover:text-white transition">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2 text-findom-gray">
              <Sun className="h-4 w-4" />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-findom-gray">
            © 2024 Your Company. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-findom-gray hover:text-findom-purple transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-findom-gray hover:text-findom-purple transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-findom-gray hover:text-findom-purple transition-colors">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>;
}
export { Footerdemo };