import NavBar from './components/Navbar'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="relative w-full h-full ">
      <NavBar />
      {children}
    </section>
  )
}
