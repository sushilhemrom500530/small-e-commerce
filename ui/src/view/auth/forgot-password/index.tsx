import { Button, Form, message } from "antd";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../redux/features/user/index.js";
import FormField from "../../../Components/form/index.js";


export default function ForgotPassword() {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const [forgotPassword, { isLoading }] =
        useForgotPasswordMutation();

    const handleSubmit = async (values: { email: string }) => {
        try {
            const res = await forgotPassword(values).unwrap();

            message.success(res.message);

            navigate("/auth/verify-forgot-otp", {
                state: {
                    email: values.email,
                },
            });
        } catch (error: any) {
            message.error(
                error?.data?.message ||
                "Unable to send OTP."
            );
        }
    };

    return (
        <div className="relative min-h-screen">

            {/* Background */}
            <div
                className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/image/register.jpg')",
                }}
            />

            {/* Overlay */}
            <div className="fixed inset-0 -z-10 bg-black/60" />

            {/* Content */}
            <div className="flex min-h-screen items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-4xl font-bold text-white">
                            Forgot Password
                        </h1>

                        <p className="text-gray-300">
                            Enter your email address to receive an OTP for resetting your password.
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <div className="mb-6">

                            <label className="mb-2 block text-sm font-medium text-white">
                                Email Address
                            </label>

                            <FormField
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                icon={<FaEnvelope />}
                                rules={[
                                    {
                                        type: "email",
                                        message:
                                            "Enter a valid email address.",
                                    },
                                ]}
                                className="backdrop-blur-xl"
                            />
                        </div>

                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            loading={isLoading}
                            className="w-full !rounded-xl !bg-primary text-lg font-semibold"
                        >
                            Send OTP
                        </Button>

                        <div className="mt-8 text-center text-gray-300">

                            Remember your password?{" "}

                            <Link
                                to="/auth/login"
                                className="font-semibold !text-secondary hover:!text-primary"
                            >
                                Back to Login
                            </Link>

                        </div>
                    </Form>
                </div>

            </div>
        </div>
    );
}