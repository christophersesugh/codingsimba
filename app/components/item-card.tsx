import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'
import { cn } from '../lib/utils'
import { overpass } from '../lib/fonts'
import { Badge } from './ui/badge'
import { CalendarDaysIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'

export default function ItemCard() {
	return (
		<Link href="/articles/1">
			<Card>
				<CardHeader className="bg-slate-200 dark:bg-slate-800 rounded-tr-lg rounded-tl-lg">
					<CardTitle className={cn(overpass.className, 'text-xl')}>
						Card Title Card Description Card Description
					</CardTitle>
					<CardDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
					</CardDescription>
				</CardHeader>
				<CardContent className="my-4">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<Avatar className="w-8 h-8">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<span className="text-sm">John D.</span>
						</div>

						<div className="flex items-center gap-2 text-xs">
							<CalendarDaysIcon size={15} />
							<span>2024-01-01</span>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex flex-wrap items-center gap-4 mx-auto">
						<Badge>Badge</Badge>
						<Badge>Badge</Badge>
						<Badge>Badge</Badge>
					</div>
				</CardFooter>
			</Card>
		</Link>
	)
}
