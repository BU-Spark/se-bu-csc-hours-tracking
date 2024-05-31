"use client"
import { Typography } from "antd"
import { usePathname } from "next/navigation"

const BodyHeader: React.FC = () => {
    const formatPath = () =>{
        const path = usePathname()
        if(path != null || undefined){
            if(path?.length != null && path.length > 1){
                const formatted = path[1].toUpperCase() + path.substring(2)
                return formatted
            }
            else{
                return 'Dashboard'
            }
        }
        
    }

    return(
        //known issue: the text is a huge h1 for some reason
       <>
       <h3>{formatPath()}</h3>
       </> 
         
       
    )
}

export default BodyHeader