"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Eye, Edit, Printer } from "lucide-react"
import { PRODUCTS } from "@/constants/products"
import { ProductSelectionModal } from "@/components/product-selection-modal"
import { QuoteRequestModal } from "@/components/quote-request-modal";
import { QuoteSummaryModal } from '@/components/quote-summary-modal';

// Sample data
const sampleQuotes = [
  {
    id: "Q001",
    clientName: "John Doe",
    product: "Private Motor Insurance",
    amount: "KSh 45,000",
    status: "Pending",
    createdDate: "2024-01-15",
    expiryDate: "2024-02-15",
    agent: "Jane Smith",
  },
  {
    id: "Q002",
    clientName: "Mary Johnson",
    product: "Marine Cargo Policy",
    amount: "KSh 32,000",
    status: "Approved",
    createdDate: "2024-01-14",
    expiryDate: "2024-02-14",
    agent: "Mike Wilson",
  },
  {
    id: "Q003",
    clientName: "Peter Brown",
    product: "Student/Personal Accident Cover",
    amount: "KSh 120,000",
    status: "Expired",
    createdDate: "2023-12-20",
    expiryDate: "2024-01-20",
    agent: "Sarah Davis",
  },
]

export default function QuotesPage() {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterProduct, setFilterProduct] = useState("all")

  // Modal states
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [showQuoteRequest, setShowQuoteRequest] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showQuoteSummary, setShowQuoteSummary] = useState(false);
  
  // Quote state
  const [quotes, setQuotes] = useState(sampleQuotes);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  // Open product selection modal
  const handleOpenNewQuote = () => {
    setShowProductSelection(true);
  };

  // Handle product selection
  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
    setShowProductSelection(false);
    setShowQuoteRequest(true);
  };

  // Handle quote submission from the quote request form
  const handleQuoteRequestSubmit = (data: any) => {
    // In a real app, this would make an API call
    const newId = `Q${String(quotes.length + 1).padStart(3, '0')}`;

    // Format the quote data
    const quoteData = {
      id: newId,
      clientName: data.name,
      product: data.product,
      amount: `KSh ${(parseInt(data.value) * 0.05).toLocaleString()}`,
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      agent: 'Current User',
      details: {
        phone: data.phone,
        email: data.email,
        vehicle: {
          make: data.make,
          model: data.model,
          year: data.year,
          value: data.value
        }
      }
    };

    setSelectedQuote(quoteData);
    setShowQuoteRequest(false);
    setShowQuoteSummary(true);
  };

  const handleConfirmQuote = () => {
    if (!selectedQuote) return;

    // Add to the quotes array
    setQuotes(prev => [selectedQuote, ...prev]);

    // Close the modal and reset
    setShowQuoteSummary(false);
    setSelectedQuote(null);
    setSelectedProduct('');

    // Show success message
    alert('Quote created successfully!');
  };

  const handlePrintAndConfirm = () => {
    if (!selectedQuote) return;

    handlePrintQuote(selectedQuote);
    handleConfirmQuote();
  };

  // View quote details
  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    alert(`Viewing quote ${quote.id} for ${quote.clientName}`);
  };

  // Print quote
  const handlePrintQuote = (quote: any) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Quote</title>');
      printWindow.document.write('<style>body { font-family: Arial, sans-serif; } .quote-details { margin: 20px; padding: 20px; border: 1px solid #ccc; } h1 { color: #ac1f2d; } </style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<div class="quote-details">');
      printWindow.document.write(`<h1>Quote Details - ${quote.id}</h1>`);
      printWindow.document.write(`<p><strong>Client:</strong> ${quote.clientName}</p>`);
      printWindow.document.write(`<p><strong>Product:</strong> ${quote.product}</p>`);
      printWindow.document.write(`<p><strong>Amount:</strong> ${quote.amount}</p>`);
      printWindow.document.write(`<p><strong>Status:</strong> ${quote.status}</p>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter quotes based on search and filters
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = searchTerm === '' ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      quote.status.toLowerCase() === filterStatus.toLowerCase();
      
    const matchesProduct = filterProduct === "all" || 
      quote.product.toLowerCase().includes(filterProduct.toLowerCase());

    return matchesSearch && matchesStatus && matchesProduct;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Quote Management</h1>
          <p className="text-gray-600 mt-1">Manage insurance quotes and generate reports</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="hover:bg-[#ac1f2d] hover:text-white transition-colors"
            onClick={() => {
              // Export quotes as CSV
              const csvRows = [
                ['ID', 'Client Name', 'Product', 'Amount', 'Status', 'Created Date', 'Expiry Date', 'Agent'],
                ...quotes.map(q => [
                  q.id,
                  q.clientName,
                  q.product,
                  q.amount,
                  q.status,
                  q.createdDate,
                  q.expiryDate,
                  q.agent,
                ])
              ];
              const csvContent = csvRows.map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'quotes_report.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button
            className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors"
            onClick={handleOpenNewQuote}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      <QuoteSummaryModal
        isOpen={showQuoteSummary}
        onOpenChange={setShowQuoteSummary}
        quote={selectedQuote}
        onConfirm={handleConfirmQuote}
        onPrint={handlePrintAndConfirm}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">{quotes.length}</div>
            <div className="text-sm text-gray-600">Total Quotes</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">
              {quotes.filter(q => q.status === 'Pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">
              {quotes.filter(q => q.status === 'Approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">
              {quotes.filter(q => q.status === 'Expired').length}
            </div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quotes..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProduct} onValueChange={setFilterProduct}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {Array.from(new Set(quotes.map(q => q.product))).map(product => (
                    <SelectItem key={product} value={product.toLowerCase()}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quotes Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50 transition-colors animate-fade-in">
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.clientName}</TableCell>
                    <TableCell>{quote.product}</TableCell>
                    <TableCell>{quote.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(quote.status)}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{quote.createdDate}</TableCell>
                    <TableCell>{quote.expiryDate}</TableCell>
                    <TableCell>{quote.agent}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewQuote(quote)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrintQuote(quote)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No quotes found. Try adjusting your filters or create a new quote.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Product Selection Modal */}
      <ProductSelectionModal 
        open={showProductSelection} 
        onOpenChange={setShowProductSelection}
        onSelectProduct={handleSelectProduct}
      />
      
      {/* Quote Request Modal */}
      {selectedProduct && (
        <QuoteRequestModal
          open={showQuoteRequest}
          product={selectedProduct}
          onOpenChange={setShowQuoteRequest}
          onSubmit={handleQuoteRequestSubmit}
        />
      )}
    </div>
  )
}
