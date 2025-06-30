"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Download, Eye, Edit, Upload, AlertCircle, CalendarIcon } from "lucide-react"
import { PRODUCTS } from "@/constants/products"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

const valuations = [
  {
    id: "VAL001",
    policyId: "POL001",
    clientName: "John Doe",
    product: "Motor Insurance",
    itemDescription: "Toyota Camry 2020",
    valuationAmount: "KSh 2,500,000",
    valuationDate: "2024-01-15",
    valuerId: "VAL123",
    valuerName: "ABC Valuers Ltd",
    status: "Completed",
    reportAvailable: true,
    expiryDate: "2025-01-15",
    notes: "Vehicle in excellent condition",
  },
  {
    id: "VAL002",
    policyId: "POL002",
    clientName: "Mary Johnson",
    product: "Home Insurance",
    itemDescription: "4-bedroom house in Karen",
    valuationAmount: "KSh 8,500,000",
    valuationDate: "2024-01-20",
    valuerId: "VAL456",
    valuerName: "XYZ Property Valuers",
    status: "Completed",
    reportAvailable: true,
    expiryDate: "2025-01-20",
    notes: "Modern house with swimming pool",
  },
  {
    id: "VAL003",
    policyId: "POL003",
    clientName: "Peter Brown",
    product: "Motor Insurance",
    itemDescription: "Mercedes Benz E-Class 2019",
    valuationAmount: null,
    valuationDate: null,
    valuerId: null,
    valuerName: null,
    status: "Pending",
    reportAvailable: false,
    expiryDate: null,
    notes: "Awaiting valuation appointment",
  },
]

export default function ValuationsPage() {
  const [newValuationDialogOpen, setNewValuationDialogOpen] = useState(false);
  const [newValuation, setNewValuation] = useState<any>({
    clientName: '',
    product: '',
    itemDescription: '',
    valuationAmount: '',
    valuationDate: '',
    valuerName: '',
    status: 'Pending',
    expiryDate: '',
    notes: ''
  });
  const handleSaveNewValuation = () => {
    // In a real app, this would make an API call
    valuations.push({
      id: `VAL${valuations.length + 1}`,
      policyId: '',
      ...newValuation,
      reportAvailable: false,
      valuerId: '',
    });
    setNewValuationDialogOpen(false);
    setNewValuation({
      clientName: '',
      product: '',
      itemDescription: '',
      valuationAmount: '',
      valuationDate: '',
      valuerName: '',
      status: 'Pending',
      expiryDate: '',
      notes: ''
    });
  };

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterProduct, setFilterProduct] = useState("all")
  const [selectedValuation, setSelectedValuation] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filteredValuations = valuations.filter((val) => {
    const matchesSearch =
      val.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || val.status.toLowerCase() === filterStatus
    const matchesProduct = filterProduct === "all" || val.product.toLowerCase().includes(filterProduct.toLowerCase())

    return matchesSearch && matchesStatus && matchesProduct
  })

  const handleEditValuation = (valuation: any) => {
    setSelectedValuation({ ...valuation })
    setEditDialogOpen(true)
  }

  const handleViewValuation = (valuation: any) => {
    setSelectedValuation(valuation)
    setViewDialogOpen(true)
  }

  const handleUploadValuation = (valuation: any) => {
    setSelectedValuation(valuation)
    setUploadDialogOpen(true)
  }

  const handleSaveValuation = () => {
    // In real app, this would make an API call
    console.log("Saving valuation:", selectedValuation)
    setEditDialogOpen(false)
    // Show success message
  }

  const handleDownloadReport = (valuation: any) => {
    // In real app, this would download the valuation report
    console.log("Downloading report for:", valuation.id)
    // Simulate download
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "in-progress":
        return "outline"
      case "expired":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Valuation Management</h1>
          <p className="text-gray-600 mt-1">Manage property and asset valuations</p>
        </div>
        <div className="flex space-x-3">
          <Button
  variant="outline"
  className="hover:bg-[#ac1f2d] hover:text-white transition-colors"
  onClick={() => {
    // Export valuations as CSV
    const csvRows = [
      ['ID', 'Policy ID', 'Client Name', 'Product', 'Item Description', 'Valuation Amount', 'Valuation Date', 'Valuer Name', 'Status', 'Expiry Date', 'Notes'],
      ...valuations.map(v => [
        v.id,
        v.policyId,
        v.clientName,
        v.product,
        v.itemDescription,
        v.valuationAmount,
        v.valuationDate,
        v.valuerName,
        v.status,
        v.expiryDate,
        v.notes
      ])
    ];
    const csvContent = csvRows.map(e => e.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valuations_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  <Download className="h-4 w-4 mr-2" />
  Export Reports
</Button>
<Button
  className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors"
  onClick={() => setNewValuationDialogOpen(true)}
>
  <Plus className="h-4 w-4 mr-2" />
  New Valuation
</Button>
<Dialog open={newValuationDialogOpen} onOpenChange={setNewValuationDialogOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Create New Valuation</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={newValuation.clientName}
            onChange={e => setNewValuation({ ...newValuation, clientName: e.target.value })}
            placeholder="Enter client name"
          />
        </div>
        <div>
          <Label htmlFor="product">Product</Label>
          <Select
            value={newValuation.product}
            onValueChange={value => setNewValuation({ ...newValuation, product: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {/* Removed: Use SelectValue placeholder instead of empty value SelectItem */}
              {PRODUCTS.map(product => (
                <SelectItem key={product} value={product}>{product}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="itemDescription">Item Description</Label>
          <Input
            id="itemDescription"
            value={newValuation.itemDescription}
            onChange={e => setNewValuation({ ...newValuation, itemDescription: e.target.value })}
            placeholder="Enter item description"
          />
        </div>
        <div>
          <Label htmlFor="valuationAmount">Valuation Amount</Label>
          <Input
            id="valuationAmount"
            value={newValuation.valuationAmount}
            onChange={e => setNewValuation({ ...newValuation, valuationAmount: e.target.value })}
            placeholder="Enter valuation amount"
          />
        </div>
        <div>
          <Label htmlFor="valuationDate">Valuation Date</Label>
          <Input
            id="valuationDate"
            type="date"
            value={newValuation.valuationDate}
            onChange={e => setNewValuation({ ...newValuation, valuationDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="valuerName">Valuer Name</Label>
          <Input
            id="valuerName"
            value={newValuation.valuerName}
            onChange={e => setNewValuation({ ...newValuation, valuerName: e.target.value })}
            placeholder="Enter valuer name"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={newValuation.status}
            onValueChange={value => setNewValuation({ ...newValuation, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In-Progress">In-Progress</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={newValuation.expiryDate}
            onChange={e => setNewValuation({ ...newValuation, expiryDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={newValuation.notes}
            onChange={e => setNewValuation({ ...newValuation, notes: e.target.value })}
            placeholder="Enter notes"
          />
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setNewValuationDialogOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSaveNewValuation} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
        Save Valuation
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        </div>
      </div>

      {/* Edit Valuation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Valuation</DialogTitle>
          </DialogHeader>
          {selectedValuation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editClientName">Client Name</Label>
                  <Input
                    id="editClientName"
                    value={selectedValuation.clientName}
                    onChange={e => setSelectedValuation({ ...selectedValuation, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editProduct">Product</Label>
                  <Select
                    value={selectedValuation.product}
                    onValueChange={value => setSelectedValuation({ ...selectedValuation, product: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Removed: Use SelectValue placeholder instead of empty value SelectItem */}
                      {PRODUCTS.map(product => (
                        <SelectItem key={product} value={product}>{product}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editItemDescription">Item Description</Label>
                  <Input
                    id="editItemDescription"
                    value={selectedValuation.itemDescription}
                    onChange={e => setSelectedValuation({ ...selectedValuation, itemDescription: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editValuationAmount">Valuation Amount</Label>
                  <Input
                    id="editValuationAmount"
                    value={selectedValuation.valuationAmount}
                    onChange={e => setSelectedValuation({ ...selectedValuation, valuationAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editValuationDate">Valuation Date</Label>
                  <Input
                    id="editValuationDate"
                    type="date"
                    value={selectedValuation.valuationDate}
                    onChange={e => setSelectedValuation({ ...selectedValuation, valuationDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editValuerName">Valuer Name</Label>
                  <Input
                    id="editValuerName"
                    value={selectedValuation.valuerName}
                    onChange={e => setSelectedValuation({ ...selectedValuation, valuerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={selectedValuation.status}
                    onValueChange={value => setSelectedValuation({ ...selectedValuation, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In-Progress">In-Progress</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editExpiryDate">Expiry Date</Label>
                  <Input
                    id="editExpiryDate"
                    type="date"
                    value={selectedValuation.expiryDate}
                    onChange={e => setSelectedValuation({ ...selectedValuation, expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={selectedValuation.notes}
                    onChange={e => setSelectedValuation({ ...selectedValuation, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Save changes in-memory
              if (selectedValuation) {
                const idx = valuations.findIndex(v => v.id === selectedValuation.id);
                if (idx !== -1) {
                  valuations[idx] = { ...selectedValuation };
                }
              }
              setEditDialogOpen(false);
            }} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Valuation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Valuation Details</DialogTitle>
          </DialogHeader>
          {selectedValuation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.clientName}</div>
                </div>
                <div>
                  <Label>Product</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.product}</div>
                </div>
                <div>
                  <Label>Item Description</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.itemDescription}</div>
                </div>
                <div>
                  <Label>Valuation Amount</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.valuationAmount}</div>
                </div>
                <div>
                  <Label>Valuation Date</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.valuationDate}</div>
                </div>
                <div>
                  <Label>Valuer Name</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.valuerName}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.status}</div>
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.expiryDate}</div>
                </div>
                <div className="col-span-2">
                  <Label>Notes</Label>
                  <div className="border rounded px-3 py-2 bg-gray-50">{selectedValuation.notes}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">456</div>
            <div className="text-sm text-gray-600">Total Valuations</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">342</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">89</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">25</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Valuation Directory</CardTitle>
          <CardDescription>Search and manage asset valuations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search valuations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {PRODUCTS.map((product) => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valuations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valuation ID</TableHead>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Valuation Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valuation Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredValuations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500">
                      No valuations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredValuations.map((val) => (
                    <TableRow key={val.id}>
                      <TableCell>{val.id}</TableCell>
                      <TableCell>{val.policyId}</TableCell>
                      <TableCell>{val.clientName}</TableCell>
                      <TableCell>{val.product}</TableCell>
                      <TableCell>{val.itemDescription}</TableCell>
                      <TableCell>{val.valuationAmount || '-'}</TableCell>
                      <TableCell>{val.valuationDate || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(val.status)}>{val.status}</Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => {
                          setSelectedValuation(val);
                          setViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => {
                          setSelectedValuation({ ...val });
                          setEditDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {val.reportAvailable ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-[#ac1f2d]"
                            onClick={() => handleDownloadReport(val)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-[#ac1f2d]"
                            onClick={() => handleUploadValuation(val)}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Valuation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Valuation Details - {selectedValuation?.id}</DialogTitle>
            <DialogDescription>Complete valuation information</DialogDescription>
          </DialogHeader>
          {selectedValuation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Policy ID</Label>
                  <p className="text-sm text-gray-600">{selectedValuation.policyId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-gray-600">{selectedValuation.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Product</Label>
                  <p className="text-sm text-gray-600">{selectedValuation.product}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedValuation.status)}>{selectedValuation.status}</Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Item Description</Label>
                  <p className="text-sm text-gray-600">{selectedValuation.itemDescription}</p>
                </div>
                {selectedValuation.valuationAmount && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Valuation Amount</Label>
                      <p className="text-sm text-gray-600 font-medium">{selectedValuation.valuationAmount}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valuation Date</Label>
                      <p className="text-sm text-gray-600">{selectedValuation.valuationDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valuer</Label>
                      <p className="text-sm text-gray-600">{selectedValuation.valuerName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Expiry Date</Label>
                      <p className="text-sm text-gray-600">{selectedValuation.expiryDate}</p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-600">{selectedValuation.notes}</p>
                </div>
              </div>
              {selectedValuation.reportAvailable && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => handleDownloadReport(selectedValuation)}
                    className="bg-[#ac1f2d] hover:bg-[#8b1a26]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Valuation Report
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Valuation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Valuation - {selectedValuation?.id}</DialogTitle>
            <DialogDescription>Manually update valuation details</DialogDescription>
          </DialogHeader>
          {selectedValuation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valuationAmount">Valuation Amount</Label>
                  <Input
                    id="valuationAmount"
                    value={selectedValuation.valuationAmount || ""}
                    onChange={(e) => setSelectedValuation({ ...selectedValuation, valuationAmount: e.target.value })}
                    placeholder="Enter valuation amount"
                  />
                </div>
                <div>
                  <Label htmlFor="valuationDate">Valuation Date</Label>
<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="w-full justify-start text-left font-normal"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {selectedValuation.valuationDate
        ? format(new Date(selectedValuation.valuationDate), "PPP")
        : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={selectedValuation.valuationDate ? new Date(selectedValuation.valuationDate) : undefined}
      onSelect={(date) => setSelectedValuation({ ...selectedValuation, valuationDate: date ? date.toISOString().split('T')[0] : "" })}
      initialFocus
    />
  </PopoverContent>
</Popover>
                </div>
                <div>
                  <Label htmlFor="valuerName">Valuer Name</Label>
                  <Input
                    id="valuerName"
                    value={selectedValuation.valuerName || ""}
                    onChange={(e) => setSelectedValuation({ ...selectedValuation, valuerName: e.target.value })}
                    placeholder="Enter valuer name"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="w-full justify-start text-left font-normal"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {selectedValuation.expiryDate
        ? format(new Date(selectedValuation.expiryDate), "PPP")
        : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={selectedValuation.expiryDate ? new Date(selectedValuation.expiryDate) : undefined}
      onSelect={(date) => setSelectedValuation({ ...selectedValuation, expiryDate: date ? date.toISOString().split('T')[0] : "" })}
      initialFocus
    />
  </PopoverContent>
</Popover>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={selectedValuation.notes || ""}
                    onChange={(e) => setSelectedValuation({ ...selectedValuation, notes: e.target.value })}
                    placeholder="Enter valuation notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveValuation} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Valuation Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Valuation Report</DialogTitle>
            <DialogDescription>Upload valuation report for {selectedValuation?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Drop your valuation report here or click to browse</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <div>
              <Label htmlFor="reportNotes">Report Notes</Label>
              <Textarea id="reportNotes" placeholder="Add notes about the valuation report" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
