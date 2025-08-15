'use client'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'وضعیت کلی',
      url: '/dashboard/overview',
      items: [
        {
          title: 'وضعیت کلی',
          url: '/dashboard/overview',
        },
        // {
        //   title: 'Project Structure',
        //   url: '#',
        // },
      ],
    },
    {
      title: 'محصولات',
      url: '/dashboard/products',
      items: [
        {
          title: 'محصولات',
          url: '/dashboard/products',
        },
        {
          title: 'دسته‌بندی',
          url: '/dashboard/categories',
          // isActive: true,
        },
        {
          title: 'زیر دسته‌بندی',
          url: '/dashboard/sub-categories',
          // isActive: true,
        },
        // {
        //   title: 'Rendering',
        //   url: '#',
        // },
      ],
    },
    {
      title: 'سفارشها',
      url: '/dashboard/orders',
      items: [
        {
          title: 'سفارشها',
          url: '/dashboard/orders',
        },
      ],
    },
    {
      title: 'تخفیها',
      url: '/dashboard/coupons',
      items: [
        {
          title: 'کوپن تخفیف',
          url: '/dashboard/coupons',
        },
      ],
    },
    {
      title: 'کاربران',
      url: '/dashboard/users',
      items: [
        {
          title: 'ورود',
          url: '/sign-in',
        },

        {
          title: 'Turbopack',
          url: '#',
        },
      ],
    },
  ],
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar side="right" {...props}>
      <SidebarHeader>{/* <SearchForm /> */}</SidebarHeader>
      <SidebarContent className=" font-bold">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/* <SidebarMenuButton asChild isActive={item?.isActive}> */}
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.url)}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
