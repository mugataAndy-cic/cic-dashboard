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
import { Search, Plus, Download, Eye, Send, AlertTriangle, CheckCircle, Clock, FileText, Mail } from "lucide-react"

const claims = [
  {
    id: "CLM001",
    policyId: "POL001",
    clientName: "John Doe",
    product: "Motor Insurance",
    claimType: "Accident",
    claimAmount: "KSh 150,000",
    reportedDate: "2024-01-15",
    incidentDate: "2024-01-14",
    status: "Under Review",
    assignedTo: "Claims Team A",
    description: "Vehicle collision on Thika Road",
    documents: ["Police Report", "Photos", "Repair Estimate"],
    lastUpdate: "2024-01-20",
    priority: "High",
  },
  {
    id: "CLM002",
    policyId: "POL002",
    clientName: "Mary Johnson",
    product: "Home Insurance",
    claimType: "Fire Damage",
    claimAmount: "KSh 500,000",
    reportedDate: "2024-01-18",
    incidentDate: "2024-01-17",
    status: "Approved",
    assignedTo: "Claims Team B",
    description: "Kitchen fire damage to property",
    documents: ["Fire Report", "Photos", "Repair Quotes"],
    lastUpdate: "2024-01-22",
    priority: "High",
  },
  {
    id: "CLM003",
    policyId: "POL003",
    clientName: "Peter Brown",
    product: "Life Insurance",
    claimType: "Death Benefit",
    claimAmount: "KSh 2,000,000",
    reportedDate: "2024-01-20",
    incidentDate: "2024-01-19",
    status: "Pending Documentation",
    assignedTo: "Claims Team C",
    description: "Death benefit claim for policy holder",
    documents: ["Death Certificate", "Medical Records"],
    lastUpdate: "2024-01-21",
    priority: "Critical",
  },
]

export default function ClaimsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterProduct, setFilterProduct] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || claim.status.toLowerCase().includes(filterStatus.toLowerCase())
    const matchesProduct = filterProduct === "all" || claim.product.toLowerCase().includes(filterProduct.toLowerCase())
    const matchesPriority = filterPriority === "all" || claim.priority.toLowerCase() === filterPriority

    return matchesSearch && matchesStatus && matchesProduct && matchesPriority
  })

  const handleViewClaim = (claim: any) => {
    setSelectedClaim(claim)
    setViewDialogOpen(true)
  }

  const handleNotifyClaims = (claim: any) => {
    setSelectedClaim(claim)
    setEmailSubject(`Claim Notification - ${claim.id}`)
    setEmailMessage(
      `Dear Claims Team,\n\nPlease review the following claim:\n\nClaim ID: ${claim.id}\nClient: ${claim.clientName}\nPolicy: ${claim.policyId}\nType: ${claim.claimType}\nAmount: ${claim.claimAmount}\n\nDescription: ${claim.description}\n\nBest regards,\nAdmin Team`,
    )
    setNotifyDialogOpen(true)
  }

  const sendNotification = () => {
    // In real app, this would send the notification
    console.log("Sending notification:", {
      claim: selectedClaim,
      subject: emailSubject,
      message: emailMessage,
    })
    setNotifyDialogOpen(false)
    // Show success message
  }

  const resendNotification = (claim: any) => {
    // In real app, this would resend the notification
    console.log("Resending notification for claim:", claim.id)
    // Show success message
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default"
      case "under review":
        return "secondary"
      case "pending documentation":
        return "outline"
      case "rejected":
        return "destructive"
      case "closed":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "under review":
        return <Clock className="h-4 w-4" />
      case "pending documentation":
        return <FileText className="h-4 w-4" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Claims Management</h1>
          <p className="text-gray-600 mt-1">Manage insurance claims and notifications</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-[#ac1f2d] hover:text-white transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Claims
          </Button>
          <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">156</div>
            <div className="text-sm text-gray-600">Total Claims</div>
            <div className="text-xs text-blue-600 mt-1">This year</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <div className="text-sm text-gray-600">Under Review</div>
            <div className="text-xs text-yellow-600 mt-1">Pending processing</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-xs text-green-600 mt-1">Ready for payment</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Critical Priority</div>
            <div className="text-xs text-red-600 mt-1">Need immediate attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Claims Directory</CardTitle>
          <CardDescription>View and manage insurance claims notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending documentation">Pending Documentation</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-[#ac1f2d]">{claim.id}</TableCell>
                    <TableCell>{claim.clientName}</TableCell>
                    <TableCell className="font-medium text-[#ac1f2d]">{claim.policyId}</TableCell>
                    <TableCell>{claim.claimType}</TableCell>
                    <TableCell className="font-medium">{claim.claimAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(claim.status)}
                        <Badge variant={getStatusColor(claim.status)}>{claim.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                    </TableCell>
                    <TableCell>{claim.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleViewClaim(claim)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleNotifyClaims(claim)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => resendNotification(claim)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Claim Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Details - {selectedClaim?.id}</DialogTitle>
            <DialogDescription>Complete claim information and status</DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Claim Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Claim ID:</span>
                      <span className="text-sm font-medium">{selectedClaim.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Policy ID:</span>
                      <span className="text-sm font-medium">{selectedClaim.policyId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Client:</span>
                      <span className="text-sm font-medium">{selectedClaim.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="text-sm font-medium">{selectedClaim.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{selectedClaim.claimType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-sm font-medium">{selectedClaim.claimAmount}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Status & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedClaim.status)}
                        <Badge variant={getStatusColor(selectedClaim.status)}>{selectedClaim.status}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge variant={getPriorityColor(selectedClaim.priority)}>{selectedClaim.priority}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assigned To:</span>
                      <span className="text-sm font-medium">{selectedClaim.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Incident Date:</span>
                      <span className="text-sm font-medium">{selectedClaim.incidentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reported Date:</span>
                      <span className="text-sm font-medium">{selectedClaim.reportedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Update:</span>
                      <span className="text-sm font-medium">{selectedClaim.lastUpdate}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Claim Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedClaim.description}</p>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleNotifyClaims(selectedClaim)}>
                  <Send className="h-4 w-4 mr-2" />
                  Notify Claims Team
                </Button>
                <Button variant="outline" onClick={() => resendNotification(selectedClaim)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Notification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notify Claims Team Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Claim Notification</DialogTitle>
            <DialogDescription>Send notification to claims team for claim {selectedClaim?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Claim Summary:</div>
              <div className="text-sm text-gray-600">ID: {selectedClaim?.id}</div>
              <div className="text-sm text-gray-600">Client: {selectedClaim?.clientName}</div>
              <div className="text-sm text-gray-600">Amount: {selectedClaim?.claimAmount}</div>
            </div>
            <div>
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="emailMessage">Message</Label>
              <Textarea
                id="emailMessage"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendNotification} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
