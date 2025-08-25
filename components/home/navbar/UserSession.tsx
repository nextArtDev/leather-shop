'use client'
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
import { authClient } from '@/lib/auth-client'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useTransition } from 'react'

export default function UserSession() {
  const {
    data: session,
    // isPending, //loading state
    // error, //error object
    // refetch, //refetch the session
  } = authClient.useSession()
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  //   const [actionState, updateAction, pending] = useActionState(
  //    await authClient.signOut({
  //   fetchOptions: {
  //     onSuccess: () => {
  //       router.push("/sign-in")
  //     },
  //   }}),{}
  //   )
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/sign-in')
          },
        },
      })
    })
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
        align="end"
      >
        <DropdownMenuLabel dir="rtl" className="cursor-pointer">
          {session ? session.user?.name : 'ورود/عضویت'}
        </DropdownMenuLabel>
        {session?.user.phoneNumber && (
          <>
            <DropdownMenuGroup dir="rtl">
              <DropdownMenuItem className="cursor-pointer">
                <Link href={'/user/profile'}>پروفایل</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild dir="rtl" className="cursor-pointer">
              <form onSubmit={handleSubmit}>
                <input className="hidden" />
                <Button
                  disabled={isPending}
                  variant={'ghost'}
                  type="submit"
                  className=" "
                >
                  خروج
                </Button>
              </form>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
