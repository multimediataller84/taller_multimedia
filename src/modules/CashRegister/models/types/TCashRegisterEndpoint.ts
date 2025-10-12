export type TCashRegisterEndpoint = {
    id: number,
    opened_at: Date,
    closed_at: Date,
    opening_amount: number,
    amount: number,
    closing_amount: number,
    status: string,
    user_id: number
}
