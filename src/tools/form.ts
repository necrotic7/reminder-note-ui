import { useState } from "react";

export function FormHelper<T>(fmt: T) {
    const [form, setForm] = useState(fmt)
    const setField = (key: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }
    return {
        form,
        setForm,
        setField,
    }
}