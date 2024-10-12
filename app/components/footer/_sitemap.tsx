import _List from './list'
import Title from './title'

export default function Sitemap() {
	const items = [
		{ name: 'home', link: '/' },
		{ name: 'workshops', link: '/workshops' },
		{ name: 'articles', link: '/articles' },
		{ name: 'subscription', link: '/subscription' },
		{ name: 'discord', link: '/discord' },
		{ name: 'about', link: '/about' },
		{ name: 'sitemap', link: '/sitemap.xml' },
	]
	return (
		<div>
			<Title title="Sitemap" />
			<_List items={items} />
		</div>
	)
}
