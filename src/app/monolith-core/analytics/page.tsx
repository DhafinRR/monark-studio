'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AnalyticsData {
  overview: {
    totalUsers: number
    pageViews: number
    sessions: number
    avgSessionDuration: number
    bounceRate: number
    newUsers: number
    activeUsers: number
  }
  topPages: {
    path: string
    title: string
    views: number
    users: number
    avgDuration: number
  }[]
  trafficSources: {
    channel: string
    sessions: number
    users: number
  }[]
  devices: {
    device: string
    users: number
    sessions: number
  }[]
  countries: {
    country: string
    city: string
    users: number
    sessions: number
  }[]
  daily: {
    date: string
    users: number
    sessions: number
    pageViews: number
  }[]
  dateRange: {
    startDate: string
    endDate: string
  }
  isLive: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DATE_RANGES = [
  { label: '7 Hari', value: '7daysAgo' },
  { label: '14 Hari', value: '14daysAgo' },
  { label: '30 Hari', value: '30daysAgo' },
  { label: '90 Hari', value: '90daysAgo' },
]

const CHART_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#6366f1', // indigo
]

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  mobile: <Smartphone className="w-4 h-4" />,
  desktop: <Monitor className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function formatDateLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

// ─── Components ──────────────────────────────────────────────────────────────

function KPICard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  trend,
}: {
  title: string
  value: string
  icon: React.ElementType
  color: string
  subtitle?: string
  trend?: { value: number; label: string }
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              {trend.value >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

function ChartTooltipContent({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs">
      <p className="font-medium mb-1">{formatDateLabel(label)}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="font-semibold">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState('30daysAgo')
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = useCallback(async (range: string) => {
    try {
      setError(null)
      const res = await fetch(
        `/api/monolith-core/analytics?startDate=${range}&endDate=today`
      )
      if (!res.ok) throw new Error('Failed to fetch analytics data')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(String(err))
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchAnalytics(selectedRange).finally(() => setLoading(false))
  }, [selectedRange, fetchAnalytics])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics(selectedRange)
    setRefreshing(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-500 font-medium">Memuat data analytics...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { overview, topPages, trafficSources, devices, countries, daily } = data

  // Calculate device totals for percentage
  const totalDeviceUsers = devices.reduce((s, d) => s + d.users, 0)

  // Traffic source totals for percentage
  const totalSourceSessions = trafficSources.reduce((s, t) => s + t.sessions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau performa dan traffic website Monark Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          {data.isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Data
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              Demo Data
            </div>
          )}

          {/* Date range selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <Calendar className="w-4 h-4 text-gray-400 ml-3" />
            {DATE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  selectedRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Demo banner */}
      {!data.isLive && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Mode Demo — Google Analytics belum dikonfigurasi
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Data yang ditampilkan adalah data simulasi. Untuk melihat data real,
                konfigurasikan Google Analytics 4 Measurement ID dan Service Account
                di file <code className="bg-amber-100 px-1 rounded">.env.local</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Pengunjung"
          value={formatNumber(overview.totalUsers)}
          icon={Users}
          color="#3b82f6"
          subtitle={`${formatNumber(overview.newUsers)} pengunjung baru`}
        />
        <KPICard
          title="Total Page Views"
          value={formatNumber(overview.pageViews)}
          icon={Eye}
          color="#8b5cf6"
          subtitle={`${(overview.pageViews / Math.max(overview.sessions, 1)).toFixed(1)} halaman/sesi`}
        />
        <KPICard
          title="Rata-rata Durasi"
          value={formatDuration(overview.avgSessionDuration)}
          icon={Clock}
          color="#06b6d4"
          subtitle="Durasi per sesi"
        />
        <KPICard
          title="Active Users"
          value={overview.activeUsers.toString()}
          icon={Activity}
          color="#10b981"
          subtitle="Saat ini online"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sesi</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatNumber(overview.sessions)}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bounce Rate</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {overview.bounceRate.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pengunjung Baru</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {overview.totalUsers > 0
                  ? ((overview.newUsers / overview.totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <Users className="w-5 h-5 text-violet-500" />
          </div>
        </div>
      </div>

      {/* Traffic Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Traffic Overview
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tren pengunjung dan sesi harian
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorSessions)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#colorPageViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column layout: Traffic Sources + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Sumber Traffic
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Channel yang membawa pengunjung
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    dataKey="sessions"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {trafficSources.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      formatNumber(value),
                      'Sessions',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {trafficSources.map((source, i) => (
                <div key={source.channel} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium truncate">
                        {source.channel}
                      </span>
                      <span className="text-gray-500 ml-2">
                        {totalSourceSessions > 0
                          ? (
                              (source.sessions / totalSourceSessions) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            totalSourceSessions > 0
                              ? (source.sessions / totalSourceSessions) * 100
                              : 0
                          }%`,
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Perangkat
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Breakdown perangkat pengunjung
          </p>
          <div className="space-y-5">
            {devices.map((device, i) => {
              const percentage =
                totalDeviceUsers > 0
                  ? ((device.users / totalDeviceUsers) * 100).toFixed(1)
                  : '0'
              return (
                <div key={device.device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${CHART_COLORS[i]}15`,
                          color: CHART_COLORS[i],
                        }}
                      >
                        {DEVICE_ICONS[device.device] || (
                          <Globe className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 capitalize">
                          {device.device}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatNumber(device.users)} users ·{' '}
                          {formatNumber(device.sessions)} sessions
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: CHART_COLORS[i],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Device bar chart */}
          <div className="h-40 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="device"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', textTransform: 'capitalize' } as any}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={formatNumber}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                />
                <Bar dataKey="users" name="Users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sessions" name="Sessions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Halaman Terpopuler
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Halaman dengan traffic paling tinggi
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Halaman
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Avg. Duration
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, i) => {
                const maxViews = topPages[0]?.views || 1
                const share = ((page.views / maxViews) * 100).toFixed(0)
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {page.title || page.path}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                          {page.path}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatNumber(page.views)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600">
                        {formatNumber(page.users)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600">
                        {formatDuration(page.avgDuration)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {share}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Data */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Lokasi Pengunjung
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Asal pengunjung berdasarkan negara dan kota
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {countries.map((loc, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {loc.city !== '(not set)' ? loc.city : loc.country}
                </p>
                <p className="text-xs text-gray-500">{loc.country}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {formatNumber(loc.users)}
                </p>
                <p className="text-xs text-gray-400">users</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Data powered by Google Analytics 4 · Last refreshed: {new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  )
}
