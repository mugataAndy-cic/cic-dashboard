"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Download, Eye, AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import { PRODUCTS } from "@/constants/products"

const policies = [
  {
    id: "POL001",
    clientName: "John Doe",
    product: "Motor Insurance",
    intermediary: "Jane Smith",
    status: "Active",
    downPayment: "KSh 15,000",
    annualPremium: "KSh 45,000",
    adjustedPremium: "KSh 42,000",
    installmentsPaid: 3,
    installmentsPending: 1,
    installmentsDue: 0,
    installmentsExpired: 0,
    totalInstallments: 4,
    rate: "8.5%",
    benefits: ["Comprehensive Cover", "Third Party", "Fire & Theft"],
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    lastPayment: "2024-03-15",
  },
  {
    id: "POL002",
    clientName: "Mary Johnson",
    product: "Home Insurance",
    intermediary: "Mike Wilson",
    status: "Expired",
    downPayment: "KSh 10,000",
    annualPremium: "KSh 32,000",
    adjustedPremium: "KSh 30,000",
    installmentsPaid: 4,
    installmentsPending: 0,
    installmentsDue: 0,
    installmentsExpired: 0,
    totalInstallments: 4,
    rate: "6.2%",
    benefits: ["Building Cover", "Contents Cover", "Personal Liability"],
    startDate: "2023-01-20",
    endDate: "2024-01-20",
    lastPayment: "2023-12-20",
  },
  {
    id: "POL003",
    clientName: "Peter Brown",
    product: "Life Insurance",
    intermediary: "Sarah Davis",
    status: "Cancelled",
    downPayment: "KSh 25,000",
    annualPremium: "KSh 120,000",
    adjustedPremium: "KSh 115,000",
    installmentsPaid: 2,
    installmentsPending: 0,
    installmentsDue: 1,
    installmentsExpired: 1,
    totalInstallments: 4,
    rate: "12.0%",
    benefits: ["Life Cover", "Critical Illness", "Disability Cover"],
    startDate: "2023-06-10",
    endDate: "2024-06-10",
    lastPayment: "2023-08-10",
  },
]

export default function PoliciesPage() {
  const [newPolicyDialogOpen, setNewPolicyDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState<any>({
    clientName: '',
    product: '',
    intermediary: '',
    status: 'Active',
    downPayment: '',
    annualPremium: '',
    adjustedPremium: '',
    startDate: '',
    endDate: '',
    lastPayment: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState<any>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleEditPolicy = (policy: any) => {
    setEditPolicy({ ...policy });
    setEditDialogOpen(true);
  };
  const handleSaveEditPolicy = () => {
    if (editPolicy) {
      const idx = policies.findIndex((p) => p.id === editPolicy.id);
      if (idx !== -1) {
        policies[idx] = { ...editPolicy };
      }
    }
    setEditDialogOpen(false);
  };

  const handleSaveNewPolicy = () => {
    // In a real app, this would make an API call
    policies.push({
      id: `POL${policies.length + 1}`,
      ...newPolicy,
      installmentsPaid: 0,
      installmentsPending: 0,
      installmentsDue: 0,
      installmentsExpired: 0,
      totalInstallments: 0,
      rate: '',
      benefits: [],
    });
    setNewPolicyDialogOpen(false);
  };
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [filterClient, setFilterClient] = useState("all")
  const [filterIntermediary, setFilterIntermediary] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = filterProduct === "all" || policy.product.toLowerCase().includes(filterProduct.toLowerCase())
    const matchesClient = filterClient === "all" || policy.clientName.toLowerCase().includes(filterClient.toLowerCase())
    const matchesIntermediary =
      filterIntermediary === "all" || policy.intermediary.toLowerCase().includes(filterIntermediary.toLowerCase())
    const matchesStatus = filterStatus === "all" || policy.status.toLowerCase() === filterStatus

    return matchesSearch && matchesProduct && matchesClient && matchesIntermediary && matchesStatus
  })

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "expired":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "discontinued":
        return "destructive"
      default:
        return "default"
    }
  }

  const getInstallmentProgress = (paid: number, total: number) => {
    return (paid / total) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Policy Management</h1>
          <p className="text-gray-600 mt-1">Manage insurance policies and track payments</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="hover:bg-[#ac1f2d] hover:text-white transition-colors"
            onClick={() => {
              // Export policies as CSV
              const csvRows = [
                ['ID', 'Client Name', 'Product', 'Intermediary', 'Status', 'Down Payment', 'Annual Premium', 'Adjusted Premium', 'Start Date', 'End Date', 'Last Payment'],
                ...policies.map(p => [
                  p.id,
                  p.clientName,
                  p.product,
                  p.intermediary,
                  p.status,
                  p.downPayment,
                  p.annualPremium,
                  p.adjustedPremium,
                  p.startDate,
                  p.endDate,
                  p.lastPayment,
                ])
              ];
              const csvContent = csvRows.map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'policies_report.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Policies
          </Button>
          <Button
            className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors"
            onClick={() => setNewPolicyDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
          <Dialog open={newPolicyDialogOpen} onOpenChange={setNewPolicyDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={newPolicy.clientName}
                      onChange={e => setNewPolicy({ ...newPolicy, clientName: e.target.value })}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={newPolicy.product}
                      onValueChange={value => setNewPolicy({ ...newPolicy, product: value })}
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
                    <Label htmlFor="intermediary">Intermediary</Label>
                    <Input
                      id="intermediary"
                      value={newPolicy.intermediary}
                      onChange={e => setNewPolicy({ ...newPolicy, intermediary: e.target.value })}
                      placeholder="Enter intermediary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPolicy.status}
                      onValueChange={value => setNewPolicy({ ...newPolicy, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <Input
                      id="downPayment"
                      value={newPolicy.downPayment}
                      onChange={e => setNewPolicy({ ...newPolicy, downPayment: e.target.value })}
                      placeholder="Enter down payment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualPremium">Annual Premium</Label>
                    <Input
                      id="annualPremium"
                      value={newPolicy.annualPremium}
                      onChange={e => setNewPolicy({ ...newPolicy, annualPremium: e.target.value })}
                      placeholder="Enter annual premium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="adjustedPremium">Adjusted Premium</Label>
                    <Input
                      id="adjustedPremium"
                      value={newPolicy.adjustedPremium}
                      onChange={e => setNewPolicy({ ...newPolicy, adjustedPremium: e.target.value })}
                      placeholder="Enter adjusted premium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPolicy.startDate}
                      onChange={e => setNewPolicy({ ...newPolicy, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPolicy.endDate}
                      onChange={e => setNewPolicy({ ...newPolicy, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastPayment">Last Payment</Label>
                    <Input
                      id="lastPayment"
                      type="date"
                      value={newPolicy.lastPayment}
                      onChange={e => setNewPolicy({ ...newPolicy, lastPayment: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewPolicyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNewPolicy} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
                  Save Policy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">1,234</div>
            <div className="text-sm text-gray-600">Active Policies</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">89</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">45</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">892</div>
            <div className="text-sm text-gray-600">Paid Installments</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Policy Directory</CardTitle>
          <CardDescription>Search and filter policies by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger>
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="mary">Mary Johnson</SelectItem>
                <SelectItem value="peter">Peter Brown</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterIntermediary} onValueChange={setFilterIntermediary}>
              <SelectTrigger>
                <SelectValue placeholder="Intermediary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intermediaries</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="mike">Mike Wilson</SelectItem>
                <SelectItem value="sarah">Sarah Davis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Policies Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Intermediary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Annual Premium</TableHead>
                  <TableHead>Payment Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-[#ac1f2d]">{policy.id}</TableCell>
                    <TableCell>{policy.clientName}</TableCell>
                    <TableCell>{policy.product}</TableCell>
                    <TableCell>{policy.intermediary}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(policy.status)}>{policy.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{policy.annualPremium}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>
                            {policy.installmentsPaid}/{policy.totalInstallments} paid
                          </span>
                          <span>
                            {getInstallmentProgress(policy.installmentsPaid, policy.totalInstallments).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={getInstallmentProgress(policy.installmentsPaid, policy.totalInstallments)}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-[#ac1f2d]"
                        onClick={() => handleViewPolicy(policy)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-[#ac1f2d]"
                        onClick={() => handleEditPolicy(policy)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Policy Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Policy Details - {selectedPolicy?.id}</DialogTitle>
            <DialogDescription>Complete policy information and payment history</DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Policy Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Client:</span>
                        <span className="text-sm font-medium">{selectedPolicy.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Product:</span>
                        <span className="text-sm font-medium">{selectedPolicy.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Intermediary:</span>
                        <span className="text-sm font-medium">{selectedPolicy.intermediary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={getStatusColor(selectedPolicy.status)}>{selectedPolicy.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Premium Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Down Payment:</span>
                        <span className="text-sm font-medium">{selectedPolicy.downPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Premium:</span>
                        <span className="text-sm font-medium">{selectedPolicy.annualPremium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Adjusted Premium:</span>
                        <span className="text-sm font-medium">{selectedPolicy.adjustedPremium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rate:</span>
                        <span className="text-sm font-medium">{selectedPolicy.rate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="payments" className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{selectedPolicy.installmentsPaid}</div>
                      <div className="text-sm text-gray-600">Paid</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{selectedPolicy.installmentsPending}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{selectedPolicy.installmentsDue}</div>
                      <div className="text-sm text-gray-600">Due</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{selectedPolicy.installmentsExpired}</div>
                      <div className="text-sm text-gray-600">Expired</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>
                      {selectedPolicy.installmentsPaid}/{selectedPolicy.totalInstallments} installments
                    </span>
                  </div>
                  <Progress
                    value={getInstallmentProgress(selectedPolicy.installmentsPaid, selectedPolicy.totalInstallments)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Applied Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPolicy.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Policy Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium">{selectedPolicy.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm font-medium">{selectedPolicy.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Payment:</span>
                      <span className="text-sm font-medium">{selectedPolicy.lastPayment}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
          </DialogHeader>
          {editPolicy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editClientName">Client Name</Label>
                  <Input
                    id="editClientName"
                    value={editPolicy.clientName}
                    onChange={e => setEditPolicy({ ...editPolicy, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editProduct">Product</Label>
                  <Select
                    value={editPolicy.product}
                    onValueChange={value => setEditPolicy({ ...editPolicy, product: value })}
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
                  <Label htmlFor="editIntermediary">Intermediary</Label>
                  <Input
                    id="editIntermediary"
                    value={editPolicy.intermediary}
                    onChange={e => setEditPolicy({ ...editPolicy, intermediary: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editPolicy.status}
                    onValueChange={value => setEditPolicy({ ...editPolicy, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDownPayment">Down Payment</Label>
                  <Input
                    id="editDownPayment"
                    value={editPolicy.downPayment}
                    onChange={e => setEditPolicy({ ...editPolicy, downPayment: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editAnnualPremium">Annual Premium</Label>
                  <Input
                    id="editAnnualPremium"
                    value={editPolicy.annualPremium}
                    onChange={e => setEditPolicy({ ...editPolicy, annualPremium: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editAdjustedPremium">Adjusted Premium</Label>
                  <Input
                    id="editAdjustedPremium"
                    value={editPolicy.adjustedPremium}
                    onChange={e => setEditPolicy({ ...editPolicy, adjustedPremium: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editStartDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editPolicy.startDate
                          ? format(new Date(editPolicy.startDate), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editPolicy.startDate ? new Date(editPolicy.startDate) : undefined}
                        onSelect={(date) =>
                          setEditPolicy({
                            ...editPolicy,
                            startDate: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="editEndDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editPolicy.endDate
                          ? format(new Date(editPolicy.endDate), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editPolicy.endDate ? new Date(editPolicy.endDate) : undefined}
                        onSelect={(date) =>
                          setEditPolicy({
                            ...editPolicy,
                            endDate: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="editLastPayment">Last Payment</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editPolicy.lastPayment
                          ? format(new Date(editPolicy.lastPayment), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editPolicy.lastPayment ? new Date(editPolicy.lastPayment) : undefined}
                        onSelect={(date) =>
                          setEditPolicy({
                            ...editPolicy,
                            lastPayment: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditPolicy} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Policy Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Policy Details - {selectedPolicy?.id}</DialogTitle>
            <DialogDescription>Complete policy information and payment history</DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Policy Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Client:</span>
                        <span className="text-sm font-medium">{selectedPolicy.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Product:</span>
                        <span className="text-sm font-medium">{selectedPolicy.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Intermediary:</span>
                        <span className="text-sm font-medium">{selectedPolicy.intermediary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={getStatusColor(selectedPolicy.status)}>{selectedPolicy.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Premium Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Down Payment:</span>
                        <span className="text-sm font-medium">{selectedPolicy.downPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Premium:</span>
                        <span className="text-sm font-medium">{selectedPolicy.annualPremium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Adjusted Premium:</span>
                        <span className="text-sm font-medium">{selectedPolicy.adjustedPremium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rate:</span>
                        <span className="text-sm font-medium">{selectedPolicy.rate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{selectedPolicy.installmentsPaid}</div>
                      <div className="text-sm text-gray-600">Paid</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{selectedPolicy.installmentsPending}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{selectedPolicy.installmentsDue}</div>
                      <div className="text-sm text-gray-600">Due</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{selectedPolicy.installmentsExpired}</div>
                      <div className="text-sm text-gray-600">Expired</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>
                      {selectedPolicy.installmentsPaid}/{selectedPolicy.totalInstallments} installments
                    </span>
                  </div>
                  <Progress
                    value={getInstallmentProgress(selectedPolicy.installmentsPaid, selectedPolicy.totalInstallments)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Applied Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPolicy.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Policy Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium">{selectedPolicy.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm font-medium">{selectedPolicy.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Payment:</span>
                      <span className="text-sm font-medium">{selectedPolicy.lastPayment}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
