import { AppSidebar } from "@/components/byMe/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const Layout = ({children}:{children:React.ReactNode;})=>{
    return (
        <SidebarProvider>
         <AppSidebar/>
         <SidebarInset>
            {children}
            </SidebarInset>   
        </SidebarProvider>
    )
}

export default Layout;