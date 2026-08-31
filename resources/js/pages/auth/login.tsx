import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { redirect as googleRedirect } from '@/routes/auth/google';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Masuk" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="border border-primary-border bg-primary-soft px-4 py-3 text-[11px] leading-5 text-ink">
                                {status}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="email"
                                    className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    Alamat email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@email.com"
                                    className="h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2.5">
                                <div className="flex items-center justify-between gap-4">
                                    <label
                                        htmlFor="password"
                                        className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                    >
                                        Kata sandi
                                    </label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-[9px] font-semibold tracking-[0.08em] text-primary uppercase no-underline hover:text-primary-hover"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi"
                                    className="h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-4 rounded-none border-ink data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-[12px] text-ink/75"
                                >
                                    Ingat saya
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        <div className="relative py-1 text-center">
                            <div className="absolute inset-x-0 top-1/2 border-t border-hairline" />
                            <span className="relative bg-canvas px-4 text-[10px] text-ink/55">
                                atau
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full rounded-none border-ink bg-transparent text-[10px] font-semibold tracking-[0.08em] text-ink uppercase shadow-none hover:bg-ink hover:text-canvas"
                            tabIndex={1}
                            onClick={() => {
                                window.location.href = googleRedirect.url();
                            }}
                        >
                            <svg
                                aria-hidden="true"
                                className="size-4"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M21.35 11.1h-9.18v2.98h5.29c-.23 1.6-1.6 4.69-5.29 4.69-3.18 0-5.78-2.63-5.78-5.88S8.99 7 12.17 7c1.81 0 3.03.77 3.72 1.44l2.53-2.44c-1.62-1.51-3.72-2.44-6.25-2.44C7.01 3.56 2.82 7.74 2.82 12.9s4.19 9.34 9.35 9.34c5.39 0 8.96-3.79 8.96-9.13 0-.61-.07-1.08-.15-1.55z"
                                />
                            </svg>
                            Masuk dengan Google
                        </Button>

                        {canRegister && (
                            <p className="text-center text-[12px] text-ink/65">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-semibold text-primary no-underline hover:text-primary-hover"
                                >
                                    Buat akun
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Masuk',
    description:
        'Masuk untuk menyimpan ritual kopi dan melanjutkan pesanan Anda.',
    breadcrumbs: [
        { label: 'Beranda', href: home() },
        { label: 'Akun' },
        { label: 'Masuk' },
    ],
};
