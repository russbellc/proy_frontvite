import { BarChart4, Building2, Calendar, CircleHelpIcon, PanelsTopLeft, Settings, ShieldCheck } from "lucide-react";



export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Building2,
        label: "Empresa",
        href: "/empresa"
    },
    {
        icon: Calendar,
        label: "Calendario",
        href: "/calendario"
    },
]

export const dataToolsSidebar = [
    {
        icon: CircleHelpIcon,
        label: "Preguntas",
        href: "/preguntas"
    },
    {
        icon: BarChart4,
        label: "Analisis",
        href: "/analisis"
    },
]

export const dataSupportSidebar = [
    {
        icon: Settings,
        label: "Configuracion",
        href: "/config"
    },
    {
        icon: ShieldCheck,
        label: "Seguridad",
        href: "/seguridad"
    },
]