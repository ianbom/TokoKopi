import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    CheckCircle2,
    Clock,
    Plus,
    RotateCcw,
    Search,
    Send,
    Tag,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/pages/admin/catalog/shared';
import type { Paginated } from '@/pages/admin/marketing/shared';

type Notification = {
    id: number;
    customer: string | null;
    customer_email: string | null;
    title: string;
    message: string;
    type: string;
    reference_type: string | null;
    reference_id: number | null;
    is_read: boolean;
    created_at: string | null;
};

type Props = {
    notifications: Paginated<Notification>;
    filters: Record<string, string>;
    types: string[];
};

const getTypeConfig = (type: string) => {
    const safeType = type || 'notification';

    if (safeType.includes('order')) {
        return {
            dot: 'bg-blue-400',
            text: 'text-blue-700',
            bg: 'bg-blue-50 border-blue-100',
        };
    }

    if (safeType.includes('payment')) {
        return {
            dot: 'bg-emerald-400',
            text: 'text-emerald-700',
            bg: 'bg-emerald-50 border-emerald-100',
        };
    }

    if (safeType.includes('promo') || safeType.includes('voucher')) {
        return {
            dot: 'bg-purple-400',
            text: 'text-purple-700',
            bg: 'bg-purple-50 border-purple-100',
        };
    }

    return {
        dot: 'bg-zinc-400',
        text: 'text-zinc-600',
        bg: 'bg-zinc-50 border-zinc-200',
    };
};

export default function NotificationsIndex({
    notifications,
    filters,
    types,
}: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search ?? '',
        type: filters.type ?? '',
        read: filters.read ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        get('/admin/notifications', { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        router.get('/admin/notifications', {}, { preserveState: false });
    };

    const readCount = notifications.data.filter(
        (notification) => notification.is_read,
    ).length;
    const unreadCount = notifications.data.length - readCount;
    const uniqueTypes = new Set(
        notifications.data
            .map((notification) => notification.type)
            .filter(Boolean),
    ).size;
    const referencedCount = notifications.data.filter(
        (notification) =>
            notification.reference_type || notification.reference_id,
    ).length;

    const stats = [
        {
            title: 'Total Notifications',
            val: notifications.total,
            sub: 'stored messages',
            icon: Bell,
            iconBg: 'bg-white/20',
            iconColor: 'text-white',
            cardBg: 'bg-gradient-to-br from-[#151515] to-[#9A6B45]',
            subColor: 'text-white/60',
            valColor: 'text-white',
            titleColor: 'text-white/80',
            accent: '',
            featured: true,
        },
        {
            title: 'Unread',
            val: unreadCount,
            sub: 'shown page',
            icon: BellRing,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-500',
            cardBg: 'bg-white',
            subColor: 'text-zinc-400',
            valColor: 'text-blue-500',
            titleColor: 'text-zinc-700',
            accent: 'from-blue-400 to-blue-600',
            featured: false,
        },
        {
            title: 'Read',
            val: readCount,
            sub: 'shown page',
            icon: CheckCircle2,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            cardBg: 'bg-white',
            subColor: 'text-zinc-400',
            valColor: 'text-emerald-600',
            titleColor: 'text-zinc-700',
            accent: 'from-emerald-400 to-emerald-600',
            featured: false,
        },
        {
            title: 'Types',
            val: uniqueTypes,
            sub: 'shown page',
            icon: Tag,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-500',
            cardBg: 'bg-white',
            subColor: 'text-zinc-400',
            valColor: 'text-purple-500',
            titleColor: 'text-zinc-700',
            accent: 'from-purple-400 to-purple-600',
            featured: false,
        },
        {
            title: 'Referenced',
            val: referencedCount,
            sub: 'has source',
            icon: Send,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            cardBg: 'bg-white',
            subColor: 'text-zinc-400',
            valColor: 'text-amber-600',
            titleColor: 'text-zinc-700',
            accent: 'from-amber-400 to-amber-600',
            featured: false,
        },
    ];

    return (
        <>
            <Head title="Notifications" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="mb-1 text-[11px] font-bold tracking-widest text-[#151515]/50 uppercase">
                            Customer Management
                        </p>
                        <h1 className="font-serif text-3xl leading-tight text-zinc-900">
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-zinc-400">
                            Pantau dan kirim notifikasi manual untuk customer
                            atau segment customer aktif.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        <Link href="/admin/notifications/create">
                            <Plus className="h-4 w-4" /> Send Notification
                        </Link>
                    </Button>
                </div>

                <StatsGrid stats={stats} />

                <div className="space-y-4">
                    <form
                        onSubmit={submit}
                        className="flex flex-wrap items-end gap-3"
                    >
                        <FilterSelect
                            label="Type"
                            value={data.type || 'all'}
                            onChange={(value) =>
                                setData('type', value === 'all' ? '' : value)
                            }
                        >
                            <SelectItem value="all">All Types</SelectItem>
                            {types.map((type) => (
                                <SelectItem
                                    key={type}
                                    value={type}
                                    className="capitalize"
                                >
                                    {type.replace(/_/g, ' ')}
                                </SelectItem>
                            ))}
                        </FilterSelect>

                        <FilterSelect
                            label="Read"
                            value={data.read || 'all'}
                            onChange={(value) =>
                                setData('read', value === 'all' ? '' : value)
                            }
                        >
                            <SelectItem value="all">Read Status</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="unread">Unread</SelectItem>
                        </FilterSelect>

                        <div className="relative min-w-[260px] flex-1">
                            <Input
                                value={data.search}
                                onChange={(event) =>
                                    setData('search', event.target.value)
                                }
                                placeholder="Search title, message, customer..."
                                className="max-w-sm"
                            />
                        </div>

                        <div className="ml-auto flex gap-2">
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={processing}
                            >
                                <Search className="h-3.5 w-3.5" /> Search
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="h-3.5 w-3.5" /> Reset
                            </Button>
                        </div>
                    </form>

                    <div className="overflow-x-auto border">
                        <table className="admin-table w-full min-w-[960px] text-sm">
                            <thead className="border-b bg-surface-soft text-left">
                                <tr>
                                    <th className="w-14 px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        No
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Notification
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Read
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Reference
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="flex flex-col items-center justify-center gap-3 py-20">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                                                    <Bell className="h-5 w-5 text-zinc-400" />
                                                </div>
                                                <p className="text-sm text-zinc-400">
                                                    No notifications found. Try
                                                    adjusting your filters.
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs"
                                                    onClick={resetFilters}
                                                >
                                                    <RotateCcw className="mr-1 h-3 w-3" />{' '}
                                                    Clear Filters
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {notifications.data.map(
                                    (notification, index) => {
                                        const typeConfig = getTypeConfig(
                                            notification.type,
                                        );

                                        return (
                                            <tr
                                                key={notification.id}
                                                className="transition-colors hover:bg-zinc-50/70"
                                            >
                                                <td className="px-4 py-3.5 text-xs font-medium text-zinc-400">
                                                    {(notifications.from ?? 1) +
                                                        index}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex max-w-lg flex-col gap-1">
                                                        <span className="font-medium text-zinc-900">
                                                            {notification.title}
                                                        </span>
                                                        <span className="truncate text-xs text-zinc-500">
                                                            {
                                                                notification.message
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium text-zinc-700">
                                                            {notification.customer ??
                                                                '-'}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">
                                                            {notification.customer_email ??
                                                                '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={
                                                            'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ' +
                                                            typeConfig.text +
                                                            ' ' +
                                                            typeConfig.bg
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                'h-1.5 w-1.5 rounded-full ' +
                                                                typeConfig.dot
                                                            }
                                                        />
                                                        {notification.type.replace(
                                                            /_/g,
                                                            ' ',
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <ReadPill
                                                        read={
                                                            notification.is_read
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-col gap-1 text-xs text-zinc-500">
                                                        <span>
                                                            {notification.reference_type ??
                                                                '-'}
                                                        </span>
                                                        <span>
                                                            {notification.reference_id
                                                                ? '#' +
                                                                  notification.reference_id
                                                                : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-zinc-300" />
                                                        {notification.created_at ??
                                                            '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination paginator={notifications} />
                </div>
            </div>
        </>
    );
}

function StatsGrid({ stats }: { stats: Array<Record<string, any>> }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {stats.map((m) => (
                <div key={m.title} className="border bg-canvas p-4">
                    <p className="text-xs text-muted-foreground">{m.title}</p>
                    <p className="text-2xl font-semibold">{m.val}</p>
                </div>
            ))}
        </div>
    );
}

function ReadPill({ read }: { read: boolean }) {
    return (
        <span
            className={
                'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ' +
                (read
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-blue-100 bg-blue-50 text-blue-700')
            }
        >
            <span
                className={
                    'h-1.5 w-1.5 rounded-full ' +
                    (read ? 'bg-emerald-400' : 'bg-blue-400')
                }
            />
            {read ? 'Read' : 'Unread'}
        </span>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    children,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    aria-label={label}
                    className="h-10 w-[180px] rounded-none border bg-canvas px-3 text-sm shadow-none"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>{children}</SelectContent>
            </Select>
        </div>
    );
}
