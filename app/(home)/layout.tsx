import NavBar from '@/components/home/navbar'
import BannerText from '@/components/home/navbar/BannerText'
import MainNav from '@/components/home/navbar/MainNav'
import FadeMenu from '@/components/home/shared/fade-menu'
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
