//ORDEM: dc src/config/testConnection.ts
const db = require('./database');

async function listProduct(){
    try {
        // O [rows] é um "destructuring" para pegar só os dados da tabela
        const [rows] = await db.query('SELECT * FROM user');
        console.log(rows);
    } catch (err) {
        console.error("Erro no banco:", err);
    }
}