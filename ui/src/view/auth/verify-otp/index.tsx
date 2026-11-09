import { Button, Form, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import { useForgotOtpVerifyMutation, useVerifyOtpMutation } from "../../../redux/features/user/index.js";
import FormField from "../../../Components/form/index.js";


export default function VerifyOtp() {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const type = location.state?.type || "register";

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [forgotVerify] = useForgotOtpVerifyMutation();

    const handleSubmit = async (values: { otp: string }) => {
        try {
            let res;

            if (type === "forgot") {
                res = await forgotVerify(values).unwrap();

                message.success(res.message);

                navigate("/auth/reset-password");
            } else {
                res = await verifyOtp(values).unwrap();

                message.success(res.message);

                navigate("/auth/login");
            }
        } catch (error: any) {
            message.error(error?.data?.message || "OTP verification failed.");
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
                            Verify OTP
                        </h1>

                        <p className="mt-2 text-gray-300">
                            Enter the OTP sent to
                        </p>

                        <p className="font-semibold text-secondary">
                            {email}
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <FormField
                            name="otp"
                            type="text"
                            required
                            placeholder="Enter 6 digit OTP"
                            icon={<FaKey />}
                            className="backdrop-blur-xl"
                        />

                        <Button
                            htmlType="submit"
                            loading={isLoading}
                            type="primary"
                            size="large"
                            className="mt-6 w-full !rounded-xl !bg-primary"
                        >
                            Verify OTP
                        </Button>

                        <div className="mt-8 text-center text-gray-300">
                            Back to{" "}
                            <Link
                                to="/auth/login"
                                className="font-semibold !text-secondary"
                            >
                                Login
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}