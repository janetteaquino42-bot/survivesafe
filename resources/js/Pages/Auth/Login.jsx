import { useForm } from "@inertiajs/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

import AuthLayout from "@/Layouts/AuthLayout";

import { useFlashMessages, useToast } from '@/Hooks/useToast';
import EmailInput from "@/Components/Form/EmailInput";
import PasswordInput from "@/Components/Form/PasswordInput";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import LoadingSVG from "@/Components/Buttons/LoadingSVG";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

import {
    validateEmail,
    validateRequired,
    validateForm
} from "@/Utils/formValidation";
import { Form } from "@heroui/react";
import InputError from "@/Components/Form/InputError";

export default function Login() {
    // useFlashMessages();
    const toast = useToast();
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const validateFormData = () => {
        const rules = {
            email: [validateEmail],
            password: [(value) => validateRequired(value, "Password")]
        };

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = (e) => {
        clearErrors(); // Clear Inertia's server errors
        console.log('[Login] Starting form submission' + getError("email"));
        console.log('[Login] Submitting form', data);
        e.preventDefault();

        console.log('[Login] Form submitted', { data, processing });

        // Client-side validation
        if (!validateFormData()) {
            console.log('[Login] Client validation failed', validationErrors);
            toast.error('Please fix the errors in the form', { duration: 5000 });
            return;
        }

        // Clear ALL validation errors (both client and server)
        setValidationErrors({});
        console.log('[Login] Client validation passed');
        console.log('[Login] Starting login request...');

        post(route("login"), {
            preserveScroll: true,
            onFinish: () => {
                console.log('[Login] Request finished');
                reset("password");
            },
            onSuccess: () => {
                console.log('[Login] Login successful');
            },
            onError: (serverErrors) => {
                console.log('[Login] Server validation errors:', serverErrors);
                // Show server errors as toast
                Object.keys(serverErrors).forEach(field => {
                    toast.error(serverErrors[field], { duration: 5000 });
                });
            },
        });
    };

    // Merge server and client validation errors
    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    return (
        <AuthLayout
            title="Login"
            heading="Log in to your Account"
            description="Welcome back! Please enter your details to log in to your account."
        >
            <Form onSubmit={submit} className="m-auto flex flex-col p-2 gap-4 justify-center transition-all duration-300 rounded-none shadow-none drop-shadow-none">
                <div className="w-full">
                    <EmailInput
                        name="email"
                        value={data.email}
                        onChange={(e) => {
                            console.log('[Login] Email changed:', e.target.value);
                            setData("email", e.target.value);
                            setValidationErrors(errors => ({ ...errors, email: "" }));
                            console.log('[Login] Updated validation errors after email change:', validationErrors);
                            console.log('[Login] Current validation errors:', validationErrors);
                            if (validationErrors.email) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.email;
                                setValidationErrors(newErrors);
                            }
                        }}
                    />
                    <InputError message={getError("email")} />
                </div>

                <div className="w-full">
                    <PasswordInput
                        name="password"
                        value={data.password}
                        onChange={(e) => {
                            setData("password", e.target.value);
                            if (validationErrors.password) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.password;
                                setValidationErrors(newErrors);
                            }
                        }}
                    />
                    <InputError message={getError("password")} />
                    <LinkButton href={route('password.request')} className="mt-2 text-xs float-right">
                        Forgot your password?
                    </LinkButton>
                </div>

                <PrimaryButton
                    type="submit"
                    className="mt-6 w-full"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <LoadingSVG />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                        </>
                    )}
                </PrimaryButton>

                <div className="flex items-center gap-4 w-full mt-4">
                    <hr className="flex-1 border-gray-300" />
                    <p className="text-sm text-gray-500 whitespace-nowrap">Or continue with</p>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <SecondaryButton
                    className="text-sm border space-x-2 inline-flex justify-center items-center px-2 py-2 font-normal w-full"
                    onClick={() => {
                        window.location.href = route("auth.google.redirect");
                    }}
                >
                    <FcGoogle className="mr-2" />
                    Sign In with Google
                </SecondaryButton>


                <div className="text-center mt-4 w-full text-gray-500">
                    Don&apos;t have an account?{" "}
                    <LinkButton href={route('register')} className="font-medium">
                        Register
                    </LinkButton>
                </div>
            </Form>
        </AuthLayout>
    );
}

// import { Link, useForm } from "@inertiajs/react";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
// import { Form } from "@heroui/react";
// import Button from "@/Components/Form/Button";

// import AuthLayout from "@/Layouts/AuthLayout";
// import InputError from "@/Components/Form/InputError";
// import InputLabel from "@/Components/Form/InputLabel";
// // import ButtonLink from "@/Components/Form/ButtonLink";
// import TextInput from "@/Components/Form/TextInput";
// import PasswordInput from "@/Components/Form/PasswordInput";
// import { motion } from "framer-motion";


// import { useFlashMessages, useToast } from '@/Hooks/useToast';
// import PrimaryButton from "@/Components/Buttons/PrimaryButton";
// import LinkButton from "@/Components/Buttons/LinkButton";

// export default function Login({ canResetPassword }) {
//     // useFlashMessages();
//     const toast = useToast();

//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: "",
//         password: "",
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route("login"), {
//             onFinish: () => reset("password"),
//             onError: (errors) => {
//                 toast.validationErrors(errors, {
//                     duration: 5000,
//                 });
//             },
//         });
//     };

//     return (
//         <AuthLayout
//             title="Sign In"
//             heading="Welcome Back"
//             description="Sign in to your Art Carousel account to continue exploring amazing artworks."
//         >
//             <Form onSubmit={submit} className="m-auto flex flex-col p-2  justify-center  transition-all duration-300  rounded-none shadow-none drop-shadow-none">
//                 <div className="mt-6 w-full">
//                     <InputLabel htmlFor="email" value="Email Address" />
//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className=""
//                         autoComplete="username"
//                         isFocused={true}
//                         placeholder="Enter your email"
//                         onChange={(e) => setData("email", e.target.value)}
//                     />
//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4 w-full">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <PasswordInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         autoComplete="current-password"
//                         placeholder="Enter your password"
//                         onChange={(e) => setData("password", e.target.value)}
//                         error={errors.password}
//                     />

//                     {/* <InputError message={errors.password} className="mt-2" /> */}

//                     {canResetPassword && (
//                         <LinkButton href={route('password.request')} className="mt-6 text-sm">
//                             Forgot your password?
//                         </LinkButton>
//                     )}
//                 </div>

//                 <PrimaryButton
//                     type="submit"
//                     className="mt-6"
//                     disabled={processing}

//                 >
//                     {processing ? (
//                         <>
//                             <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Signing In...
//                         </>
//                     ) : (
//                         <>
//                             Sign In
//                         </>
//                     )}
//                 </PrimaryButton>

//                 <div className="flex items-center gap-4 w-full mt-4">
//                     <hr className="flex-1 border-gray-300" />
//                     <p className="text-sm text-gray-500 whitespace-nowrap">Or continue with</p>
//                     <hr className="flex-1 border-gray-300" />
//                 </div>

//                 <motion.button
//                     initial="hidden"
//                     animate="visible"
//                     whileTap={{ scale: 0.95 }}
//                     whileHover={{ y: -2 }}
//                     type="button"
//                     className={`text-sm border space-x-2 inline-flex justify-center items-center px-2 py-2 focus:outline-g-dark-green focus:ring-2 focus:ring-green-300 focus:ring-offset-2 rounded-lg w-full`}
//                     onClick={() => {
//                         window.location.href = route("auth.google.redirect");
//                     }}
//                 >
//                     <FcGoogle className="mr-2" />
//                     Sign In with Google
//                 </motion.button>
//                 {/* <IconButton
//                     variant="outline"
//                     type="button"
//                     onClick={() => {
//                         window.location.href = route("auth.facebook.redirect");
//                     }}
//                 >
//                     <FaFacebook className="text-blue-800 mr-2" />
//                     Login with Facebook
//                 </IconButton> */}

//                 <div className="text-center mt-4 w-full text-gray-500">
//                     Don&apos;t have an account?{" "}
//                     <LinkButton href={route('register')} className="font-medium">
//                         Sign Up
//                     </LinkButton>
//                 </div>
//             </Form>
//         </AuthLayout>
//     );
// }