import { useRef } from 'react';

export function TimePicker({
    value,
    onChange,
    className = '',
}: {
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={`form-control relative ${className}`}>
            <button
                type="button"
                onClick={() => inputRef.current?.showPicker()}
                className="input input-bordered flex items-center justify-between cursor-pointer hover:border-primary focus:border-primary focus:outline-none relative z-1"
            >
                <span
                    className={
                        value ? 'text-base-content' : 'text-base-content/50'
                    }
                >
                    {value}
                </span>
                <svg
                    className="w-4 h-4 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </button>

            {/* input 放在按鈕的相同位置，但透明且不可互動 */}
            <input
                ref={inputRef}
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none z-0"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
