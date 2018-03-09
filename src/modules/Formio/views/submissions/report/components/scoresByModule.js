let ScoresByModule = class {
  static get() {
    return [
      {
        moduleNumber: 2,
        moduleName: "Household",
        academic: "AG-hh-ac-average",
        importance: "AG-hh-ac-imp",
        adequacy: "AG-hh-ac-adq",
        adequacyElements: ["AG-hh-activityNeeds"],
        importanceElements: ["AG-hh-importantActivities"],
        pillar: "Agronomic",
        abbreviation: "Household"
      },
      {
        moduleNumber: 3,
        moduleName: "Agricultural Production Activities",
        academic: "AG-agr-ac-average",
        importance: "AG-agr-imp",
        adequacy: "AG-agr-adq",
        adequacyElements: ["AG-agr-suffHouseholdNeeds"],
        importanceElements: ["AG-agr-diversityFarmSystem"],
        pillar: "Agronomic",
        abbreviation: "Agricultural activities "
      },
      {
        moduleNumber: 4,
        moduleName: "Non-farm Income Generating Activities (IGAS)",
        academic: "EC-iga-ac-average",
        importance: "EC-iga-imp",
        adequacy: "EC-iga-adq",
        adequacyElements: ["EC-iga-igasSufficient"],
        importanceElements: ["EC-iga-igasLivelihood"],
        pillar: "Economic",
        abbreviation: "Non-farm IGA"
      },
      {
        moduleNumber: 5,
        moduleName: "Land Access",
        academic: "EN-landac-ac-average",
        importance: "EN-landac-imp",
        adequacy: "EN-landac-adq",
        adequacyElements: ["EN-landac-adequateAccess"],
        importanceElements: ["EN-landac-communalLandAccess"],
        pillar: "Environment",
        abbreviation: "Land access"
      },
      {
        moduleNumber: 6,
        moduleName: "Crop Production",
        academic: "AG-crop-ac-average",
        importance: "AG-crop-imp",
        adequacy: "AG-crop-adq",
        adequacyElements: ["AG-crop-sufficientFarmSystem"],
        importanceElements: ["AG-crop-importantDifferentCrops"],
        pillar: "Agronomic",
        abbreviation: "Crop production"
      },
      {
        moduleNumber: 7,
        moduleName: "Intercropping",
        academic: "AG-inter-ac-average",
        importance: "AG-inter-ac-imp",
        adequacy: "AG_inter_adq",
        adequacyElements: ["AG-inter-cropsMeetingNeeds"],
        importanceElements: ["AG-inter-intercroppingFarmSysted"],
        pillar: "Agronomic",
        abbreviation: "Intercropping"
      },
      {
        moduleNumber: 8,
        moduleName: "Weed Species and Management",
        academic: "EN-weed-ac-average",
        importance: "EN-weed-imp",
        adequacy: "EN-weed-adq",
        adequacyElements: ["EN-weed-curtailingNegativeImpact"],
        importanceElements: ["EN-weed-invasiveWeed"],
        pillar: "Environment",
        abbreviation: "Weeds"
      },
      {
        moduleNumber: 9,
        moduleName: "Pest Management Practices",
        academic: "AG_spm_ac_average",
        importance: "AG-spm-imp",
        adequacy: "AG-spm-adq",
        adequacyElements: ["AG-spm-pestControl"],
        importanceElements: ["AG-spm-importantPestControl"],
        pillar: "Agronomic",
        abbreviation: "Pest"
      },
      {
        moduleNumber: 10,
        moduleName: "Land Management Practices",
        academic: "EN-slm-ac-average",
        importance: "EN-slm-imp",
        adequacy: "EN-slm-adq",
        adequacyElements: ["EN-slm-improveFarmLand"],
        importanceElements: ["EN-slm-importantPractice"],
        pillar: "Environment",
        abbreviation: "Land practices"
      },
      {
        moduleNumber: 11,
        moduleName: "Leguminous Plants and Trees",
        academic: "EN_legum_ac_average",
        importance: "EN_legum_imp",
        adequacy: "EN_legum_adq",
        adequacyElements: ["EN-legum-leguminousAffectFarm"],
        importanceElements: ["EN-legum-importanceLeguminous"],
        pillar: "Environment",
        abbreviation: "Legumes"
      },
      {
        moduleNumber: 12,
        moduleName: "Fertilisation Practices",
        academic: "EN-fert-ac-average",
        importance: "EN-fert-imp",
        adequacy: "EN-fert-adq",
        adequacyElements: ["EN-fert-naturalFertilisers"],
        importanceElements: ["EN-fert-accessNaturalFertilisers"],
        pillar: "Environment",
        abbreviation: "Fertilization"
      },
      {
        moduleNumber: 13,
        moduleName: "Animal Production Practices",
        academic: "AG-animal-ac-average",
        importance: "AG-animal-imp",
        adequacy: "AG-animal-adq",
        adequacyElements: ["AG-animal-sufficientLivestock"],
        importanceElements: ["AG-animal-importantLivestock"],
        pillar: "Agronomic",
        abbreviation: "Animal production"
      },
      {
        moduleNumber: 14,
        moduleName: "Animal Breeding Practices",
        academic: "AG-breed-ac-average",
        importance: "AG-breed-imp",
        adequacy: "AG-breed-adq",
        adequacyElements: ["AG-breed-ableToImprove"],
        importanceElements: ["AG-breed-importantLivestock"],
        pillar: "Agronomic",
        abbreviation: "Animal breeding"
      },
      {
        moduleNumber: 15,
        moduleName: "Animal Nutrition Practices",
        academic: "AG-health-ac-average",
        importance: "AG-health-imp",
        adequacy: "AG-health-adq",
        adequacyElements: ["AG-health-adq-house", "AG-health-adq-health"],
        importanceElements: ["AG-health-imp-house", "AG-health-imp-health"],
        pillar: "Agronomic",
        abbreviation: "Animal health"
      },
      {
        moduleNumber: 16,
        moduleName: "Utilization of New And Adapted Varieties and Breeds",
        academic: "AG-new-ac-average",
        importance: "AG-new-imp",
        adequacy: "AG-new-adq",
        adequacyElements: [
          "AG-new-cropsFoodSecurityRevenues",
          "AG-new-breedsFoodSecurityRevenues"
        ],
        importanceElements: [
          "AG-new-improvingAccessSecurityRevenues",
          "AG-new-improvingAccessBreedsSecurity"
        ],
        pillar: "Agronomic",
        abbreviation: "Varieties & breeds"
      },
      {
        moduleNumber: 17,
        moduleName: "Farm Inputs",
        academic: "EC-input-ac-average",
        importance: "EC-input-imp",
        adequacy: "EC-input-adq",
        adequacyElements: ["EC-input-accessLocalFarm"],
        importanceElements: ["EC-input-importantAccessLocalFarm"],
        pillar: "Economic",
        abbreviation: "Farm inputs"
      },
      {
        moduleNumber: 18,
        moduleName: "Water Access",
        academic: "EN-wacc-ac-average",
        importance: "EN-wacc-imp",
        adequacy: "EN-wacc-adq",
        adequacyElements: ["EN-wacc-sufficientAccess"],
        importanceElements: ["EN-wacc-importantWaterAccess"],
        pillar: "Environment",
        abbreviation: "Water access"
      },
      {
        moduleNumber: 19,
        moduleName: "Water Conservation Practices And Techniques",
        academic: "EN-wcp-ac-average",
        importance: "EN-wcp-imp",
        adequacy: "EN-wcp-adq",
        adequacyElements: ["EN-wcp-waterConservationUse"],
        importanceElements: ["EN-wcp-importantWaterConservation"],
        pillar: "Environment",
        abbreviation: "Water conservation"
      },
      {
        moduleNumber: 20,
        moduleName: "Water Quality",
        academic: "EN-wqa-ac-average",
        importance: "EN-wqa-imp",
        adequacy: "EN-wqa-adq",
        adequacyElements: ["EN-wqa-adequacy-Human", "EN-wqa-adequacy-agric"],
        importanceElements: ["EN-wqa-importance"],
        pillar: "Environment",
        abbreviation: "Water quality"
      },
      {
        moduleNumber: 21,
        moduleName: "Soil Quality and Land Degradation",
        academic: "EN-landqa-ac-average",
        importance: "EN-landqa-imp",
        adequacy: "EN-landqa-adq",
        adequacyElements: ["EN-landqa-richInSoilOrganic"],
        importanceElements: ["EN-landqa-landDegradationImpact"],
        pillar: "Environment",
        abbreviation: "Soil quality"
      },
      {
        moduleNumber: 22,
        moduleName: "Trees",
        academic: "AG-trees-ac-average",
        importance: "AG-trees-ac-imp",
        adequacy: "AG-trees-ac-adq",
        adequacyElements: ["AG-trees-accessTrees"],
        importanceElements: ["AG-trees-howImportant"],
        pillar: "Agronomic",
        abbreviation: "Trees"
      },
      {
        moduleNumber: 23,
        moduleName: "Landscape Characteristics",
        academic: "EN-lands-ac-average",
        importance: "EN-lands-imp",
        adequacy: "EN-lands-adq",
        adequacyElements: ["EN-lands-yeldLosses"],
        importanceElements: ["EN-lands-importantUnmanagedAreas"],
        pillar: "Environment",
        abbreviation: "Landscape"
      },
      {
        moduleNumber: 24,
        moduleName: "Energy Sources",
        academic: "EN-enerso-ac-average",
        importance: "EN-enerso-imp",
        adequacy: "EN-enerso-adq",
        adequacyElements: ["EN-enerso-energySufficient"],
        importanceElements: ["EN-enerso-importantAccessEnergy"],
        pillar: "Environment",
        abbreviation: "Energy sources"
      },
      {
        moduleNumber: 25,
        moduleName: "Energy Conservation Practices",
        academic: "EN-enercp-ac-average",
        importance: "EN-enercp-imp",
        adequacy: "EN-enercp-adq",
        adequacyElements: ["EN-enercp-methodsSaveEnergy"],
        importanceElements: ["EN-enercp-importantEnergySaving"],
        pillar: "Environment",
        abbreviation: "Energy conservation"
      },
      {
        moduleNumber: 26,
        moduleName: "Disturbances",
        academic: "SO-dist-ac-average",
        importance: "SO-dist-imp",
        adequacy: "SO-dist-adq",
        adequacyElements: ["SO-dist-responsesToDistuurbances"],
        importanceElements: ["SO-dist-disturbancesAffect"],
        pillar: "Social",
        abbreviation: "Disturbances"
      },
      {
        moduleNumber: 27,
        moduleName: "Climate Change",
        academic: "SO-cc-ac-average",
        importance: "SO-cc-imp",
        adequacy: "SO-cc-adq",
        adequacyElements: ["SO-cc-strategiesSatisfaction"],
        importanceElements: ["SO-cc-changingClimatePriority"],
        pillar: "Social",
        abbreviation: "Climate change"
      },
      {
        moduleNumber: 28,
        moduleName:
          "Access To Information On Weather And Climate Change Adaptation Practices",
        academic: "AG-infoac-ac-average",
        importance: "AG-infoac-imp",
        adequacy: "AG-infoac-adq",
        adequacyElements: ["AG-infoac-usefulFarmSystemInfo"],
        importanceElements: ["AG-infoac-climateChangeAdaptation"],
        pillar: "Agronomic",
        abbreviation: "Information access"
      },
      {
        moduleNumber: 29,
        moduleName:
          "Information And Comunication Technologies (ICTS) (Sensitive Question)",
        academic: "EC-ict-ac-average",
        importance: "EC-ict-imp",
        adequacy: "EC-ict-adq",
        adequacyElements: ["EC-ict-accessICTfarmSystem"],
        importanceElements: ["EC-ict-importantareICTfarmSystem"],
        pillar: "Economic",
        abbreviation: "ICTs"
      },
      {
        moduleNumber: 30,
        moduleName:
          "Goverment Policies and Programmes On Climate Change And Sustainable Agriculture",
        academic: "GO-gov-ac-average",
        importance: "GO-gov-imp",
        adequacy: "GO-gov-adq",
        adequacyElements: ["GO-gov-helpfulsupportlivelihood"],
        importanceElements: ["GO-gov-importantSupportLivelihood"],
        pillar: "Goverment",
        abbreviation: "Policies & programmes"
      },
      {
        moduleNumber: 31,
        moduleName: "Access to Markets",
        academic: "EC-mkt-ac-average",
        importance: "EC-mkt-imp",
        adequacy: "EC-mkt-adq",
        adequacyElements: ["EC-Mkt-adequacy"],
        importanceElements: ["EC-Mkt-importance"],
        pillar: "Economic",
        abbreviation: "Market access"
      },
      {
        moduleNumber: 32,
        moduleName: "Income Sources, Expenditures And Savings",
        academic: "EC-inc-ac-average",
        importance: "EC-inc-imp",
        adequacy: "EC-inc-adq",
        adequacyElements: ["EC-inc-incomeSources"],
        importanceElements: ["EC-inc-importantIncomeSources"],
        pillar: "Economic",
        abbreviation: "Income"
      },
      {
        moduleNumber: 33,
        moduleName: "Major Productive Assets",
        academic: "EC-ass-ac-average",
        importance: "EC-ass-imp",
        adequacy: "EC-ass-adq",
        adequacyElements: ["EC-ass-assetsAdequate"],
        importanceElements: ["EC-ass-importantProductiveAsset"],
        pillar: "Economic",
        abbreviation: "Productive assets"
      },
      {
        moduleNumber: 34,
        moduleName: "Access to Financial Services",
        academic: "EC-fin-ac-average",
        importance: "EC-fin-imp",
        adequacy: "EC-fin-adq",
        adequacyElements: ["EC-fin-adequacy"],
        importanceElements: ["EC-fin-importance"],
        pillar: "Economic",
        abbreviation: "Financial services"
      },
      {
        moduleNumber: 35,
        moduleName: "Insurance",
        academic: "EC-ins-ac-average",
        importance: "EC-ins-imp",
        adequacy: "EC-ins-adq",
        adequacyElements: ["EC-ins-adequacy"],
        importanceElements: ["EC-ins-importance"],
        pillar: "Economic",
        abbreviation: "Insurance"
      },
      {
        moduleNumber: 36,
        moduleName: "Community Cooperation",
        academic: "SO-coop-ac-average",
        importance: "SO-coop-imp",
        adequacy: "SO-coop-adq",
        adequacyElements: ["SO-coop-adequacy"],
        importanceElements: ["SO-coop-importance"],
        pillar: "Social",
        abbreviation: "Community cooperation"
      },
      {
        moduleNumber: 37,
        moduleName: "Group Membership",
        academic: "SO-group-ac-average",
        importance: "SO-group-imp",
        adequacy: "SO-group-adq",
        adequacyElements: ["SO-group-adequacy"],
        importanceElements: ["SO-group-importance"],
        pillar: "Social",
        abbreviation: "Group membership"
      },
      {
        moduleNumber: 38,
        moduleName: "Meals",
        academic: "SO-meal-ac-average",
        importance: "SO-meal-imp",
        adequacy: "SO-meal-adq",
        adequacyElements: ["SO-meal-adequacy"],
        importanceElements: ["SO-meal-importance"],
        pillar: "Social",
        abbreviation: "Meals"
      },
      {
        moduleNumber: 39,
        moduleName: "Decision-Making (Household)",
        academic: "SO-dmhh-ac-average",
        importance: "SO-dmhh-imp",
        adequacy: "SO-dmhh-adq",
        adequacyElements: ["SO-dmhh-adequacy"],
        importanceElements: ["SO-dmhh-importance"],
        pillar: "Social",
        abbreviation: "Household decisions"
      },
      {
        moduleNumber: 40,
        moduleName: "Decision-Making (Farm Management)",
        academic: "SO-dmfarm-ac-average",
        importance: "SO-dmfarm-imp",
        adequacy: "SO-dmfarm-adq",
        adequacyElements: ["SO-dmfarm-decisionMakingSatisfaction"],
        importanceElements: [
          "SO-dmfarm-importance1",
          "SO-dmfarm-importance2"
        ],
        pillar: "Social",
        abbreviation: "Farm decisions"
      }
    ];
  }
}
export default ScoresByModule
