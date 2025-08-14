import { useMemo } from "react";

export const Pagination = ({
    currentPage = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    showSizeChanger = false,
    pageSizeOptions = [10, 20, 50, 100],
    onPageSizeChange,
    showQuickJumper = false,
    showTotal = false,
    maxVisiblePages = 5
}) => {
    // 計算總頁數
    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / pageSize);
    }, [totalItems, pageSize]);

    // 計算顯示的頁碼範圍
    const visiblePages = useMemo(() => {
        const pages: number[] = [];
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        // 調整起始位置
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }, [currentPage, totalPages, maxVisiblePages]);

    // 處理快速跳轉
    const handleQuickJump = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
                onPageChange(page);
                e.target.value = '';
            }
        }
    };

    // 計算顯示的資料範圍
    const getDataRange = () => {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalItems);
        return { start, end };
    };

    const { start, end } = getDataRange();

    return (
        <div>
            {/* 總計資訊 */}
            {showTotal && (
                <div className=" flex flex-col  items-center text-sm text-gray-600 p-4">
                    顯示 {start}-{end} 筆，共 {totalItems} 筆資料
                </div>
            )}
        <div className="flex flex-col  items-center gap-4 p-4">
            <div className="flex items-center gap-4">
                {/* 每頁筆數選擇器 */}
                {showSizeChanger && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">每頁</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
                            className="select select-bordered select-sm"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span className="text-sm">筆</span>
                    </div>
                )}

                {/* 分頁控制 */}
                <div className="flex items-center gap-1">
                    {/* 第一頁 */}
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="btn btn-sm btn-outline"
                        title="第一頁"
                    >
                        ⏮
                    </button>

                    {/* 上一頁 */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-sm btn-outline"
                        title="上一頁"
                    >
                        ⏴
                    </button>

                    {/* 頁碼 */}
                    {visiblePages[0] > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="btn btn-sm btn-outline"
                            >
                                1
                            </button>
                            {visiblePages[0] > 2 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                        </>
                    )}

                    {visiblePages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`btn btn-sm ${page === currentPage
                                    ? 'btn-primary'
                                    : 'btn-outline'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && (
                        <>
                            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="btn btn-sm btn-outline"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    {/* 下一頁 */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm btn-outline"
                        title="下一頁"
                    >
                        ⏵
                    </button>

                    {/* 最後一頁 */}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm btn-outline"
                        title="最後一頁"
                    >
                        ⏭
                    </button>
                </div>

                {/* 快速跳轉 */}
                {showQuickJumper && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">跳至</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            className="input input-bordered input-sm w-16 text-center"
                            placeholder="頁"
                            onKeyPress={handleQuickJump}
                        />
                        <span className="text-sm">頁</span>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};