import { Head, Link, useForm } from '@inertiajs/react';
import { BarChart3, Download, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/pages/admin/catalog/shared';
import { exportMethod, index as reportIndex } from '@/routes/admin/reports';

type Metric = { label: string; value: number; format: 'currency' | 'number' };
type ReportTable = {
    title: string;
    columns: string[];
    rows: Record<string, unknown>[];
};

type Props = {
    type: string;
    tabs: string[];
    filters: {
        date_from: string;
        date_to: string;
        payment_status: string;
        order_status: string;
        category_id: string;
    };
    options: {
        paymentStatuses: string[];
        orderStatuses: string[];
        categories: { id: number; name: string }[];
    };
    report: { metrics: Metric[]; tables: ReportTable[] };
};

function metricValue(metric: Metric) {
    return metric.format === 'currency'
        ? formatPrice(metric.value)
        : new Intl.NumberFormat('id-ID').format(metric.value);
}

function titleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ReportIndex({
    type,
    tabs,
    filters,
    options,
    report,
}: Props) {
    const { data, setData, get, processing } = useForm(filters);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        get(reportIndex.url(type), { preserveState: true, replace: true });
    };

    const query = new URLSearchParams(
        Object.entries(data).filter(([, value]) => value !== ''),
    ).toString();

    return (
        <>
            <Head title={`${type} Report`} />
            <main className="flex min-h-[100dvh] flex-1 flex-col gap-6 bg-canvas p-4 text-ink md:p-6">
                <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            <BarChart3 className="size-4" strokeWidth={1.7} />
                            Reports
                        </p>
                        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
                            {titleCase(type)} Report
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Ringkasan data toko untuk order, produk, customer,
                            shipment, dan voucher.
                        </p>
                    </div>

                    <Button
                        asChild
                        className="h-10 w-full rounded-[6px] bg-primary px-5 text-[12px] font-semibold tracking-[0.08em] text-white uppercase shadow-none hover:bg-[#E67312] active:scale-[0.98] sm:w-auto"
                    >
                        <a
                            href={exportMethod.url(type, {
                                query: Object.fromEntries(
                                    new URLSearchParams(query),
                                ),
                            })}
                        >
                            <Download className="size-4" /> Export CSV
                        </a>
                    </Button>
                </header>

                <nav className="grid grid-cols-5 rounded-[6px] border border-hairline-strong bg-white p-1 sm:flex">
                    {tabs.map((tab) => (
                        <Link
                            key={tab}
                            href={reportIndex(tab)}
                            className={`h-8 rounded-[4px] px-2 text-center text-xs font-semibold transition-colors sm:px-3 ${
                                tab === type
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'text-muted-foreground hover:bg-surface-soft hover:text-ink'
                            }`}
                        >
                            {titleCase(tab)}
                        </Link>
                    ))}
                </nav>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-end"
                >
                    <Input
                        type="date"
                        value={data.date_from}
                        onChange={(event) =>
                            setData('date_from', event.target.value)
                        }
                        className="h-9 w-full cursor-pointer rounded-[6px] border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
                    />
                    <Input
                        type="date"
                        value={data.date_to}
                        onChange={(event) =>
                            setData('date_to', event.target.value)
                        }
                        className="h-9 w-full cursor-pointer rounded-[6px] border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
                    />
                    <select
                        value={data.payment_status}
                        onChange={(event) =>
                            setData('payment_status', event.target.value)
                        }
                        className="h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
                    >
                        <option value="">All payment</option>
                        {options.paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.order_status}
                        onChange={(event) =>
                            setData('order_status', event.target.value)
                        }
                        className="h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
                    >
                        <option value="">All order</option>
                        {options.orderStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.category_id}
                        onChange={(event) =>
                            setData('category_id', event.target.value)
                        }
                        className="h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
                    >
                        <option value="">All categories</option>
                        {options.categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="submit"
                        disabled={processing}
                        variant="outline"
                        className="h-9 w-full rounded-[6px] border-hairline-strong bg-white px-4 text-body shadow-none hover:bg-surface-soft hover:text-ink active:scale-[0.98] lg:w-auto"
                    >
                        <Search className="size-4" /> Apply
                    </Button>
                </form>

                <section className="grid overflow-hidden rounded-[8px] border border-hairline-strong bg-white sm:grid-cols-2 xl:grid-cols-5">
                    {report.metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="border-r border-b border-hairline-strong px-4 py-4 last:border-r-0 sm:px-5 sm:py-5"
                        >
                            <p className="text-sm font-semibold text-muted-foreground">
                                {metric.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
                                {metricValue(metric)}
                            </p>
                        </div>
                    ))}
                </section>

                {report.tables.map((table) => (
                    <section
                        key={table.title}
                        className="rounded-[8px] border border-hairline-strong p-4 sm:p-5"
                    >
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-ink">
                                    {table.title}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {table.rows.length} rows
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 overflow-x-auto rounded-[8px] border-y border-hairline-strong">
                            <table className="admin-table w-full min-w-[760px] text-sm">
                                <thead className="border-b border-hairline-strong bg-surface-soft text-xs tracking-wider text-muted-foreground uppercase">
                                    <tr className="text-left">
                                        <th className="w-14 py-4 pr-4 pl-4 font-semibold">
                                            No
                                        </th>
                                        {table.columns.map((column) => (
                                            <th
                                                key={column}
                                                className="py-4 pr-4 font-semibold"
                                            >
                                                {column.replaceAll('_', ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.rows.map((row, index) => (
                                        <tr
                                            key={index}
                                            className="transition-colors hover:bg-primary-soft"
                                        >
                                            <td className="py-4 pr-4 pl-4 text-xs font-medium text-muted-foreground">
                                                {index + 1}
                                            </td>
                                            {table.columns.map((column) => (
                                                <td
                                                    key={column}
                                                    className="py-4 pr-4 text-body"
                                                >
                                                    {formatCell(
                                                        column,
                                                        row[column],
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {table.rows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={
                                                    table.columns.length + 1
                                                }
                                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                                            >
                                                No report data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ))}
            </main>
        </>
    );
}

function formatCell(column: string, value: unknown) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (
        ['grand_total', 'revenue', 'total_spending', 'total_discount'].includes(
            column,
        )
    ) {
        return formatPrice(Number(value));
    }

    return String(value);
}
