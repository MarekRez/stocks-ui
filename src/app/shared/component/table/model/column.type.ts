export type Column<T> = {
    label: string; // The label of the column
    text?: string; // The text to be displayed in the column
    attribute?: keyof T; // The attribute of the object to be displayed in the column
    onClick?: (row: T) => void; // The function to be called when the row is clicked
    width?: string; // The width of the column
}
