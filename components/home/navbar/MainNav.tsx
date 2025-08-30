'use client'

import { Menu, Package2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import TextRotate from '../shared/text-rotate'
import DrawerCart from './DrawerCart'
import UserSession from './UserSession'

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

// --- TypeScript Definitions for Navigation Data ---

interface FeaturedItem {
  name: string
  href: string
  imageSrc: string
  imageAlt: string
}

interface Category {
  name: string
  featured: FeaturedItem[]
}

interface Page {
  name: string
  href: string
}

export interface NavigationData {
  categories: Category[]
  pages: Page[]
}

// --- Component Data ---

// const navigation: NavigationData = {
//   categories: [
//     {
//       name: 'Women',
//       featured: [
//         {
//           name: 'New Arrivals',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Models sitting back to back, wearing Basic Tee in black and bone.',
//         },
//         {
//           name: 'Basic Tees',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
//         },
//         {
//           name: 'Accessories',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Model wearing minimalist watch with black wristband and white watch face.',
//         },
//         {
//           name: 'Carry',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Model opening tan leather long wallet with credit card pockets and cash pouch.',
//         },
//       ],
//     },
//     {
//       name: 'Men',
//       featured: [
//         {
//           name: 'New Arrivals',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
//         },
//         {
//           name: 'Basic Tees',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt: 'Model wearing light heather gray t-shirt.',
//         },
//         {
//           name: 'Accessories',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
//         },
//         {
//           name: 'Carry',
//           href: '#',
//           imageSrc: '/images/hero-image.webp',
//           imageAlt:
//             'Model putting folded cash into slim card holder olive leather wallet with hand stitching.',
//         },
//       ],
//     },
//   ],
//   pages: [
//     { name: 'Company', href: '#' },
//     { name: 'Stores', href: '#' },
//   ],
// }

// --- Child Components ---

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Package2 className="h-6 w-6" />
    <span className="font-bold inline-block">SEP</span>
  </Link>
)

// Fixed ListItem component - removed nested Link issue
const ListItem = React.forwardRef<
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

const DesktopNav = ({ navigation }: { navigation: NavigationData }) => (
  <NavigationMenu dir="rtl" className="hidden lg:block">
    <NavigationMenuList>
      {navigation.categories.map((category) => (
        <NavigationMenuItem key={category.name}>
          <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-4 gap-6 p-6 w-[600px] lg:w-[800px]">
              {category.featured.map((item) => (
                <ListItem key={item.name} title={item.name} href={item.href}>
                  <div className="aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={200}
                      height={200}
                      className="object-cover object-center"
                    />
                  </div>
                </ListItem>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}
      {navigation.pages.map((page) => (
        <NavigationMenuItem key={page.name}>
          <NavigationMenuLink asChild>
            <Link href={page.href} className={navigationMenuTriggerStyle()}>
              {page.name}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
)

const MobileNav = ({ navigation }: { navigation: NavigationData }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="flex flex-col">
      <div className="w-full h-fit ">
        {/* <Logo /> */}
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="rounded-full sr-only">
            Close
          </Button>
        </SheetClose>
      </div>
      {/* <Separator className="my-4" /> */}
      <div className="flex-1 overflow-y-auto pt-6 ">
        <nav className="grid items-start px-4 text-sm font-medium space-y-4">
          {navigation.categories.map((category) => (
            <div key={category.name}>
              <p className="font-semibold text-foreground px-2 mb-2">
                {category.name}
              </p>
              {category.featured.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
          <Separator className="my-4" />
          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              href={page.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              {page.name}
            </Link>
          ))}
        </nav>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2 px-4 pb-6">
        <Button asChild variant="default" className="w-full">
          <Link href="/sign-in">ایجاد حساب کاربری</Link>
        </Button>
        {/* <Button asChild variant="secondary" className="w-full">
          <Link href="/login">Sign in</Link>
        </Button> */}
      </div>
    </SheetContent>
  </Sheet>
)

const SearchBar = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean
  onToggle: () => void
}) => (
  <>
    <Button
      variant="ghost"
      size="icon"
      aria-label="Search"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <Search className="h-6 w-6" />
    </Button>
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="absolute top-full left-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10"
    >
      <CollapsibleContent>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جست‌و‌جوی محصولات..."
                className="w-full pl-10 h-12"
                autoFocus
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </>
)

const TopBanner = () => {
  const isHydrated = useHydrationSafe()

  return (
    <div className="bg-primary text-primary-foreground">
      {isHydrated ? (
        <TextRotate
          texts={[
            'All duties and taxes included. within the US',
            'Buy now. Pay later with Klarna. ',
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
          All duties and taxes included. within the US
        </div>
      )}
    </div>
  )
}

// --- Main Exported Component ---

export default function MainNav({
  navigation,
}: {
  navigation: NavigationData
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
                  <MobileNav navigation={navigation} />
                </div>

                <div className="lg:hidden">
                  <Logo />
                </div>

                <div className="flex flex-1 items-center justify-end lg:justify-start">
                  <div className="flex lg:flex-row-reverse items-center space-x-4">
                    <SearchBar isOpen={isSearchOpen} onToggle={toggleSearch} />
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      aria-label="User account"
                      >
                      <User className="h-6 w-6" />
                      </Button> */}
                    <UserSession />
                    <DrawerCart />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                  <Logo />
                </div>

                <div className="hidden lg:items-center h-full lg:flex">
                  <DesktopNav navigation={navigation} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
