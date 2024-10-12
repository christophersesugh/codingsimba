import React from 'react'
import Header from './header'
import Articles from './articles'
import Workshops from './workshops'
import { Separator } from '../ui/separator'

export default function _Home() {
	return (
		<div className="mx-auto mt-8">
			<Header />
			<Separator className="my-16" />
			<Workshops />
			<Separator className="my-16" />
			<Articles />
			<Separator className="my-16" />
		</div>
	)
}
