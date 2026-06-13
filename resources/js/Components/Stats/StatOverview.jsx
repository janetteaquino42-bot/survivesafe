import StatCard from "./StatCard";

export default function StatOverview({ stats = [], className = "", columns = 4 }) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    };

    return (
        <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 ${className}`}>
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
