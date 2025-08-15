import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';
import { type Invoice } from '@/../../shared/api';

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onDownloadInvoice: (invoiceId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  onDownloadAll: () => void;
  isLoading?: boolean;
}

export function InvoiceHistory({ 
  invoices, 
  onDownloadInvoice, 
  onViewInvoice, 
  onDownloadAll,
  isLoading 
}: InvoiceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  const getStatusBadge = (status: Invoice['status']) => {
    const colors = {
      paid: 'text-green-700 bg-green-50 border-green-200',
      open: 'text-blue-700 bg-blue-50 border-blue-200',
      draft: 'text-gray-700 bg-gray-50 border-gray-200',
      uncollectible: 'text-red-700 bg-red-50 border-red-200',
      void: 'text-red-700 bg-red-50 border-red-200'
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.stripeInvoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.amount.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Billing History</h2>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span> total billed
            </div>
            <div>
              <span className="font-medium text-green-600">${paidAmount.toFixed(2)}</span> paid
            </div>
            <div>
              <span className="font-medium text-foreground">{invoices.length}</span> invoices
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onDownloadAll} disabled={isLoading}>
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="uncollectible">Uncollectible</SelectItem>
                <SelectItem value="void">Void</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No invoices found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Your invoices will appear here once you have an active subscription'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">
                            Invoice #{invoice.stripeInvoiceId.slice(-8)}
                          </p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {invoice.createdAt.toLocaleDateString()}
                          </span>
                          <span>Due: {invoice.dueDate.toLocaleDateString()}</span>
                          {invoice.paidAt && (
                            <span>Paid: {invoice.paidAt.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-lg">${invoice.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{invoice.currency.toUpperCase()}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDownloadInvoice(invoice.id)}
                          disabled={isLoading}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {invoice.invoiceUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onViewInvoice(invoice.id)}
                            disabled={isLoading}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {invoice.status === 'open' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          This invoice is due on {invoice.dueDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {invoice.status === 'uncollectible' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">
                          This invoice could not be collected and may affect your service
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Billed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {invoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status === 'paid').length} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-orange-600">
              ${(totalAmount - paidAmount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status !== 'paid').length} unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}