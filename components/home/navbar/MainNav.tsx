// components/main-nav.tsx
'use client'

import {
  Menu,
  Package2,
  Search,
  ShoppingBag,
  //   X,
  User,
} from 'lucide-react'
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
import useFromStore from '@/hooks/useFromStore'
import { useCartStore } from '@/hooks/useCartStore'

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

interface NavigationData {
  categories: Category[]
  pages: Page[]
}

// --- Component Data ---
const navigation: NavigationData = {
  categories: [
    {
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: '/images/hero-image.jpg',
          imageAlt:
            'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: '/images/hero-image.jpg',
          imageAlt:
            'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc: '/images/hero-image.jpg',
          imageAlt:
            'Model wearing minimalist watch with black wristband and white watch face.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc: '/images/hero-image.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: '/images/hero-image.jpg-01.jpg',
          imageAlt:
            'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: '/images/hero-image.jpg-02.jpg',
          imageAlt: 'Model wearing light heather gray t-shirt.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc: '/images/hero-image.jpg-03.jpg',
          imageAlt:
            'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc: '/images/hero-image.jpg-04.jpg',
          imageAlt:
            'Model putting folded cash into slim card holder olive leather wallet with hand stitching.',
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

// --- Child Components ---

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Package2 className="h-6 w-6" />
    <span className="font-bold inline-block">SEP</span>
  </Link>
)

const DesktopNav = () => (
  <NavigationMenu className="hidden lg:block">
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
          <Link href={page.href} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {page.name}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
)

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="flex flex-col">
      <div className="flex items-center justify-between pr-2">
        <Logo />
        <SheetClose asChild>
          {/* <Button variant="ghost" size="icon" className="rounded-full"> */}
          {/* <X className="h-5 w-5" /> */}
          {/* </Button> */}
        </SheetClose>
      </div>
      <Separator className="my-4" />
      <div className="flex-1 overflow-y-auto">
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
      <div className="space-y-2 px-4">
        <Button asChild variant="default" className="w-full">
          <Link href="#">Create an account</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="#">Sign in</Link>
        </Button>
      </div>
    </SheetContent>
  </Sheet>
)

// --- Main Exported Component ---

export default function MainNav() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const cartItems = useFromStore(useCartStore, (state) => state.cart)
  return (
    <div className="bg-background">
      <header className="relative">
        <nav aria-label="Top">
          {/* Top navigation */}
          <div className="bg-primary text-primary-foreground">
            {/* <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <form>
                <Select defaultValue="CAD">
                  <SelectTrigger className="border-0 bg-transparent text-primary-foreground focus:ring-0 focus:ring-offset-0 h-auto p-0">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </form>

              <div className="hidden lg:flex items-center space-x-6">
                <Button
                  variant="link"
                  asChild
                  className="text-primary-foreground"
                >
                  <Link href="#">Sign in</Link>
                </Button>
                <Button
                  variant="link"
                  asChild
                  className="text-primary-foreground"
                >
                  <Link href="#">Create an account</Link>
                </Button>
              </div>
            </div> */}
            <TextRotate
              texts={[
                'All duties and taxes included. within the US',

                'Buy now. Pay later with Klarna. ',
              ]}
              mainClassName="flex items-center justify-center px-2 sm:px-2 md:px-3   overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg"
              staggerFrom={'last'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitBy="line"
              splitLevelClassName="overflow-hidden line-clamp-2  text-center py-auto pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={5000}
            />
          </div>

          {/* Secondary navigation */}
          <div className=" ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center lg:hidden">
                  <MobileNav />
                </div>

                <div className="hidden lg:items-center h-full lg:flex  ">
                  <DesktopNav />
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center ">
                  <Logo />
                </div>
                <div className="lg:hidden">
                  <Logo />
                </div>

                <div className="flex flex-1 items-center justify-end">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Search"
                      aria-expanded={isSearchOpen}
                      onClick={() => setIsSearchOpen((prev) => !prev)}
                    >
                      <Search className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Help">
                      <User className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Cart"
                      className="relative "
                      asChild
                    >
                      <Link href={'/cart'}>
                        <ShoppingBag className="h-4 w-4" />
                        <span className="ml-1 w-fit h-fit p-1 text-sm font-medium text-red-500 rounded-full absolute left-1.5 -top-1.5 ">
                          {cartItems?.length ?? null}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* This is the new collapsible search panel */}
        <Collapsible
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          className="absolute top-full left-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10"
        >
          <CollapsibleContent>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="w-full pl-10 h-12"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </header>
    </div>
  )
}

// Custom ListItem component for NavigationMenu, now using Next.js Link
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
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
            Shop Now
          </p>
        </Link>
      </NavigationMenuLink>
    </div>
  )
})
ListItem.displayName = 'ListItem'
