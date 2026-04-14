export class OrderEntity {
    constructor(
        public status: string,
        public total: number,
        public order_date: string,
        public external_reference?: string,
        public preference_id?: string,
        public id_user?: number,
        public id_order?: number
    ){}
}