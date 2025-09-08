
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Languages, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const supportedLanguages = [
    { value: 'Afrikaans', label: 'Afrikaans' },
    { value: 'Albanian', label: 'Shqip (Albanian)' },
    { value: 'Amharic', label: 'አማርኛ (Amharic)' },
    { value: 'Arabic', label: 'العربية (Arabic)' },
    { value: 'Armenian', label: 'Հայերեն (Armenian)' },
    { value: 'Azerbaijani', label: 'Azərbaycan (Azerbaijani)' },
    { value: 'Basque', label: 'Euskara (Basque)' },
    { value: 'Belarusian', label: 'Беларуская (Belarusian)' },
    { value: 'Bengali', label: 'বাংলা (Bengali)' },
    { value: 'Bosnian', label: 'Bosanski (Bosnian)' },
    { value: 'Bulgarian', label: 'Български (Bulgarian)' },
    { value: 'Catalan', label: 'Català (Catalan)' },
    { value: 'Cebuano', label: 'Cebuano' },
    { value: 'Chinese (Simplified)', label: '简体中文 (Chinese, Simplified)' },
    { value: 'Chinese (Traditional)', label: '繁體中文 (Chinese, Traditional)' },
    { value: 'Corsican', label: 'Corsu (Corsican)' },
    { value: 'Croatian', label: 'Hrvatski (Croatian)' },
    { value: 'Czech', label: 'Čeština (Czech)' },
    { value: 'Danish', label: 'Dansk (Danish)' },
    { value: 'Dutch', label: 'Nederlands (Dutch)' },
    { value: 'English', label: 'English' },
    { value: 'Esperanto', label: 'Esperanto' },
    { value: 'Estonian', label: 'Eesti (Estonian)' },
    { value: 'Finnish', label: 'Suomi (Finnish)' },
    { value: 'French', label: 'Français (French)' },
    { value: 'Frisian', label: 'Frysk (Frisian)' },
    { value: 'Galician', label: 'Galego (Galician)' },
    { value: 'Georgian', label: 'ქართული (Georgian)' },
    { value: 'German', label: 'Deutsch (German)' },
    { value: 'Greek', label: 'Ελληνικά (Greek)' },
    { value: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
    { value: 'Haitian Creole', label: 'Kreyòl Ayisyen (Haitian Creole)' },
    { value: 'Hausa', label: 'Hausa' },
    { value: 'Hawaiian', label: 'ʻŌlelo Hawaiʻi (Hawaiian)' },
    { value: 'Hebrew', label: 'עברית (Hebrew)' },
    { value: 'Hindi', label: 'हिन्दी (Hindi)' },
    { value: 'Hmong', label: 'Hmong' },
    { value: 'Hungarian', label: 'Magyar (Hungarian)' },
    { value: 'Icelandic', label: 'Íslenska (Icelandic)' },
    { value: 'Igbo', label: 'Igbo' },
    { value: 'Indonesian', label: 'Bahasa Indonesia (Indonesian)' },
    { value: 'Irish', label: 'Gaeilge (Irish)' },
    { value: 'Italian', label: 'Italiano (Italian)' },
    { value: 'Japanese', label: '日本語 (Japanese)' },
    { value: 'Javanese', label: 'Basa Jawa (Javanese)' },
    { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'Kazakh', label: 'Қазақ тілі (Kazakh)' },
    { value: 'Khmer', label: 'ខ្មែរ (Khmer)' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'Korean', label: '한국어 (Korean)' },
    { value: 'Kurdish', label: 'Kurdî (Kurmanji)' },
    { value: 'Kyrgyz', label: 'Кыргызча (Kyrgyz)' },
    { value: 'Lao', label: 'ລາວ (Lao)' },
    { value: 'Latin', label: 'Latina (Latin)' },
    { value: 'Latvian', label: 'Latviešu (Latvian)' },
    { value: 'Lithuanian', label: 'Lietuvių (Lithuanian)' },
    { value: 'Luxembourgish', label: 'Lëtzebuergesch (Luxembourgish)' },
    { value: 'Macedonian', label: 'Македонски (Macedonian)' },
    { value: 'Malagasy', label: 'Malagasy' },
    { value: 'Malay', label: 'Bahasa Melayu (Malay)' },
    { value: 'Malayalam', label: 'മലയാളം (Malayalam)' },
    { value: 'Maltese', label: 'Malti (Maltese)' },
    { value: 'Maori', label: 'Te Reo Māori (Maori)' },
    { value: 'Marathi', label: 'मराठी (Marathi)' },
    { value: 'Mongolian', label: 'Монгол (Mongolian)' },
    { value: 'Myanmar (Burmese)', label: 'မြန်မာ (Burmese)' },
    { value: 'Nepali', label: 'नेपाली (Nepali)' },
    { value: 'Norwegian', label: 'Norsk (Norwegian)' },
    { value: 'Nyanja (Chichewa)', label: 'Nyanja (Chichewa)' },
    { value: 'Odia (Oriya)', label: 'ଓଡ଼ିଆ (Oriya)' },
    { value: 'Pashto', label: 'پښتو (Pashto)' },
    { value: 'Persian', label: 'فارسی (Persian)' },
    { value: 'Polish', label: 'Polski (Polish)' },
    { value: 'Portuguese', label: 'Português (Portuguese)' },
    { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'Romanian', label: 'Română (Romanian)' },
    { value: 'Russian', label: 'Русский (Russian)' },
    { value: 'Samoan', label: 'Gagana Sāmoa (Samoan)' },
    { value: 'Scots Gaelic', label: 'Gàidhlig (Scots Gaelic)' },
    { value: 'Serbian', label: 'Српски (Serbian)' },
    { value: 'Sesotho', label: 'Sesotho' },
    { value: 'Shona', label: 'chiShona' },
    { value: 'Sindhi', label: 'سنڌي (Sindhi)' },
    { value: 'Sinhala (Sinhalese)', label: 'සිංහල (Sinhalese)' },
    { value: 'Slovak', label: 'Slovenčina (Slovak)' },
    { value: 'Slovenian', label: 'Slovenščina (Slovenian)' },
    { value: 'Somali', label: 'Soomaali (Somali)' },
    { value: 'Spanish', label: 'Español (Spanish)' },
    { value: 'Sundanese', label: 'Basa Sunda (Sundanese)' },
    { value: 'Swahili', label: 'Kiswahili (Swahili)' },
    { value: 'Swedish', label: 'Svenska (Swedish)' },
    { value: 'Tagalog (Filipino)', label: 'Tagalog (Filipino)' },
    { value: 'Tajik', label: 'Тоҷикӣ (Tajik)' },
    { value: 'Tamil', label: 'தமிழ் (Tamil)' },
    { value: 'Tatar', label: 'Татар (Tatar)' },
    { value: 'Telugu', label: 'తెలుగు (Telugu)' },
    { value: 'Thai', label: 'ไทย (Thai)' },
    { value: 'Turkish', label: 'Türkçe (Turkish)' },
    { value: 'Turkmen', label: 'Türkmen (Turkmen)' },
    { value: 'Ukrainian', label: 'Українська (Ukrainian)' },
    { value: 'Urdu', label: 'اردو (Urdu)' },
    { value: 'Uyghur', label: 'ئۇيغۇر (Uyghur)' },
    { value: 'Uzbek', label: 'Oʻzbek (Uzbek)' },
    { value: 'Vietnamese', label: 'Tiếng Việt (Vietnamese)' },
    { value: 'Welsh', label: 'Cymraeg (Welsh)' },
    { value: 'Xhosa', label: 'isiXhosa (Xhosa)' },
    { value: 'Yiddish', label: 'ייִדיש (Yiddish)' },
    { value: 'Yoruba', label: 'Yorùbá (Yoruba)' },
    { value: 'Zulu', label: 'isiZulu (Zulu)' },
];

type LanguageDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLanguage: (language: string) => void;
  isPending: boolean;
};

export function LanguageDialog({
  children,
  open,
  onOpenChange,
  onSelectLanguage,
  isPending,
}: LanguageDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<{value: string, label: string} | null | undefined>(null);

  const handleTranslate = () => {
    if (searchResult && searchResult.value) {
      onSelectLanguage(searchResult.value);
    }
    // The dialog will be closed by the parent component after the action is dispatched.
  };
  
  const handleSearch = () => {
      if (!searchTerm.trim()) {
          setSearchResult(null);
          return;
      }
      const result = supportedLanguages.find(lang => lang.label.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchResult(result);
  }

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSearchResult(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate Post</DialogTitle>
          <DialogDescription>
            Search for a language and translate this post.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} type="button" variant="outline" size="icon">
                <Search className="h-4 w-4" />
            </Button>
          </div>
          {searchResult === undefined && (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    The language "{searchTerm}" was not found. Please try another search.
                </AlertDescription>
            </Alert>
          )}
          {searchResult && (
             <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Language Found</AlertTitle>
                <AlertDescription>
                    Selected language: <strong>{searchResult.label}</strong>. Click Translate to continue.
                </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={!searchResult || isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Languages className="mr-2 h-4 w-4" />
            )}
            Translate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
