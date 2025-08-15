import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Settings,
    Bell,
    Mail,
    CreditCard,
    Download,
    Shield,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface BillingSettingsProps {
    onSave: (settings: any) => void;
    isLoading?: boolean;
}

export function BillingSettings({ onSave, isLoading }: BillingSettingsProps) {
    const [settings, setSettings] = useState({
        notifications: {
            emailInvoices: true,
            emailPaymentFailed: true,
            emailUsageAlerts: true,
            emailPlanChanges: true,
            usageThreshold: 80,
            advanceNotice: 7
        },
        billing: {
            autoDownloadInvoices: false,
            currency: 'USD',
            taxId: '',
            billingEmail: '',
            companyName: ''
        },
        security: {
            requireConfirmationForChanges: true,
            allowTeamMemberBillingAccess: false
        }
    });

    const [hasChanges, setHasChanges] = useState(false);

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        onSave(settings);
        setHasChanges(false);
    };

    const handleReset = () => {
        // Reset to default values
        setSettings({
            notifications: {
                emailInvoices: true,
                emailPaymentFailed: true,
                emailUsageAlerts: true,
                emailPlanChanges: true,
                usageThreshold: 80,
                advanceNotice: 7
            },
            billing: {
                autoDownloadInvoices: false,
                currency: 'USD',
                taxId: '',
                billingEmail: '',
                companyName: ''
            },
            security: {
                requireConfirmationForChanges: true,
                allowTeamMemberBillingAccess: false
            }
        });
        setHasChanges(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Billing Settings</h2>
                <p className="text-muted-foreground">
                    Configure your billing preferences and notification settings
                </p>
            </div>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Notification Preferences
                    </CardTitle>
                    <CardDescription>
                        Choose when and how you want to be notified about billing events
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailInvoices">Email invoices</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive invoices and receipts via email
                                </p>
                            </div>
                            <Switch
                                id="emailInvoices"
                                checked={settings.notifications.emailInvoices}
                                onCheckedChange={(checked) =>
                                    handleSettingChange('notifications', 'emailInvoices', checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailPaymentFailed">Payment failure alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when payments fail
                                </p>
                            </div>
                            <Switch
                                id="emailPaymentFailed"
                                checked={settings.notifications.emailPaymentFailed}
                                onCheckedChange={(checked) =>
                                    handleSettingChange('notifications', 'emailPaymentFailed', checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailUsageAlerts">Usage limit alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when approaching usage limits
                                </p>
                            </div>
                            <Switch
                                id="emailUsageAlerts"
                                checked={settings.notifications.emailUsageAlerts}
                                onCheckedChange={(checked) =>
                                    handleSettingChange('notifications', 'emailUsageAlerts', checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailPlanChanges">Plan change confirmations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive confirmations for subscription changes
                                </p>
                            </div>
                            <Switch
                                id="emailPlanChanges"
                                checked={settings.notifications.emailPlanChanges}
                                onCheckedChange={(checked) =>
                                    handleSettingChange('notifications', 'emailPlanChanges', checked)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label htmlFor="usageThreshold">Usage alert threshold (%)</Label>
                            <Select
                                value={settings.notifications.usageThreshold.toString()}
                                onValueChange={(value) =>
                                    handleSettingChange('notifications', 'usageThreshold', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="50">50%</SelectItem>
                                    <SelectItem value="75">75%</SelectItem>
                                    <SelectItem value="80">80%</SelectItem>
                                    <SelectItem value="90">90%</SelectItem>
                                    <SelectItem value="95">95%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="advanceNotice">Renewal notice (days)</Label>
                            <Select
                                value={settings.notifications.advanceNotice.toString()}
                                onValueChange={(value) =>
                                    handleSettingChange('notifications', 'advanceNotice', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 day</SelectItem>
                                    <SelectItem value="3">3 days</SelectItem>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="14">14 days</SelectItem>
                                    <SelectItem value="30">30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Billing Information
                    </CardTitle>
                    <CardDescription>
                        Update your billing details and preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="billingEmail">Billing email</Label>
                            <Input
                                id="billingEmail"
                                type="email"
                                placeholder="billing@company.com"
                                value={settings.billing.billingEmail}
                                onChange={(e) =>
                                    handleSettingChange('billing', 'billingEmail', e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to use your account email
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company name</Label>
                            <Input
                                id="companyName"
                                placeholder="Your Company Inc."
                                value={settings.billing.companyName}
                                onChange={(e) =>
                                    handleSettingChange('billing', 'companyName', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxId">Tax ID / VAT number</Label>
                            <Input
                                id="taxId"
                                placeholder="123-45-6789"
                                value={settings.billing.taxId}
                                onChange={(e) =>
                                    handleSettingChange('billing', 'taxId', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Preferred currency</Label>
                            <Select
                                value={settings.billing.currency}
                                onValueChange={(value) =>
                                    handleSettingChange('billing', 'currency', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoDownloadInvoices">Auto-download invoices</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically download invoices when available
                            </p>
                        </div>
                        <Switch
                            id="autoDownloadInvoices"
                            checked={settings.billing.autoDownloadInvoices}
                            onCheckedChange={(checked) =>
                                handleSettingChange('billing', 'autoDownloadInvoices', checked)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Security & Access
                    </CardTitle>
                    <CardDescription>
                        Configure security settings for billing operations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="requireConfirmation">Require confirmation for changes</Label>
                            <p className="text-sm text-muted-foreground">
                                Require email confirmation for plan changes and cancellations
                            </p>
                        </div>
                        <Switch
                            id="requireConfirmation"
                            checked={settings.security.requireConfirmationForChanges}
                            onCheckedChange={(checked) =>
                                handleSettingChange('security', 'requireConfirmationForChanges', checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="teamBillingAccess">Team member billing access</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow team admins to view billing information
                            </p>
                        </div>
                        <Switch
                            id="teamBillingAccess"
                            checked={settings.security.allowTeamMemberBillingAccess}
                            onCheckedChange={(checked) =>
                                handleSettingChange('security', 'allowTeamMemberBillingAccess', checked)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Changes */}
            {hasChanges && (
                <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        You have unsaved changes. Don't forget to save your settings.
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex justify-end space-x-3">
                <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!hasChanges || isLoading}
                >
                    Reset
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges || isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}