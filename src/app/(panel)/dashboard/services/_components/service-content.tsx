import { LabelSubscription } from "@/components/ui/label-subscription";
import { getAllServices } from "../_data-access/get-all-services";
import { ServicesList } from "./services-list";
import { canPermission} from '@/utils/permissions/canPermission'

interface ServicesContentProps{
    userId: string;
}

export async function ServicesContent({userId}:ServicesContentProps) {

    const services = await getAllServices({userId: userId})
    const permission  = await canPermission({type: "service"})
    

    return(
       <>   {/* {permission.planId === "TRIAL" && (
                <div>
                    <h3>
                        Você esta no plano de teste
                    </h3>
                </div>
            )} */}
            {!permission.hasPermission && (
                <LabelSubscription expired={permission.expired}/>
            )}
            <ServicesList services={services.data || []} permission={permission}/>
       </>
    )
}