let preProcess = class {
  static JsonSubmission(jsonSubmission) {
    console.log('jsonSubmission', jsonSubmission)
    let modifiedSubmission = jsonSubmission // preProcess.changeAdecuacyAndImportanceValues(jsonSubmission)

    modifiedSubmission = preProcess.changeLabels(modifiedSubmission)

    modifiedSubmission = preProcess.swapKeysAndValues(modifiedSubmission)
    // This change needs to come second, as it will have the modify value
    // Of the Datagrid Array, then we can modify its inner keys
    modifiedSubmission = preProcess.changeDatagridKeys(modifiedSubmission)
    return modifiedSubmission
  }

  static changeLabels(jsonSubmission) {
    let changes = preProcess.getChanges()
    changes.forEach(change => {
      if (jsonSubmission.data[change.previous]) {
        jsonSubmission.data[change.new] = jsonSubmission.data[change.previous]
        delete jsonSubmission.data[change.previous]
      }
    });
    jsonSubmission.data['S0-info-climaticSeason'] = preProcess.changeClimaticSeason(jsonSubmission.data['S0-info-climaticSeason'])
    jsonSubmission.data['EN-landqa-doesTheWater'] = preProcess.waterFallsinSoil(jsonSubmission.data['EN-landqa-doesTheWater'])
    jsonSubmission.data['EN-enercp-importantEnergySaving'] = preProcess.fixImportanceQuestions(jsonSubmission.data['EN-enercp-importantEnergySaving'])
    jsonSubmission.data['SO-dist-householdEffectedShock'] = preProcess.numericTrueFalseToString(jsonSubmission.data['SO-dist-householdEffectedShock'])
    jsonSubmission.data['SO-dist-behaviourChanged'] = preProcess.numericTrueFalseToString(jsonSubmission.data['SO-dist-behaviourChanged'])
    jsonSubmission.data['GO-gov-importantSupportLivelihood'] = preProcess.fixImportanceQuestions(jsonSubmission.data['GO-gov-importantSupportLivelihood'])
    jsonSubmission.data['SO-coop-adequacy'] = preProcess.fixAdequacyQuestions(jsonSubmission.data['SO-coop-adequacy'])
    console.log('AG-health-imp-health', jsonSubmission.data['AG-health-imp-health'])
    return jsonSubmission
  }

  static getChanges() {
    return [
      {
        new: 'page32EC-mktEC-mkt-whyNot',
        previous: 'EC-mkt-whyNot'
      },
      {
        new: 'S0-infoS0-info-ID',
        previous: 'S0-info-ID'
      },
      {
        new: 'S0-infoS0-info-indigenous',
        previous: 'S0-info-indigenous'
      }, {
        new: 'S0-infoS0-info-indigenous-other',
        previous: 'S0-info-indigenous-other'
      },
      {
        new: 'S0-infoS0-info-language',
        previous: 'S0-info-language'
      },
      {
        new: 'S0-infoS0-info-language-other',
        previous: 'S0-info-language-other'
      },
      {
        new: 'AG-hh-schooladlt',
        previous: 'AG-hh-school'
      },
      {
        new: 'AG-crop-datagrid2',
        previous: 'AG-cropDatagrid2'
      },
      {
        new: 'AG-new-percLocalCultivatedCrops',
        previous: 'AG-newTableNumberField'
      },
      {
        new: 'AG-new-LocalCropAdapted',
        previous: 'AG-new-LocalAnimalAdapted'
      },
      {
        new: 'AG-new-NewCropAdapted',
        previous: 'AG-new-NewAnimalAdapted'
      },
      {
        new: 'AG-new-newlyAnimalBreed',
        previous: 'AG-newFieldset2TableSelectField'
      },
      {
        new: 'AG-new-newlyPercBreed',
        previous: 'AG-newFieldset2TableNumberField'
      },
      {
        new: 'AG-new-LocalAnimalAdapted',
        previous: 'AG-new-localadAptedConditions'
      },
      {
        new: 'AG-new-newlyAnimalAdapted',
        previous: 'AG-newFieldset2TableSelectField3'
      },
      {
        new: 'EN-wacc-agricoltureSourceChanged',
        previous: 'EN-wacc-agricultureSourceChanged'
      }
      /*
      {
        new: 'AG-health-NoHousedReasonn',
        previous: 'AG-health-noHousedReason'
      }
      */
    ]
  }

  static swapKeysAndValues(jsonSubmission) {
    let changes = preProcess.getValuesToSwap();
    changes.forEach(change => {
      let holder = jsonSubmission.data[change.value1]
      jsonSubmission.data[change.value1] = jsonSubmission.data[change.value2]
      jsonSubmission.data[change.value2] = holder
    })
    return jsonSubmission
  }

  static getValuesToSwap() {
    return [
      {
        value1: 'EC-ict-ownMobilePhone',
        value2: 'EC-ict-ownInternet'
      }
    ]
  }
  static changeDatagridKeys(jsonSubmission) {
    let changes = preProcess.getDatagridKeysChanged()
    changes.forEach((change) => {
      jsonSubmission.data[change.datagridName].forEach(row => {
        row[change.new] = row[change.previous]
        delete row[change.previous]
      })
    })
    return jsonSubmission
  }

  static getDatagridKeysChanged() {
    return [{
      new: 'SO-dist-howLongDisturbance',
      previous: 'soDistDatagridHowlongdidthemostimportantdisturbancelastfor',
      datagridName: 'SO-distDatagrid'
    }]
  }

  static changeAdecuacyAndImportanceValues(jsonSubmission) {
    let ImportanceQuestions = preProcess.getImportanceQuestions()
    ImportanceQuestions.forEach((q) => {
      jsonSubmission.data[q] = preProcess.getImportanceModifiedValue(jsonSubmission.data[q])
      if (!jsonSubmission.data[q]) {
        console.log('jsonSubmission.data[q]', q)
      }
    })

    let AdecuacyQuestions = preProcess.getAdecuacyQuestions()
    AdecuacyQuestions.forEach((q) => {
      jsonSubmission.data[q] = preProcess.getAdecuacyModifiedValue(jsonSubmission.data[q])
    })
    return jsonSubmission
  }

  static getAdecuacyQuestions() {
    /*
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
     */
    // Uganda LDFC VERSION

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
    return uganda
  }

  static getImportanceQuestions() {
    /*
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
     */
    // Uganda LDFC VERSION

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

    return uganda
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

  static changeClimaticSeason(oldValue) {
    switch (oldValue) {
      case 'wet':
        return 'wetSeason'
        break;
      case 'dry':
        return 'drySeason'
    }
  }

  static waterFallsinSoil(oldValue) {
    if (typeof oldValue === 'object') {
      console.log('Object')
      return 'notApplicable'
    }
  }

  static fixImportanceQuestions(oldValue) {
    switch (oldValue) {
      case 'notAtall':
        return 'notAtAll'
        break;
      case 'completely':
        return 'very'
    }
  }

  static numericTrueFalseToString(oldValue) {
    switch (oldValue) {
      case 1:
        return 'yes'
        break;
      case 0:
        return 'no'
    }
  }

  static fixAdequacyQuestions(oldValue) {
    switch (oldValue) {
      case 'notAtall':
        return 'notAtAll'
        break;
    }
  }
}
export default preProcess
