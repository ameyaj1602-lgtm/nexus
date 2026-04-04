'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  User,
  Globe,
  Shield,
  Download,
  Trash2,
  UserPlus,
  Info,
  LogOut,
  Copy,
  Check,
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { getLanguage, setLanguage, t, type Language } from '@/lib/i18n';

interface PrivacySettings {
  showIdentity: boolean;
  showJournal: boolean;
  showHypotheses: boolean;
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showIdentity: true,
    showJournal: false,
    showHypotheses: true,
  });
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(u);
    setLang(getLanguage());

    // Load privacy settings
    const storedPrivacy = localStorage.getItem('nexus_privacy');
    if (storedPrivacy) {
      try {
        setPrivacy(JSON.parse(storedPrivacy));
      } catch {
        // use defaults
      }
    }

    // Load or generate invite code
    let code = localStorage.getItem('nexus_invite_code');
    if (!code) {
      code = generateInviteCode();
      localStorage.setItem('nexus_invite_code', code);
    }
    setInviteCode(code);
  }, [router]);

  function handleLanguageChange(newLang: Language) {
    setLang(newLang);
    setLanguage(newLang);
  }

  function handlePrivacyChange(key: keyof PrivacySettings, value: boolean) {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    localStorage.setItem('nexus_privacy', JSON.stringify(updated));
  }

  function handleExportData() {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nexus_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key)!);
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClearData() {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nexus_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setClearDialogOpen(false);
    router.push('/');
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">{t('settings', lang)}</h1>

          {/* Profile Section */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-base">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                <span className="capitalize">{user.role}</span>
              </div>
            </CardContent>
          </Card>

          {/* Language Preference */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="size-4 text-indigo-400" />
                {t('language', lang)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={lang === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('en')}
                  className={lang === 'en' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                >
                  English
                </Button>
                <Button
                  variant={lang === 'hi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('hi')}
                  className={lang === 'hi' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                >
                  हिन्दी
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="size-4 text-indigo-400" />
                {t('privacyControls', lang)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-identity" className="flex-1 cursor-pointer">
                  {lang === 'hi'
                    ? 'पैरेंट्स को पहचान प्रोफ़ाइल दिखाएं'
                    : 'Allow parents to see my identity profile'}
                </Label>
                <Switch
                  id="show-identity"
                  checked={privacy.showIdentity}
                  onCheckedChange={(checked) =>
                    handlePrivacyChange('showIdentity', checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="show-journal" className="flex-1 cursor-pointer">
                  {lang === 'hi'
                    ? 'पैरेंट्स को जर्नल एंट्रीज़ दिखाएं'
                    : 'Allow parents to see my journal entries'}
                </Label>
                <Switch
                  id="show-journal"
                  checked={privacy.showJournal}
                  onCheckedChange={(checked) =>
                    handlePrivacyChange('showJournal', checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="show-hypotheses" className="flex-1 cursor-pointer">
                  {lang === 'hi'
                    ? 'पैरेंट्स को करियर अनुमान दिखाएं'
                    : 'Allow parents to see my career hypotheses'}
                </Label>
                <Switch
                  id="show-hypotheses"
                  checked={privacy.showHypotheses}
                  onCheckedChange={(checked) =>
                    handlePrivacyChange('showHypotheses', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="size-4 text-indigo-400" />
                {lang === 'hi' ? 'डेटा प्रबंधन' : 'Data Management'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExportData}
              >
                <Download className="size-4" />
                {t('exportData', lang)}
              </Button>

              <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                    />
                  }
                >
                  <Trash2 className="size-4" />
                  {t('clearData', lang)}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {lang === 'hi' ? 'क्या आप पक्के हैं?' : 'Are you sure?'}
                    </DialogTitle>
                    <DialogDescription>
                      {lang === 'hi'
                        ? 'यह सारा Nexus डेटा मिटा देगा। यह वापस नहीं आएगा।'
                        : 'This will permanently delete all your Nexus data. This action cannot be undone.'}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline" />}
                    >
                      {t('cancel', lang)}
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleClearData}
                    >
                      {lang === 'hi' ? 'हां, सब मिटाएं' : 'Yes, clear everything'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Invite Parent */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="size-4 text-indigo-400" />
                {lang === 'hi' ? 'पैरेंट को आमंत्रित करें' : 'Invite Parent'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {lang === 'hi'
                  ? 'यह कोड अपने पैरेंट को दें। वे इससे अकाउंट लिंक कर सकते हैं।'
                  : 'Share this code with your parent. They can use it to link their account.'}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-muted px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest">
                  {inviteCode}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="size-4 text-green-400" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4" />
                Nexus v1.0 &mdash; Career &amp; Identity Navigation OS
              </div>
            </CardContent>
          </Card>

          {/* Log Out */}
          <Button
            variant="outline"
            className="w-full justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-900/30"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            {t('logout', lang)}
          </Button>
        </div>
      </main>
    </div>
  );
}
