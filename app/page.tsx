"use client";

import { useMemo, useState } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/dashboard/Hero";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RegionMap } from "@/components/dashboard/RegionMap";
import { RegionRanking } from "@/components/dashboard/RegionRanking";
import { OccupationChart } from "@/components/dashboard/OccupationChart";

import { useStatistics } from "@/hooks/useStatistics";
import { buildGepsStatistics } from "@/lib/geps-statistics";

export default function Home() {
    const {
        year,
        setYear,
        data,
        loading,
        error,
    } = useStatistics();

    const [selectedRegion, setSelectedRegion] =
        useState<string | null>(null);

    const statistics = useMemo(
        () =>
            data
                ? buildGepsStatistics(data.items)
                : {
                    regions: [],
                    occupations: [],
                    regionOccupations: [],
                    totalCount: 0,
                },
        [data]
    );

    const occupationData = useMemo(() => {
        if (!selectedRegion) {
            return statistics.occupations;
        }

        return statistics.regionOccupations
            .filter(
                (item) =>
                    item.region === selectedRegion
            )
            .map(({ occupation, count }) => ({
                occupation,
                count,
            }));
    }, [
        selectedRegion,
        statistics.occupations,
        statistics.regionOccupations,
    ]);

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-slate-900">
            <Header />

            <Hero
                year={year}
                onYearChange={setYear}
            />

            {error && (
                <div className="mx-auto max-w-7xl px-6 pt-6">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                </div>
            )}

            {loading && (
                <div className="mx-auto max-w-7xl px-6 pt-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                        {year}년 통계 데이터를 불러오는 중입니다...
                    </div>
                </div>
            )}

            <section
                id="overview"
                className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8"
            >
                <SummaryCards
                    year={year}
                    totalCount={statistics.totalCount}
                    regionData={statistics.regions}
                    occupationData={statistics.occupations}
                />
            </section>

            <section
                id="region"
                className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-8"
            >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <RegionMap
                        data={statistics.regions}
                        selectedRegion={selectedRegion}
                        onRegionSelect={setSelectedRegion}
                    />

                    <RegionRanking
                        data={statistics.regions}
                    />
                </div>
            </section>

            <section
                id="occupation"
                className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-16"
            >
                <OccupationChart
                    data={occupationData}
                    selectedRegion={selectedRegion}
                />
            </section>

            <Footer />
        </main>
    );
}