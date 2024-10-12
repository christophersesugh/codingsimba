import React from 'react'
import { ThemeProvider } from '@/app/components/theme-provider'
import './globals.css'
import { roboto } from '@/app/lib/fonts'
import NavBar from './components/nav-bar'
import Footer from './components/footer'
import { Dialog } from './components/ui/dialog'
import SignInDialog from './components/signin-dialog'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.className} bg-slate-100 dark:bg-slate-900 antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Dialog>
						<NavBar />
						{children}
						<SignInDialog />
						<Footer />
					</Dialog>
				</ThemeProvider>
			</body>
		</html>
	)
}
