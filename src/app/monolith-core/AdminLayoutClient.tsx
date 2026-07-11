'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  ShoppingBag,
  Briefcase,
  Cpu,
  Package,
  BookOpen,
  Shield,
  ScrollText,
  Clock,
  Quote as QuoteIcon,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/gatekeeper')
    router.refresh()
  }

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { href: '/monolith-core', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/monolith-core/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Sales & Projects',
      items: [
        { href: '/monolith-core/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/monolith-core/invoices', label: 'Invoices', icon: FileText },
      ]
    },
    {
      title: 'Pricing Engine',
      items: [
        { href: '/monolith-core/price-catalog/packages', label: 'Pricing Packages', icon: Package },
        { href: '/monolith-core/price-catalog/features', label: 'Feature Catalog', icon: FileText },
        { href: '/monolith-core/price-catalog/difficulties', label: 'Difficulty Matrix', icon: BarChart3 },
      ]
    },
    {
      title: 'Content',
      items: [
        { href: '/monolith-core/posts', label: 'Posts', icon: FileText },
      ]
    },
    {
      title: 'Portfolios',
      items: [
        { href: '/monolith-core/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/monolith-core/tech-stacks', label: 'Tech Stacks', icon: Cpu },
      ]
    },
    {
      title: 'Website Content',
      items: [
        { href: '/monolith-core/about', label: 'About', icon: BookOpen },
        { href: '/monolith-core/quote', label: 'Quote', icon: QuoteIcon },
        { href: '/monolith-core/timeline', label: 'Timeline', icon: Clock },
        { href: '/monolith-core/ketentuan', label: 'Ketentuan', icon: ScrollText },
        { href: '/monolith-core/privacy-policy', label: 'Privacy & Policy', icon: Shield },
        { href: '/monolith-core/terms-conditions', label: 'Terms & Conditions', icon: FileText },
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/monolith-core/users', label: 'Users', icon: Users },
        { href: '/monolith-core/settings', label: 'Settings', icon: Settings },
      ]
    }
  ]

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="space-y-6">
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'
                  }`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0 bg-gray-900 border-r border-gray-800 print:hidden">
        <div className="h-full px-4 py-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">M</div>
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-gray-800 pb-1">Monark <span className="text-blue-500">Studio</span></h2>
            </div>
            <NavContent />
          </div>

          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-500 group-hover:text-red-500" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden bg-gray-900 border-r border-gray-800 print:hidden`}
      >
        <div className="h-full px-4 py-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-10 px-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Monark <span className="text-blue-500">Admin</span></h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavContent mobile />
          </div>

          <div className="pt-6 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-500 group-hover:text-red-500" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 print:ml-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 print:hidden">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative text-gray-500 hover:text-gray-700">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        href="/monolith-core/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/monolith-core/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 print:p-0">
          {children}
        </main>
      </div>
    </div>
  )
}