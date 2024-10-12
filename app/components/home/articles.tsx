import React from 'react'
import ItemCard from '../item-card'
import SectionTitle from '../section-title'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowBigRight } from 'lucide-react'

export default function Articles() {
	return (
		<section className="flex flex-col items-center">
			<SectionTitle title="Recent Articles" />
			<div></div>
			<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{Array.from({ length: 3 }).map((_, index) => (
					<ItemCard key={index} />
				))}
			</div>

			<Button size={'lg'} variant={'outline'} className="mx-auto mt-12 text-lg">
				<Link href="/articles" className="flex items-center gap-2">
					View all articles <ArrowBigRight size={20} />
				</Link>
			</Button>
		</section>
	)
}
