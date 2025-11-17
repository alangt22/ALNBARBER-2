import { SidebarDashboard } from "./_components/sidebar"


export default function DashboarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return(
        <>
            <SidebarDashboard>
                {children}
            </SidebarDashboard>
        </>
    )
}