export type CreateReminderForm = {
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    time: string;
    hour: string;
    minute: string;
    weekday: string;
    date: string;
    month: string;
    year: string;
    fullDate: Date | null;
};

export type ReqCreateReminderBody = {
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    remindTime: RemindTimeBody;
};

export type RemindTimeBody = {
    hour: number;
    minute: number;
    weekday: number;
    date: number;
    month: number;
    year: number;
};

export enum EnumReminderFrequency {
    Once = 'Once',
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Annually = 'Annually',
}

export const EnumReminderFrequencyName: Record<EnumReminderFrequency, string> =
    {
        Once: '單次',
        Daily: '每日',
        Weekly: '每週',
        Monthly: '每月',
        Annually: '每年',
    };

export type ReminderBody = {
    id: string;
    userID: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    remindTime: RemindTimeBody;
    createdAt: Date;
    updatedAt?: Date;
};

export type RespGetRemindersBody = {
    status: boolean;
    message: string;
    data: {
        counts: number;
        records: ReminderBody[];
    };
};

export type ReqGetReminderListBody = {
    userId: string;
    page?: number;
    pageSize?: number;
    createStartTime?: Date;
    createEndTime?: Date;
    title?: string;
    content?: string;
    frequency?: EnumReminderFrequency;
};

export type ReqDeleteReminderBody = {
    userId: string;
    id: string;
};

export type UpdateReminderForm = {
    id: string;
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    time: string;
    hour: string;
    minute: string;
    weekday: string;
    date: string;
    month: string;
    year: string;
    fullDate: Date | null;
};

export type ReqUpdateReminderBody = {
    id: string;
    userId: string;
    title: string;
    content: string;
    frequency: EnumReminderFrequency;
    remindTime: RemindTimeBody;
};
