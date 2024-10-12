import React from 'react'
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SignInDialog() {
	return (
		<DialogContent className="max-w-md">
			<DialogHeader>
				<DialogTitle className="text-center text-xl">Sign In</DialogTitle>
				<DialogDescription className="max-w-sm text-center mx-auto text-slate-600 dark:text-slate-400">
					To sign in to your account or to create a new one fill in your email below
					and we&apos;ll send you an email with a magic link to get you started.
				</DialogDescription>
			</DialogHeader>
			<div>
				<Label htmlFor="email" className="text-right">
					Email address:
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Email address"
					required
				/>
			</div>

			<DialogFooter>
				<DialogClose asChild>
					<Button variant={'outline'} className="text-lg">
						Close
					</Button>
				</DialogClose>
				<Button type="submit" className="text-lg">
					Email a magic link
				</Button>
			</DialogFooter>
		</DialogContent>
	)
}
