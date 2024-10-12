import React from 'react'
import { cn } from '../lib/utils'
import { overpass } from '../lib/fonts'

export default function SectionTitle({ title }: { title: string }) {
	return (
		<h2 className={cn(overpass.className, 'text-2xl font-bold text-center mb-8')}>
			{title}
		</h2>
	)
}
