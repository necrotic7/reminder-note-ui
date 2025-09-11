import { JSX, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import liff from '@line/liff';
import { EnumLocalStorageKey } from '../consts/localStorage';
import { Alert, Button, Card, Divider, Flex, Space, Spin } from 'antd';

function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // 初始化 LIFF
                await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID });

                // 檢查登入狀態
                let isLoggedIn = liff.isLoggedIn();

                if (isLoggedIn) {
                    const profile = await liff.getProfile();
                    localStorage.setItem(EnumLocalStorageKey.LineID, profile.userId);
                    localStorage.setItem(EnumLocalStorageKey.LineDisplayName, profile.displayName);
                    navigate('/');
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                if (
                    err.message.includes('invalid authorization code') ||
                    err.message.includes('authorization')
                ) {
                    console.log('忽略 authorization code 錯誤');
                    init();
                } else {
                    console.error('LIFF 初始化失敗:', err);
                    setError(`初始化失敗: ${err.message}`);
                    setIsLoading(false);
                }
            }
        };

        init();
        return;
    }, [navigate]);

    const handleLogin = useCallback(() => {
        try {
            liff.login();
        } catch (err) {
            console.error('登入失敗:', err);
            setError(`登入失敗: ${err.message}`);
        }
    }, []);

    let component: JSX.Element;

    if (error) {
        component = (
            <>
                <Alert
                    message="發生錯誤"
                    description={error}
                    type="error"
                    showIcon
                    style={{ margin: 20 }}
                />
                <Button
                    color='blue'
                    variant='solid'
                    onClick={() => window.location.reload()}>
                    重新整理頁面
                </Button>
            </>
        )
    } else if (isLoading) {
        component = (
           <Space direction="vertical" size="large" align='center' style={{ display: 'flex' }}>
                <Spin /> 
                <p>正在初始化 LINE 登入服務</p>
            </Space>
        );
    } else {
        component = (
            <>
                <h2 className="text-4xl font-bold">
                    歡迎使用 提醒助手
                </h2>
                <p style={{ color: '#ffffff88' }}>
                    請使用 LINE 帳號登入以繼續使用服務
                </p>
                <Card
                    style={{ width: '30vw', boxShadow: 'inherit', background: '#272727ff', margin: 10 }}
                >
                    <Flex vertical justify='center' align='center' >
                        <Button
                            color='cyan'
                            variant='solid'
                            onClick={handleLogin}
                            style={{ width: '20vw', marginBottom: 5 }}
                        >
                            LINE 登入
                        </Button>
                        <Divider style={{ borderColor: '#ffffff88' }}>
                            安全快速登入
                        </Divider>
                        <p style={{ color: '#ffffff88' }}>
                            使用 LINE 帳號，無需另外註冊
                        </p>
                    </Flex>
                </Card>
            </>
        )
    }

    return (
        <Flex vertical justify='center' align='center' style={{ height: '100vh' }}>
            {component}
        </Flex>
    )
}

export default LoginPage;
