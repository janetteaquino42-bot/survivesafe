import { Card, CardBody } from "@heroui/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    description,
    color = "primary",
    iconColor,
    iconBgColor,
    className = "",
    loading = false,
    ...props
}) {
    const colorClasses = {
        primary: "bg-blue-600",
        success: "bg-green-600",
        warning: "bg-yellow-600",
        danger: "bg-red-600",
        secondary: "bg-gray-600",
        brown: "bg-[#664b33]",
    };

    const getTrendIcon = () => {
        if (trend === "up") return <TrendingUp size={16} className="text-green-600" />;
        if (trend === "down") return <TrendingDown size={16} className="text-red-600" />;
        return <Minus size={16} className="text-gray-400" />;
    };

    const getTrendColor = () => {
        if (trend === "up") return "text-green-600";
        if (trend === "down") return "text-red-600";
        return "text-gray-500";
    };

    return (
        <Card
            className={`border-none rounded-xl shadow-sm transition-all bg-gray-50 ${className}`}
            isPressable={!!props.onClick}
            {...props}
        >
            <CardBody className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {title}
                        </p>
                        {loading ? (
                            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                        ) : (
                            <p className="text-4xl font-bold text-gray-900 mb-3">{value}</p>
                        )}

                        {(trend || trendValue || description) && (
                            <div className="flex items-center gap-2">
                                {trend && (
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                                        {getTrendIcon()}
                                        {trendValue && (
                                            <span className={`text-sm font-bold ${getTrendColor()}`}>
                                                {trendValue}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {description && (
                                    <p className="text-sm text-gray-600">{description}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {Icon && (
                        <div
                            className={`p-4 rounded-2xl ${colorClasses[color]} shadow-lg`}
                            style={{
                                backgroundColor: iconBgColor,
                            }}
                        >
                            <Icon
                                size={28}
                                className="text-white"
                                style={{
                                    color: iconColor || undefined
                                }}
                            />
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
