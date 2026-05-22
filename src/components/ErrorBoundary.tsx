'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-xl border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Critical Error Detected!</h1>
            <p className="text-gray-700 mb-4">Component crashed. Error details below:</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm font-mono mb-4">
              <pre>{this.state.error?.toString()}</pre>
              <pre className="mt-4 opacity-60">{this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
