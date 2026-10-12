import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';

const controls =
    'input:not([type="hidden"]), select, textarea, [contenteditable="true"], [role="checkbox"]';

function focusField(name: string) {
    let field: HTMLElement | null = null;
    let key = name;

    while (key && !field) {
        field = document.querySelector(`[data-field="${CSS.escape(key)}"]`);
        key = key.includes('.') ? key.slice(0, key.lastIndexOf('.')) : '';
    }

    const control =
        field?.querySelector<HTMLElement>(controls) ??
        field?.querySelector<HTMLElement>('button');
    control?.focus({ preventScroll: true });
    field?.scrollIntoView({ block: 'center', behavior: 'instant' });

    return Boolean(control);
}

export function FormErrorSummary({
    errors,
}: {
    errors: Record<string, string | undefined>;
}) {
    const summary = useRef<HTMLDivElement>(null);
    const entries = Object.entries(errors).filter(
        (entry): entry is [string, string] => Boolean(entry[1]),
    );
    useEffect(() => {
        const first = Object.keys(errors).find((key) => errors[key]);

        if (first && !focusField(first)) {
            summary.current?.focus();
        }
    }, [errors]);

    if (!entries.length) {
        return null;
    }

    return (
        <div
            ref={summary}
            tabIndex={-1}
            role="alert"
            aria-label="Form belum dapat disimpan"
            className="border border-destructive bg-destructive/5 p-4 text-sm"
        >
            <p className="font-semibold">
                Periksa input berikut. Data yang sudah diisi tetap tersimpan di
                form.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
                {entries.map(([name, message]) => (
                    <li key={name}>
                        <button
                            type="button"
                            className="text-left underline underline-offset-2"
                            onClick={() => focusField(name)}
                        >
                            {message}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function FormField({
    name,
    label,
    error,
    className = '',
    children,
    required = false,
    requiredIndicator = 'text',
}: {
    name: string;
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
    required?: boolean;
    requiredIndicator?: 'text' | 'asterisk';
}) {
    const identifier = useId();
    const field = useRef<HTMLDivElement>(null);
    useEffect(() => {
        field.current
            ?.querySelectorAll<HTMLElement>(controls)
            .forEach((control, index) => {
                if (
                    !(
                        control instanceof HTMLInputElement &&
                        ['checkbox', 'radio'].includes(control.type)
                    )
                ) {
                    if (index === 0) {
                        control.id = `${identifier}-input`;
                    }

                    control.setAttribute(
                        'aria-labelledby',
                        `${identifier}-label`,
                    );
                }

                control.setAttribute('aria-invalid', error ? 'true' : 'false');

                if (requiredIndicator === 'asterisk') {
                    control.setAttribute('aria-required', String(required));

                    if (
                        control instanceof HTMLInputElement ||
                        control instanceof HTMLSelectElement ||
                        control instanceof HTMLTextAreaElement
                    ) {
                        control.required = required;
                    }
                }

                if (error) {
                    control.setAttribute(
                        'aria-describedby',
                        `${identifier}-error`,
                    );
                } else {
                    control.removeAttribute('aria-describedby');
                }
            });
    }, [identifier, error, children, required, requiredIndicator]);

    return (
        <div
            ref={field}
            data-field={name}
            className={`grid gap-1.5 ${className}`}
        >
            <label
                id={`${identifier}-label`}
                htmlFor={`${identifier}-input`}
                className="text-sm font-medium"
            >
                {label}
                {required && requiredIndicator === 'asterisk' ? (
                    <span aria-hidden="true" className="ml-1 text-destructive">
                        *
                    </span>
                ) : required === undefined ? (
                    ''
                ) : (
                    ` (${required ? 'wajib' : 'opsional'})`
                )}
            </label>
            {children}
            {error && (
                <p
                    id={`${identifier}-error`}
                    className="text-sm text-destructive"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
