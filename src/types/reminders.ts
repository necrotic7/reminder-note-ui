export class CreateReminderForm {
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    time: string;
    hour: number;
    minute: number;
    weekday: number;
    date: number;
    month: number;
    year: number;
    fullDate: Date | null
}

export type ReqCreateReminderPayload = {
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    remindTime: {
        hour: number;
        minute: number;
        weekday: number;
        date: number;
        month: number;
        year: number;
    }
}

export enum EnumReminderFrequency {
    Once = 'Once',
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Annually = 'Annually',
}

export const EnumReminderFrequencyName: Record<EnumReminderFrequency, string> = {
    Once: '單次',
    Daily: '每日',
    Weekly: '每週',
    Monthly: '每月',
    Annually: '每年',
}