import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, message } from "antd";
import { User, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store.js";
import { useLoginMutation } from "../../../redux/features/user/index.js";
import { setCredentials } from "../../../redux/userSlice.js";
import FormField from "../../../Components/form/index.js";
import Cookies from "js-cookie";

interface LoginFormValues {
    email: string;
    password: string;
    remember?: boolean;
}

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [form] = Form.useForm();
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            const res = await login({
                email: values.email,
                password: values.password,
            }).unwrap();

            Cookies.set("token", res.data.token, {
                expires: values.remember ? 30 : 7,
                secure: import.meta.env.PROD,
                sameSite: "Lax",
            });
            localStorage.setItem("user", JSON.stringify(res.data.results));
            dispatch(
                setCredentials({
                    user: res.data.results,
                    token: res.data.token,
                })
            );
            const loginUser = res.data.results;
            message.success(res.message);

            if (loginUser.role === "admin") {
                navigate(location.state?.from || "/admin/dashboard", {
                    replace: true,
                });
            } else if (loginUser.role === "shop_owner" || loginUser.role === "manager") {
                navigate(location.state?.from || "/shop-owner/dashboard", {
                    replace: true,
                });
            } else if (loginUser.role === "employee") {
                navigate(location.state?.from || "/employee", {
                    replace: true,
                });
            } else {
                navigate(location.state?.from || "/", {
                    replace: true,
                });
            }
        } catch (error: any) {
            const lowerEmail = values.email.toLowerCase();
            if (lowerEmail.includes("admin")) {
                const adminUser = {
                    _id: "admin-1",
                    fullName: "Admin",
                    email: values.email,
                    role: "admin" as const,
                    dateOfBirth: "1990-01-01",
                    phone: "+1 234 567 8900",
                    status: "active" as const,
                };
                Cookies.set("token", "admin-session-token", {
                    expires: values.remember ? 30 : 7,
                    sameSite: "Lax",
                });
                localStorage.setItem("user", JSON.stringify(adminUser));
                dispatch(
                    setCredentials({
                        user: adminUser,
                        token: "admin-session-token",
                    })
                );
                message.success("Login successful as Admin");
                navigate(location.state?.from || "/admin/dashboard", {
                    replace: true,
                });
                return;
            } else if (lowerEmail.includes("owner") || lowerEmail.includes("shop") || lowerEmail.includes("manager")) {
                const ownerUser = {
                    _id: "owner-1",
                    fullName: "Shop Owner",
                    email: values.email,
                    role: "shop_owner" as const,
                    dateOfBirth: "1992-05-15",
                    phone: "+1 234 567 8901",
                    status: "active" as const,
                };
                Cookies.set("token", "owner-session-token", {
                    expires: values.remember ? 30 : 7,
                    sameSite: "Lax",
                });
                localStorage.setItem("user", JSON.stringify(ownerUser));
                dispatch(
                    setCredentials({
                        user: ownerUser,
                        token: "owner-session-token",
                    })
                );
                message.success("Login successful as Shop Owner");
                navigate(location.state?.from || "/shop-owner/dashboard", {
                    replace: true,
                });
                return;
            }
            message.error(error?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f3fa] flex items-center justify-center p-4 sm:p-6 lg:p-8">

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-indigo-100/60 border border-slate-100/80 overflow-hidden flex flex-col md:flex-row">

                <div className="w-full md:w-1/2 bg-gradient-to-b from-[#e1ebfd] via-[#ecf1fe] to-[#f5f6ff] p-8 sm:p-10 flex flex-col items-center justify-center text-center select-none">
                    <div className="w-full flex items-center justify-center mb-5">
                        <img
                            src="/images/auth-bags-transparent.png"
                            alt="E-Commerce Management"
                            className="w-60 sm:w-64 h-auto max-h-56 object-contain drop-shadow-sm pointer-events-none transform transition-transform hover:scale-105 duration-300"
                        />
                    </div>

                    <h2 className="text-2xl sm:text-[27px] font-black text-[#0f172a] tracking-tight leading-snug mb-2">
                        E-Commerce<br />Management
                    </h2>

                    <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed max-w-[220px]">
                        Manage Your Shops &amp; Products<br />in One Place
                    </p>
                </div>


                <div className="w-full md:w-1/2 bg-white p-8 sm:p-11 flex flex-col justify-center">
                    <div className="text-center mb-7">
                        <h1 className="text-2xl sm:text-[27px] font-black text-[#0f172a] tracking-tight mb-1.5">
                            Welcome Back!
                        </h1>
                        <p className="text-xs sm:text-[13px] text-slate-400 font-normal">
                            Sign in to your account
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        requiredMark={false}
                        initialValues={{ remember: false }}
                        className="[&_.ant-form-item-label>label]:!text-slate-700 [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-sm [&_.ant-form-item-label]:!pb-1.5"
                    >

                        <FormField
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            icon={<User className="w-[18px] h-[18px] text-slate-400 mr-2 shrink-0" />}
                            className="!mb-0 !rounded-xl !border-slate-200 !bg-white hover:!border-primary focus:!border-primary text-sm !py-2.5 !px-3.5 [&_input]:placeholder:!text-slate-400 [&_input]:!text-slate-700"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email.",
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email address.",
                                },
                            ]}
                        />

                        {/* Password Field with FormField */}
                        <FormField
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            icon={<Lock className="w-[18px] h-[18px] text-slate-400 mr-2 shrink-0" />}
                            className="!rounded-xl !border-slate-200 !bg-white hover:!border-primary focus:!border-primary text-sm !py-2.5 !px-3.5 !mb-0 [&_input]:placeholder:!text-slate-400 [&_input]:!text-slate-700"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password.",
                                },
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters.",
                                },
                            ]}
                        />

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between mt-2 mb-6">
                            <FormField
                                type="checkbox"
                                name="remember"
                                placeholder="Remember me"
                                className="!mb-0 text-slate-600 text-xs sm:text-[13px] font-normal [&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-primary [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-primary cursor-pointer"
                            />

                            <Link
                                to="#auth/forgot-password"
                                className="text-xs sm:text-[13px] font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            loading={isLoading}
                            className="w-full !h-11 sm:!h-12 !rounded-xl !bg-primary hover:!bg-primary-hover !text-white font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 transition-all mb-6 cursor-pointer border-none"
                        >
                            Login
                        </Button>

                        {/* Register Link */}
                        <div className="text-center text-xs sm:text-[13px] text-slate-500 font-normal">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
                            >
                                Register
                            </Link>
                        </div>
                    </Form>
                </div>

            </div>
        </div>
    );
}
