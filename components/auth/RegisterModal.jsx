'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { toast } from 'sonner';
import {
    Loader2,
    Syringe,
    Mail,
    Lock,
    ArrowRight,
    ChevronLeft,
    X,
    ShieldCheck
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const verifySchema = z.object({
    otp: z.string().length(6, 'Please enter the 6-digit OTP'),
});

export default function RegisterModal({ children }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState('register'); // 'register' | 'verify'
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(180);

    useEffect(() => {
        let interval;
        if (step === 'verify' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', password: '' },
    });

    const verifyForm = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: { otp: '' },
    });

    const onRegisterSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/auth/register', data);
            toast.success('OTP sent successfully!');
            setEmail(data.email);
            setStep('verify');
            setTimer(180);
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifySubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/auth/verify-email', {
                email: email,
                otp: parseInt(data.otp),
            });
            toast.success('Email verified successfully!');
            setOpen(false);
            setTimeout(() => {
                setStep('register');
                registerForm.reset();
                verifyForm.reset();
            }, 500);
        } catch (error) {
            console.error('Verification error:', error);
            const message = error.response?.data?.message || 'Verification failed.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatEmail = (email) => {
        if (!email) return '';
        const [user, domain] = email.split('@');
        return `${user.substring(0, 3)}...${user.slice(-2)}@${domain}`;
    };

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            {/* Custom styled dialog content to meet all SaaS requirements */}
            <DialogContent
                className="max-w-md w-full p-10 rounded-[2rem] border-none bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 outline-none"
                showCloseButton={false}
            >
                {/* Close Button Override */}
                <DialogClose className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-20">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                </DialogClose>

                <div className="flex flex-col items-center">

                    {/* Top Icon Badge */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.3)] mb-6">
                        <Syringe className="h-8 w-8 text-white transform rotate-[-45deg]" />
                    </div>

                    {/* Heading Section */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {step === 'register' ? 'Join Vaccination Drive' : 'Identity Verification'}
                        </h2>
                        <p className="text-base text-gray-500 mt-2">
                            {step === 'register'
                                ? 'Secure your slot with simple registration'
                                : `Verify the code sent to ${formatEmail(email)}`}
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="w-full">
                        {step === 'register' ? (
                            <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                                    <div className="space-y-4">
                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="relative group">
                                                        <FormControl>
                                                            <input
                                                                className="w-full h-14 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium"
                                                                placeholder="Email Address"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage className="text-xs font-medium text-red-500 mt-1 pl-2" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="relative group">
                                                        <FormControl>
                                                            <input
                                                                className="w-full h-14 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium"
                                                                type="password"
                                                                placeholder="Create Password"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage className="text-xs font-medium text-red-500 mt-1 pl-2" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 text-white font-medium rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group border-none"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Register & Continue
                                                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="text-center pt-2">
                                        <p className="text-sm text-gray-500">
                                            Already have an account?{' '}
                                            <button type="button" className="text-indigo-600 hover:underline font-medium transition-colors">
                                                Login
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </Form>
                        ) : (
                            <Form {...verifyForm}>
                                <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                                    <FormField
                                        control={verifyForm.control}
                                        name="otp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative group">
                                                    <FormControl>
                                                        <input
                                                            className="w-full h-16 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none text-3xl text-center text-gray-900 font-bold tracking-[0.5em] placeholder:text-gray-200 placeholder:tracking-normal transition-all duration-300"
                                                            type="text"
                                                            placeholder="000000"
                                                            {...field}
                                                            maxLength={6}
                                                            autoFocus
                                                            onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage className="text-xs font-medium text-red-500 mt-2 text-center" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm mb-4">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                            </span>
                                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} remaining
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify Identity"}
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setStep('register')}
                                            className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors flex items-center justify-center mx-auto uppercase tracking-widest"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Go Back
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
