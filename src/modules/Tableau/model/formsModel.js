/* {
    "_id": "5a65f5e3fd7f5e0001cbef69",
    "modified": "2018-01-22T14:32:03.648Z",
    "title": "2. Assessment 1",
    "name": "M2A1Assessment1",
    "path": "m2a1assessment1",
    "display": "form",
    "machineName": "tknrqdvfbuczudk:Assessment1",
    "project": "5a65f5d5d772bf00015a3dc3",
    "_vid": 0,
    "revisions": "",
    "created": "2018-01-22T14:32:03.640Z",
    "components": [
        {
            "components": [
                {
                    "lockKey": true,
                    "key": "M2A1-assessment1Html",
                    "input": false,
                    "tag": "p",
                    "attrs": [
                        {
                            "attr": "",
                            "value": ""
                        }
                    ],
                    "className": "",
                    "content": "<b>Assessment 1: Crop production, key production areas, uses of product and estimated value",
                    "type": "htmlelement",
                    "tags": [],
                    "conditional": {
                        "eq": "",
                        "when": null,
                        "show": ""
                    },
                    "properties": {
                        "": ""
                    },
                    "customClass": ""
                },
                {
                    "input": true,
                    "tableView": true,
                    "label": "Select The program",
                    "key": "m2A1Assessment1SelectTheprogram",
                    "placeholder": "",
                    "resource": "5a65f5e3fd7f5e0001cbef66",
                    "project": "5a65f5d5d772bf00015a3dc3",
                    "defaultValue": "",
                    "template": "<span>{{ item.data['M1-programName'] }}</span>",
                    "selectFields": "",
                    "searchFields": "",
                    "multiple": false,
                    "protected": false,
                    "persistent": true,
                    "hidden": false,
                    "clearOnHide": true,
                    "validate": {
                        "required": false
                    },
                    "defaultPermission": "",
                    "type": "resource",
                    "tags": [
                        "M1-programName"
                    ],
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "properties": {
                        "": ""
                    },
                    "addResource": true,
                    "addResourceLabel": "Add new Program"
                },
                {
                    "input": true,
                    "tableView": true,
                    "label": "Select component",
                    "key": "m2A1Assessment1Selectcomponent",
                    "placeholder": "",
                    "data": {
                        "values": [
                            {
                                "value": "grea",
                                "label": "grea"
                            },
                            {
                                "value": "grea44",
                                "label": "grea44"
                            },
                            {
                                "value": "grea442",
                                "label": "grea442"
                            }
                        ],
                        "json": "",
                        "url": "",
                        "resource": "",
                        "custom": ""
                    },
                    "dataSrc": "values",
                    "valueProperty": "",
                    "defaultValue": "",
                    "refreshOn": "",
                    "filter": "",
                    "authenticate": false,
                    "template": "<span>{{ item.label }}</span>",
                    "multiple": false,
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "hidden": false,
                    "clearOnHide": true,
                    "validate": {
                        "required": false
                    },
                    "type": "select",
                    "tags": [],
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "properties": {
                        "": ""
                    },
                    "lockKey": true
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Enter your source(s) for these data",
                    "key": "M2A1-sourceData",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "hidden": false,
                    "clearOnHide": true,
                    "validate": {
                        "customPrivate": false,
                        "custom": "",
                        "pattern": "",
                        "maxLength": "",
                        "minLength": "",
                        "required": false
                    },
                    "conditional": {
                        "eq": "",
                        "when": null,
                        "show": ""
                    },
                    "type": "textfield",
                    "tags": [],
                    "properties": {
                        "": ""
                    },
                    "lockKey": true
                },
                {
                    "input": true,
                    "tableView": true,
                    "inputType": "number",
                    "label": "Enter the year for these data (e.g. 2007)",
                    "key": "M2A1-year",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "defaultValue": "",
                    "protected": false,
                    "persistent": true,
                    "hidden": false,
                    "clearOnHide": true,
                    "validate": {
                        "custom": "",
                        "multiple": "",
                        "integer": "",
                        "step": "any",
                        "max": "",
                        "min": "",
                        "required": false
                    },
                    "type": "number",
                    "tags": [],
                    "conditional": {
                        "eq": "",
                        "when": null,
                        "show": ""
                    },
                    "properties": {
                        "": ""
                    },
                    "lockKey": true
                },
                {
                    "components": [
                        {
                            "lockKey": true,
                            "properties": {
                                "": ""
                            },
                            "tags": [],
                            "type": "currency",
                            "conditional": {
                                "show": "",
                                "when": null,
                                "eq": ""
                            },
                            "validate": {
                                "required": false,
                                "multiple": "",
                                "custom": ""
                            },
                            "clearOnHide": true,
                            "hidden": false,
                            "persistent": true,
                            "protected": false,
                            "defaultValue": "",
                            "suffix": "",
                            "prefix": "",
                            "placeholder": "",
                            "key": "M2A1-dietaryAmount",
                            "label": "Dietary Staple Amount (MT)",
                            "inputMask": "",
                            "inputType": "text",
                            "tableView": true,
                            "input": true
                        },
                        {
                            "lockKey": true,
                            "properties": {
                                "": ""
                            },
                            "tags": [],
                            "type": "currency",
                            "conditional": {
                                "show": "",
                                "when": null,
                                "eq": ""
                            },
                            "validate": {
                                "required": false,
                                "multiple": "",
                                "custom": ""
                            },
                            "clearOnHide": true,
                            "hidden": false,
                            "persistent": true,
                            "protected": false,
                            "defaultValue": "",
                            "suffix": "",
                            "prefix": "",
                            "placeholder": "",
                            "key": "M2A1-dietaryValue",
                            "label": "Dietary Staple Value ($USD)",
                            "inputMask": "",
                            "inputType": "text",
                            "tableView": true,
                            "input": true
                        },
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Internal/Cash Amount (MT)",
                            "key": "M2A1-CashAmount",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "defaultValue": "",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "validate": {
                                "custom": "",
                                "multiple": "",
                                "required": false
                            },
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "type": "currency",
                            "tags": [],
                            "properties": {
                                "": ""
                            },
                            "lockKey": true
                        },
                        {
                            "lockKey": true,
                            "properties": {
                                "": ""
                            },
                            "tags": [],
                            "type": "currency",
                            "conditional": {
                                "show": "",
                                "when": null,
                                "eq": ""
                            },
                            "validate": {
                                "required": false,
                                "multiple": "",
                                "custom": ""
                            },
                            "clearOnHide": true,
                            "hidden": false,
                            "persistent": true,
                            "protected": false,
                            "defaultValue": "",
                            "suffix": "",
                            "prefix": "",
                            "placeholder": "",
                            "key": "M2A1-cashValue",
                            "label": "Internal/Cash Value ($USD)",
                            "inputMask": "",
                            "inputType": "text",
                            "tableView": true,
                            "input": true
                        },
                        {
                            "lockKey": true,
                            "properties": {
                                "": ""
                            },
                            "tags": [],
                            "type": "currency",
                            "conditional": {
                                "show": "",
                                "when": null,
                                "eq": ""
                            },
                            "validate": {
                                "required": false,
                                "multiple": "",
                                "custom": ""
                            },
                            "clearOnHide": true,
                            "hidden": false,
                            "persistent": true,
                            "protected": false,
                            "defaultValue": "",
                            "suffix": "",
                            "prefix": "",
                            "placeholder": "",
                            "key": "M2A1-industrialAmount",
                            "label": "Internal/Industrial Amount (MT)",
                            "inputMask": "",
                            "inputType": "text",
                            "tableView": true,
                            "input": true
                        },
                        {
                            "lockKey": true,
                            "properties": {
                                "": ""
                            },
                            "tags": [],
                            "type": "currency",
                            "conditional": {
                                "show": "",
                                "when": null,
                                "eq": ""
                            },
                            "validate": {
                                "required": false,
                                "multiple": "",
                                "custom": ""
                            },
                            "clearOnHide": true,
                            "hidden": false,
                            "persistent": true,
                            "protected": false,
                            "defaultValue": "",
                            "suffix": "",
                            "prefix": "",
                            "placeholder": "",
                            "key": "M2A1-industrialValue",
                            "label": "Internal/Industrial Value ($USD)",
                            "inputMask": "",
                            "inputType": "text",
                            "tableView": true,
                            "input": true
                        },
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Export Amount (MT)",
                            "key": "M2A1-exportAmount",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "defaultValue": "",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "validate": {
                                "custom": "",
                                "multiple": "",
                                "required": false
                            },
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "type": "currency",
                            "tags": [],
                            "properties": {
                                "": ""
                            },
                            "lockKey": true
                        },
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Export Value ($USD)",
                            "key": "M2A1-exportValue",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "defaultValue": "",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "validate": {
                                "custom": "",
                                "multiple": "",
                                "required": false
                            },
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "type": "currency",
                            "tags": [],
                            "properties": {
                                "": ""
                            },
                            "lockKey": true
                        },
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Total Amount (MT)",
                            "key": "M2A1-totalAmount",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "defaultValue": "",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "validate": {
                                "custom": "",
                                "multiple": "",
                                "required": false
                            },
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "type": "currency",
                            "tags": [],
                            "properties": {
                                "": ""
                            },
                            "lockKey": true
                        },
                        {
                            "input": true,
                            "tableView": true,
                            "inputType": "text",
                            "inputMask": "",
                            "label": "Total Value ($USD)",
                            "key": "M2A1-totalValue",
                            "placeholder": "",
                            "prefix": "",
                            "suffix": "",
                            "defaultValue": "",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "validate": {
                                "custom": "",
                                "multiple": "",
                                "required": false
                            },
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "type": "currency",
                            "tags": [],
                            "properties": {
                                "": ""
                            },
                            "lockKey": true
                        }
                    ],
                    "lockKey": true,
                    "properties": {
                        "": ""
                    },
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "tags": [],
                    "type": "fieldset",
                    "legend": "1. Estimate the total amount produced and value of this crop grown in this country for the following uses: Country Totals (MT is metric tons)",
                    "tableView": false,
                    "input": false,
                    "key": "M2A1-assessment1Fieldset"
                },
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "lockKey": true,
                                    "properties": {
                                        "": ""
                                    },
                                    "tags": [],
                                    "type": "textfield",
                                    "conditional": {
                                        "show": "",
                                        "when": null,
                                        "eq": ""
                                    },
                                    "validate": {
                                        "required": false,
                                        "minLength": "",
                                        "maxLength": "",
                                        "pattern": "",
                                        "custom": "",
                                        "customPrivate": false
                                    },
                                    "clearOnHide": true,
                                    "hidden": false,
                                    "persistent": true,
                                    "unique": false,
                                    "protected": false,
                                    "defaultValue": "",
                                    "multiple": false,
                                    "suffix": "",
                                    "prefix": "",
                                    "placeholder": "",
                                    "key": "M2A1-productionArea1Name",
                                    "label": "Key Production Area/Region # Name?",
                                    "inputMask": "",
                                    "inputType": "text",
                                    "tableView": false,
                                    "input": true,
                                    "hideLabel": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Dietary Staple Amount (MT)",
                                    "key": "M2A1-dietaryAmount1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Dietary Staple Value ($USD)",
                                    "key": "M2A1-dietaryValue1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Internal/Cash Amount (MT)",
                                    "key": "M2A1-cashAmount1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "lockKey": true,
                                    "properties": {
                                        "": ""
                                    },
                                    "tags": [],
                                    "type": "currency",
                                    "conditional": {
                                        "show": "",
                                        "when": null,
                                        "eq": ""
                                    },
                                    "validate": {
                                        "required": false,
                                        "multiple": "",
                                        "custom": ""
                                    },
                                    "clearOnHide": true,
                                    "hidden": false,
                                    "persistent": true,
                                    "protected": false,
                                    "defaultValue": "",
                                    "suffix": "",
                                    "prefix": "",
                                    "placeholder": "",
                                    "key": "M2A1-cashValue1",
                                    "label": "Internal/Cash Value ($USD)",
                                    "inputMask": "",
                                    "inputType": "text",
                                    "tableView": false,
                                    "input": true,
                                    "hideLabel": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Internal/Industrial Amount (MT)",
                                    "key": "M2A1-industrialAmount1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "lockKey": true,
                                    "properties": {
                                        "": ""
                                    },
                                    "tags": [],
                                    "type": "currency",
                                    "conditional": {
                                        "show": "",
                                        "when": null,
                                        "eq": ""
                                    },
                                    "validate": {
                                        "required": false,
                                        "multiple": "",
                                        "custom": ""
                                    },
                                    "clearOnHide": true,
                                    "hidden": false,
                                    "persistent": true,
                                    "protected": false,
                                    "defaultValue": "",
                                    "suffix": "",
                                    "prefix": "",
                                    "placeholder": "",
                                    "key": "M2A1-industrialValue1",
                                    "label": "Internal/Industrial Value ($USD)",
                                    "inputMask": "",
                                    "inputType": "text",
                                    "tableView": false,
                                    "input": true,
                                    "hideLabel": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Export Amount (MT)",
                                    "key": "M2A1-exportAmount1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Export Value ($USD)",
                                    "key": "M2A1-exportValue1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Total Amount (MT)",
                                    "key": "M2A1-totalAmount1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                },
                                {
                                    "input": true,
                                    "tableView": false,
                                    "inputType": "text",
                                    "inputMask": "",
                                    "label": "Total Value ($USD)",
                                    "key": "M2A1-totalValue1",
                                    "placeholder": "",
                                    "prefix": "",
                                    "suffix": "",
                                    "defaultValue": "",
                                    "protected": false,
                                    "persistent": true,
                                    "hidden": false,
                                    "clearOnHide": true,
                                    "validate": {
                                        "custom": "",
                                        "multiple": "",
                                        "required": false
                                    },
                                    "conditional": {
                                        "eq": "",
                                        "when": null,
                                        "show": ""
                                    },
                                    "type": "currency",
                                    "hideLabel": true,
                                    "tags": [],
                                    "properties": {
                                        "": ""
                                    },
                                    "lockKey": true
                                }
                            ],
                            "input": true,
                            "tree": true,
                            "tableView": false,
                            "label": "",
                            "key": "M2A1-assessment1Fieldset2Datagrid",
                            "protected": false,
                            "persistent": true,
                            "hidden": false,
                            "clearOnHide": true,
                            "type": "datagrid",
                            "tags": [],
                            "conditional": {
                                "eq": "",
                                "when": null,
                                "show": ""
                            },
                            "properties": {
                                "": ""
                            },
                            "striped": true,
                            "bordered": true,
                            "lockKey": true
                        }
                    ],
                    "properties": {
                        "": ""
                    },
                    "conditional": {
                        "show": "",
                        "when": null,
                        "eq": ""
                    },
                    "tags": [],
                    "type": "fieldset",
                    "legend": "2. For each of the following key production areas/regions within this country, estimate the total amount produced and value of this crop grown for the following uses (please specify as many individual areas, or regions, such as \"Njoro, Kenya\" that you will be using throughout your assessments):",
                    "tableView": true,
                    "input": false,
                    "key": "M2A1-assessment1Fieldset2",
                    "lockKey": true
                }
            ],
            "key": "M2A1-assessment1",
            "input": false,
            "title": "Module 2 - Analysis of crop value, delivery systems, breeding programs and unmet needs for plant materials",
            "theme": "success",
            "tableView": false,
            "type": "panel",
            "breadcrumb": "default",
            "tags": [],
            "conditional": {
                "eq": "",
                "when": null,
                "show": ""
            },
            "properties": {
                "": ""
            },
            "lockKey": true
        },
        {
            "custom": "saveAsDraft(data)",
            "customClass": "saveAsDraft pull-right",
            "properties": {
                "": ""
            },
            "conditional": {
                "eq": "",
                "when": null,
                "show": ""
            },
            "tags": [],
            "type": "button",
            "theme": "default",
            "disableOnInvalid": false,
            "action": "custom",
            "block": false,
            "rightIcon": "",
            "leftIcon": "",
            "size": "md",
            "key": "saveasDraft",
            "tableView": false,
            "label": "Save as Draft",
            "input": true
        },
        {
            "customClass": "submitForm",
            "properties": {
                "": ""
            },
            "conditional": {
                "eq": "",
                "when": null,
                "show": ""
            },
            "tags": [],
            "input": true,
            "label": "Submit",
            "tableView": false,
            "key": "submit",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "submit",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button"
        }
    ],
    "owner": null,
    "submissionAccess": [
        {
            "type": "create_all",
            "roles": []
        },
        {
            "type": "read_all",
            "roles": []
        },
        {
            "type": "update_all",
            "roles": []
        },
        {
            "type": "delete_all",
            "roles": []
        },
        {
            "type": "create_own",
            "roles": [
                "5a65f5d5d772bf00015a3dc5"
            ]
        },
        {
            "type": "read_own",
            "roles": [
                "5a65f5d5d772bf00015a3dc5"
            ]
        },
        {
            "type": "update_own",
            "roles": [
                "5a65f5d5d772bf00015a3dc5"
            ]
        },
        {
            "type": "delete_own",
            "roles": [
                "5a65f5d5d772bf00015a3dc5"
            ]
        },
        {
            "type": "team_read",
            "roles": []
        },
        {
            "type": "team_write",
            "roles": []
        },
        {
            "type": "team_admin",
            "roles": []
        }
    ],
    "access": [
        {
            "type": "create_all",
            "roles": []
        },
        {
            "type": "read_all",
            "roles": [
                "5a65f5d5d772bf00015a3dc4",
                "5a65f5d5d772bf00015a3dc5",
                "5a65f5d5d772bf00015a3dc6"
            ]
        },
        {
            "type": "update_all",
            "roles": []
        },
        {
            "type": "delete_all",
            "roles": []
        },
        {
            "type": "create_own",
            "roles": []
        },
        {
            "type": "read_own",
            "roles": []
        },
        {
            "type": "update_own",
            "roles": []
        },
        {
            "type": "delete_own",
            "roles": []
        },
        {
            "type": "team_read",
            "roles": []
        },
        {
            "type": "team_write",
            "roles": []
        },
        {
            "type": "team_admin",
            "roles": []
        }
    ],
    "tags": [
        "visible"
    ],
    "type": "resource"
} /*