import { useEffect, useState } from "react";
import { GetUserReminders } from "../apis/reminders";
import RemindCalendar from "../components/RemindCalendar";

export default function Home() {
     // 狀態管理
  const [reminders, setReminders] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 打 API 的副作用
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const lineId = localStorage.getItem('lineId')!;
        const data = await GetUserReminders(lineId);
        setReminders(data);
      } catch (err) {
        setError('載入提醒失敗');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []); // 空陣列表示只在組件掛載時執行一次

  // 載入中顯示
  if (loading) {
    return (
      <div className="reminderHome">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">載入中...</span>
        </div>
      </div>
    );
  }

  // 錯誤顯示
  if (error) {
    return (
      <div className="reminderHome">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // 正常顯示
  return (
    <div className="reminderHome">
      <RemindCalendar events={reminders} />
    </div>
  );
}