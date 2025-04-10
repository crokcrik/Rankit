"use client";

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ListMusic, PlusCircle, Settings } from 'lucide-react'
import Logo from './components/Logo'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'My Rankings', href: '/rankings', icon: ListMusic },
  ]

  return (
    <html lang="en">
      <head>
        <title>Rank it! - Album Ranking Made Fun</title>
        <meta name="description" content="Create, share, and discover album rankings. Your music taste, organized." />
        <meta name="theme-color" content="#1DB954" />
        <meta property="og:title" content="Rank it! - Album Ranking Made Fun" />
        <meta property="og:description" content="Create, share, and discover album rankings. Your music taste, organized." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-background-secondary p-4 border-r border-border">
            <div className="mb-8 px-4">
              <Link href="/" className="block hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
                  >
                    <Icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="mt-8">
              <Link href="/rankings/new" className="btn-primary w-full flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                New Ranking
              </Link>
            </div>
            <div className="absolute bottom-8 left-4 right-4">
              <Link href="/settings" className="sidebar-item">
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-accent to-blue-500"></div>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
