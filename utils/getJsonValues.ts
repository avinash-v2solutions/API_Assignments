// Function to fetch a value from a JSON object based on a JSON path
export function getJsonValueByPath(obj: any, path: string): any {
    const pathArray = path.split('.');
    return pathArray.reduce((acc, key) => {
        return acc ? acc[key] : undefined;
    }, obj);
}