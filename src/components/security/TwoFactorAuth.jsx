import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Key, Copy, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateSecureToken } from '@/utils/encryption';
import { logSecurityEvent } from '@/utils/securityLogger';

export function TwoFactorAuth() {
  const [step, setStep] = useState('setup'); // setup, verify, complete
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    const secret = generateSecureToken().substring(0, 16);
    const qrData = `otpauth://totp/SmartGrid:user@company.com?secret=${secret}&issuer=SmartGrid`;
    setQrCode(qrData);
    
    logSecurityEvent('2fa_setup_started', { method: 'totp' });
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    return codes;
  };

  const handleSetup = () => {
    generateQRCode();
    generateBackupCodes();
    setStep('verify');
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    // Mock verification - in real app, verify with server
    if (verificationCode === '123456') {
      setIsEnabled(true);
      setStep('complete');
      setError('');
      
      logSecurityEvent('2fa_enabled', { 
        method: 'totp',
        backupCodesGenerated: backupCodes.length 
      });
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setStep('setup');
    setQrCode('');
    setBackupCodes([]);
    setVerificationCode('');
    setError('');
    
    logSecurityEvent('2fa_disabled', { method: 'totp' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = `Smart Grid Platform - Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes safe and secure. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartgrid-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isEnabled && step === 'complete') {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-secondary-500" />
            <span>Two-Factor Authentication</span>
            <Badge variant="success">Enabled</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Two-factor authentication is now enabled for your account. Your account is more secure!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Backup Codes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm p-2 bg-white dark:bg-gray-700 rounded border">
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-3">
                <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Codes
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(backupCodes.join('\n'))}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="destructive" onClick={handleDisable}>
                Disable Two-Factor Authentication
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5" />
          <span>Two-Factor Authentication</span>
          <Badge variant="outline">Disabled</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'setup' && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is not enabled. Enable it now to add an extra layer of security to your account.
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-medium mb-2">How it works</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Install an authenticator app like Google Authenticator or Authy</li>
                <li>Scan the QR code with your authenticator app</li>
                <li>Enter the 6-digit code from your app to verify</li>
                <li>Save your backup codes in a secure location</li>
              </ol>
            </div>

            <Button onClick={handleSetup} className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Scan QR Code</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app, then enter the 6-digit code below.
              </p>
              
              {/* Mock QR Code */}
              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-black mx-auto mb-2" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`,
                    backgroundSize: 'cover'
                  }} />
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Manual entry key:</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  ABCD EFGH IJKL MNOP
                </code>
              </div>
            </div>

            <div>
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1">
                Verify & Enable
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                For testing, use code: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">123456</code>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}