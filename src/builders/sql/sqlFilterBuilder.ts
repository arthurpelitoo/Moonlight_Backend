import type { FilterConfig } from "./filterConfigType.js";

export function buildSqlFilters(query: Record<string, any>, config: FilterConfig){
    let where = "WHERE 1=1";
    const params: any[] = [];

    for (const key of Object.keys(config) as (keyof typeof config)[]){

        const entry = config[key]; //objeto filterConfig["nome do filtro"]
        if(!entry) continue;

        const value = query[key]; //objeto da query["nome do item da query"]
        if(value === null || value === undefined) continue

        switch(entry.type){
            case `like`:
                where += ` AND ${entry.column} LIKE ?`;
                params.push(`%${value}%`);
                break;
            case `exact`:
                where += ` AND ${entry.column} = ?`;
                params.push(value);
                break;
            case `boolean`:
                where += ` AND ${entry.column} = ?`;
                params.push(value ? 1 : 0);
                break;
            case `greaterThanOrEqual`:
                where += ` AND ${entry.column} >= ?`;
                params.push(value);
                break;
            case `lessThanOrEqual`:
                where += ` AND ${entry.column} <= ?`;
                params.push(value);
                break;
        }
    }
    return {where, params}
}