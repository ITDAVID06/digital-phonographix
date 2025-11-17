import { motion } from "framer-motion";
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head } from '@inertiajs/react';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100">
            <Head title="Login" />

            {/* Left Side – Fun animated gradient and title */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 items-center justify-center flex-col text-center p-8"
            >
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-5xl font-extrabold text-white drop-shadow-lg mb-4"
                >
                    🌈 Digital Phono-Graphix
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-white text-lg max-w-md drop-shadow-md"
                >
                    Making reading and spelling fun, interactive, and magical for kids! ✨
                </motion.p>

                <motion.div
                    className="mt-8 flex space-x-4 text-4xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                    }}
                >
                    <span>⭐</span>
                    <span>🌟</span>
                    <span>💫</span>
                    <span>🎨</span>
                </motion.div>
            </motion.div>

            {/* Right Side – Animated Form Section */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="flex w-full md:w-1/2 bg-white items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-md p-10"
                >
                    <h2 className="text-3xl font-extrabold text-purple-600 text-center mb-2">
                        Welcome Back! 👋
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Continue your learning journey today!
                    </p>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-foreground"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-foreground">Password</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-sm text-purple-600 hover:text-purple-800"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-foreground"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember" className="text-foreground">Remember me</Label>
                                </div> 

                                {/* Submit Button */}
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Button
                                        type="submit"
                                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full py-3 transition-all"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log In
                                    </Button>
                                </motion.div>

                                {/* Register Link */}
                                {canRegister && (
                                    <div className="text-center text-sm text-gray-500">
                                        Don’t have an account?{' '}
                                        <TextLink
                                            href={register()}
                                            className="text-purple-600 font-medium hover:text-purple-800"
                                            tabIndex={5}
                                        >
                                            Sign up
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
