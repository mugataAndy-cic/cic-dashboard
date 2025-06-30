"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  CalendarIcon,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"

// Sample data for charts
const transactionData = [
  { month: "Jan", premiums: 4500000, claims: 1200000, commissions: 675000 },
  { month: "Feb", premiums: 5200000, claims: 1800000, commissions: 780000 },
  { month: "Mar", premiums: 4800000, claims: 1500000, commissions: 720000 },
  { month: "Apr", premiums: 6100000, claims: 2100000, commissions: 915000 },
  { month: "May", premiums: 5800000, claims: 1900000, commissions: 870000 },
  { month: "Jun", premiums: 6500000, claims: 2300000, commissions: 975000 },
]

const productData = [
  { name: "Motor Insurance", value: 45, color: "#ac1f2d" },
  { name: "Home Insurance", value: 30, color: "#333333" },
  { name: "Life Insurance", value: 20, color: "#666666" },
  { name: "Commercial", value: 5, color: "#999999" },
]

const claimsData = [
  { month: "Jan", approved: 15, pending: 8, rejected: 3 },
  { month: "Feb", approved: 22, pending: 12, rejected: 5 },
  { month: "Mar", approved: 18, pending: 9, rejected: 4 },
  { month: "Apr", approved: 28, pending: 15, rejected: 7 },
  { month: "May", approved: 25, pending: 11, rejected: 6 },
  { month: "Jun", approved: 32, pending: 18, rejected: 8 },
]

const reportTypes = [
  {
    id: "transactions",
    name: "Transaction Reports",
    description: "Premium collections, payments, and financial transactions",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    id: "claims",
    name: "Claims Reports",
    description: "Claims analysis, approval rates, and processing times",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    id: "customers",
    name: "Customer Reports",
    description: "Customer demographics, acquisition, and retention",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "commissions",
    name: "Commission Reports",
    description: "Intermediary commissions and payment analysis",
    icon: BarChart3,
    color: "text-purple-600",
  },
  {
    id: "policies",
    name: "Policy Reports",
    description: "Policy performance, renewals, and cancellations",
    icon: Shield,
    color: "text-indigo-600",
  },
  {
    id: "premiums",
    name: "Premium Reports",
    description: "Premium analysis, paid vs expected amounts",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedReportType, setSelectedReportType] = useState("")
  const [dateRange, setDateRange] = useState("month")
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)

  const handleGenerateReport = (reportType: string) => {
    setSelectedReportType(reportType)
    setGenerateDialogOpen(true)
  }

  const confirmGenerateReport = () => {
    // In real app, this would generate and download the report
    console.log("Generating report:", selectedReportType, "Date range:", dateRange)
    setGenerateDialogOpen(false)
    // Show success message
  }

  const totalPremiums = transactionData.reduce((sum, item) => sum + item.premiums, 0)
  const totalClaims = transactionData.reduce((sum, item) => sum + item.claims, 0)
  const totalCommissions = transactionData.reduce((sum, item) => sum + item.commissions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Reports & Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-[#ac1f2d] hover:text-white transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button className="bg-[#ac1f2d] hover:bg-[#8b1a26] transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="scale-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#333333]">KSh {(totalPremiums / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">Total Premiums</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% vs last period
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#333333]">KSh {(totalClaims / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">Claims Paid</div>
                    <div className="text-xs text-red-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3% vs last period
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#333333]">
                      KSh {(totalCommissions / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600">Commissions</div>
                    <div className="text-xs text-purple-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15.2% vs last period
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="scale-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#333333]">2,847</div>
                    <div className="text-sm text-gray-600">Active Policies</div>
                    <div className="text-xs text-blue-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.7% vs last period
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview Chart */}
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="text-[#333333]">Financial Overview</CardTitle>
              <CardDescription>Monthly premiums, claims, and commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  premiums: {
                    label: "Premiums",
                    color: "hsl(var(--chart-1))",
                  },
                  claims: {
                    label: "Claims",
                    color: "hsl(var(--chart-2))",
                  },
                  commissions: {
                    label: "Commissions",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="premiums" fill="var(--color-premiums)" name="Premiums" />
                    <Bar dataKey="claims" fill="var(--color-claims)" name="Claims" />
                    <Bar dataKey="commissions" fill="var(--color-commissions)" name="Commissions" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Product Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="slide-in-left">
              <CardHeader>
                <CardTitle className="text-[#333333]">Product Distribution</CardTitle>
                <CardDescription>Premium distribution by product type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    motor: {
                      label: "Motor Insurance",
                      color: "#ac1f2d",
                    },
                    home: {
                      label: "Home Insurance",
                      color: "#333333",
                    },
                    life: {
                      label: "Life Insurance",
                      color: "#666666",
                    },
                    commercial: {
                      label: "Commercial",
                      color: "#999999",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="slide-in-right">
              <CardHeader>
                <CardTitle className="text-[#333333]">Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Claims Approval Rate</span>
                    <span>87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Policy Renewal Rate</span>
                    <span>92.1%</span>
                  </div>
                  <Progress value={92.1} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Satisfaction</span>
                    <span>94.5%</span>
                  </div>
                  <Progress value={94.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Premium Collection Rate</span>
                    <span>89.7%</span>
                  </div>
                  <Progress value={89.7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Claims Analysis */}
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="text-[#333333]">Claims Analysis</CardTitle>
              <CardDescription>Monthly claims processing and approval trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  approved: {
                    label: "Approved",
                    color: "hsl(var(--chart-1))",
                  },
                  pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-2))",
                  },
                  rejected: {
                    label: "Rejected",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={claimsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="approved" stroke="var(--color-approved)" name="Approved" />
                    <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" name="Pending" />
                    <Line type="monotone" dataKey="rejected" stroke="var(--color-rejected)" name="Rejected" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="scale-in">
              <CardHeader>
                <CardTitle className="text-sm">Average Claim Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#333333]">12.5 days</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.3 days vs last month
                </div>
              </CardContent>
            </Card>
            <Card className="scale-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="text-sm">Customer Acquisition Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#333333]">KSh 2,450</div>
                <div className="text-xs text-red-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% vs last month
                </div>
              </CardContent>
            </Card>
            <Card className="scale-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-sm">Average Policy Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#333333]">KSh 65,400</div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.7% vs last month
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report, index) => (
              <Card
                key={report.id}
                className="scale-in hover:shadow-lg transition-all-smooth cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleGenerateReport(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-50`}>
                      <report.icon className={`h-6 w-6 ${report.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#333333]">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-[#ac1f2d] hover:bg-[#8b1a26]"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGenerateReport(report.id)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Reports */}
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="text-[#333333]">Quick Reports</CardTitle>
              <CardDescription>Generate commonly requested reports instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-[#ac1f2d] hover:text-white transition-colors"
                  onClick={() => handleGenerateReport("monthly-summary")}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Monthly Summary</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-[#ac1f2d] hover:text-white transition-colors"
                  onClick={() => handleGenerateReport("outstanding-premiums")}
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Outstanding Premiums</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-[#ac1f2d] hover:text-white transition-colors"
                  onClick={() => handleGenerateReport("expiring-policies")}
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Expiring Policies</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-[#ac1f2d] hover:text-white transition-colors"
                  onClick={() => handleGenerateReport("commission-summary")}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Commission Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Configure report parameters</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Input
                id="reportType"
                value={reportTypes.find((r) => r.id === selectedReportType)?.name || selectedReportType}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmGenerateReport} className="bg-[#ac1f2d] hover:bg-[#8b1a26]">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
