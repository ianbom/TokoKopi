import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="name"
                                    className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    Nama lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-0"
                                />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@email.com"
                                    className="h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="password"
                                    className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    Kata sandi
                                </label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Buat kata sandi"
                                    className="h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2.5">
                                <label
                                    htmlFor="password_confirmation"
                                    className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    Konfirmasi kata sandi
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    className="h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat akun
                            </Button>
                        </div>

                        <p className="text-center text-[12px] text-ink/65">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-semibold text-primary no-underline hover:text-primary-hover"
                            >
                                Masuk
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun',
    description:
        'Simpan preferensi kopi dan buat setiap pembelian lebih mudah.',
    breadcrumbs: [
        { label: 'Beranda', href: home() },
        { label: 'Akun' },
        { label: 'Daftar' },
    ],
};
