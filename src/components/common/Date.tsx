import { Select } from "antd";

export const DaySelect = (props: any) => (
    <Select<number>
        {...props}
    >
        {[...Array(31)].map((_, i) => (
            <option key={i} value={i + 1}>
                {i + 1} 日
            </option>
        ))}
    </Select>
);

export const WeekdaySelect = (props: any) => (
<Select {...props}>
    {[...Array(7)].map((_, i) => (
        <Select.Option
            key={i}
            value={i}
        >{`星期${'日一二三四五六'[i]}`}</Select.Option>
    ))}
</Select>)

