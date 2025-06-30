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
import { Search, Plus, Download, Eye, DollarSign, CheckCircle, Clock, Percent } from "lucide-react"

const commissions = [
  {
    id: "COM001",
    intermediaryName: "Jane Smith",
    intermediaryId: "INT001",
    product: "Motor Insurance",
    policyId: "POL001",
    clientName: "John Doe",
    premiumAmount: "KSh 45,000",
    commissionRate: "15%",
    commissionAmount: "KSh 6,750",
    status: "Paid",
    paidDate: "2024-01-20",
    dueDate: "2024-01-15",
    quarter: "Q1 2024",
  },
  {
    id: "COM002",
    intermediaryName: "Mike Wilson",
    intermediaryId: "INT002",
    product: "Home Insurance",
    policyId: "POL002",
    clientName: "Mary Johnson",
    premiumAmount: "KSh 32,000",
    commissionRate: "12%",
    commissionAmount: "KSh 3,840",
    status: "Unpaid",
    paidDate: null,
    dueDate: "2024-01-25",
    quarter: "Q1 2024",
  },
  {
    id: "COM003",
    intermediaryName: "Sarah Davis",
    intermediaryId: "INT003",
    product: "Life Insurance",
    policyId: "POL003",
    clientName: "Peter Brown",
    premiumAmount: "KSh 120,000",
    commissionRate: "20%",
    commissionAmount: "KSh 24,000",
    status: "Unpaid",
    paidDate: null,
    dueDate: "2024-02-01",
    quarter: "Q1 2024",
  },
]

export default function CommissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterIntermediary, setFilterIntermediary] = useState("all")
  const [selectedCommission, setSelectedCommission] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch =
      commission.intermediaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct =
      filterProduct === "all" || commission.product.toLowerCase().includes(filterProduct.toLowerCase())
    const matchesStatus = filterStatus === "all" || commission.status.toLowerCase() === filterStatus
    const matchesIntermediary =
      filterIntermediary === "all" ||
      commission.intermediaryName.toLowerCase().includes(filterIntermediary.toLowerCase())

    return matchesSearch && matchesProduct && matchesStatus && matchesIntermediary
  })

  const handleViewCommission = (commission: any) => {
    setSelectedCommission(commission)
    setViewDialogOpen(true)
  }

  const handleMarkAsPaid = (commission: any) => {
    setSelectedCommission(commission)
    setPaymentDialogOpen(true)
  }

  const confirmPayment = () => {
    // In real app, this would make an API call
    console.log("Marking commission as paid:", selectedCommission.id)
    setPaymentDialogOpen(false)
    // Show success message and update commission status
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default"
      case "unpaid":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "unpaid":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalCommissions = commissions.reduce(
    (sum, comm) => sum + Number.parseFloat(comm.commissionAmount.replace(/[^\d]/g, "")),
    0,
  )
  const paidCommissions = commissions
    .filter((c) => c.status === "Paid")
    .reduce((sum, comm) => sum + Number.parseFloat(comm.commissionAmount.replace(/[^\d]/g, "")), 0)
  const unpaidCommissions = commissions
    .filter((c) => c.status === "Unpaid")
    .reduce((sum, comm) => sum + Number.parseFloat(comm.commissionAmount.replace(/[^\d]/g, "")), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Commission Management</h1>
          <p className="text-gray-600 mt-1">Manage intermediary commissions and payments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-[#ac1f2d] hover:text-white transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">KSh {(totalCommissions / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Total Commissions</div>
            <div className="text-xs text-blue-600 mt-1">All time</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">KSh {(paidCommissions / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Paid Commissions</div>
            <div className="text-xs text-green-600 mt-1">
              {commissions.filter((c) => c.status === "Paid").length} payments
            </div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">KSh {(unpaidCommissions / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Unpaid Commissions</div>
            <div className="text-xs text-red-600 mt-1">
              {commissions.filter((c) => c.status === "Unpaid").length} pending
            </div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{commissions.length}</div>
            <div className="text-sm text-gray-600">Active Intermediaries</div>
            <div className="text-xs text-purple-600 mt-1">This quarter</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Commission Directory</CardTitle>
          <CardDescription>View and manage intermediary commissions by product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search commissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="motor">Motor Insurance</SelectItem>
                <SelectItem value="home">Home Insurance</SelectItem>
                <SelectItem value="life">Life Insurance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
          </div>

          {/* Commissions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intermediary</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-[#333333]">{commission.intermediaryName}</div>
                        <div className="text-sm text-gray-500">{commission.intermediaryId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{commission.product}</TableCell>
                    <TableCell className="font-medium text-[#ac1f2d]">{commission.policyId}</TableCell>
                    <TableCell>{commission.clientName}</TableCell>
                    <TableCell className="font-medium">{commission.premiumAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Percent className="h-3 w-3 text-gray-400" />
                        <span>{commission.commissionRate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">{commission.commissionAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(commission.status)}
                        <Badge variant={getStatusColor(commission.status)}>{commission.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleViewCommission(commission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {commission.status === "Unpaid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-green-600"
                            onClick={() => handleMarkAsPaid(commission)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Commission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission Details - {selectedCommission?.id}</DialogTitle>
            <DialogDescription>Complete commission information</DialogDescription>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Intermediary</div>
                  <p className="text-sm font-medium">{selectedCommission.intermediaryName}</p>
                  <p className="text-xs text-gray-500">{selectedCommission.intermediaryId}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Product</div>
                  <p className="text-sm">{selectedCommission.product}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Policy ID</div>
                  <p className="text-sm font-medium text-[#ac1f2d]">{selectedCommission.policyId}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Client</div>
                  <p className="text-sm">{selectedCommission.clientName}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Premium Amount</div>
                  <p className="text-sm font-medium">{selectedCommission.premiumAmount}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Commission Rate</div>
                  <p className="text-sm">{selectedCommission.commissionRate}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Commission Amount</div>
                  <p className="text-sm font-medium text-green-600">{selectedCommission.commissionAmount}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedCommission.status)}
                    <Badge variant={getStatusColor(selectedCommission.status)}>{selectedCommission.status}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Due Date</div>
                  <p className="text-sm">{selectedCommission.dueDate}</p>
                </div>
                {selectedCommission.paidDate && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Paid Date</div>
                    <p className="text-sm">{selectedCommission.paidDate}</p>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-600">Quarter</div>
                  <p className="text-sm">{selectedCommission.quarter}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Commission as Paid</DialogTitle>
            <DialogDescription>Confirm payment for commission {selectedCommission?.id}</DialogDescription>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium">Commission Details:</div>
                <div className="text-sm text-gray-600">Intermediary: {selectedCommission.intermediaryName}</div>
                <div className="text-sm text-gray-600">Amount: {selectedCommission.commissionAmount}</div>
                <div className="text-sm text-gray-600">Policy: {selectedCommission.policyId}</div>
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to mark this commission as paid? This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
