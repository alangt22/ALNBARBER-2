import { About } from "./_components/about";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/professionals";
import { getProfessional } from "./_data-access/get-professional";

export const revalidate = 120; 

export default async function Home() {

  const professionals = await getProfessional()

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      
      <div>
        <Hero/>

        <About/>
        
        <Professionals professionals={professionals || []}/>

        <Footer/>
      </div>
    </div>
  )
}