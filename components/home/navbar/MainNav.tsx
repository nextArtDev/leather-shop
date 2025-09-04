'use client'

import Link from 'next/link'
import * as React from 'react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { CurrentUserType, NavigationData } from '@/lib/types/home'
import { cn } from '@/lib/utils'
import TextRotate from '../shared/text-rotate'
import DesktopNav from './DesktopNav'
import DrawerCart from './DrawerCart'
import MobileNav from './MobileNav'
import UserSession from './UserSession'
import SearchBar from './SearchBar'
import Logo from './Logo'

// Hook to ensure consistent client-side rendering
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const useEffectToUse =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
  useEffectToUse(effect, deps)
}

// Hook to prevent hydration mismatches
function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

// Fixed ListItem component - removed nested Link issue
export const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string
    children: React.ReactNode
  }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        href={href}
        className={cn(
          'group block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
        <div className="text-sm font-medium leading-none text-foreground">
          {title}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          مشاهده
        </p>
      </Link>
    </NavigationMenuLink>
  )
})
ListItem.displayName = 'ListItem'

// const MobileNav = ({ navigation }: { navigation: NavigationData }) => (
//   <Sheet>
//     <SheetTrigger asChild>
//       <Button variant="ghost" size="icon" className="lg:hidden">
//         <Menu className="h-6 w-6" />
//         <span className="sr-only">Open menu</span>
//       </Button>
//     </SheetTrigger>
//     <SheetContent side="left" className="flex flex-col">
//       <div className="w-full h-fit ">
//         {/* <Logo /> */}
//         <SheetClose asChild>
//           <Button variant="ghost" size="icon" className="rounded-full sr-only">
//             Close
//           </Button>
//         </SheetClose>
//       </div>
//       {/* <Separator className="my-4" /> */}
//       <div className="flex-1 overflow-y-auto pt-6 ">
//         <nav className="grid items-start px-4 text-sm font-medium space-y-4">
//           {navigation.categories.map((category) => (
//             <div key={category.name}>
//               <p className="font-semibold text-foreground px-2 mb-2">
//                 {category.name}
//               </p>
//               {category.featured.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           ))}
//           <Separator className="my-4" />
//           {navigation.pages.map((page) => (
//             <Link
//               key={page.name}
//               href={page.href}
//               className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//             >
//               {page.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//       <Separator className="my-4" />
//       <div className="space-y-2 px-4 pb-6">
//         <Button asChild variant="default" className="w-full">
//           <Link href="/sign-in">ایجاد حساب کاربری</Link>
//         </Button>
//         {/* <Button asChild variant="secondary" className="w-full">
//           <Link href="/login">Sign in</Link>
//         </Button> */}
//       </div>
//     </SheetContent>
//   </Sheet>
// )

const TopBanner = () => {
  const isHydrated = useHydrationSafe()

  return (
    <div className="bg-primary text-primary-foreground">
      {isHydrated ? (
        <TextRotate
          texts={[
            // 'All duties and taxes included. within the US',
            // 'Buy now. Pay later with Klarna. ',
            'تمام محصولات چرم طبیعی و بوسیله دست تهیه شده‌اند.',
            'همین حالا خرید کنید!',
          ]}
          mainClassName="flex items-center justify-center px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg"
          staggerFrom={'last'}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitBy="line"
          splitLevelClassName="overflow-hidden line-clamp-2 text-center py-auto pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={5000}
        />
      ) : (
        <div className="flex items-center justify-center px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1">
          {/* All duties and taxes included. within the US */}
        </div>
      )}
    </div>
  )
}

// --- Main Exported Component ---

export default function MainNav({
  navigation,
  session,
}: {
  navigation: NavigationData
  session: CurrentUserType
}) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const toggleSearch = React.useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  return (
    <div className="bg-background">
      <header className="relative">
        <nav aria-label="Main navigation">
          {/* Top navigation */}
          <TopBanner />

          {/* Secondary navigation */}
          <div className="">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center lg:hidden">
                  <MobileNav navigation={navigation} session={session} />
                </div>

                <div className="lg:hidden">
                  <Logo />
                </div>

                <div className="flex flex-1 items-center justify-end lg:justify-start">
                  <div className="flex lg:flex-row-reverse items-center space-x-4">
                    <SearchBar
                      isOpen={isSearchOpen}
                      onToggle={toggleSearch}
                      categories={navigation.categories.map((cat) => {
                        return {
                          category: cat.name,
                        }
                      })}
                    />
                    {/* <SearchCombobox
                      isOpen={isSearchOpen}
                      onToggle={toggleSearch}
                      categories={navigation.categories.map((cat) => {
                        return {
                          category: cat.name,
                        }
                      })}
                    /> */}
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      aria-label="User account"
                      >
                      <User className="h-6 w-6" />
                      </Button> */}
                    <UserSession session={session} />
                    <DrawerCart />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                  <Logo />
                </div>

                <div className="hidden lg:items-center h-full lg:flex">
                  <DesktopNav navigation={navigation} session={session} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
