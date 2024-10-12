'use client'

import Sitemap from './_sitemap'
import Contact from './contact'
import General from './general'
import Social from './social'
import SubscriptionForm from './subscription-form'

export default function Footer() {
	const year = new Date().getFullYear()
	return (
		<>
			<footer id="footer" className="max-w-6xl mx-auto px-6 pb-12">
				<SubscriptionForm />
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center mx-auto">
					<Social />
					<Contact />
					<General />
					<Sitemap />
				</section>
				<p className="mt-12">All rights reserved &copy; Coding Simba {year}.</p>
			</footer>
		</>
	)
}
