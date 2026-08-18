export interface StatisticsItem {
    bseYr: string;
    ctpCdNm: string;
    ststJclCsfCdNm: string;
    psePcnt: number;
}

export interface StatisticsResponse {
    items: StatisticsItem[];
    totalCount: number;
    pageNo: number;
    numOfRows: number;
}
