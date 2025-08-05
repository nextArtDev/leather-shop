import NavBar from '@/components/home/navbar'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className=" ">
      <NavBar />
      {children}
    </section>
  )
}
