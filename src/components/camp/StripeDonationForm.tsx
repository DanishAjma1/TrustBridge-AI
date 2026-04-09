import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Mail, Phone } from 'lucide-react';

interface StripeDonationFormProps {
    amount: number;
    campaignId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const StripeDonationForm: React.FC<StripeDonationFormProps> = ({
    amount,
    campaignId,
    onSuccess,
    onCancel,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    const URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!user && (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim())) {
            toast.error("Please enter your name, phone number and email");
            return;
        }

        const token = localStorage.getItem('token');
        setIsProcessing(true);

        try {
            const payload: any = { amount, campaignId };
            const headers: any = {};

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } else {
                payload.guestName = guestName;
                payload.guestPhone = guestPhone;
                payload.guestEmail = guestEmail;
            }

            const { data: { clientSecret } } = await axios.post(
                `${URL}/payment/create-payment-intent`,
                payload,
                { headers }
            );

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) return;

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user ? user.name : guestName,
                        phone: user ? undefined : guestPhone,
                        email: user ? user.email : guestEmail
                    }
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                const confirmPayload = {
                    ...payload,
                    paymentIntentId: paymentIntent.id
                };

                await axios.post(
                    `${URL}/payment/confirm-payment`,
                    confirmPayload,
                    { headers }
                );

                toast.success('Donation successful! Thank you for your support.');
                onSuccess();
            }
        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error(err.response?.data?.message || 'Something went wrong with the payment');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Donation Amount Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                <p className="text-sm text-gray-600 mb-1">Donation Amount</p>
                <p className="text-3xl font-black text-primary-600">${amount}</p>
            </div>

            {/* Guest Information - Only show if not logged in */}
            {!user && (
                <div className="space-y-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <p className="text-sm font-bold text-gray-900 mb-4">Your Information</p>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} className="text-primary-600" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Mail size={16} className="text-primary-600" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Phone size={16} className="text-primary-600" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="+1 (555) 123-4567"
                            required
                        />
                    </div>
                </div>
            )}

            {/* Card Payment Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-primary-600" />
                    Payment Details
                </label>
                <div className="p-4 bg-white border-2 border-gray-300 rounded-lg focus-within:border-primary-500 transition-colors">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1f2937',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    '::placeholder': {
                                        color: '#9ca3af',
                                    },
                                },
                                invalid: {
                                    color: '#dc2626',
                                },
                            },
                        }}
                    />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                    💳 Your payment is secure and encrypted
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-lg transition-all duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">●</span>
                            Processing...
                        </span>
                    ) : (
                        `Donate $${amount}`
                    )}
                </button>
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-green-700">
                    🔒 Secure payment powered by Stripe
                </p>
            </div>
        </form>
    );
};
