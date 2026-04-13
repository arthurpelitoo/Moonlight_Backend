export class GameEntity {
    constructor(
        public title: string,
        public price: number,
        public launch_date: Date,
        public active: boolean,
        public id_game?: number,
        public description?: string | undefined,
        public image?: string | undefined,
        public banner_image?: string | undefined,
        public link?: string | undefined,
    ){}
}