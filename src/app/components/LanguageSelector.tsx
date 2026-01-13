// LanguageSelector - Component to switch app language

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { setLanguage, getLanguage, type Language } from '@/app/services/i18n';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange?: (lang: Language) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const handleLanguageChange = (lang: string) => {
    const newLang = lang as Language;
    setLanguage(newLang);
    setCurrentLang(newLang);
    
    // Trigger re-render of parent component
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    
    // Force page reload to apply translations
    window.location.reload();
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue>
            {languages.find(l => l.code === currentLang)?.flag}{' '}
            {languages.find(l => l.code === currentLang)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
