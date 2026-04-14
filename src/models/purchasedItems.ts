export class PurchasedItemsEntity {
    constructor(
        public price: number,
        public id_game: number,
        public id_order: number
    ){}
}