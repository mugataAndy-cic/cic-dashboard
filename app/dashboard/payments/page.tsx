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
import { Search, Plus, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, Smartphone } from "lucide-react"

const payments = [
  {
    id: "PAY001",
    policyId: "POL001",
    clientName: "John Doe",
    mpesaCode: "QA12B3C4D5",
    amount: "KSh 15,000",
    paymentDate: "2024-01-15",
    paymentTime: "14:30:25",
    phoneNumber: "+254700123456",
    status: "Validated",
    validatedBy: "Admin User",
    validationDate: "2024-01-15",
    notes: "Payment validated successfully",
  },
  {
    id: "PAY002",
    policyId: "POL002",
    clientName: "Mary Johnson",
    mpesaCode: "QB34C5D6E7",
    amount: "KSh 10,000",
    paymentDate: "2024-01-16",
    paymentTime: "09:15:42",
    phoneNumber: "+254700234567",
    status: "Pending",
    validatedBy: null,
    validationDate: null,
    notes: "Awaiting validation",
  },
  {
    id: "PAY003",
    policyId: "POL003",
    clientName: "Peter Brown",
    mpesaCode: "QC45D6E7F8",
    amount: "KSh 25,000",
    paymentDate: "2024-01-17",
    paymentTime: "16:45:18",
    phoneNumber: "+254700345678",
    status: "Failed",
    validatedBy: "Admin User",
    validationDate: "2024-01-17",
    notes: "Payment verification failed - insufficient funds",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [validateDialogOpen, setValidateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [validationNotes, setValidationNotes] = useState("")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.mpesaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.policyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status.toLowerCase() === filterStatus
    // Add date filtering logic here if needed

    return matchesSearch && matchesStatus
  })

  const handleValidatePayment = (payment: any) => {
    setSelectedPayment(payment)
    setValidationNotes("")
    setValidateDialogOpen(true)
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
    setViewDialogOpen(true)
  }

  const confirmValidation = (isValid: boolean) => {
    // In real app, this would make an API call
    console.log("Validating payment:", selectedPayment.id, "Valid:", isValid, "Notes:", validationNotes)
    setValidateDialogOpen(false)
    // Show success message and update payment status
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "validated":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "validated":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Payment Management</h1>
          <p className="text-gray-600 mt-1">Manage M-Pesa payments and validations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-[#ac1f2d] hover:text-white transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Payments
          </Button>
          <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">1,247</div>
            <div className="text-sm text-gray-600">Total Payments</div>
            <div className="text-xs text-green-600 mt-1">KSh 45.2M processed</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1,089</div>
            <div className="text-sm text-gray-600">Validated</div>
            <div className="text-xs text-green-600 mt-1">87.3% success rate</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">134</div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xs text-yellow-600 mt-1">Awaiting validation</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">24</div>
            <div className="text-sm text-gray-600">Failed</div>
            <div className="text-xs text-red-600 mt-1">Need attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Payment Transactions</CardTitle>
          <CardDescription>View and validate M-Pesa payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by client, M-Pesa code, or policy ID..."
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
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>M-Pesa Code</TableHead>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-[#ac1f2d]">{payment.mpesaCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#ac1f2d]">{payment.policyId}</TableCell>
                    <TableCell>{payment.clientName}</TableCell>
                    <TableCell className="font-medium">{payment.amount}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{payment.paymentDate}</div>
                        <div className="text-xs text-gray-500">{payment.paymentTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleViewPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-[#ac1f2d]"
                            onClick={() => handleValidatePayment(payment)}
                          >
                            <Edit className="h-4 w-4" />
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

      {/* View Payment Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details - {selectedPayment?.mpesaCode}</DialogTitle>
            <DialogDescription>Complete payment transaction information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">M-Pesa Code</Label>
                  <p className="text-sm text-gray-600 font-mono">{selectedPayment.mpesaCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Policy ID</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.policyId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-gray-600 font-medium">{selectedPayment.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Date</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.paymentDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Time</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.paymentTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedPayment.status)}
                    <Badge variant={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge>
                  </div>
                </div>
                {selectedPayment.validatedBy && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Validated By</Label>
                      <p className="text-sm text-gray-600">{selectedPayment.validatedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Validation Date</Label>
                      <p className="text-sm text-gray-600">{selectedPayment.validationDate}</p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-600">{selectedPayment.notes}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Validate Payment Dialog */}
      <Dialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Validate Payment</DialogTitle>
            <DialogDescription>Validate M-Pesa payment: {selectedPayment?.mpesaCode}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium">Payment Details:</div>
                <div className="text-sm text-gray-600">Client: {selectedPayment.clientName}</div>
                <div className="text-sm text-gray-600">Amount: {selectedPayment.amount}</div>
                <div className="text-sm text-gray-600">
                  Date: {selectedPayment.paymentDate} {selectedPayment.paymentTime}
                </div>
              </div>
              <div>
                <Label htmlFor="validationNotes">Validation Notes</Label>
                <Textarea
                  id="validationNotes"
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Add notes about the validation..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setValidateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => confirmValidation(false)}>
              Mark as Failed
            </Button>
            <Button onClick={() => confirmValidation(true)} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              Validate Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
