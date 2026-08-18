export const AVAILABLE_YEARS = [
    2025,
    2024,
    2023,
    2022,
    2021,
    2020,
] as const;

export const DEFAULT_YEAR = AVAILABLE_YEARS[0];

export const REGION_ORDER = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
] as const;

export type RegionName =
    (typeof REGION_ORDER)[number];

export const REGION_NAME_MAP = {
    Seoul: "서울",
    Busan: "부산",
    Daegu: "대구",
    Incheon: "인천",
    Gwangju: "광주",
    Daejeon: "대전",
    Ulsan: "울산",
    Sejong: "세종",
    Gyeonggi: "경기",
    Gangwon: "강원",
    "North Chungcheong": "충북",
    "South Chungcheong": "충남",
    "North Jeolla": "전북",
    "South Jeolla": "전남",
    "North Gyeongsang": "경북",
    "South Gyeongsang": "경남",
    Jeju: "제주",
} as const;

export type RegionMapKey =
    keyof typeof REGION_NAME_MAP;