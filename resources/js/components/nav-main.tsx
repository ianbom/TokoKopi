import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export type NavGroup = {
    title: string;
    items: NavItem[];
};

export function NavMain({
    items = [],
    groups,
}: {
    items?: NavItem[];
    groups?: NavGroup[];
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const navGroups = groups ?? [{ title: 'Platform', items }];

    return (
        <>
            {navGroups.map((group) => (
                <SidebarGroup key={group.title} className="px-1 py-2">
                    <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-[0.16em] text-white/75 uppercase">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentOrParentUrl(
                                            item.href,
                                        )}
                                        tooltip={{ children: item.title }}
                                        className="relative h-9 rounded-[6px] text-[13px] font-medium text-white transition-colors duration-200 before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary-foreground data-[active=true]:before:bg-sidebar-primary-foreground"
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}
