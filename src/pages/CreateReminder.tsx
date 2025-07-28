import { useState } from "react";
import NavBar from '../components/NavBar'
export default function CreateReminder() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    // const [frequency, setFrequency] = useState('')
    // const [year, setYear] = useState()
    // const [month, setMonth] = useState()
    // const [date, setDate] = useState()
    // const [hour, setHour] = useState()
    // const [minute, setMinute] = useState()

    const submit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const lineId = localStorage.getItem('lineId')
        const payload = { userId: lineId, title, content }
        console.log('要送出的資料：', payload)
        // TODO 請求reminder-note-api
    }

    return (
        <>
            <NavBar />
            <div style={{ padding: '1rem' }}>
                <h2>新增提醒</h2>
                <form onSubmit={submit}>
                    <div>
                        <label>提醒名稱：</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        >
                        </input>
                    </div>
                    <div>
                        <label>提醒內容：</label>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        >
                        </input>
                    </div>
                    <button type="submit">送出</button>
                </form>
            </div>
        </>
    )
}