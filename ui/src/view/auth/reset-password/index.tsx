import { Button, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import FormField from "../../../Components/form/index.js";
import { useResetPasswordMutation } from "../../../redux/features/user/index.js";


export default function ResetPassword() {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const [resetPassword, { isLoading }] =
        useResetPasswordMutation();

    const handleSubmit = async (values: any) => {
        try {
            await resetPassword(values).unwrap();

            message.success("Password reset successfully.");

            navigate("/auth/login");
        } catch (error: any) {
            message.error(
                error?.data?.message ||
                "Unable to reset password."
            );
        }
    };

    return (
        <div className="relative min-h-screen">

            <div
                className="fixed inset-0 -z-20 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/image/register.jpg')",
                }}
            />

            <div className="fixed inset-0 -z-10 bg-black/60" />

            <div className="flex min-h-screen items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">

                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white">
                            Reset Password
                        </h1>

                        <p className="mt-2 text-gray-300">
                            Enter your new password.
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <FormField
                            name="password"
                            type="password"
                            required
                            placeholder="New Password"
                            icon={<FaLock />}
                            className="backdrop-blur-xl"
                        />

                        <FormField
                            name="confirmPassword"
                            type="password"
                            required
                            placeholder="Confirm Password"
                            icon={<FaLock />}
                            className="backdrop-blur-xl"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            new Error(
                                                "Passwords do not match."
                                            )
                                        );
                                    },
                                }),
                            ]}
                        />

                        <Button
                            htmlType="submit"
                            loading={isLoading}
                            type="primary"
                            size="large"
                            className="mt-6 w-full !rounded-xl !bg-primary"
                        >
                            Reset Password
                        </Button>

                        <div className="mt-8 text-center text-gray-300">
                            <Link
                                to="/auth/login"
                                className="font-semibold !text-secondary"
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