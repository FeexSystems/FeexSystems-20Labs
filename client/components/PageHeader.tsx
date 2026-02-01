import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    showBackButton?: boolean;
    backTo?: string;
    actions?: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
    title,
    description,
    showBackButton = true,
    backTo,
    actions,
    breadcrumbs
}: PageHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="mb-6 space-y-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center hover:text-foreground transition-colors"
                    >
                        <Home className="h-4 w-4" />
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            <span>/</span>
                            {crumb.href ? (
                                <button
                                    onClick={() => navigate(crumb.href!)}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            ) : (
                                <span className="text-foreground font-medium">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-full"
                            onClick={handleBack}
                            title="Go back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PageHeader;
