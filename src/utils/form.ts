import { useState } from 'react';
import { FormHelper } from '../types/utils';

export function useFormHelper<T>(init: Partial<Record<keyof T, any>>): FormHelper<T> {
    const [form, setForm] = useState<T>(init as T);

    const setField = (key: keyof T, value: any) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return {
        form,
        setForm,
        setField,
    };
}