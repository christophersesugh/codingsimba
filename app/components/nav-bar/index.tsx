'use client'

import React from 'react'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import { cn } from '@/app/lib/utils'
import { protestStrike } from '@/app/lib/fonts'
import { Button } from '../ui/button'
import ModeToggle from './mode-toggle'
import { AlignRight } from 'lucide-react'
import NavDropdown from './nav-dropdown'
import { DialogTrigger } from '../ui/dialog'

export default function NavBar() {
	const links = [
		{ href: '/workshops', label: 'Workshops' },
		{ href: '/articles', label: 'Articles' },
		{ href: '/subscription', label: 'Subscription' },
		{ href: '/about', label: 'About Me' },
	]

	const [isOpen, setIsOpen] = React.useState(false)
	return (
		<nav className="relative">
			<div className="max-w-5xl w-full flex items-center justify-between mx-auto py-10 px-4">
				<div className="flex items-center gap-2 !text-lg">
					<Link
						href="/"
						className={cn(protestStrike.className, 'font-bold text-2xl mr-2')}
					>
						Coding Simba
					</Link>
					<Separator orientation="vertical" className="h-6 hidden md:block" />
					<div className="items-center hidden md:flex">
						{links.map(link => (
							<Button variant="link" className="text-lg" asChild key={link.href}>
								<Link href={link.href}>{link.label}</Link>
							</Button>
						))}
					</div>
				</div>
				<div className="flex items-center gap-4">
					<ModeToggle />
					<Button
						onClick={() => setIsOpen(!isOpen)}
						size={'icon'}
						variant="outline"
						className="text-lg flex items-center justify-center md:hidden h-9 w-9"
					>
						<AlignRight className="h-6 w-6" />
					</Button>
					<DialogTrigger asChild>
						<Button className="text-lg hidden md:flex">Sign In</Button>
					</DialogTrigger>
				</div>
			</div>
			{isOpen ? <NavDropdown links={links} /> : null}
		</nav>
	)
}
