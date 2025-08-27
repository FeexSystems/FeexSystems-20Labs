import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Star,
  AlertCircle
} from 'lucide-react';
import { type PaymentMethod } from '@shared/api';

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (data: any) => void;
  onUpdatePaymentMethod: (id: string, data: any) => void;
  onDeletePaymentMethod: (id: string) => void;
  isLoading?: boolean;
}

export function PaymentMethodManager({ 
  paymentMethods, 
  onAddPaymentMethod, 
  onUpdatePaymentMethod, 
  onDeletePaymentMethod,
  isLoading 
}: PaymentMethodManagerProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    setAsDefault: false
  });

  const getCardBrandIcon = (brand?: string) => {
    // In a real app, you'd have actual card brand icons
    return <CreditCard className="w-5 h-5 text-primary" />;
  };

  const handleAddCard = () => {
    // In a real app, this would integrate with Stripe Elements
    onAddPaymentMethod({
      ...newCardData,
      type: 'card'
    });
    setIsAddingCard(false);
    setNewCardData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      name: '',
      setAsDefault: false
    });
  };

  const handleSetDefault = (methodId: string) => {
    onUpdatePaymentMethod(methodId, { setAsDefault: true });
  };

  const handleDelete = (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      onDeletePaymentMethod(methodId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>
        <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new credit or debit card to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCardData.cardNumber}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select 
                    value={newCardData.expiryMonth} 
                    onValueChange={(value) => setNewCardData(prev => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select 
                    value={newCardData.expiryYear} 
                    onValueChange={(value) => setNewCardData(prev => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <SelectItem key={year} value={String(year).slice(-2)}>
                            {String(year).slice(-2)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={newCardData.cvc}
                    onChange={(e) => setNewCardData(prev => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newCardData.name}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="setAsDefault"
                  checked={newCardData.setAsDefault}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, setAsDefault: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="setAsDefault" className="text-sm">
                  Set as default payment method
                </Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCard} disabled={isLoading}>
                  Add Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No payment methods</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add a payment method to manage your subscription and billing
            </p>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'ring-2 ring-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getCardBrandIcon(method.brand)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {method.brand?.toUpperCase()} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={isLoading}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      disabled={isLoading || method.isDefault}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {method.isDefault && (
                  <div className="mt-3 p-2 bg-primary/5 rounded-lg">
                    <p className="text-xs text-primary flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      This is your default payment method for subscriptions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Secure Payment Processing</h4>
              <p className="text-sm text-blue-700 mt-1">
                All payment information is securely processed by Stripe. We never store your full card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}