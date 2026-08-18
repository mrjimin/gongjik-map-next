import type {
    OccupationStatistic,
    RegionStatistic,
} from "@/lib/geps-statistics";

interface SummaryCardsProps {
    year: number;
    totalCount: number;
    regionData: RegionStatistic[];
    occupationData: OccupationStatistic[];
}

function formatNumber(value: number) {
    return value.toLocaleString("ko-KR");
}

export function SummaryCards({
                                 year,
                                 totalCount,
                                 regionData,
                                 occupationData,
                             }: SummaryCardsProps) {
    const topRegion = regionData[0];
    const topOccupation = occupationData[0];

    const cards = [
        {
            label: "전체 공무원",
            value: `${formatNumber(totalCount)}명`,
            description: `${year}년 기준`,
        },
        topRegion && {
            label: "가장 많은 지역",
            value: topRegion.region,
            description: `${formatNumber(topRegion.count)}명`,
        },
        topOccupation && {
            label: "가장 많은 직종",
            value: topOccupation.occupation,
            description: `${formatNumber(topOccupation.count)}명`,
        },
    ].filter(Boolean);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
                <article
                    key={card.label}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <p className="text-sm font-medium text-slate-500">
                        {card.label}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                        {card.value}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                        {card.description}
                    </p>
                </article>
            ))}
        </div>
    );
}
