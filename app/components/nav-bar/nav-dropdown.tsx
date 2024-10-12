import Link from 'next/link'
import React from 'react'

export default function NavDropdown({
	links,
}: {
	links: { href: string; label: string }[]
}) {
	return (
		<ul className="flex flex-col bg-background p-4 rounded-md shadow-md absolute top-20 w-full border border-border right-0 space-y-3">
			{links.map(link => (
				<li key={link.href}>
					<Link href={link.href}>{link.label}</Link>
				</li>
			))}
		</ul>
	)
}
