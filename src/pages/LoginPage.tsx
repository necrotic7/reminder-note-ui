import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import liff from '@line/liff'

function LoginPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const init = async () => {
            try {
                await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID }) // 這裡填你在 LINE Developer 建好的 LIFF ID
                console.log('LIFF 初始化成功')
            } catch (err) {
                console.error('LIFF 初始化失敗', err)
            }
            if (!liff.isLoggedIn()) {
                liff.login()
            } else {
                const profile = await liff.getProfile()
                localStorage.setItem('lineId', profile.userId)
                navigate('/home') // 成功後導到 home 頁面
            }
        }
        init()
    })
    return <div>登入中...</div>
}

export default LoginPage