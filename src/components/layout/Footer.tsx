import React from 'react';
import { Share2, Cloud, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="
      bg-white 
      dark:bg-gray-900 
      border-t 
      dark:border-gray-800 
      py-6 
      mt-auto
    ">
      <div className="
        container 
        mx-auto 
        px-4 
        flex 
        flex-col 
        md:flex-row 
        justify-between 
        items-center
      ">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="
            text-gray-600 
            dark:text-gray-400 
            text-sm
          ">
            © {currentYear} Beam Calculator. Todos os direitos reservados.
          </p>
        </div>

        <div className="flex space-x-4">
          <a 
            href="#" 
            className="
              text-gray-600 
              dark:text-gray-400 
              hover:text-blue-600 
              dark:hover:text-blue-400 
              transition-colors
            "
          >
            <Share2 size={24} />
          </a>
          <a 
            href="#" 
            className="
              text-gray-600 
              dark:text-gray-400 
              hover:text-blue-600 
              dark:hover:text-blue-400 
              transition-colors
            "
          >
            <Cloud size={24} />
          </a>
          <a 
            href="#" 
            className="
              text-gray-600 
              dark:text-gray-400 
              hover:text-blue-600 
              dark:hover:text-blue-400 
              transition-colors
            "
          >
            <Globe size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;