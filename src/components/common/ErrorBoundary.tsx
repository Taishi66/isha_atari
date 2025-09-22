/**
 * Advanced Error Boundary Component
 * @fileoverview Comprehensive error handling with recovery mechanisms and detailed logging
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import type { AppError } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface ErrorBoundaryState {
    readonly hasError: boolean;
    readonly error: Error | null;
    readonly errorInfo: ErrorInfo | null;
    readonly errorId: string;
    readonly retryCount: number;
}

interface ErrorBoundaryProps {
    readonly children: ReactNode;
    readonly fallback?: (error: AppError, retry: () => void) => ReactNode;
    readonly onError?: (error: AppError) => void;
    readonly enableRetry?: boolean;
    readonly maxRetries?: number;
    readonly isolate?: boolean;
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private retryTimeout: NodeJS.Timeout | null = null;

    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
            retryCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        return {
            hasError: true,
            error,
            errorId,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        const { onError } = this.props;

        // Create structured error object
        const appError: AppError = {
            code: error.name || 'UNKNOWN_ERROR',
            message: error.message,
            details: {
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorBoundary: this.constructor.name,
                retryCount: this.state.retryCount,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                url: window.location.href,
            },
            timestamp: new Date(),
        };

        // Update state with error info
        this.setState({ errorInfo });

        // Call error handler if provided
        if (onError) {
            try {
                onError(appError);
            } catch (handlerError) {
                console.error('Error in error handler:', handlerError);
            }
        }

        // Log to console in development
        if (import.meta.env.DEV) {
            console.group('🚨 Error Boundary Caught Error');
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
            console.error('App Error:', appError);
            console.groupEnd();
        }

        // Send to error tracking service (Sentry, LogRocket, etc.)
        this.reportError(appError);
    }

    private reportError = (error: AppError): void => {
        // In a real application, you would send this to your error tracking service
        if (typeof window !== 'undefined' && 'gtag' in window) {
            // Example: Google Analytics error tracking
            (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'exception', {
                description: error.message,
                fatal: false,
                custom_map: {
                    error_code: error.code,
                    error_id: this.state.errorId,
                },
            });
        }

        // Custom error reporting
        if (import.meta.env.PROD) {
            fetch('/api/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(error),
            }).catch(reportingError => {
                console.warn('Failed to report error:', reportingError);
            });
        }
    };

    private handleRetry = (): void => {
        const { maxRetries = 3 } = this.props;
        const { retryCount } = this.state;

        if (retryCount >= maxRetries) {
            console.warn('Maximum retry attempts reached');
            return;
        }

        // Clear any existing timeout
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;

        this.retryTimeout = setTimeout(() => {
            this.setState(prevState => ({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: prevState.retryCount + 1,
            }));
        }, delay);
    };

    private renderFallback(): ReactNode {
        const { fallback, enableRetry = true, maxRetries = 3 } = this.props;
        const { error, retryCount } = this.state;

        if (!error) return null;

        const appError: AppError = {
            code: error.name || 'UNKNOWN_ERROR',
            message: error.message,
            details: { retryCount },
            timestamp: new Date(),
        };

        // Use custom fallback if provided
        if (fallback) {
            return fallback(appError, this.handleRetry);
        }

        // Default fallback UI
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
                <div className="max-w-md w-full space-y-6 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-red-400">
                                Something went wrong
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {error.message || 'An unexpected error occurred'}
                            </p>
                        </div>
                    </div>

                    {enableRetry && retryCount < maxRetries && (
                        <button
                            onClick={this.handleRetry}
                            className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors duration-200"
                        >
                            Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                        </button>
                    )}

                    {retryCount >= maxRetries && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded hover:bg-gray-500/30 transition-colors duration-200"
                        >
                            Reload Page
                        </button>
                    )}

                    {import.meta.env.DEV && (
                        <details className="text-left text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-400">
                                Error Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    componentWillUnmount(): void {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
    }

    render(): ReactNode {
        const { children, isolate = false } = this.props;
        const { hasError } = this.state;

        if (hasError) {
            return isolate ? (
                <div className="error-boundary-isolated">
                    {this.renderFallback()}
                </div>
            ) : (
                this.renderFallback()
            );
        }

        return children;
    }
}

// ============================================================================
// HOC FOR WRAPPING COMPONENTS
// ============================================================================

export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// ============================================================================
// HOOK FOR ERROR REPORTING
// ============================================================================

export function useErrorHandler() {
    return (error: Error, errorInfo?: Record<string, unknown>) => {
        const appError: AppError = {
            code: error.name || 'MANUAL_ERROR',
            message: error.message,
            details: {
                ...errorInfo,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            },
            timestamp: new Date(),
        };

        // Report the error
        console.error('Manual error report:', appError);

        // In production, send to error tracking service
        if (import.meta.env.PROD) {
            fetch('/api/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appError),
            }).catch(console.warn);
        }
    };
}