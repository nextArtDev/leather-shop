import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import { CurrentUserType, NavigationData } from '@/lib/types/home'
import Link from 'next/link'
import { ListItem } from './MainNav'
import { cn } from '@/lib/utils'

type Props = {
  navigation: NavigationData
  session: CurrentUserType
}

const DesktopNav = ({ navigation, session }: Props) => {
  return (
    <div>
      <NavigationMenu dir="rtl" className="hidden lg:block">
        <NavigationMenuList>
          {navigation.categories.map((category) => (
            <NavigationMenuItem key={category.name}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-4 gap-6 p-6 w-[600px] lg:w-[800px]">
                  {category.featured.map((item) => (
                    <ListItem
                      key={item.name}
                      title={item.name}
                      href={item.href}
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75">
                        <Image
                          unoptimized
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
          {session?.id && session?.role === 'ADMIN' && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={'/dashboard'}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-primary text-secondary'
                  )}
                >
                  دشبورد
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default DesktopNav
