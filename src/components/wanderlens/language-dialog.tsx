
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Languages } from 'lucide-react';

const supportedLanguages = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Español (Spanish)' },
  { value: 'French', label: 'Français (French)' },
  { value: 'German', label: 'Deutsch (German)' },
  { value: 'Italian', label: 'Italiano (Italian)' },
  { value: 'Portuguese', label: 'Português (Portuguese)' },
  { value: 'Russian', label: 'Русский (Russian)' },
  { value: 'Japanese', label: '日本語 (Japanese)' },
  { value: 'Korean', label: '한국어 (Korean)' },
  { value: 'Chinese (Simplified)', label: '简体中文 (Chinese, Simplified)' },
  { value: 'Hindi', label: 'हिन्दी (Hindi)' },
  { value: 'Arabic', label: 'العربية (Arabic)' },
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
  const [selectedLanguage, setSelectedLanguage] = React.useState('');

  const handleTranslate = () => {
    if (selectedLanguage) {
      onSelectLanguage(selectedLanguage);
      onOpenChange(false); // Close dialog on translate
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate Post</DialogTitle>
          <DialogDescription>
            Select a language to translate this post into.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a language..." />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={!selectedLanguage || isPending}
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
