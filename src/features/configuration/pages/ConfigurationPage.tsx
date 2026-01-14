import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useBusiness, useQRCode, useConnectionStatus } from '../hooks/useConfiguration';
import { CheckCircle2, XCircle, Clock, Smartphone, QrCode, AlertCircle, RefreshCw } from 'lucide-react';

export function ConfigurationPage() {
  const { user } = useAuth();
  const businessSlug = user?.business?.slug || '';
  const [isScanning, setIsScanning] = useState(false);

  const { data: business, isLoading: isLoadingBusiness } = useBusiness(businessSlug);
  const { data: connectionStatus, refetch: refetchStatus } = useConnectionStatus(businessSlug, isScanning);
  const { data: qrCode, isLoading: isLoadingQR, refetch: refetchQR } = useQRCode(businessSlug, isScanning);
  
  const isConnected = connectionStatus?.state === 'open';

  const handleGetQRCode = async () => {
    setIsScanning(true);
    await refetchQR();
  };

  const handleCheckStatus = async () => {
    await refetchStatus();
  };

  if (isLoadingBusiness) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
            <SiteHeader />
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-6 pb-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Configuration</h1>
                <p className="text-sm text-muted-foreground">Manage your business settings and connections</p>
              </div>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Your business details and subscription status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                      <p className="text-base font-semibold">{business?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Slug</p>
                      <p className="text-base font-mono">{business?.slug}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={business?.is_active ? 'default' : 'secondary'}>
                        {business?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Onboarding</p>
                      <Badge variant={business?.onboarding_status === 'completed' ? 'default' : 'secondary'}>
                        {business?.onboarding_status}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Subscription Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Plan</p>
                        <p className="text-base">{business?.subscription_plan || 'No plan'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="text-base">{business?.subscription_status || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Connection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        WhatsApp Connection
                      </CardTitle>
                      <CardDescription>Connect your WhatsApp account to enable messaging</CardDescription>
                    </div>
                    {isConnected && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </Badge>
                    )}
                    {isScanning && !isConnected && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3 animate-spin" />
                        Scanning
                      </Badge>
                    )}
                    {!isConnected && !isScanning && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isScanning && !isConnected && (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <Smartphone className="h-12 w-12 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">
                        Connect your WhatsApp account to start receiving messages
                      </p>
                      <Button onClick={handleGetQRCode} size="lg">
                        <QrCode className="mr-2 h-4 w-4" />
                        Get QR Code
                      </Button>
                    </div>
                  )}

                  {isScanning && !isConnected && qrCode && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                        <QrCode className="h-6 w-6 mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-4">Scan this QR code with WhatsApp</p>
                        {qrCode.qrCode && (
                          <img
                            src={qrCode.qrCode}
                            alt="WhatsApp QR Code"
                            className="w-64 h-64 border-4 border-background rounded-lg shadow-lg"
                          />
                        )}
                        {qrCode.pairingCode && (
                          <div className="mt-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Or use pairing code:</p>
                            <p className="text-2xl font-mono font-bold">{qrCode.pairingCode}</p>
                          </div>
                        )}
                      </div>
                      <Alert>
                        <Smartphone className="h-4 w-4" />
                        <AlertTitle>How to connect</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>1. Open WhatsApp on your phone</p>
                          <p>2. Tap Menu or Settings and select Linked Devices</p>
                          <p>3. Tap Link a Device</p>
                          <p>4. Point your phone at this screen to scan the QR code</p>
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2">
                        <Button onClick={handleCheckStatus} variant="outline" className="flex-1">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Check Status
                        </Button>
                        <Button onClick={handleGetQRCode} variant="outline" className="flex-1">
                          <QrCode className="mr-2 h-4 w-4" />
                          Refresh QR Code
                        </Button>
                      </div>
                    </div>
                  )}

                  {isConnected && (
                    <Alert className="border-primary">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <AlertTitle>Successfully Connected</AlertTitle>
                      <AlertDescription>
                        Your WhatsApp account is connected and ready to receive messages.
                        <br />
                        Instance: <span className="font-mono text-sm">{connectionStatus?.instanceName}</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isLoadingQR && (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
