const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var report = {}
async function updateReport(msg) {

    const content = JSON.parse(msg.content)
    console.log(content)
    const products = content.products
    for (let product of products) {
        if (!product.name) {
            continue
        } else if (!report[product.name]) {
            report[product.name] = 1;
        } else {
            report[product.name]++;
        }
    }
    printReport()

}

async function printReport() {
    for (const [key, value] of Object.entries(report)) {
        console.log(`${key} = ${value} vendas`);
    }
}

async function consume() {
    console.log(`INSCRITO COM SUCESSO NA FILA: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => { updateReport(msg) })
}

consume()
