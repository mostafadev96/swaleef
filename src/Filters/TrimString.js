export const TrimString = (string) => {
    return string.length > 100?string.substring(0,100)+"...":string;
}
