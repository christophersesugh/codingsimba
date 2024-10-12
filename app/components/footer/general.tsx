import _List from './list'
import Title from './title'

export default function General() {
	const items = [
		{ name: 'My Mission', link: '/mission' },
		{ name: 'Privacy policy', link: '/privacy-policy' },
		{ name: 'Terms of use', link: '/terms-of-use' },
	]
	return (
		<div>
			<Title title="General" />
			<_List items={items} />
		</div>
	)
}
