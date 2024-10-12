import { overpass } from '@/app/lib/fonts'
import { cn } from '@/app/lib/utils'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function Header() {
	return (
		<section className="flex flex-col items-center justify-center">
			<h1
				className={cn(
					overpass.className,
					'text-4xl font-bold max-w-lg text-center',
				)}
			>
				Crafting exceptional software solutions for tomorrow&apos;s challenges.
			</h1>
			<p className="text-lg text-muted-foreground max-w-sm text-center mt-4">
				Let&apos;s make the world a better place by building exceptional software
				solutions.
			</p>
			<div className="mt-8 flex gap-4">
				<Button className="text-lg" asChild>
					<Link href="/workshops">Workshops</Link>
				</Button>
				<Button variant="outline" className="text-lg" asChild>
					<Link href="/articles">Read articles</Link>
				</Button>
			</div>
		</section>
	)
}
