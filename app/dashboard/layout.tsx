"use client"

import React, { useState, useEffect } from "react"
import styles from "./layout.module.css"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  Shield,
  FolderOpen,
  Calculator,
  CreditCard,
  Percent,
  Bell,
  AlertTriangle,
  BarChart3,
  Menu,
  LogOut,
  Home,
  User,
  Settings,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Users/Clients", href: "/dashboard/users", icon: Users },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { name: "Policies", href: "/dashboard/policies", icon: Shield },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Valuations", href: "/dashboard/valuations", icon: Calculator },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Commissions", href: "/dashboard/commissions", icon: Percent },
  { name: "Reminders", href: "/dashboard/reminders", icon: Bell },
  { name: "Claims", href: "/dashboard/claims", icon: AlertTriangle },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sidebar is collapsed by default; expands on hover
  // Sidebar open state for mobile only
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter();
  // Ref for sidebar and logout
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const logoutButtonRef = React.useRef<HTMLButtonElement>(null);
  // Debounce timer for hover navigation
  const hoverTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the last hovered tab to avoid unnecessary navigation
  const lastHovered = React.useRef<string | null>(null);

  return (
    <div className={`flex h-screen bg-gray-50 ${styles.transitionAll}`}>
      {/* Global animations are now in the CSS module */}
      {/* Sidebar */}
      {/* Responsive: hamburger for mobile, hover for desktop */}
      <div className="lg:hidden absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div
        ref={sidebarRef}
        className={`group/sidebar fixed z-20 h-full flex flex-col shadow-lg ${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
          lg:relative lg:z-0 lg:flex ${styles.sidebarHover}`}
        tabIndex={0}
        onMouseLeave={() => setSidebarOpen(false)}

      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-center border-b border-[hsl(var(--sidebar-border))] transition-all duration-300
            ${sidebarOpen ? 'p-4' : 'py-3 px-0'}
            lg:p-0 lg:py-3 lg:justify-center lg:items-center lg:transition-all lg:duration-300
            group-hover/sidebar:p-4
          `}>
            <Image
              src="/cic-logo.png"
              alt="CIC Group Logo"
              width={sidebarOpen ? 80 : 32}
              height={sidebarOpen ? 60 : 32}
              className={`object-contain transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}
                lg:w-8 lg:h-8 lg:mx-auto lg:transition-all lg:duration-300
                group-hover/sidebar:w-20 group-hover/sidebar:h-16
              `}
            />
          </div>

          {/* Navigation */}
          <nav className={`flex-1 px-0 py-2 space-y-1 transition-all duration-300`}>  
            <div className="relative">
              {navigation.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (window.innerWidth < 1024) return; // Only on desktop
                      if (isActive) return;
                      if (lastHovered.current === item.href) return;
                      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                      hoverTimeout.current = setTimeout(() => {
                        router.push(item.href);
                        lastHovered.current = item.href;
                      }, 120);
                    }}
                    onMouseLeave={() => {
                      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex items-center py-2 ${styles.transitionAll} z-10
                        px-0 justify-center
                        lg:px-0 lg:justify-center lg:group-hover/sidebar:px-3 lg:group-hover/sidebar:justify-start
                        rounded-lg text-sm font-medium
                        ${isActive ? 'text-[#ac1f2d] font-semibold bg-[#ac1f2d]/20' : 'text-gray-700 hover:bg-gray-100 hover:text-[#ac1f2d]'}
                        w-full
                      `}
                      tabIndex={0}
                      onClick={() => setSidebarOpen(false)}
                      style={!sidebarOpen && isActive ? { boxShadow: '0 4px 16px rgba(172,31,45,0.10)' } : {}}
                    >
                      <span className={`flex items-center justify-center ${styles.transitionAll} relative
                        ${isActive ? 'bg-[#ac1f2d] text-white shadow-lg rounded-lg w-10 h-10' : 'group-hover:scale-110'}
                        mx-auto lg:mx-auto lg:group-hover/sidebar:mx-0
                        hover:transform hover:scale-110 active:scale-95 active:duration-100
                        ${isActive ? styles.animatePulseSlow : ''}
                      `}>
                        <item.icon
                          className={`h-6 w-6 ${styles.transitionAll}
                            ${sidebarOpen ? "mr-3" : "mx-auto"}
                            lg:mx-auto lg:group-hover/sidebar:mr-3
                            ${isActive ? 'text-white' : 'group-hover:text-[#ac1f2d]'}
                            group-active:transform group-active:scale-90
                          `}
                        />
                        {isActive && (
                          <span className="absolute -top-1 -right-1 h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ac1f2d] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ac1f2d]"></span>
                          </span>
                        )}
                      </span>
                      {/* Hide label when collapsed, show on expand */}
                      <span className={`transition-all duration-200 whitespace-nowrap
                        opacity-0 w-0 overflow-hidden pointer-events-none
                        lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:ml-1 lg:group-hover/sidebar:w-auto lg:group-hover/sidebar:pointer-events-auto
                        ${sidebarOpen ? 'opacity-100 ml-1 w-auto pointer-events-auto' : ''}
                      `}>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className={`border-t border-[hsl(var(--sidebar-border))] transition-all duration-300
            py-3 px-0 lg:p-0 lg:py-3 lg:justify-center lg:items-center lg:transition-all lg:duration-300 group-hover/sidebar:p-2
          `}>
            <Button
              ref={logoutButtonRef}
              variant="ghost"
              className={`w-full text-gray-700 hover:text-[#ac1f2d] hover:bg-gray-100 transition-all duration-300
                justify-center lg:justify-center lg:group-hover/sidebar:justify-start flex items-center
              `}
              onClick={() => (window.location.href = "/login")}
            >
              <LogOut className={`h-6 w-6 transition-all duration-300 mx-auto lg:mx-auto lg:group-hover/sidebar:mr-3 group-hover:scale-110 group-active:scale-90`} />
              <span className={`transition-all duration-200 whitespace-nowrap
                opacity-0 w-0 overflow-hidden pointer-events-none
                lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:ml-1 lg:group-hover/sidebar:w-auto lg:group-hover/sidebar:pointer-events-auto
                ${sidebarOpen ? 'opacity-100 ml-1 w-auto pointer-events-auto' : ''}
              `}>Logout</span>
            </Button>
          </div>
          {/* Mobile close overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-20 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#333333]">Easy Bima Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Administrator</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div key={pathname} className={styles.fadeIn}>{children}</div>
        </main>
      </div>
    </div>
  );
}
