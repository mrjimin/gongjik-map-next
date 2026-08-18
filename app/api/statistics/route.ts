import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    fetchAllGepsStatistics,
} from "@/lib/geps-api";

export async function GET(
    request: NextRequest
) {
    try {
        const searchParams =
            request.nextUrl.searchParams;

        const yearParam =
            searchParams.get("year");

        if (!yearParam) {
            return NextResponse.json(
                {
                    error:
                        "year 파라미터가 필요합니다.",
                },
                { status: 400 }
            );
        }

        const year =
            Number(yearParam);

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > 2100
        ) {
            return NextResponse.json(
                {
                    error:
                        "올바른 기준연도를 입력해주세요.",
                },
                { status: 400 }
            );
        }

        const items =
            await fetchAllGepsStatistics(
                year
            );

        return NextResponse.json({
            items,
            totalCount:
            items.length,
            pageNo: 1,
            numOfRows:
            items.length,
        });
    } catch (error) {
        console.error(
            "[GET /api/statistics]",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "통계 데이터를 불러오는 중 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}
