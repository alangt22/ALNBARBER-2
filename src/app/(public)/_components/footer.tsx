

export function Footer() {
    return(
        <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
            <p>Todos direitos reservados © {new Date().getFullYear()} - <a href="/" className="hover:text-blue-500 duration-300 font-bold">ALN<span className="text-white">Barber</span></a></p>
        </footer>
    )
}