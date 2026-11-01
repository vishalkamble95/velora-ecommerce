import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, ShieldCheck, LogIn, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ErrorMessage from "../components/common/ErrorMessage";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoginError("");

      const response = await login(formData);

      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand-section">
          <div className="auth-brand-icon">
            <ShoppingBag size={27} />
          </div>

          <h1>Welcome Back!</h1>
          <p>Login to your account and continue shopping.</p>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-heading">
            <h2>Login</h2>
            <p>Enter your account details below.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email?.message}
            />

            <div className="auth-password-wrapper">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                register={register}
                error={errors.password?.message}
              />

              <button
                type="button"
                className="auth-password-toggle"
                data-tooltip={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {loginError && <ErrorMessage message={loginError} />}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-button"
            >
              <LogIn size={18} />
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="auth-register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>

          <div className="auth-security-note">
            <ShieldCheck size={17} />
            <span>Your account is protected with secure authentication.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
