import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// Tipos de variantes para o Select
const selectVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
};

// Interface para as opções do Select
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Propriedades do componente Select
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  variant?: keyof typeof selectVariants;
  onChange?: (value: string | number) => void;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  fullWidth = false,
  variant = 'default',
  onChange,
  placeholder,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedOption(option);
    setIsOpen(false);
    
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label 
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      
      <div 
        className="relative"
        onBlur={() => setIsOpen(false)}
        tabIndex={0}
      >
        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between
            w-full
            rounded-lg
            border
            py-2 px-3
            cursor-pointer
            transition-all
            duration-200
            ${selectVariants[variant]}
            ${error ? selectVariants.error : ''}
            ${className || ''}
          `}
        >
          <div className="flex items-center">
            {selectedOption?.icon && (
              <span className="mr-2">{selectedOption.icon}</span>
            )}
            <span>
              {selectedOption?.label || placeholder || 'Selecione...'}
            </span>
          </div>
          <ChevronDown 
            className={`
              transform transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
            `} 
            size={20} 
          />
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                absolute 
                z-50 
                mt-1 
                w-full 
                bg-white 
                rounded-lg 
                shadow-lg 
                max-h-60 
                overflow-auto
                border
                divide-y
              "
            >
              {options.map((option) => (
                <motion.li
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  className={`
                    px-3 
                    py-2 
                    flex 
                    items-center 
                    justify-between
                    cursor-pointer
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${selectedOption?.value === option.value ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-center">
                    {option.icon && (
                      <span className="mr-2">{option.icon}</span>
                    )}
                    {option.label}
                  </div>
                  {selectedOption?.value === option.value && (
                    <Check size={20} className="text-blue-600" />
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
          id={`${props.id}-error`}
        >
          {error}
        </motion.p>
      )}

      {/* Hidden native select for form submissions */}
      <select 
        ref={ref}
        className="hidden"
        value={selectedOption?.value || ''}
        {...props}
      >
        <option value="">{placeholder || 'Selecione...'}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;