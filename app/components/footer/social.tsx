import Link from 'next/link'
import { Button } from '../ui/button'
import {
	GitHubLogoIcon,
	LinkedInLogoIcon,
	TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/app/lib/utils'
import { overpass } from '@/app/lib/fonts'

export default function Social() {
	const handles = [
		{
			icon: <GitHubLogoIcon className="w-6 h-6" />,
			link: 'https://github.com/christophersesugh',
			name: 'github icon',
		},
		{
			icon: <LinkedInLogoIcon className="w-6 h-6" />,
			link: 'https://www.linkedin.com/christopher-sesugh-265332176/',
			name: 'linkedin icon',
		},
		{
			icon: <TwitterLogoIcon className="w-6 h-6" />,
			link: 'https://twitter.com/codingsimba_',
			name: 'twitter icon',
		},
	]
	return (
		<div className="flex flex-col items-start">
			<h1 className="font-black text-2xl">
				<span className={cn(overpass.className, 'text-blue-500')}>Coding </span>
				Simba
			</h1>
			<p className="text-slate-400 text-xl my-4">
				Software Engineer and Educator.
			</p>
			<div className="flex gap-6 justify-center items-center mt-4">
				{handles.map((handle, index) => (
					<Button
						variant="ghost"
						className="text-2xl m-0 p-0"
						aria-label={handle.name}
						key={`${handle.link}-${index}`}
					>
						<Link href={handle.link} target="_blank" rel="noopener noreferrer">
							{handle.icon}
						</Link>
					</Button>
				))}
			</div>
		</div>
	)
}
