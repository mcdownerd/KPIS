import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show the install button
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallButton(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    const handleDismiss = () => {
        setShowInstallButton(false);
        // Hide for this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Don't show if dismissed in this session
    if (sessionStorage.getItem('pwa-install-dismissed')) {
        return null;
    }

    if (!showInstallButton) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Download className="w-6 h-6" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Instalar App</p>
                    <p className="text-xs text-white/90 mt-0.5">
                        Acesso rápido e funciona offline
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleInstallClick}
                        className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                    >
                        Instalar
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="text-white hover:bg-white/20"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
