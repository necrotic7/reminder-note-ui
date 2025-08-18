import { useState } from "react";

export function FormHelper<T>(init: Partial<Record<keyof T, any>>) {
    const [form, setForm] = useState<T>(init as any)
    const setField = (key: keyof typeof form, value: any) => {
        setForm(prev => {
            return { ...prev, [key]: value }
        })
    }
    return {
        form,
        setForm,
        setField,
    }
}