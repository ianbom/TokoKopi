export type VariantOption = {
    id: number;
    net_weight: string | null;
    grind_type: string | null;
    available_stock: number;
    regular_price: number;
    sale_price: number | null;
    image_url?: string | null;
};

export function getVariantSelection(
    variants: VariantOption[],
    weight: string | null | undefined,
    grind: string | null | undefined,
) {
    const firstAvailable = variants.find(
        (variant) => variant.available_stock > 0,
    );
    const weightVariants = variants.filter(
        (variant) => (variant.net_weight || null) === weight,
    );
    const requiresGrind = weightVariants.some((variant) =>
        Boolean(variant.grind_type),
    );
    const variant =
        weightVariants
            .filter(
                (candidate) =>
                    candidate.available_stock > 0 &&
                    (requiresGrind
                        ? grind !== undefined &&
                          (candidate.grind_type || null) === grind
                        : !candidate.grind_type),
            )
            .sort((first, second) => first.id - second.id)[0] ?? null;
    const pricedVariants = weightVariants.some(
        (candidate) => candidate.available_stock > 0,
    )
        ? weightVariants.filter((candidate) => candidate.available_stock > 0)
        : weightVariants;
    const previewVariant =
        [...pricedVariants].sort(
            (first, second) =>
                (first.sale_price ?? first.regular_price) -
                    (second.sale_price ?? second.regular_price) ||
                first.id - second.id,
        )[0] ?? null;

    return {
        initialWeight: firstAvailable
            ? firstAvailable.net_weight || null
            : undefined,
        weights: [
            ...new Set(
                variants.map((candidate) => candidate.net_weight || null),
            ),
        ].map((value) => ({
            value,
            available: variants.some(
                (candidate) =>
                    (candidate.net_weight || null) === value &&
                    candidate.available_stock > 0,
            ),
        })),
        grinds: [
            ...new Set(
                variants.map((candidate) => candidate.grind_type || null),
            ),
        ].map((value) => ({
            value,
            exists: weightVariants.some(
                (candidate) => (candidate.grind_type || null) === value,
            ),
            available: weightVariants.some(
                (candidate) =>
                    (candidate.grind_type || null) === value &&
                    candidate.available_stock > 0,
            ),
        })),
        requiresGrind,
        variant,
        previewVariant,
        previewPrice: previewVariant
            ? (previewVariant.sale_price ?? previewVariant.regular_price)
            : null,
    };
}
