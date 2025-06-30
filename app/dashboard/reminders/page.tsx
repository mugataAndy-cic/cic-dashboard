"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Download, CalendarIcon, Eye, Edit, FileText, Bell, Mail, MessageSquare, Send } from "lucide-react"
import { format } from "date-fns"
import { PRODUCTS } from "@/constants/products"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reminderTemplates = [
  {
    id: "REM001",
    name: "Payment Due Reminder",
    product: "Motor Insurance",
    type: "SMS",
    triggerDays: 7,
    status: "Active",
    message:
      "Dear {clientName}, your insurance payment of {amount} is due on {dueDate}. Please make payment to avoid policy cancellation.",
    lastUsed: "2024-01-15",
    usageCount: 45,
  },
  {
    id: "REM002",
    name: "Policy Renewal Notice",
    product: "Home Insurance",
    type: "Email",
    triggerDays: 30,
    status: "Active",
    message:
      "Dear {clientName}, your {productName} policy {policyNumber} expires on {expiryDate}. Please contact us to renew.",
    lastUsed: "2024-01-20",
    usageCount: 23,
  },
  {
    id: "REM003",
    name: "Cancellation Warning",
    product: "All Products",
    type: "Both",
    triggerDays: 3,
    status: "Active",
    message:
      "URGENT: Your policy {policyNumber} will be cancelled in 3 days due to non-payment. Pay {amount} immediately.",
    lastUsed: "2024-01-18",
    usageCount: 12,
  },
]

const sentReminders = [
  {
    id: "SENT001",
    templateId: "REM001",
    templateName: "Payment Due Reminder",
    clientName: "John Doe",
    policyId: "POL001",
    type: "SMS",
    sentDate: "2024-01-15",
    sentTime: "09:30:00",
    status: "Delivered",
    phoneNumber: "+254700123456",
    email: null,
  },
  {
    id: "SENT002",
    templateId: "REM002",
    templateName: "Policy Renewal Notice",
    clientName: "Mary Johnson",
    policyId: "POL002",
    type: "Email",
    sentDate: "2024-01-20",
    sentTime: "14:15:00",
    status: "Delivered",
    phoneNumber: null,
    email: "mary.johnson@email.com",
  },
]

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProduct, setFilterProduct] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newTemplateDialogOpen, setNewTemplateDialogOpen] = useState(false)
  const [testReminderDialogOpen, setTestReminderDialogOpen] = useState(false)

  const filteredTemplates = reminderTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct =
      filterProduct === "all" || template.product.toLowerCase().includes(filterProduct.toLowerCase())
    const matchesType = filterType === "all" || template.type.toLowerCase() === filterType
    const matchesStatus = filterStatus === "all" || template.status.toLowerCase() === filterStatus

    return matchesSearch && matchesProduct && matchesType && matchesStatus
  })

  const filteredSentReminders = sentReminders.filter((reminder) => {
    const matchesSearch =
      reminder.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.policyId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate({ ...template })
    setEditDialogOpen(true)
  }

  const handleSaveTemplate = () => {
    // In real app, this would make an API call
    console.log("Saving template:", selectedTemplate)
    setEditDialogOpen(false)
    // Show success message
  }

  const handleTestReminder = (template: any) => {
    setSelectedTemplate(template)
    setTestReminderDialogOpen(true)
  }

  const sendTestReminder = () => {
    // In real app, this would send a test reminder
    console.log("Sending test reminder:", selectedTemplate.id)
    setTestReminderDialogOpen(false)
    // Show success message
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "delivered":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "both":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Automatic Reminders</h1>
          <p className="text-gray-600 mt-1">Configure and manage automated SMS and email reminders</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="hover:bg-[#ac1f2d] hover:text-white transition-colors"
            onClick={() => {
              // Export reminderTemplates as CSV
              const csvRows = [
                ['ID', 'Name', 'Product', 'Type', 'Trigger Days', 'Status', 'Message', 'Last Used', 'Usage Count'],
                ...reminderTemplates.map(t => [
                  t.id,
                  t.name,
                  t.product,
                  t.type,
                  t.triggerDays,
                  t.status,
                  t.message.replace(/\n/g, ' '),
                  t.lastUsed,
                  t.usageCount,
                ])
              ];
              const csvContent = csvRows.map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reminder_templates.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={newTemplateDialogOpen} onOpenChange={setNewTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors"
                onClick={() => {
                  setSelectedTemplate({
                    id: '',
                    name: '',
                    product: '',
                    type: '',
                    triggerDays: 1,
                    status: 'Active',
                    message: '',
                    lastUsed: '',
                    usageCount: 0,
                  });
                  setNewTemplateDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Reminder Template</DialogTitle>
                <DialogDescription>Set up a new automated reminder template</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input id="templateName" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={selectedTemplate?.product || ""}
                      onValueChange={(value) => setSelectedTemplate({ ...selectedTemplate, product: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Removed: Use SelectValue placeholder instead of empty value SelectItem */}
                        {PRODUCTS.map((product) => (
                          <SelectItem key={product} value={product}>{product}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Reminder Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS Only</SelectItem>
                        <SelectItem value="email">Email Only</SelectItem>
                        <SelectItem value="both">SMS & Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="triggerDays">Trigger Days Before</Label>
                    <Input id="triggerDays" type="number" placeholder="Enter days" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message Template</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter message template. Use {clientName}, {amount}, {dueDate}, etc. for dynamic content"
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Activate template immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTemplateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26]">Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="scale-in">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#333333]">{reminderTemplates.length}</div>
            <div className="text-sm text-gray-600">Active Templates</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <div className="text-sm text-gray-600">Reminders Sent</div>
            <div className="text-xs text-green-600 mt-1">This month</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-gray-600">Delivery Rate</div>
            <div className="text-xs text-blue-600 mt-1">SMS & Email</div>
          </CardContent>
        </Card>
        <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">67</div>
            <div className="text-sm text-gray-600">Payments Received</div>
            <div className="text-xs text-purple-600 mt-1">After reminders</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-[#333333]">Reminder Management</CardTitle>
          <CardDescription>Configure reminder templates and view sent reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Reminder Templates</TabsTrigger>
              <TabsTrigger value="sent">Sent Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              {/* Filters for Templates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterProduct} onValueChange={setFilterProduct}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {PRODUCTS.map(product => (
                      <SelectItem key={product} value={product}>{product}</SelectItem>
                    ))}
                    <SelectItem value="All Products">All Products</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Templates Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Trigger Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium text-[#333333]">{template.name}</div>
                            <div className="text-sm text-gray-500">{template.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{template.product}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(template.type)}
                            <span>{template.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{template.triggerDays} days</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(template.status)}>{template.status}</Badge>
                        </TableCell>
                        <TableCell>{template.usageCount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:text-[#ac1f2d]"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:text-[#ac1f2d]"
                              onClick={() => handleTestReminder(template)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {/* Filters for Sent Reminders */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sent reminders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sent Reminders Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Policy ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSentReminders.map((reminder) => (
                      <TableRow key={reminder.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium text-[#333333]">{reminder.templateName}</div>
                            <div className="text-sm text-gray-500">{reminder.templateId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{reminder.clientName}</TableCell>
                        <TableCell className="font-medium text-[#ac1f2d]">{reminder.policyId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(reminder.type)}
                            <span>{reminder.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{reminder.sentDate}</div>
                            <div className="text-xs text-gray-500">{reminder.sentTime}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {reminder.phoneNumber && <div className="text-sm">{reminder.phoneNumber}</div>}
                          {reminder.email && <div className="text-sm">{reminder.email}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(reminder.status)}>{reminder.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Reminder Template</DialogTitle>
            <DialogDescription>Update reminder template settings and message</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Template Name</Label>
                  <Input
                    id="editName"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editTriggerDays">Trigger Days Before</Label>
                  <Input
                    id="editTriggerDays"
                    type="number"
                    value={selectedTemplate.triggerDays}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, triggerDays: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editMessage">Message Template</Label>
                <Textarea
                  id="editMessage"
                  value={selectedTemplate.message}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, message: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editActive"
                  checked={selectedTemplate.status === "Active"}
                  onCheckedChange={(checked) =>
                    setSelectedTemplate({ ...selectedTemplate, status: checked ? "Active" : "Inactive" })
                  }
                />
                <Label htmlFor="editActive">Template is active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Add new template to reminderTemplates (mock, in-memory only)
                if (selectedTemplate) {
                  reminderTemplates.push({ ...selectedTemplate, id: `REM${reminderTemplates.length + 1}` });
                }
                setEditDialogOpen(false);
              }}
              className="bg-[#ac1f2d] hover:bg-[#8b1a26]"
            >
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Reminder Dialog */}
      <Dialog open={testReminderDialogOpen} onOpenChange={setTestReminderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Reminder</DialogTitle>
            <DialogDescription>Send a test reminder to verify the template</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium">Template: {selectedTemplate.name}</div>
                <div className="text-sm text-gray-600">Type: {selectedTemplate.type}</div>
              </div>
              <div>
                <Label htmlFor="testPhone">Test Phone Number (for SMS)</Label>
                <Input id="testPhone" placeholder="+254700000000" />
              </div>
              <div>
                <Label htmlFor="testEmail">Test Email (for Email)</Label>
                <Input id="testEmail" type="email" placeholder="test@example.com" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendTestReminder} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <Send className="h-4 w-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
