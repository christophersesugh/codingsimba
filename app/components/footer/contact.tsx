import React from 'react'
import _List from './list'
import Title from './title'

export default function Contact() {
	const items = [
		{ name: 'Email Chris', link: 'mailto:christohybrid185@gmail.com' },
	]

	return (
		<div>
			<Title title="Contact" />
			<_List items={items} />
		</div>
	)
}
