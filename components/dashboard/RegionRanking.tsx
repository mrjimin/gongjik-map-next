import type { RegionStatistic } from "@/lib/geps-statistics";

interface RegionRankingProps {
    data: RegionStatistic[];
}

function formatNumber(value: number) {
    return value.toLocaleString("ko-KR");
}

export function RegionRanking({
                                  data,
                              }: RegionRankingProps) {
    const ranking = data;
    const max = ranking[0]?.count ?? 1;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-950">
                    지역별 순위
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    공무원 수가 많은 지역 순입니다.
                </p>
            </div>

            <div className="space-y-5">
                {ranking.map((item, index) => {
                    const width =
                        (item.count / max) * 100;

                    return (
                        <div key={item.region}>
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-5 text-sm font-bold ${
                                            index < 3
                                                ? "text-blue-600"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {index + 1}
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {item.region}
                                    </span>
                                </div>

                                <span className="text-sm font-bold tabular-nums text-slate-700">
                                    {formatNumber(item.count)}
                                    <span className="ml-1 font-medium text-slate-400">
                                        명
                                    </span>
                                </span>
                            </div>

                            <div className="ml-8 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                    style={{
                                        width: `${width}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}