type OrdersRepository = {
    id: number,
    table_session_id: number,
    product_id: number,
    quantity: number,
    price: number,
    created_at: Date,
    update_at: Date
}