export const DaySelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <select className="select select-bordered w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        <option disabled value="">選擇日期</option>
        {[...Array(31)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1} 日</option>
        ))}
    </select>
)

export const MonthSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <select className="select select-bordered w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        <option disabled value="">選擇月份</option>
        {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1} 月</option>
        ))}
    </select>
)