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
import { Search, Download, Eye, FileText, Mail, Upload, Send, Paperclip } from "lucide-react"

const documents = [
  {
    id: "DOC001",
    policyId: "POL001",
    clientName: "John Doe",
    documentType: "Policy Schedule",
    fileName: "policy_schedule_POL001.pdf",
    uploadDate: "2024-01-15",
    status: "Sent",
    sentDate: "2024-01-16",
    sentTo: "john.doe@email.com",
    size: "2.4 MB",
    category: "Policy Documents",
  },
  {
    id: "DOC002",
    policyId: "POL001",
    clientName: "John Doe",
    documentType: "Confirmation Letter",
    fileName: "confirmation_letter_POL001.pdf",
    uploadDate: "2024-01-15",
    status: "Pending",
    sentDate: null,
    sentTo: null,
    size: "1.2 MB",
    category: "Correspondence",
  },
  {
    id: "DOC003",
    policyId: "POL002",
    clientName: "Mary Johnson",
    documentType: "Valuation Slip",
    fileName: "valuation_slip_POL002.pdf",
    uploadDate: "2024-01-20",
    status: "Sent",
    sentDate: "2024-01-21",
    sentTo: "mary.johnson@email.com",
    size: "3.1 MB",
    category: "Valuation Documents",
  },
  {
    id: "DOC004",
    policyId: "POL003",
    clientName: "Peter Brown",
    documentType: "Certificate",
    fileName: "certificate_POL003.pdf",
    uploadDate: "2024-02-10",
    status: "Draft",
    sentDate: null,
    sentTo: null,
    size: "1.8 MB",
    category: "Certificates",
  },
]

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false)
  const [emailRecipient, setEmailRecipient] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.documentType.toLowerCase().includes(filterType.toLowerCase())
    const matchesStatus = filterStatus === "all" || doc.status.toLowerCase() === filterStatus
    const matchesCategory =
      filterCategory === "all" || doc.category.toLowerCase().includes(filterCategory.toLowerCase())

    return matchesSearch && matchesType && matchesStatus && matchesCategory
  })

  const handleDownload = (document: any) => {
    // In real app, this would download the file
    console.log("Downloading:", document.fileName)
    // Simulate download
    const link = document.createElement("a")
    link.href = "#"
    link.download = document.fileName
    link.click()
  }

  const handleSendEmail = (document: any) => {
    setSelectedDocument(document)
    setEmailRecipient(document.sentTo || "")
    setEmailSubject(`Document: ${document.documentType} - ${document.policyId}`)
    setEmailMessage(
      `Dear ${document.clientName},\n\nPlease find attached the ${document.documentType} for your policy ${document.policyId}.\n\nBest regards,\nEasy Bima Team`,
    )
    setSendEmailDialogOpen(true)
  }

  const sendDocumentEmail = () => {
    // In real app, this would send the email
    console.log("Sending email:", {
      document: selectedDocument,
      recipient: emailRecipient,
      subject: emailSubject,
      message: emailMessage,
    })
    setSendEmailDialogOpen(false)
    // Show success message
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "default"
      case "pending":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Document Management</h1>
          <p className="text-gray-600 mt-1">Manage policy documents and customer correspondence</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-[#ac1f2d] hover:text-white transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
          <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">2,847</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1,892</div>
            <div className="text-sm text-gray-600">Sent to Customers</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">456</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">499</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Document Library</CardTitle>
          <CardDescription>Search and manage policy documents and correspondence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="schedule">Policy Schedule</SelectItem>
                <SelectItem value="confirmation">Confirmation Letter</SelectItem>
                <SelectItem value="valuation">Valuation Slip</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy">Policy Documents</SelectItem>
                <SelectItem value="correspondence">Correspondence</SelectItem>
                <SelectItem value="valuation">Valuation Documents</SelectItem>
                <SelectItem value="certificates">Certificates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#ac1f2d]" />
                        <div>
                          <div className="font-medium text-[#333333]">{doc.fileName}</div>
                          <div className="text-sm text-gray-500">{doc.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#ac1f2d]">{doc.policyId}</TableCell>
                    <TableCell>{doc.clientName}</TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[#ac1f2d]"
                          onClick={() => handleSendEmail(doc)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:text-[#ac1f2d]">
                          <Eye className="h-4 w-4" />
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

      {/* Send Email Dialog */}
      <Dialog open={sendEmailDialogOpen} onOpenChange={setSendEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Document via Email</DialogTitle>
            <DialogDescription>Send {selectedDocument?.documentType} to customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedDocument?.fileName}</span>
              <span className="text-sm text-gray-500">({selectedDocument?.size})</span>
            </div>
            <div>
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="Enter recipient email"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Email message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendDocumentEmail} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
