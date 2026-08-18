import type {
    StatisticsItem,
} from "@/lib/geps-types";

export interface RegionStatistic {
    region: string;
    count: number;
}

export interface OccupationStatistic {
    occupation: string;
    count: number;
}

export interface RegionOccupationStatistic {
    region: string;
    occupation: string;
    count: number;
}

export interface GepsStatistics {
    regions: RegionStatistic[];
    occupations: OccupationStatistic[];
    regionOccupations: RegionOccupationStatistic[];
    totalCount: number;
}

export function buildGepsStatistics(
    items: StatisticsItem[]
): GepsStatistics {
    const regionMap =
        new Map<string, number>();

    const occupationMap =
        new Map<string, number>();

    const regionOccupationMap =
        new Map<
            string,
            Map<string, number>
        >();

    let totalCount = 0;

    for (const item of items) {
        const region =
            item.ctpCdNm?.trim();

        const occupation =
            item.ststJclCsfCdNm?.trim();

        const count =
            Number(item.psePcnt) || 0;

        totalCount += count;

        if (region) {
            regionMap.set(
                region,
                (regionMap.get(region) ?? 0) +
                count
            );
        }

        if (occupation) {
            occupationMap.set(
                occupation,
                (occupationMap.get(
                    occupation
                ) ?? 0) + count
            );
        }

        if (
            region &&
            occupation
        ) {
            let occupations =
                regionOccupationMap.get(
                    region
                );

            if (!occupations) {
                occupations =
                    new Map<string, number>();

                regionOccupationMap.set(
                    region,
                    occupations
                );
            }

            occupations.set(
                occupation,
                (occupations.get(
                    occupation
                ) ?? 0) + count
            );
        }
    }

    const regions =
        Array.from(
            regionMap,
            ([region, count]) => ({
                region,
                count,
            })
        ).sort(
            (a, b) =>
                b.count - a.count
        );

    const occupations =
        Array.from(
            occupationMap,
            ([occupation, count]) => ({
                occupation,
                count,
            })
        ).sort(
            (a, b) =>
                b.count - a.count
        );

    const regionOccupations: RegionOccupationStatistic[] =
        [];

    for (
        const [
            region,
            occupations,
        ] of regionOccupationMap
        ) {
        for (
            const [
                occupation,
                count,
            ] of occupations
            ) {
            regionOccupations.push({
                region,
                occupation,
                count,
            });
        }
    }

    regionOccupations.sort(
        (a, b) =>
            b.count - a.count
    );

    return {
        regions,
        occupations,
        regionOccupations,
        totalCount,
    };
}
