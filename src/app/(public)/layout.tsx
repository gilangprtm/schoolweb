import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main-content" className="flex flex-col flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
