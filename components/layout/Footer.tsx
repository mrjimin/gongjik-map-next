const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <h2 className="text-sm font-bold text-slate-800">
                    공직지형도
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    공무원연금공단{" "}
                    <span className="font-medium text-slate-500">
                        직종별 지역별 재직자현황 조회 서비스
                    </span>
                    를 활용하여 제작한 개인 프로젝트입니다.
                </p>

                <p className="mt-4 text-xs leading-5 text-slate-400">
                    공공데이터를 활용한 비공식 개인 프로젝트입니다.
                    <br className="sm:hidden" />
                    우석고등학교 및 국가기관과는 관련이 없습니다.
                </p>

                <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {CURRENT_YEAR} 공직지형도 · All rights reserved.</span>

                    <span>
                        Supported by{" "}
                        <span className="font-medium text-slate-500">
                            우석고등학교 (공돌이)
                        </span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
