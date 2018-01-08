import * as Database from 'database/Database'
import uuidv4 from 'uuid/v4'
import FormioUtils from "formiojs/utils";
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import LocalTranslation from 'database/collections/scopes/LocalTranslation'
import {
  TRANSLATIONS
} from 'modules/Localization/appTranslations'

const LocalForm = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("forms")
  }

  static async find(filter) {
    const model = await LocalForm.getModel()
    return model.find(filter);
  }

  static async findOne(filter) {
    const model = await LocalForm.getModel()
    return model.findOne(filter);
  }

  static async remove(document) {
    const model = await LocalForm.getModel()
    return model.remove(document);
  }

  static async insert(element) {
    const model = await LocalForm.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }

  static async update(document) {
    const model = await LocalForm.getModel()
    return model.update(document);
  }
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get(id) {
    const model = await LocalForm.getModel()
    id = id.replace(/\s/g, '')

    let formRequest = await model.findOne({
      'data.name': id
    })
    let formRequestID = await model.findOne({
      'data._id': id
    })
    let formRequestPath = await model.findOne({
      'data.path': id
    })

    if (formRequest) {
      return formRequest.data
    }
    if (formRequestID) {
      return formRequestID.data
    }
    if (formRequestPath) {
      return formRequestPath.data
    }
  }

  static async sAll() {
    const model = await LocalForm.getModel()
    let allForms = await model.find()
    return allForms
  }

  static async getAllLabels(formNameFilter, languageFilter) {
    formNameFilter = formNameFilter || undefined
    languageFilter = languageFilter || ['en', 'fr', 'es', 'pt']
    languageFilter.push('label')

    let formFilter = formNameFilter && {
      'data.title': {
        // $containsAny
        '$in': formNameFilter
      }
    };
    let stats = {}
    stats.translations = {}
    stats.missingTranslations = []
    let translations = await LocalTranslation.find();
    translations = translations[0].data
    let forms = await LocalForm.find(formFilter);

    let componentLabels = []

    // Extranct all labels for all available forms
    _forEach(forms, form => {
      // Go across every component
      FormioUtils.eachComponent(form.data.components, (component) => {
        if (component.addAnother && component.addAnother !== '') {
          componentLabels.push(component.addAnother)
        }
        if (component.legend && component.legend !== '') {
          componentLabels.push(component.legend)
        }

        if (component.title && component.title !== '') {
          componentLabels.push(component.title)
        }
        // If it has a label
        if (component.label && component.label !== '') {
          componentLabels.push(component.label)
        }
        // If it has values that have labels (radio)
        if (component.values) {
          _forEach(component.values, value => {
            if (value.label && value.label !== '') {
              componentLabels.push(value.label)
            }
          })
        }
        // If it is an HTML element
        if (component.type === 'htmlelement' && component.content !== '') {
          componentLabels.push(component.content)
        }
        // If it is a select component
        if (component.type === 'select') {
          if (component.data && component.data.values) {
            _forEach(component.data.values, value => {
              if (value.label && value.label !== '') {
                componentLabels.push(value.label)
              }
            })
          }
        }
      }, true);
    })
    componentLabels = componentLabels.concat(TRANSLATIONS)
    // Clean duplicated labels
    let uniqueLabels = Array.from(new Set(componentLabels)).sort();

    let columnNames = []
    let labelsArray = []
    let labelsObject = []

    // First column will always be the Form Label
    columnNames.push('Form Label')

    if (_isEmpty(translations)) {
      stats.missingTranslations = uniqueLabels
    }
    // Match the labels with local translations
    _forEach(uniqueLabels, uniqueLabel => {
      let translation = []
      let languages = {}
      translation.push(uniqueLabel)

      _forEach(translations, (language, lenguageCode) => {
        // Dont include if the language is not supported
        if (languageFilter.indexOf(lenguageCode) === -1) {
          return
        }
        columnNames.push(lenguageCode)
        languages['label'] = uniqueLabel
        if (typeof (language[uniqueLabel]) !== 'undefined' && language[uniqueLabel] !== "") {
          // If the language doesn't exist, create it
          if (!stats.translations[lenguageCode]) {
            stats.translations[lenguageCode] = {}
            stats.translations[lenguageCode].total = 0
          }
          // Add 1 every time we have a translation
          stats.translations[lenguageCode].total = stats.translations[lenguageCode].total + 1
        }
        languages[lenguageCode] = language[uniqueLabel]
        if (typeof (language[uniqueLabel]) === 'undefined' && lenguageCode === 'label') {
          stats.missingTranslations.push(uniqueLabel)
        }
        translation.push(language[uniqueLabel])
      })
      labelsObject.push(languages)
      labelsArray.push(translation)
    })

    // Clean the column Names
    let uniqueColumsNames = Array.from(new Set(columnNames));
    stats.missingTranslations = Array.from(new Set(stats.missingTranslations));

    stats.totalTranslations = labelsArray.length

    _forEach(stats.translations, (language, index) => {
      stats.translations[index].translated = stats.translations[index].total / stats.totalTranslations
    })

    return {
      labels: labelsArray,
      columns: uniqueColumsNames,
      stats: stats,
      labelsObject: labelsObject
    };
  }
}
export default LocalForm
