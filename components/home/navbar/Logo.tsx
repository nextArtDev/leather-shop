import Link from 'next/link'
import { FC } from 'react'

interface LogoProps {
  href?: string
}

const Logo: FC<LogoProps> = ({ href = '/' }) => {
  return (
    <div>
      <Link href={href} className="flex items-center space-x-2">
        {/* <Package2 className="h-6 w-6" /> */}
        <span className="font-bold inline-block">خارَک</span>
      </Link>
    </div>
  )
}

export default Logo
