"use client";

import React, { useMemo, useState } from "react";

import koreaMap from "@svg-maps/south-korea";

import type { RegionStatistic } from "@/lib/geps-statistics";
import {
    REGION_NAME_MAP,
    type RegionMapKey,
} from "@/lib/constants";

interface RegionMapProps {
    data: RegionStatistic[];
    selectedRegion: string | null;
    onRegionSelect: (region: string | null) => void;
}

interface KoreaMapLocation {
    id: string;
    name: string;
    path: string;
}

interface TooltipState {
    region: string;
    count: number;
    x: number;
    y: number;
}

const locations =
    koreaMap.locations as KoreaMapLocation[];

function getRegionColor(
    count: number,
    max: number
): string {
    if (count <= 0 || max <= 0) {
        return "#EEF3FA";
    }

    const ratio = count / max;

    if (ratio >= 0.8) return "#2563EB";
    if (ratio >= 0.6) return "#4F83F1";
    if (ratio >= 0.4) return "#7AA3F5";
    if (ratio >= 0.2) return "#A9C2F8";

    return "#D4E1FA";
}

function isRegionMapKey(
    value: string
): value is RegionMapKey {
    return value in REGION_NAME_MAP;
}

export function RegionMap({
                              data,
                              selectedRegion,
                              onRegionSelect,
                          }: RegionMapProps) {
    const [tooltip, setTooltip] =
        useState<TooltipState | null>(null);

    const [mapScale, setMapScale] =
        useState(1);

    const dataMap = useMemo(
        () =>
            new Map(
                data.map(({ region, count }) => [
                    region,
                    count,
                ])
            ),
        [data]
    );

    const max = useMemo(
        () =>
            Math.max(
                ...data.map((item) => item.count),
                1
            ),
        [data]
    );

    const handleRegionClick = (
        region: string
    ) => {
        onRegionSelect(
            selectedRegion === region
                ? null
                : region
        );

        requestAnimationFrame(() => {
            document
                .getElementById("occupation")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        });
    };

    const handleMouseEnter = (
        event: React.MouseEvent<SVGPathElement>,
        region: string,
        count: number
    ) => {
        setTooltip({
            region,
            count,
            x: event.clientX,
            y: event.clientY,
        });
    };

    const handleMouseMove = (
        event: React.MouseEvent<SVGPathElement>
    ) => {
        setTooltip((current) =>
            current
                ? {
                    ...current,
                    x: event.clientX,
                    y: event.clientY,
                }
                : null
        );
    };

    const zoomIn = () => {
        setMapScale((scale) =>
            Math.min(scale + 0.1, 1.5)
        );
    };

    const zoomOut = () => {
        setMapScale((scale) =>
            Math.max(scale - 0.1, 0.8)
        );
    };

    const resetZoom = () => {
        setMapScale(1);
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950">
                    지역별 분포
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                    지역을 클릭하면 해당 지역의
                    직종별 현황을 확인할 수 있습니다.
                </p>
            </div>

            <div className="mb-1 flex min-h-9 items-center">
                {selectedRegion ? (
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                            {selectedRegion}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                onRegionSelect(null)
                            }
                            className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
                        >
                            선택 해제
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">
                        현재 전국 기준
                    </span>
                )}
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-slate-50 to-white">
                <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button
                        type="button"
                        onClick={zoomIn}
                        disabled={mapScale >= 1.5}
                        aria-label="지도 확대"
                        className="flex h-9 w-9 items-center justify-center text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        +
                    </button>

                    <div className="h-px bg-slate-200" />

                    <button
                        type="button"
                        onClick={zoomOut}
                        disabled={mapScale <= 0.8}
                        aria-label="지도 축소"
                        className="flex h-9 w-9 items-center justify-center text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        −
                    </button>

                    <div className="h-px bg-slate-200" />

                    <button
                        type="button"
                        onClick={resetZoom}
                        aria-label="지도 크기 초기화"
                        className="flex h-9 w-9 items-center justify-center text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600"
                    >
                        100
                    </button>
                </div>

                <div className="flex min-h-130 items-center justify-center px-8 py-14">
                    <svg
                        viewBox={koreaMap.viewBox}
                        role="img"
                        aria-label="대한민국 지역별 공무원 분포"
                        className="h-auto w-full max-w-150 overflow-visible transition-transform duration-300 ease-out"
                        style={{
                            transform: `scale(${mapScale})`,
                        }}
                    >
                        {locations.map((location) => {
                            if (
                                !isRegionMapKey(
                                    location.name
                                )
                            ) {
                                return null;
                            }

                            const region =
                                REGION_NAME_MAP[
                                    location.name
                                    ];

                            const count =
                                dataMap.get(region) ?? 0;

                            const isSelected =
                                selectedRegion === region;

                            const isHovered =
                                tooltip?.region === region;

                            return (
                                <path
                                    key={location.id}
                                    d={location.path}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${region} ${count.toLocaleString("ko-KR")}명`}
                                    onClick={() =>
                                        handleRegionClick(
                                            region
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key ===
                                            "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            handleRegionClick(
                                                region
                                            );
                                        }
                                    }}
                                    onMouseEnter={(event) =>
                                        handleMouseEnter(
                                            event,
                                            region,
                                            count
                                        )
                                    }
                                    onMouseMove={
                                        handleMouseMove
                                    }
                                    onMouseLeave={() =>
                                        setTooltip(null)
                                    }
                                    className="cursor-pointer outline-none transition-all duration-200"
                                    stroke={
                                        isSelected
                                            ? "#60A5FA"
                                            : "#FFFFFF"
                                    }
                                    strokeWidth={
                                        isSelected
                                            ? 3
                                            : isHovered
                                                ? 2
                                                : 1
                                    }
                                    strokeLinejoin="round"
                                    style={{
                                        fill: isSelected
                                            ? "#93C5FD"
                                            : getRegionColor(
                                                count,
                                                max
                                            ),
                                        filter: isSelected
                                            ? "drop-shadow(0 3px 5px rgba(37, 99, 235, 0.2))"
                                            : isHovered
                                                ? "brightness(0.95)"
                                                : "none",
                                    }}
                                />
                            );
                        })}
                    </svg>
                </div>

                {tooltip && (
                    <div
                        className="pointer-events-none fixed z-50 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg ring-1 ring-black/5"
                        style={{
                            left: tooltip.x,
                            top: tooltip.y,
                            transform:
                                "translate(-50%, calc(-100% - 14px))",
                        }}
                    >
                        <div className="text-xs font-medium text-slate-400">
                            {tooltip.region}
                        </div>

                        <div className="mt-1 text-sm font-bold tabular-nums text-slate-900">
                            {tooltip.count.toLocaleString(
                                "ko-KR"
                            )}
                            <span className="ml-1 font-medium text-slate-500">
                                명
                            </span>
                        </div>

                        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white" />
                    </div>
                )}

                <div className="absolute bottom-4 right-4 rounded-lg bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 shadow-sm backdrop-blur">
                    {Math.round(mapScale * 100)}%
                </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
                <span className="text-xs text-slate-400">
                    적음
                </span>

                <div className="flex h-2 w-32 overflow-hidden rounded-full">
                    <div className="flex-1 bg-[#D4E1FA]" />
                    <div className="flex-1 bg-[#A9C2F8]" />
                    <div className="flex-1 bg-[#7AA3F5]" />
                    <div className="flex-1 bg-[#4F83F1]" />
                    <div className="flex-1 bg-[#2563EB]" />
                </div>

                <span className="text-xs text-slate-400">
                    많음
                </span>
            </div>
        </section>
    );
}