import NavBar from '@/components/home/navbar'
import BannerText from '@/components/home/navbar/BannerText'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="relative w-full h-full ">
      {/* <NavBar /> */}
      {children}
    </section>
  )
}
