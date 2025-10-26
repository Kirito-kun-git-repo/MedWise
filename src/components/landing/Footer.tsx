import Image from "next/image";

function Footer() {
  return (
    <footer className="px-6 py-12 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="MedWise Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-semibold text-lg">MedWise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered healthcare assistant — simplifying patient care, diagnostics, and wellness insights.
            </p>
          </div>

          {/* Product Section */}
          <div>
            <h4 className="font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Data Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MedWise. Empowering smarter healthcare with intelligent insights.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
