import { motion } from "framer-motion";
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100">
            <Head title="Register" />

            {/* Left Section – Fun Background with Animation */}
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
                    🌈 Digital Phonographix
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-white text-lg max-w-md drop-shadow-md"
                >
                    Join the fun world of reading and learning!  
                    Create your account and start your adventure today! ✨
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
                    <span>🎈</span>
                    <span>🎨</span>
                </motion.div>
            </motion.div>

            {/* Right Section – Registration Form */}
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
                        Create Your Account 💫
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Fill in the details below to get started!
                    </p>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-primary-foreground">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-primary-foreground"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-primary-foreground">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-primary-foreground"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-primary-foreground">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-primary-foreground"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-primary-foreground">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        className="rounded-full border-purple-300 focus:ring-purple-400 focus:border-purple-400 text-primary-foreground"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                {/* Submit Button */}
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Button
                                        type="submit"
                                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full py-3 transition-all"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Create Account
                                    </Button>
                                </motion.div>

                                {/* Login Link */}
                                <div className="text-center text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <TextLink
                                        href={login()}
                                        className="text-purple-600 font-medium hover:text-purple-800"
                                        tabIndex={6}
                                    >
                                        Log in
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </motion.div>
            </motion.div>
        </div>
    );
}
