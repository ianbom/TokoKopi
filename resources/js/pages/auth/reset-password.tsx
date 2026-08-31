import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset kata sandi" />

            <div className="mb-7 border border-hairline-strong bg-surface-soft px-4 py-3 text-[12px] leading-5 text-ink/65">
                <p className="font-semibold text-ink">
                    Buat kata sandi baru untuk akun ini.
                </p>
                <p className="mt-1">
                    Gunakan kata sandi yang belum pernah dipakai. Setelah reset
                    selesai, masuk dengan kata sandi baru.
                </p>
            </div>

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-7">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="h-12 rounded-none border-hairline-strong bg-oat text-[13px] text-ink/65 focus-visible:border-ink focus-visible:ring-0"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                            <p className="text-[11px] leading-5 text-ink/55">
                                Email ini berasal dari tautan reset dan tidak
                                bisa diubah di sini.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                            >
                                Kata sandi
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                autoFocus
                                placeholder="Kata sandi"
                            />
                            <InputError message={errors.password} />
                            <p className="text-[11px] leading-5 text-ink/55">
                                Gunakan minimal 8 karakter dengan kombinasi
                                huruf, angka, atau simbol.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                            >
                                Konfirmasi kata sandi
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                placeholder="Konfirmasi kata sandi"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            {processing
                                ? 'Mereset kata sandi...'
                                : 'Reset kata sandi'}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset kata sandi',
    description:
        'Masukkan dan konfirmasi kata sandi baru untuk mengakses kembali akunmu.',
};
