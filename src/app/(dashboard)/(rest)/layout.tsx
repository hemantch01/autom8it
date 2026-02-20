import { AppHeader } from "@/components/byMe/topBar";

const Layout = ({children}:{children:React.ReactNode;})=>{
    return (
            <>
                <AppHeader/>
                <main>
                    {children}
                </main>
            </>
    )
}

export default Layout;