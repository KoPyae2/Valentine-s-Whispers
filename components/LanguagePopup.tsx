'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  countryCode: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', countryCode: 'US' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', countryCode: 'CN' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲', countryCode: 'MM' },
];

export default function LanguagePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const preferredLanguage = localStorage.getItem('preferred-language');
    if (!preferredLanguage) {
      setIsOpen(true);
    } else {
      setSelectedLang(preferredLanguage);
    }
  }, []);

  const selectLanguage = (code: string) => {
    localStorage.setItem('preferred-language', code);
    document.cookie = `preferred-language=${code}; path=/; max-age=31536000`;
    setSelectedLang(code);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="bg-gradient-to-b from-gray-900/90 to-gray-800/90 rounded-2xl border border-pink-200/20 shadow-xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4 text-center">
            <div className="inline-flex rounded-full bg-pink-500/10 p-3">
              <Globe className="w-6 h-6 text-pink-400" />
            </div>
          </div>

          <div className="px-6 pb-6 space-y-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                  ${selectedLang === lang.code 
                    ? 'bg-pink-500/20 border-pink-400/50 text-white' 
                    : 'bg-black/20 border-pink-200/10 text-gray-300 hover:bg-pink-500/10 hover:border-pink-400/30'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.nativeName}</span>
                  {lang.name !== lang.nativeName && (
                    <span className="text-sm text-gray-400">{lang.name}</span>
                  )}
                </div>
                {selectedLang === lang.code && (
                  <motion.div 
                    className="ml-auto w-2 h-2 rounded-full bg-pink-400"
                    layoutId="selectedDot"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  );
} 