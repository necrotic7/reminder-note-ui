import { FormInstance } from "antd"

export interface FormHelper<T>  {
    form: T,
    setForm: React.Dispatch<React.SetStateAction<T>>,
    setField: (key: keyof T, value: any) => void
}