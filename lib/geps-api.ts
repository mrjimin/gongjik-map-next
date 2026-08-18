const GEPS_API_URL =
    "https://apis.data.go.kr/B552640/GepsJclAreHofrInfoService/selectListJclAreHofrPrsD";

const PAGE_SIZE = 100;
const MAX_PAGE_CONCURRENCY = 4;

export interface GepsApiParams {
    year: number;
    page?: number;
    size?: number;
    occupation?: string;
    region?: string;
}

export interface GepsApiItem {
    bseYr: string;
    ctpCdNm: string;
    ststJclCsfCdNm: string;
    psePcnt: number;
}

interface GepsApiResponse {
    items?: GepsApiItem[];
    totalCount?: number;
    pageNo?: number;
    numOfRows?: number;
    response?: {
        header?: {
            pageNo?: number;
            resultCode?: string;
            resultMsg?: string;
            totalCount?: number;
            numOfRows?: number;
        };
        body?: {
            items?:
                | {
                item?:
                    | GepsApiItem
                    | GepsApiItem[];
            }
                | GepsApiItem[];
        };
    };
}

export interface GepsStatisticsResult {
    items: GepsApiItem[];
    totalCount: number;
    pageNo: number;
    numOfRows: number;
}

function normalizeItems(
    raw: unknown
): GepsApiItem[] {
    if (Array.isArray(raw)) {
        return raw as GepsApiItem[];
    }

    if (
        typeof raw !== "object" ||
        raw === null ||
        !("item" in raw)
    ) {
        return [];
    }

    const item = (
        raw as {
            item?: GepsApiItem | GepsApiItem[];
        }
    ).item;

    if (!item) {
        return [];
    }

    return Array.isArray(item)
        ? item
        : [item];
}

function parseGepsResponse(
    data: GepsApiResponse,
    page: number,
    size: number
): GepsStatisticsResult {
    if (Array.isArray(data.items)) {
        return {
            items: data.items,
            totalCount: Number(
                data.totalCount ?? 0
            ),
            pageNo: Number(
                data.pageNo ?? page
            ),
            numOfRows: Number(
                data.numOfRows ?? size
            ),
        };
    }

    const response =
        data.response;

    if (!response) {
        throw new Error(
            "공공데이터 API 응답 형식이 올바르지 않습니다."
        );
    }

    const header =
        response.header;

    const resultCode =
        String(
            header?.resultCode ?? ""
        );

    if (
        resultCode &&
        resultCode !== "0" &&
        resultCode !== "00"
    ) {
        throw new Error(
            header?.resultMsg ??
            "공공데이터 API 오류"
        );
    }

    return {
        items: normalizeItems(
            response.body?.items
        ),
        totalCount: Number(
            header?.totalCount ?? 0
        ),
        pageNo: Number(
            header?.pageNo ?? page
        ),
        numOfRows: Number(
            header?.numOfRows ?? size
        ),
    };
}

export async function fetchGepsStatistics({
                                              year,
                                              page = 1,
                                              size = PAGE_SIZE,
                                              occupation,
                                              region,
                                          }: GepsApiParams): Promise<GepsStatisticsResult> {
    const serviceKey =
        process.env.DATA_GO_KR_SERVICE_KEY;

    if (!serviceKey) {
        throw new Error(
            "DATA_GO_KR_SERVICE_KEY 환경변수가 설정되지 않았습니다."
        );
    }

    const safeSize = Math.min(
        Math.max(size, 1),
        PAGE_SIZE
    );

    const params = new URLSearchParams({
        ServiceKey: serviceKey,
        pageNo: String(page),
        numOfRows: String(safeSize),
        viewType: "json",
        bseYr: String(year),
    });

    if (occupation) {
        params.set(
            "ststJclCsfCdNm",
            occupation
        );
    }

    if (region) {
        params.set(
            "ctpCdNm",
            region
        );
    }

    const response = await fetch(
        `${GEPS_API_URL}?${params.toString()}`,
        {
            next: {
                revalidate: 3600,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `공공데이터 API HTTP 오류: ${response.status}`
        );
    }

    let data: GepsApiResponse;

    try {
        data =
            (await response.json()) as GepsApiResponse;
    } catch {
        throw new Error(
            "공공데이터 API 응답을 JSON으로 변환할 수 없습니다."
        );
    }

    return parseGepsResponse(
        data,
        page,
        safeSize
    );
}

function chunk<T>(
    array: T[],
    size: number
): T[][] {
    const result: T[][] = [];

    for (
        let i = 0;
        i < array.length;
        i += size
    ) {
        result.push(
            array.slice(i, i + size)
        );
    }

    return result;
}

export async function fetchAllGepsStatistics(
    year: number
): Promise<GepsApiItem[]> {
    const firstPage =
        await fetchGepsStatistics({
            year,
            page: 1,
            size: PAGE_SIZE,
        });

    const {
        items: firstItems,
        totalCount,
    } = firstPage;

    if (
        totalCount <=
        firstItems.length
    ) {
        return firstItems;
    }

    const totalPages =
        Math.ceil(
            totalCount / PAGE_SIZE
        );

    const remainingPages =
        Array.from(
            {
                length:
                    totalPages - 1,
            },
            (_, index) =>
                index + 2
        );

    const allItems: GepsApiItem[] = [
        ...firstItems,
    ];

    const pageChunks = chunk(
        remainingPages,
        MAX_PAGE_CONCURRENCY
    );

    for (
        const pages of pageChunks
        ) {
        const results =
            await Promise.all(
                pages.map(
                    (page) =>
                        fetchGepsStatistics(
                            {
                                year,
                                page,
                                size: PAGE_SIZE,
                            }
                        )
                )
            );

        for (
            const result of results
            ) {
            allItems.push(
                ...result.items
            );
        }
    }

    return allItems.slice(
        0,
        totalCount
    );
}
