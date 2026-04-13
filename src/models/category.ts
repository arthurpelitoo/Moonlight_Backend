export class CategoryEntity{
    constructor(
        public name: string,
        public description: string,
        public id_category?: number,
        public image?: string | undefined,
    ){}
}