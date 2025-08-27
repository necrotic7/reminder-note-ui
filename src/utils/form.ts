import { useCallback, useEffect, useState } from 'react';
import { AntdFormHelper, FormHelper } from '../types/utils';
import { Form } from 'antd';

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


export function useAntdFormHelper<T>(init?: Partial<T>): AntdFormHelper<T> {
  const [form] = Form.useForm();

  useEffect(() => {
    if (init) {
      form.setFieldsValue(init);
    }
  }, [init, form]);

  const setField = useCallback(
    (key: keyof T, value: any) => {
      form.setFieldValue(key as string, value);
    },
    [form]
  );

  const setForm = useCallback(
    (values: Partial<T>) => {
      form.setFieldsValue(values);
    },
    [form]
  );

  const getFields = useCallback((): T => {
    return form.getFieldsValue(true) as T;
  }, [form]);

  return {
    form: form,
    setField,
    setForm,
    getFields,
  };
}