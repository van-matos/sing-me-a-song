import recommendationFactory from "./recommendationFactory";

export default async function recommendationListFactory() {
    let counter = 0;
        
        while (counter < 15) {
            await recommendationFactory();
            counter++;
        }
    
    return;
}