import { Head, Link, useForm } from '@inertiajs/react';
import Highlight from '@tiptap/extension-highlight';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    ArrowLeft,
    Bold,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Plus,
    Redo2,
    Save,
    Trash2,
    Undo2,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, show, store, update } from '@/routes/admin/products';

type Option = { id: number; name: string };
type ImageRow = {
    id?: number;
    image_url: string | null;
    sort_order: number;
    is_primary: boolean;
    image: File | null;
};
type VariantRow = {
    id?: number;
    sku: string;
    net_weight: string;
    grind_type: string;
    regular_price: string | number;
    sale_price: string | number;
    shipping_weight_gram: string | number;
    image_url: string;
    is_active: boolean;
    stock_quantity: string | number;
    low_stock_threshold: string | number;
    image: File | null;
};
type Product = {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    origin: string | null;
    process: string | null;
    description: string | null;
    status: string;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    category_ids: number[];
    images: ImageRow[];
    variants: VariantRow[];
};
type Props = {
    mode: 'create' | 'edit';
    product: Product | null;
    options: { categories: Option[]; statuses: string[]; grindTypes: string[] };
};
type FormData = Omit<Product, 'id' | 'images' | 'variants'> & {
    images: ImageRow[];
    variants: VariantRow[];
};

const blankImage = (): ImageRow => ({
    image_url: null,
    sort_order: 0,
    is_primary: true,
    image: null,
});
const blankVariant = (): VariantRow => ({
    sku: '',
    net_weight: '',
    grind_type: 'whole_bean',
    regular_price: '',
    sale_price: '',
    shipping_weight_gram: '',
    image_url: '',
    is_active: true,
    stock_quantity: '',
    low_stock_threshold: 5,
    image: null,
});
const value = (item: unknown) => (item == null ? '' : String(item));

export default function ProductForm({ mode, product, options }: Props) {
    const form = useForm<FormData>({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        sku: product?.sku ?? '',
        origin: product?.origin ?? '',
        process: product?.process ?? '',
        description: product?.description ?? '',
        status: product?.status ?? 'draft',
        is_featured: product?.is_featured ?? false,
        is_new_arrival: product?.is_new_arrival ?? false,
        is_best_seller: product?.is_best_seller ?? false,
        category_ids: product?.category_ids ?? [],
        images: product?.images?.map((image) => ({
            ...image,
            image: null,
        })) ?? [blankImage()],
        variants: product?.variants?.map((variant) => ({
            ...variant,
            net_weight: value(variant.net_weight),
            grind_type: value(variant.grind_type),
            regular_price: value(variant.regular_price),
            sale_price: value(variant.sale_price),
            shipping_weight_gram: value(variant.shipping_weight_gram),
            stock_quantity: value(variant.stock_quantity),
            low_stock_threshold: value(variant.low_stock_threshold),
            image: null,
        })) ?? [blankVariant()],
    });
    const errors = form.errors as Record<string, string | undefined>;
    const setField = <Key extends keyof FormData>(
        field: Key,
        fieldValue: FormData[Key],
    ) => form.setData(field, fieldValue as never);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) =>
            mode === 'create' ? data : { ...data, _method: 'put' },
        );
        form.post(mode === 'create' ? store.url() : update.url(product!.id), {
            forceFormData: true,
        });
    };
    const patchImage = (imageIndex: number, patch: Partial<ImageRow>) =>
        setField(
            'images',
            form.data.images.map((image, index) =>
                index === imageIndex ? { ...image, ...patch } : image,
            ),
        );
    const patchVariant = (variantIndex: number, patch: Partial<VariantRow>) =>
        setField(
            'variants',
            form.data.variants.map((variant, index) =>
                index === variantIndex ? { ...variant, ...patch } : variant,
            ),
        );
    const toggleCategory = (categoryId: number, checked: boolean) =>
        setField(
            'category_ids',
            checked
                ? [...form.data.category_ids, categoryId]
                : form.data.category_ids.filter((id) => id !== categoryId),
        );

    return (
        <>
            <Head title={mode === 'create' ? 'Tambah Produk' : 'Edit Produk'} />
            <main className="w-full space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog kopi
                        </p>
                        <h1 className="font-serif text-3xl">
                            {mode === 'create'
                                ? 'Tambah Produk'
                                : 'Edit Produk'}
                        </h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={mode === 'edit' ? show(product!) : index()}>
                            <ArrowLeft /> Kembali
                        </Link>
                    </Button>
                </header>
                <form onSubmit={submit} className="w-full space-y-6">
                    <section className="grid gap-4 border bg-canvas p-5 lg:grid-cols-3">
                        <Field label="Nama produk" error={errors.name}>
                            <Input
                                placeholder="Contoh: Deklase Gayo Natural"
                                value={form.data.name}
                                onChange={(event) =>
                                    setField('name', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Slug" error={errors.slug}>
                            <Input
                                placeholder="Deklase-gayo-natural"
                                value={form.data.slug}
                                onChange={(event) =>
                                    setField('slug', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="SKU" error={errors.sku}>
                            <Input
                                placeholder="DCL-GAYO-250"
                                value={form.data.sku ?? ''}
                                onChange={(event) =>
                                    setField('sku', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Origin" error={errors.origin}>
                            <Input
                                placeholder="Aceh Gayo"
                                value={form.data.origin ?? ''}
                                onChange={(event) =>
                                    setField('origin', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Process" error={errors.process}>
                            <Input
                                placeholder="Natural anaerobic"
                                value={form.data.process ?? ''}
                                onChange={(event) =>
                                    setField('process', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Status" error={errors.status}>
                            <select
                                className="h-9 border bg-canvas px-3 text-sm"
                                value={form.data.status}
                                onChange={(event) =>
                                    setField('status', event.target.value)
                                }
                            >
                                {options.statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Kategori"
                            error={errors.category_ids}
                            className="lg:col-span-3"
                        >
                            <div className="grid gap-2 border bg-surface-soft p-3 sm:grid-cols-2 lg:grid-cols-4">
                                {options.categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.data.category_ids.includes(
                                                category.id,
                                            )}
                                            onChange={(event) =>
                                                toggleCategory(
                                                    category.id,
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        {category.name}
                                    </label>
                                ))}
                            </div>
                        </Field>
                        <Field
                            label="Deskripsi"
                            error={errors.description}
                            className="lg:col-span-3"
                        >
                            <RichTextEditor
                                content={form.data.description ?? ''}
                                onChange={(html) =>
                                    setField('description', html)
                                }
                            />
                        </Field>
                        <div className="flex flex-wrap gap-5 text-sm lg:col-span-3">
                            {(
                                [
                                    'is_featured',
                                    'is_new_arrival',
                                    'is_best_seller',
                                ] as const
                            ).map((field) => (
                                <label
                                    key={field}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.data[field]}
                                        onChange={(event) =>
                                            setField(
                                                field,
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    {field.replaceAll('_', ' ')}
                                </label>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-4 border bg-canvas p-5">
                        <SectionTitle
                            title="Gambar produk"
                            onAdd={() =>
                                setField('images', [
                                    ...form.data.images,
                                    {
                                        ...blankImage(),
                                        is_primary:
                                            form.data.images.length === 0,
                                    },
                                ])
                            }
                        />
                        <div className="grid gap-4 xl:grid-cols-2">
                            {form.data.images.map((image, imageIndex) => (
                                <div
                                    key={image.id ?? imageIndex}
                                    className="grid gap-4 border p-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                                >
                                    <ImagePreview
                                        file={image.image}
                                        url={image.image_url}
                                        alt={form.data.name || 'Pratinjau kopi'}
                                    />
                                    <div className="grid gap-3">
                                        <Field
                                            label="File gambar"
                                            error={
                                                errors[
                                                `images.${imageIndex}.image`
                                                ]
                                            }
                                        >
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) =>
                                                    patchImage(imageIndex, {
                                                        image:
                                                            event.target
                                                                .files?.[0] ??
                                                            null,
                                                    })
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="Urutan"
                                            error={
                                                errors[
                                                `images.${imageIndex}.sort_order`
                                                ]
                                            }
                                        >
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={value(image.sort_order)}
                                                onChange={(event) =>
                                                    patchImage(imageIndex, {
                                                        sort_order: Number(
                                                            event.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </Field>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="primary_image"
                                                    checked={image.is_primary}
                                                    onChange={() =>
                                                        setField(
                                                            'images',
                                                            form.data.images.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => ({
                                                                    ...item,
                                                                    is_primary:
                                                                        index ===
                                                                        imageIndex,
                                                                }),
                                                            ),
                                                        )
                                                    }
                                                />
                                                Gambar utama
                                            </label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setField(
                                                        'images',
                                                        form.data.images.filter(
                                                            (_, index) =>
                                                                index !==
                                                                imageIndex,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Trash2 /> Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-4 border bg-canvas p-5">
                        <SectionTitle
                            title="Varian dan stok"
                            onAdd={() =>
                                setField('variants', [
                                    ...form.data.variants,
                                    blankVariant(),
                                ])
                            }
                        />
                        <div className="grid gap-4">
                            {form.data.variants.map((variant, variantIndex) => (
                                <div
                                    key={variant.id ?? variantIndex}
                                    className="grid gap-4 border p-4 lg:grid-cols-4"
                                >
                                    <Field
                                        label="SKU"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.sku`
                                            ]
                                        }
                                    >
                                        <Input
                                            placeholder="DCL-GAYO-250-WB"
                                            value={variant.sku}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    sku: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Berat bersih"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.net_weight`
                                            ]
                                        }
                                    >
                                        <Input
                                            placeholder="250gram"
                                            value={variant.net_weight}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    net_weight:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Grind type"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.grind_type`
                                            ]
                                        }
                                    >
                                        <select
                                            className="h-9 border bg-canvas px-3 text-sm"
                                            value={variant.grind_type}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    grind_type:
                                                        event.target.value,
                                                })
                                            }
                                        >
                                            {options.grindTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field
                                        label="Harga normal"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.regular_price`
                                            ]
                                        }
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="95000"
                                            value={value(variant.regular_price)}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    regular_price:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Harga promo"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.sale_price`
                                            ]
                                        }
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="85000"
                                            value={value(variant.sale_price)}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    sale_price:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Berat kirim (gram)"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.shipping_weight_gram`
                                            ]
                                        }
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="300"
                                            value={value(
                                                variant.shipping_weight_gram,
                                            )}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    shipping_weight_gram:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Stok"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.stock_quantity`
                                            ]
                                        }
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="20"
                                            value={value(
                                                variant.stock_quantity,
                                            )}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    stock_quantity:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Batas stok rendah"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.low_stock_threshold`
                                            ]
                                        }
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="5"
                                            value={value(
                                                variant.low_stock_threshold,
                                            )}
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    low_stock_threshold:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="File gambar varian"
                                        error={
                                            errors[
                                            `variants.${variantIndex}.image`
                                            ]
                                        }
                                        className="lg:col-span-2"
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                patchVariant(variantIndex, {
                                                    image:
                                                        event.target
                                                            .files?.[0] ?? null,
                                                })
                                            }
                                        />
                                    </Field>
                                    <div className="flex items-end gap-4">
                                        <label className="flex h-9 items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={variant.is_active}
                                                onChange={(event) =>
                                                    patchVariant(variantIndex, {
                                                        is_active:
                                                            event.target
                                                                .checked,
                                                    })
                                                }
                                            />
                                            Aktif
                                        </label>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                                setField(
                                                    'variants',
                                                    form.data.variants.filter(
                                                        (_, index) =>
                                                            index !==
                                                            variantIndex,
                                                    ),
                                                )
                                            }
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing}>
                            <Save /> Simpan
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

function RichTextEditor({
    content,
    onChange,
}: {
    content: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Highlight],
        content,
        editorProps: {
            attributes: {
                class: 'min-h-40 px-3 py-2 text-sm leading-6 outline-none',
            },
        },
        onUpdate: ({ editor: updatedEditor }) =>
            onChange(updatedEditor.getHTML()),
    });
    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border bg-canvas">
            <div className="flex flex-wrap gap-1 border-b p-2">
                <EditorButton
                    editor={editor}
                    label="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Highlight"
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                >
                    <Highlighter />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Bullets"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Numbered list"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 />
                </EditorButton>
            </div>
            <div className="relative">
                <EditorContent editor={editor} />
                {editor.isEmpty && (
                    <span className="pointer-events-none absolute top-2 left-3 text-sm text-muted-soft">
                        Ceritakan rasa, aroma, dan karakter kopi ini.
                    </span>
                )}
            </div>
        </div>
    );
}

function EditorButton({
    editor,
    label,
    onClick,
    children,
}: {
    editor: Editor;
    label: string;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={label}
            disabled={!editor.isEditable}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}
function ImagePreview({
    file,
    url,
    alt,
}: {
    file: File | null;
    url: string | null;
    alt: string;
}) {
    const preview = useMemo(
        () => (file ? URL.createObjectURL(file) : url),
        [file, url],
    );

    useEffect(() => {
        if (!file || !preview) {
            return;
        }

        return () => URL.revokeObjectURL(preview);
    }, [file, preview]);

    return (
        <div className="aspect-square overflow-hidden border bg-surface-soft">
            {preview ? (
                <img
                    src={preview}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="grid h-full place-items-center px-4 text-center text-xs text-muted-soft">
                    Pilih foto kopi.
                </div>
            )}
        </div>
    );
}
function Field({
    label,
    error,
    className = '',
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={`grid gap-1.5 ${className}`}>
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
function SectionTitle({ title, onAdd }: { title: string; onAdd: () => void }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold">{title}</h2>
            <Button type="button" variant="outline" onClick={onAdd}>
                <Plus /> Tambah
            </Button>
        </div>
    );
}
