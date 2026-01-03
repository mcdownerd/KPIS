
import { getSalesSummaryMetrics } from "./lib/api/service";

async function test() {
    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][currentMonthIndex];

    const amadoraId = "f86b0b1f-05d0-4310-a655-a92ca1ab68bf";
    const queluzId = "fcf80b5a-b658-48f3-871c-ac62120c5a78";

    console.log(`Testing for month: ${currentMonthName}`);

    try {
        const amadoraData = await getSalesSummaryMetrics(currentMonthName, amadoraId);
        console.log("Amadora Data:", amadoraData);
    } catch (e) {
        console.error("Error fetching Amadora:", e);
    }

    try {
        const queluzData = await getSalesSummaryMetrics(currentMonthName, queluzId);
        console.log("Queluz Data:", queluzData);
    } catch (e) {
        console.error("Error fetching Queluz:", e);
    }
}

test();
