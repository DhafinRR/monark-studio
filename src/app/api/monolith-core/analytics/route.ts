import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Initialize GA4 Data API client
function getAnalyticsClient() {
  const clientEmail = process.env.GA_CLIENT_EMAIL
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    return null
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  })
}

const propertyId = process.env.GA_PROPERTY_ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'

    const client = getAnalyticsClient()

    if (!client || !propertyId) {
      // Return demo data when GA is not configured
      return NextResponse.json(getDemoData())
    }

    const property = `properties/${propertyId}`

    // Run all queries in parallel
    const [
      overviewData,
      pageViewsData,
      trafficSourceData,
      deviceData,
      countryData,
      dailyData,
      realtimeData,
    ] = await Promise.all([
      // 1. Overview metrics
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'newUsers' },
        ],
      }),

      // 2. Top pages
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // 3. Traffic sources
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),

      // 4. Device categories
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
      }),

      // 5. Countries
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 10,
      }),

      // 6. Daily sessions/users (for chart)
      client.runReport({
        property,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),

      // 7. Realtime (active users)
      client.runRealtimeReport({
        property,
        metrics: [{ name: 'activeUsers' }],
      }).catch(() => null), // Realtime may not be available
    ])

    // Parse overview
    const overviewRow = overviewData[0]?.rows?.[0]
    const overview = {
      totalUsers: parseInt(overviewRow?.metricValues?.[0]?.value || '0'),
      pageViews: parseInt(overviewRow?.metricValues?.[1]?.value || '0'),
      sessions: parseInt(overviewRow?.metricValues?.[2]?.value || '0'),
      avgSessionDuration: parseFloat(overviewRow?.metricValues?.[3]?.value || '0'),
      bounceRate: parseFloat(overviewRow?.metricValues?.[4]?.value || '0'),
      newUsers: parseInt(overviewRow?.metricValues?.[5]?.value || '0'),
      activeUsers: parseInt(
        realtimeData?.[0]?.rows?.[0]?.metricValues?.[0]?.value || '0'
      ),
    }

    // Parse top pages
    const topPages = (pageViewsData[0]?.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
    }))

    // Parse traffic sources
    const trafficSources = (trafficSourceData[0]?.rows || []).map((row) => ({
      channel: row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
    }))

    // Parse devices
    const devices = (deviceData[0]?.rows || []).map((row) => ({
      device: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }))

    // Parse countries
    const countries = (countryData[0]?.rows || []).map((row) => ({
      country: row.dimensionValues?.[0]?.value || '',
      city: row.dimensionValues?.[1]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }))

    // Parse daily data
    const daily = (dailyData[0]?.rows || []).map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || ''
      const formatted = dateStr
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
        : ''
      return {
        date: formatted,
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
      }
    })

    return NextResponse.json({
      overview,
      topPages,
      trafficSources,
      devices,
      countries,
      daily,
      dateRange: { startDate, endDate },
      isLive: true,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: String(error) },
      { status: 500 }
    )
  }
}

// Demo data for when GA is not configured
function getDemoData() {
  const now = new Date()
  const daily = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    return {
      date: dateStr,
      users: Math.floor(Math.random() * 120) + 30,
      sessions: Math.floor(Math.random() * 180) + 50,
      pageViews: Math.floor(Math.random() * 400) + 100,
    }
  })

  const totalUsers = daily.reduce((s, d) => s + d.users, 0)
  const totalSessions = daily.reduce((s, d) => s + d.sessions, 0)
  const totalPageViews = daily.reduce((s, d) => s + d.pageViews, 0)

  return {
    overview: {
      totalUsers,
      pageViews: totalPageViews,
      sessions: totalSessions,
      avgSessionDuration: 145.3,
      bounceRate: 42.5,
      newUsers: Math.floor(totalUsers * 0.65),
      activeUsers: Math.floor(Math.random() * 8) + 1,
    },
    topPages: [
      { path: '/', title: 'Monark Studio - Home', views: 1240, users: 890, avgDuration: 62.5 },
      { path: '/portfolio', title: 'Portfolio', views: 680, users: 520, avgDuration: 95.2 },
      { path: '/order/manual', title: 'Order Form', views: 340, users: 290, avgDuration: 180.4 },
      { path: '/order/ai', title: 'AI Order Assistant', views: 280, users: 240, avgDuration: 210.8 },
      { path: '/portfolio/1', title: 'Project Detail', views: 190, users: 160, avgDuration: 85.3 },
    ],
    trafficSources: [
      { channel: 'Organic Search', sessions: 980, users: 780 },
      { channel: 'Direct', sessions: 650, users: 520 },
      { channel: 'Social', sessions: 420, users: 380 },
      { channel: 'Referral', sessions: 180, users: 150 },
      { channel: 'Paid Search', sessions: 90, users: 75 },
    ],
    devices: [
      { device: 'mobile', users: 1200, sessions: 1450 },
      { device: 'desktop', users: 850, sessions: 1100 },
      { device: 'tablet', users: 120, sessions: 150 },
    ],
    countries: [
      { country: 'Indonesia', city: 'Jakarta', users: 1200, sessions: 1450 },
      { country: 'Indonesia', city: 'Surabaya', users: 340, sessions: 420 },
      { country: 'Indonesia', city: 'Bandung', users: 280, sessions: 350 },
      { country: 'United States', city: 'New York', users: 120, sessions: 150 },
      { country: 'Singapore', city: 'Singapore', users: 85, sessions: 110 },
      { country: 'Malaysia', city: 'Kuala Lumpur', users: 65, sessions: 80 },
    ],
    daily,
    dateRange: { startDate: '30daysAgo', endDate: 'today' },
    isLive: false,
  }
}
