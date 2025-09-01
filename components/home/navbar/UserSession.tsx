import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'
import Link from 'next/link'
import SignOutBtn from '../shared/SignOutBtn'
// import { getCurrentUser } from '@/lib/auth-helpers'
import { CurrentUserType } from '@/lib/types/home'

export default function UserSession(session: {
  session: CurrentUserType | null
}) {
  if (!session.session?.id) {
    return (
      <Link href={'/sign-in'} className="w-full ">
        <User className="h-6 w-6" />
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User account">
          <User className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit rounded-none bg-background/20 backdrop-blur-lg   "
        align="start"
      >
        <DropdownMenuLabel dir="rtl" className="cursor-pointer" asChild>
          {session.session?.name}
        </DropdownMenuLabel>
        {session.session?.phoneNumber && (
          <>
            <DropdownMenuGroup dir="rtl">
              <Link href={'/user/profile'}>
                <DropdownMenuItem className="cursor-pointer">
                  پروفایل
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              dir="rtl"
              className="cursor-pointer w-full"
            >
              <SignOutBtn className="w-full" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
