import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function SubscriptionForm() {
	return (
		<Card className="max-w-xl mx-auto mb-12 md:mb-20">
			<CardHeader>
				<CardTitle>Stay up to date.</CardTitle>
				<CardDescription className="text-center max-w-xs mx-auto">
					Subscribe to the newsletter to receive the latest updates on workshops,
					articles and more.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form className="flex flex-col gap-2">
					<Label htmlFor="email">Email:</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Your email address..."
						className="p-6 rounded-2xl"
						required
					/>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<Button type="submit" className="text-lg">
					Subscribe
				</Button>
			</CardFooter>
		</Card>
	)
}
