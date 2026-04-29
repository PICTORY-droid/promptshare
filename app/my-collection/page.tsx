'use client'
import dynamic from 'next/dynamic'
const MyCollectionClient = dynamic(() => import('./client'), { ssr: false })
export default function Page() { return <MyCollectionClient /> }