// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa kata sandi" />

            {status && (
                <div className="mb-6 border border-primary/30 bg-primary-soft px-4 py-3 text-[12px] leading-5 text-primary">
                    {status}
                </div>
            )}

            <div className="space-y-7">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[10px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    Alamat email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="h-12 rounded-none border-hairline-strong bg-canvas text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-7 flex items-center justify-start">
                                <Button
                                    className="h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Kirim tautan reset kata sandi
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-[12px] text-ink/65">
                    <span>Atau, kembali ke</span>
                    <TextLink
                        href={login()}
                        className="font-semibold text-primary no-underline hover:text-primary-hover"
                    >
                        masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa kata sandi',
    description: 'Masukkan email untuk menerima tautan reset kata sandi',
};
