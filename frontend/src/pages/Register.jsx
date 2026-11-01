import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, UserPlus, ShieldCheck, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setRegisterError("");

      const { confirmPassword, ...userData } = formData;

      await registerUser(userData);

      navigate("/");
    } catch (error) {
      setRegisterError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-brand-section">
          <div className="auth-brand-icon">
            <ShoppingBag size={27} />
          </div>

          <h1>Join Our Store!</h1>
          <p>Create your account and enjoy a better shopping experience.</p>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-heading">
            <h2>Create Account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <Input
              label="Name"
              name="name"
              placeholder="Enter your name"
              register={register}
              error={errors.name?.message}
            />

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
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                data-tooltip={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="auth-password-wrapper">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                register={register}
                error={errors.confirmPassword?.message}
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                data-tooltip={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <ErrorMessage message={registerError} />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-button"
            >
              <UserPlus size={18} />
              {isSubmitting ? "Registering..." : "Create Account"}
            </Button>
          </form>

          <div className="auth-register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
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

export default Register;
