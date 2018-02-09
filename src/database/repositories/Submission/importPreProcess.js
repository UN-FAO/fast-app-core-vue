let preProcess = class {
  static JsonSubmission(jsonSubmission) {
    console.log('We need to pre process this', jsonSubmission)
    let ImportanceQuestions = preProcess.getImportanceQuestions()
    ImportanceQuestions.forEach((q) => {
      console.log('Previous Value ImportanceQuestions', jsonSubmission.data[q], q)
      // jsonSubmission.data[q] = preProcess.getImportanceModifiedValue(jsonSubmission.data[q])
      console.log('New Value ImportanceQuestions', preProcess.getImportanceModifiedValue(jsonSubmission.data[q]))
    })
    let AdecuacyQuestions = preProcess.getAdecuacyQuestions()
    AdecuacyQuestions.forEach((q) => {
      console.log('Previous Value AdecuacyQuestions', jsonSubmission.data[q], q)
      // jsonSubmission.data[q] = preProcess.getAdecuacyModifiedValue(jsonSubmission.data[q])
      console.log('New Value AdecuacyQuestions', preProcess.getAdecuacyModifiedValue(jsonSubmission.data[q]))
    })
    return jsonSubmission
  }

  static getAdecuacyQuestions() {
    let burundi = [
      // Module 2
      'AG-hh-activityNeeds',
      // Module 3
      'AG-agr-suffHouseholdNeeds',
      // Module 4
      'EC-iga-igasSufficient',
      // Module 5
      'EN-landac-adequateAccess',
      // Module 6
      'AG-crop-sufficientFarmSystem',
      // Module 7
      'AG-inter-cropsMeetingNeeds',
      // Module 8
      'AG-spm-pestControl',
      // Module 9
      'EN-slm-improveFarmLand',
      // Module 10
      'AG-animal-sufficientLivestock',
      // Module 11
      'AG-health-adq-house',
      'AG-health-adq-health',
      // Module 12
      'AG-new-cropsFoodSecurityRevenues',
      'AG-new-breedsFoodSecurityRevenues',
      // Module 13
      'EN-wacc-sufficientAccess',
      // Module 14
      'EN-wcp-waterConservationUse',
      // Module 15
      'EN-landqa-richInSoilOrganic',
      // Module 16
      'AG-trees-accessTrees',
      // Module 17
      'EN-enercp-methodsSaveEnergy',
      // Module 18
      'SO-dist-responsesToDistuurbances',
      // Module 19
      'SO-cc-strategiesSatisfaction',
      // Module 20
      'AG-infoac-usefulFarmSystemInfo',
      // Module 21
      'EC-ict-accessICTfarmSystem',
      // Module 22
      'GO-gov-helpfulsupportlivelihood',
      // Module 23
      'EC-Mkt-adequacy',
      // Module 24
      'EC-inc-incomeSources',
      // Module 25
      'SO-coop-adequacy',
      // Module 26
      'SO-group-adequacy',
      // Module 27
      'SO-meal-adequacy',
      // Module 28
      'SO-dmhh-adequacy',
      // Module 29
      'SO-dmfarm-decisionMakingSatisfaction'
    ]
    // Uganda LDFC VERSION
    /*
    let uganda = [
      // Module 2
      'AG-hh-activityNeeds',
      // Module 3
      'AG-agr-suffHouseholdNeeds',
      // Module 4
      'EC-iga-igasSufficient',
      // Module 5
      'EN-landac-adequateAccess',
      // Module 6
      'AG-crop-sufficientFarmSystem',
      // Module 7
      'AG-inter-cropsMeetingNeeds',
      // Module 8
      'AG-spm-pestControl',
      // Module 9
      'EN-slm-improveFarmLand',
      // Module 10
      'AG-animal-sufficientLivestock',
      // Module 11
      'AG-health-adq-house',
      'AG-health-adq-health',
      // Module 12
      'AG-new-cropsFoodSecurityRevenues',
      'AG-new-breedsFoodSecurityRevenues',
      // Module 13
      'EN-wacc-sufficientAccess',
      // Module 14
      'EN-wcp-waterConservationUse',
      // Module 15
      'EN-landqa-richInSoilOrganic',
      // Module 16
      'AG-trees-accessTrees',
      // Module 17
      'EN-enercp-methodsSaveEnergy',
      // Module 18
      'SO-dist-responsesToDistuurbances',
      // Module 19
      'SO-cc-strategiesSatisfaction',
      // Module 20
      'AG-infoac-usefulFarmSystemInfo',
      // Module 21
      'EC-ict-accessICTfarmSystem',
      // Module 22
      'GO-gov-helpfulsupportlivelihood',
      // Module 23
      'EC-Mkt-adequacy',
      // Module 24
      'EC-inc-incomeSources',
      // Module 25
      'SO-coop-adequacy',
      // Module 26
      'SO-group-adequacy',
      // Module 27
      'SO-meal-adequacy',
      // Module 28
      'SO-dmhh-adequacy',
      // Module 29
      'SO-dmfarm-decisionMakingSatisfaction'
    ]
     */
    return burundi
  }

  static getImportanceQuestions() {
    let burundi = [
      // Module 2
      'AG-hh-importantActivities',
      // Module 3
      'AG-agr-diversityFarmSystem',
      // Module 4
      'EC-iga-igasLivelihood',
      // Module 5
      'EN-landac-communalLandAccess',
      // Module 6
      'AG-crop-importantDifferentCrops',
      // Module 7
      'AG-inter-intercroppingFarmSysted',
      // Module 8
      'AG-spm-importantPestControl',
      // Module 9
      'EN-slm-importantPractice',
      // Module 10
      'AG-animal-importantLivestock',
      // Module 11
      'AG-health-imp-house',
      'AG-health-imp-health',
      // Module 12
      'AG-new-cropsFoodSecurityRevenues',
      'AG-new-breedsFoodSecurityRevenues',
      // Module 13
      'EN-wacc-importantWaterAccess',
      // Module 14
      'EN-wcp-importantWaterConservation',
      // Module 15
      'EN-landqa-landDegradationImpact',
      // Module 16
      'AG-trees-howImportant',
      // Module 17
      'EN-enercp-importantEnergySaving',
      // Module 18
      'SO-dist-disturbancesAffect',
      // Module 19
      'SO-cc-changingClimatePriority',
      // Module 20
      'AG-infoac-climateChangeAdaptation',
      // Module 21
      'EC-ict-importantareICTfarmSystem',
      // Module 22
      'GO-gov-importantSupportLivelihood',
      // Module 23
      'EC-Mkt-importance',
      // Module 24
      'EC-inc-importantIncomeSources',
      // Module 25
      'SO-coop-importance',
      // Module 26
      'SO-group-importance',
      // Module 27
      'SO-meal-importance',
      // Module 28
      'SO-dmhh-importance',
      // Module 29
      'SO-dmfarm-importance1',
      'SO-dmfarm-importance2'
    ]
    // Uganda LDFC VERSION
    /*
    let uganda = [
      // Module 2
      'AG-hh-importantActivities',
      // Module 3
      'AG-agr-diversityFarmSystem',
      // Module 4
      'EC-iga-igasLivelihood',
      // Module 5
      'EN-landac-communalLandAccess',
      // Module 6
      'AG-crop-importantDifferentCrops',
      // Module 7
      'AG-inter-intercroppingFarmSysted',
      // Module 8
      'AG-spm-importantPestControl',
      // Module 9
      'EN-slm-importantPractice',
      // Module 10
      'AG-animal-importantLivestock',
      // Module 11
      'AG-health-imp-house',
      'AG-health-imp-health',
      // Module 12
      'AG-new-cropsFoodSecurityRevenues',
      'AG-new-breedsFoodSecurityRevenues',
      // Module 13
      'EN-wacc-importantWaterAccess',
      // Module 14
      'EN-wcp-importantWaterConservation',
      // Module 15
      'EN-landqa-landDegradationImpact',
      // Module 16
      'AG-trees-howImportant',
      // Module 17
      'EN-enercp-importantEnergySaving',
      // Module 18
      'SO-dist-disturbancesAffect',
      // Module 19
      'SO-cc-changingClimatePriority',
      // Module 20
      'AG-infoac-climateChangeAdaptation',
      // Module 21
      'EC-ict-importantareICTfarmSystem',
      // Module 22
      'GO-gov-importantSupportLivelihood',
      // Module 23
      'EC-Mkt-importance',
      // Module 24
      'EC-inc-importantIncomeSources',
      // Module 25
      'SO-coop-importance',
      // Module 26
      'SO-group-importance',
      // Module 27
      'SO-meal-importance',
      // Module 28
      'SO-dmhh-importance',
      // Module 29
      'SO-dmfarm-importance1',
      'SO-dmfarm-importance2'
    ]
    */
    return burundi
  }

  static getImportanceModifiedValue(oldValue) {
    if (isNaN(oldValue)) {
      return oldValue
    }
    switch (oldValue) {
      case 10:
        return 'notAtall'
        break;
      case 7.5:
        return 'aLittle'
        break;
      case 7:
        return 'aLittle'
        break;
      case 5:
        return 'average'
        break;
      case 2.5:
        return 'aLot'
        break;
      case 2:
        return 'aLot'
        break;
      case 0:
        return 'completely'
        break;
    }
  }

  static getAdecuacyModifiedValue(oldValue) {
    if (isNaN(oldValue)) {
      return oldValue
    }
    switch (oldValue) {
      case 0:
        return 'notAtall'
        break;
      case 2.5:
        return 'aLittle'
        break;
      case 2:
        return 'aLittle'
        break;
      case 5:
        return 'average'
        break;
      case 7.5:
        return 'aLot'
        break;
      case 7:
        return 'aLot'
        break;
      case 10:
        return 'completely'
        break;
    }
  }
}
export default preProcess
