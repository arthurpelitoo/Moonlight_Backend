type FilterType = 'like' | 'exact' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'boolean';

export type FilterConfig<FilterKeys extends string = string> = Record<FilterKeys, {
    type: FilterType, 
    column: string
}>;


/**
 * como funciona?
 * 
 * FilterConfig precisa receber o nome de cada filtro como string na tipagem.
 * 
 * aí o Record é um objeto
 * onde o primeiro parametro do tipo é o nome do objeto
 * e o segundo parametro é o conteudo desse objeto.
 * 
 * nesse caso, onde cada nome ou chave de filtro precisa corresponder a string fornecida na tipagem
 * 
 * se o nome do filtro for name, então o nome do objeto precisa ser name
 * pra acessar os valores do objeto no filterBuilder.
 * 
 * exemplo:
 * 
 *      type CategoryKeyFilters = "name";
 * 
 *      const categoryFilterConfig: FilterConfig<CategoryKeyFilters> = {
 *          name: { type: 'like', column: 'c.name' },
 *      };
 * 
 *      func(config: FilterConfig){
 *          for (const key of Object.keys(config) as (keyof typeof config)[]){
 *                  const entry = config[key]; //acesso o objeto "name" com o valor do type e column
 *                                              //dessa maneira consigo ter autocomplete deles extendendo.
 * 
 *                  switch(entry.type){
 *                  case `like`:
 *                      where += ` AND ${entry.column} LIKE ?`;
 *                      params.push(`%${value}%`); // value é o valor de cada item no objeto da query.
 *                      break;
 *                  }
 *          }
 *      }
 */