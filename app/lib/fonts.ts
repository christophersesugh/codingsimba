import { Roboto } from 'next/font/google'
import { Overpass } from 'next/font/google'
import { Protest_Strike } from 'next/font/google'

export const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin'],
})

export const overpass = Overpass({
	weight: ['400', '700'],
	subsets: ['latin'],
})

export const protestStrike = Protest_Strike({
	weight: ['400'],
	subsets: ['latin'],
})
