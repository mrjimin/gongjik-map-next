"use client";

import React, { useEffect, useState } from "react";

const NAV_ITEMS = [
    {
        label: "전국 현황",
        href: "#overview",
        id: "overview",
    },
    {
        label: "지역 분석",
        href: "#region",
        id: "region",
    },
    {
        label: "직종 분석",
        href: "#occupation",
        id: "occupation",
    },
] as const;

const HEADER_HEIGHT = 64;
const ACTIVE_OFFSET = 40;

export function Header() {
    const [activeNav, setActiveNav] =
        useState("#overview");

    useEffect(() => {
        const sections = NAV_ITEMS.map((item) => ({
            ...item,
            element: document.getElementById(item.id),
        })).filter(
            (
                item
            ): item is typeof item & {
                element: HTMLElement;
            } => Boolean(item.element)
        );

        if (!sections.length) {
            return;
        }

        let ticking = false;

        const updateActiveNav = () => {
            const position =
                window.scrollY +
                HEADER_HEIGHT +
                ACTIVE_OFFSET;

            let active = sections[0];

            for (const section of sections) {
                if (
                    position >=
                    section.element.offsetTop
                ) {
                    active = section;
                } else {
                    break;
                }
            }

            setActiveNav((current) =>
                current === active.href
                    ? current
                    : active.href
            );

            ticking = false;
        };

        const handleScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;

            window.requestAnimationFrame(
                updateActiveNav
            );
        };

        updateActiveNav();

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateActiveNav
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );

            window.removeEventListener(
                "resize",
                updateActiveNav
            );
        };
    }, []);

    const handleNavClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        id: string,
        href: string
    ) => {
        event.preventDefault();

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        setActiveNav(href);

        const targetTop =
            element.getBoundingClientRect().top +
            window.scrollY -
            HEADER_HEIGHT;

        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: "smooth",
        });

        window.history.replaceState(
            null,
            "",
            href
        );
    };

    const handleLogoClick = (
        event: React.MouseEvent<HTMLAnchorElement>
    ) => {
        event.preventDefault();

        setActiveNav("#overview");

        window.scrollTo({
            top: 0,
            behavior: "auto",
        });

        window.history.replaceState(
            null,
            "",
            "#overview"
        );
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <a
                    href="#overview"
                    onClick={handleLogoClick}
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center shadow-sm transition-colors duration-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.svg" alt="South Korea Map Logo" className="h-full w-full" />
                    </div>

                    <div>
                        <div className="text-base font-bold tracking-tight text-slate-950">
                            공직지형도
                        </div>

                        <div className="hidden text-[11px] text-slate-400 sm:block">
                            지역과 직종으로 바라보는 대한민국 공무원
                        </div>
                    </div>
                </a>

                <nav
                    aria-label="주요 메뉴"
                    className="flex items-center gap-7"
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            activeNav === item.href;

                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={(event) =>
                                    handleNavClick(
                                        event,
                                        item.id,
                                        item.href
                                    )
                                }
                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }
                                className={`relative pb-1 text-sm transition-colors duration-200 ${
                                    isActive
                                        ? "font-bold text-blue-600"
                                        : "font-medium text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                {item.label}

                                <span
                                    aria-hidden="true"
                                    className={`absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ease-out ${
                                        isActive
                                            ? "w-full opacity-100"
                                            : "w-0 opacity-0"
                                    }`}
                                />
                            </a>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
