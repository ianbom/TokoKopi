import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi kata sandi" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-7">
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
                                placeholder="Kata sandi"
                                autoComplete="current-password"
                                autoFocus
                                className="h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Konfirmasi kata sandi
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi kata sandi',
    description:
        'Ini area aman aplikasi. Konfirmasi kata sandi sebelum melanjutkan.',
};
