import { LucideIcon } from "lucide-react"

export type SidebarItemsProps = {
    item: {
        label: string,
        icon: LucideIcon,
        href: string
    },
    key: string
}