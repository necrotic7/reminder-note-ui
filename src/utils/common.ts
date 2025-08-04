export function DateToUnix(d: Date) {
    return Math.floor(d.getTime() / 1000);
}