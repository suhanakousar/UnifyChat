import { Link } from "react-router-dom";
import { logo } from "../assets";
import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Services", href: "#services" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    company: [
      { name: "About", href: "/#features" },
      { name: "Blog", href: "/Help" },
      { name: "Careers", href: "/Help" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Privacy", href: "/Help" },
      { name: "Terms", href: "/Help" },
      { name: "Security", href: "/Help" },
      { name: "Cookies", href: "/Help" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      
      <div className="section-container relative z-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Chatlas" className="h-12 w-12" />
              <span className="text-2xl font-display font-bold text-gradient">UnifyChat</span>
            </div>
            <p className="text-neutral-300 max-w-xs text-lg leading-relaxed">
              Breaking language barriers with AI-powered real-time translation. Connect with anyone, anywhere.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/5 hover:bg-primary-600/20 border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/5 hover:bg-primary-600/20 border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/5 hover:bg-primary-600/20 border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient-cyan">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient-cyan">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') || link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient-cyan">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') || link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400">
              © 2025 <span className="text-white font-semibold">UnifyChat</span>. All Rights Reserved.
            </p>
            <a
              href="mailto:unifychathelp@gmail.com"
              className="group flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary-600/20 border border-white/10 group-hover:border-primary-500/50 transition-all duration-300">
                <FaEnvelope />
              </div>
              <span className="font-medium">unifychathelp@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
