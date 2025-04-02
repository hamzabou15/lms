import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data:[
                {name:"Computer Science"},
                {name:"Music"},
                {name:"Fitness"},
                {name:"Photography"},
                {name:"Accounting"},
                {name:"Enginnering"},
                {name:"Filming"},
            ]
        })

        console.log('success')
    } catch (error) {
        console.log("error seeding the db categories " , error)
    }  finally {
        await db.$disconnect();
    }
}

main();