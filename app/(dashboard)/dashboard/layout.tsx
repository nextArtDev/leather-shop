import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppSidebar from '../../../components/dashboard/AppSidebar'
import { Separator } from '@/components/ui/separator'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb'
import AdminSearch from '@/components/dashboard/admin-search'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section dir="rtl" className="w-full h-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full">
          <SidebarInset>
            <header className="w-full px-2 flex h-16 shrink-0 items-center gap-2 border-b">
              <SidebarTrigger />
              {/* <p>LOGO</p> */}
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AdminSearch />
              {/* <Breadcrumb>
              <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
              Building Your Application
              </BreadcrumbLink>
              </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb> */}
            </header>
          </SidebarInset>
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
    </section>
  )
}
