"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Shield, CreditCard, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Policies",
    value: "1,234",
    change: "+8%",
    changeType: "positive",
    icon: Shield,
    color: "text-green-600",
  },
  {
    title: "Pending Quotes",
    value: "89",
    change: "-5%",
    changeType: "negative",
    icon: FileText,
    color: "text-yellow-600",
  },
  {
    title: "Monthly Revenue",
    value: "KSh 4.2M",
    change: "+15%",
    changeType: "positive",
    icon: CreditCard,
    color: "text-[#ac1f2d]",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "policy",
    message: "New policy created for John Doe",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "payment",
    message: "Payment received from Jane Smith",
    time: "15 minutes ago",
    status: "success",
  },
  {
    id: 3,
    type: "claim",
    message: "Claim submitted by Mike Johnson",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    type: "quote",
    message: "Quote expired for Sarah Wilson",
    time: "2 hours ago",
    status: "error",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#ac1f2d] to-[#333333] rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to Easy Bima Admin Dashboard</h2>
        <p className="text-white/80">
          Manage your insurance operations efficiently with real-time insights and comprehensive tools.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="scale-in hover:shadow-lg transition-all-smooth"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#333333]">{stat.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp
                  className={`h-3 w-3 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                />
                <span className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="slide-in-left">
          <CardHeader>
            <CardTitle className="text-[#333333]">Recent Activities</CardTitle>
            <CardDescription>Latest updates from your insurance platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {activity.status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.status === "warning" && <Clock className="h-5 w-5 text-yellow-600" />}
                    {activity.status === "error" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="slide-in-right">
          <CardHeader>
            <CardTitle className="text-[#333333]">Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-[#ac1f2d] hover:bg-[#ac1f2d]/5 transition-all-smooth group">
                <Users className="h-6 w-6 text-[#ac1f2d] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-gray-900">Add User</div>
                <div className="text-xs text-gray-500">Create new user account</div>
              </button>
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-[#ac1f2d] hover:bg-[#ac1f2d]/5 transition-all-smooth group">
                <FileText className="h-6 w-6 text-[#ac1f2d] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-gray-900">New Quote</div>
                <div className="text-xs text-gray-500">Generate insurance quote</div>
              </button>
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-[#ac1f2d] hover:bg-[#ac1f2d]/5 transition-all-smooth group">
                <Shield className="h-6 w-6 text-[#ac1f2d] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-gray-900">New Policy</div>
                <div className="text-xs text-gray-500">Create insurance policy</div>
              </button>
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-[#ac1f2d] hover:bg-[#ac1f2d]/5 transition-all-smooth group">
                <CreditCard className="h-6 w-6 text-[#ac1f2d] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-gray-900">Process Payment</div>
                <div className="text-xs text-gray-500">Handle payment transactions</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
