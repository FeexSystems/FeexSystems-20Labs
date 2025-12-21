import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types/auth';
import { loginSchema } from '../../utils/validation';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('');
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="text-center mb-2">Sign In</h1>
      <p className="text-center mb-2">Welcome back! Please sign in to your account.</p>

      {error && (
        <div className="form-error mb-2" style={{ textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="form-error">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            {...register('password')}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="form-error">{errors.password.message}</div>
          )}
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <div className="text-center">
          <Link to="/forgot-password" className="link">
            Forgot your password?
          </Link>
        </div>

        <div className="text-center mt-2">
          <span>Don't have an account? </span>
          <Link to="/register" className="link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;