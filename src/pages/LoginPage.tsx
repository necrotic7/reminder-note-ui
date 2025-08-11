import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import liff from '@line/liff'

function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string|null>(null)

    useEffect(() => {
        let isMounted = true

        const init = async () => {
            try {
                // 初始化 LIFF
                await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID })
                
                if (!isMounted) return
                
                // 等待 LIFF 完全就緒
                await new Promise(resolve => setTimeout(resolve, 200))
                
                if (!isMounted) return

                // 檢查登入狀態 (忽略 authorization code 錯誤)
                let isLoggedIn = false
                try {
                    isLoggedIn = liff.isLoggedIn()
                } catch (err) {
                    if (err.message.includes('invalid authorization code') || 
                        err.message.includes('authorization')) {
                        console.log('忽略 authorization code 錯誤，視為未登入')
                        isLoggedIn = false
                    } else {
                        throw err
                    }
                }
                
                if (!isMounted) return
                
                if (isLoggedIn) {
                    const profile = await liff.getProfile()
                    if (isMounted) {
                        localStorage.setItem('lineId', profile.userId)
                        navigate('/home')
                    }
                } else {
                    if (isMounted) setIsLoading(false)
                }
                
            } catch (err) {
                console.error('LIFF 初始化失敗:', err)
                if (isMounted) {
                    setError(`初始化失敗: ${err.message}`)
                    setIsLoading(false)
                }
            }
        }

        init()

        return () => {
            isMounted = false
        }
    }, [navigate])

    const handleLogin = useCallback(() => {
        try {
            liff.login()
        } catch (err) {
            console.error('登入失敗:', err)
            setError(`登入失敗: ${err.message}`)
        }
    }, [])

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>發生錯誤</h3>
                <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
                <button onClick={() => window.location.reload()}>
                    重新整理頁面
                </button>
            </div>
        )
    }

    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>載入中...</div>
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>LINE 登入</h2>
            <p>請點擊下方按鈕使用 LINE 帳號登入</p>
            <button 
                onClick={handleLogin}
                style={{ 
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#00B900',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                LINE 登入
            </button>
        </div>
    )
}


export default LoginPage