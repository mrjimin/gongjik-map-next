"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { OccupationStatistic } from "@/lib/geps-statistics";

interface OccupationChartProps {
    data: OccupationStatistic[];
    selectedRegion: string | null;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value?: number | string;
        payload?: OccupationStatistic;
    }>;
}

function formatNumber(value: number): string {
    return value.toLocaleString("ko-KR");
}

function CustomTooltip({
                           active,
                           payload,
                       }: CustomTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0];
    const occupation = item.payload?.occupation ?? "-";
    const count = Number(item.value) || 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">

            <p className="mt-1 text-sm font-bold text-slate-900">
                {occupation}
            </p>

            <div className="mt-2 border-t border-slate-100 pt-2">
                <span className="text-lg font-bold tabular-nums text-blue-600">
                    {formatNumber(count)}
                </span>

                <span className="ml-1 text-xs text-slate-500">
                    명
                </span>
            </div>
        </div>
    );
}

export function OccupationChart({
                                    data,
                                    selectedRegion,
                                }: OccupationChartProps) {
    const chartData = [...data]
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

    const title = selectedRegion
        ? `${selectedRegion} 직종별 공무원 현황`
        : "직종별 공무원 현황";

    const description = selectedRegion
        ? `${selectedRegion} 지역의 직종별 인력 규모를 비교합니다.`
        : "전국 직종별 인력 규모를 비교합니다.";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-7">
                <h2 className="text-lg font-bold text-slate-950">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            <div className="h-[420px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 0,
                                bottom: 20,
                            }}
                            barCategoryGap="30%"
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="#E2E8F0"
                                strokeDasharray="4 4"
                            />

                            <XAxis
                                dataKey="occupation"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 11,
                                    fill: "#64748B",
                                }}
                                tickMargin={10}
                                interval={0}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 11,
                                    fill: "#94A3B8",
                                }}
                                tickFormatter={(value) =>
                                    formatNumber(Number(value))
                                }
                            />

                            <Tooltip
                                cursor={{
                                    fill: "rgba(37, 99, 235, 0.05)",
                                }}
                                content={<CustomTooltip />}
                            />

                            <Bar
                                dataKey="count"
                                fill="#2563EB"
                                radius={[8, 8, 2, 2]}
                                maxBarSize={42}
                                animationDuration={500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        표시할 직종 데이터가 없습니다.
                    </div>
                )}
            </div>
        </section>
    );
}