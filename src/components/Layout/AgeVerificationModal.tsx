import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAgeVerification } from '@/contexts/AgeVerificationContext';

const AgeVerificationModal = () => {
  const { showModal, verifyAge, closeModal } = useAgeVerification();
  const [step, setStep] = useState<'initial' | 'us-check' | 'denied'>('initial');
  const [isUSUser, setIsUSUser] = useState(false);

  // Detect if user is likely from the US
  useEffect(() => {
    const detectUSUser = () => {
      // Check timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const usTimezones = [
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu'
      ];
      
      // Check language
      const language = navigator.language || navigator.languages[0];
      const isUSLanguage = language.startsWith('en-US');
      
      // Check timezone or language indicates US
      const likelyUS = usTimezones.some(tz => timezone.includes(tz)) || isUSLanguage;
      
      setIsUSUser(likelyUS);
    };

    detectUSUser();
  }, []);

  const handleOver18 = () => {
    if (isUSUser) {
      setStep('us-check');
    } else {
      verifyAge();
    }
  };

  const handleOver21 = () => {
    verifyAge();
  };

  const handleUnder18 = () => {
    setStep('denied');
  };

  const handleUnder21 = () => {
    setStep('denied');
  };

  const handleLeaveWebsite = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showModal) return null;

  return (
    <Dialog open={showModal} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md mx-auto bg-background border border-border shadow-2xl [&>button]:hidden"
      >
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Age Verification Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground mb-2">
              Snusthetic
            </div>
            <p className="text-sm text-muted-foreground">
              This website contains information about tobacco products
            </p>
          </div>

          <Separator />

          {step === 'initial' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Are you 18 years of age or older?
                </h3>
                <p className="text-sm text-muted-foreground">
                  You must be of legal age to view this website
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleOver18}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  Yes, I'm 18+
                </Button>
                <Button 
                  onClick={handleUnder18}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {step === 'us-check' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Are you 21 years of age or older?
                </h3>
                <p className="text-sm text-muted-foreground">
                  US residents must be 21+ to view tobacco products
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleOver21}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  Yes, I'm 21+
                </Button>
                <Button 
                  onClick={handleUnder21}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {step === 'denied' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-destructive mb-2">
                  Access Denied
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You must be of legal age to access this website.
                </p>
              </div>
              
              <Button 
                onClick={handleLeaveWebsite}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                size="lg"
              >
                Leave Website
              </Button>
            </div>
          )}

          <Separator />

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>By entering this website, you certify that you are of legal smoking age.</p>
            <p>This website contains information about tobacco products.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationModal;