import { Link } from "react-router-dom";
import {
  //Facebook,
  //Twitter,
  //Instagram,
  //Youtube,
  Mail,
  Phone,
  MapPin,
  //Calendar,
  Clock,
  
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

import { SiFacebook, SiYoutube, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks: FooterLink[] = [
    { label: "Productos", href: "/products" },
    { label: "Reservas", href: "/bookings" },
    { label: "Mis Reservas", href: "/my-bookings" },
    { label: "Contacto", href: "/contact" },
  ];

  const legalLinks: FooterLink[] = [
    { label: "Términos y Condiciones", href: "/terms" },
    { label: "Política de Privacidad", href: "/privacy" },
    { label: "Política de Cookies", href: "/cookies" },
  ];

  const socialLinks = [
    { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: SiX, href: "https://twitter.com", label: "Twitter" },
    { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: SiYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-white">
                Ibero
                <span className="text-red-700 dark:text-blue-400">Max</span>
              </h2>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              La plataforma más sencilla para reservar productos y gestionar tus
              pedidos. Rápido, seguro y confiable.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Av. Principal 1234,
                  <br />
                  Ciudad, País
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <a
                  href="mailto:contacto@iberomax.com"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  contacto@iberomax.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Lun - Vie: 9:00 - 18:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} IberoMax. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              to="/terms"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Términos
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
