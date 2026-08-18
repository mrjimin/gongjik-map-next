"use client";

import React from "react";

import { AVAILABLE_YEARS } from "@/lib/constants";

interface HeroProps {
    year: number;
    onYearChange: (year: number) => void;
}

export function Hero({
                         year,
                         onYearChange,
                     }: HeroProps) {
    const handleYearChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        onYearChange(Number(event.target.value));
    };

    return (
        <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            공무원연금공단 공공데이터
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                            공무원 인력 현황
                            <br />
                            한눈에 살펴보기
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                            지역과 직종별 공무원 인력 데이터를
                            <br className="hidden sm:block" />
                            한눈에 비교하고 지역별 분포를 확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <label
                            htmlFor="year"
                            className="mb-2 block text-xs font-semibold text-slate-500"
                        >
                            기준연도
                        </label>

                        <div className="relative">
                            <select
                                id="year"
                                value={year}
                                onChange={handleYearChange}
                                className="min-w-[140px] appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            >
                                {AVAILABLE_YEARS.map(
                                    (availableYear) => (
                                        <option
                                            key={availableYear}
                                            value={availableYear}
                                        >
                                            {availableYear}년
                                        </option>
                                    )
                                )}
                            </select>

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                            >
                                ▼
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}