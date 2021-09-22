import { registerEnumType } from "type-graphql";

export enum Category {
    animalsAndPlants = "animalsAndPlants",
    watersAndOceans = "watersAndOceans",
    sustainableAgricultureAndNutrition = "sustainableAgricultureAndNutrition",
    wasteAndRecycling = "wasteAndRecycling",
    industryTransformation = "industryTransformation",
    cultureAndArt = "cultureAndArt",
    protectionOfBasicNeeds = "protectionOfBasicNeeds",
    educationAndResearch = "educationAndResearch",
    energyAndMobility = "energyAndMobility"
 }

 registerEnumType(Category, {
    name: "Category",
    description: "Categories for impacts",
  });