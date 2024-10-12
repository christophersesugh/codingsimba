import Link from 'next/link'
import { Button } from '../ui/button'

export default function _List({
	items,
}: {
	items: { name: string; link: string }[]
}) {
	return (
		<ul className="flex flex-col gap-2 items-start mt-4">
			{items.map((item: { name: string; link: string }, index: number) => (
				<li key={`${item.link}-${index}`}>
					{/* <Button
						asChild
						variant="link"
						key={`${item.link}-${index}`}
						className="p-0 capitalize"
					> */}
					<Link
						href={item.link}
						rel="noopener noreferrer"
						className="capitalize text-lg"
						target={item.link === '/sitemap.xml' ? '_blank' : '_self'}
					>
						{item.name}
					</Link>
					{/* </Button> */}
				</li>
			))}
		</ul>
	)
}
