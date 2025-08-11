import MainNav from '@/components/home/navbar/MainNav'
import Footer from '@/components/home/shared/Footer'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="relative w-full h-full ">
      {/* <NavBar /> */}

      <MainNav />
      {children}
      <Footer />
    </section>
  )
}
