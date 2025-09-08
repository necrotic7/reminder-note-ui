
import { Form, FormInstance, Pagination } from 'antd';
import { useWatch } from 'antd/es/form/Form';

export function FormPagination({
    form,
    total,
}: {
    form: FormInstance;
    total: number;
}) {
    const page = useWatch('page', form)
    const pageSize = useWatch('pageSize', form)
    return (
        <Form
            form={form}
        >
            <Form.Item name="page" noStyle></Form.Item>
            <Form.Item name="pageSize" noStyle></Form.Item>
            <Form.Item>
                <Pagination
                    total={total}
                    current={page}
                    pageSize={pageSize}
                    showSizeChanger
                    onChange={(page, pageSize) => {
                        form.setFieldsValue({
                            page,
                            pageSize,
                        })
                    }}
                />
            </Form.Item>
        </Form>
    )
}
