import { FormInstance } from "antd"

export interface FormHelper<T>  {
    form: T,
    setForm: React.Dispatch<React.SetStateAction<T>>,
    setField: (key: keyof T, value: any) => void
}

export interface AntdFormHelper<T>  {
    form: FormInstance<T>,
    setForm: (values: Partial<T>) => void,
    setField: (key: keyof T, value: any) => void
    getFields: () => T,
}