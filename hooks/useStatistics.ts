"use client";

import { useEffect, useState } from "react";

import type { StatisticsResponse } from "@/lib/geps-types";
import {
    AVAILABLE_YEARS,
    DEFAULT_YEAR,
} from "@/lib/constants";

interface UseStatisticsResult {
    year: number;
    setYear: (year: number) => void;
    data: StatisticsResponse | null;
    loading: boolean;
    error: string | null;
}

export function useStatistics(): UseStatisticsResult {
    const [year, setYear] =
        useState<number>(DEFAULT_YEAR);

    const [data, setData] =
        useState<StatisticsResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadStatistics = async () => {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                const response = await fetch(
                    `/api/statistics?year=${year}`,
                    {
                        signal:
                        controller.signal,
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.error ??
                        "통계 데이터를 불러오지 못했습니다."
                    );
                }

                setData(
                    result as StatisticsResponse
                );
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name ===
                    "AbortError"
                ) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : "통계 데이터를 불러오지 못했습니다."
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        void loadStatistics();

        return () => {
            controller.abort();
        };
    }, [year]);

    const changeYear = (newYear: number) => {
        if (
            !AVAILABLE_YEARS.includes(
                newYear as (typeof AVAILABLE_YEARS)[number]
            )
        ) {
            return;
        }

        setYear(newYear);
    };

    return {
        year,
        setYear: changeYear,
        data,
        loading,
        error,
    };
}