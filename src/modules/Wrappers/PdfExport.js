import FormioUtils from "formiojs/utils";
const PdfExport = class ClassName {
  static export(currentForm, currentSubmission, pageSize, portraitLandscape) {
    // var lfrom represents the current form
    // var indexr = 1;
    var linesOfPage = 0; // linesOfPage exist for be a parameter of size of the page
    // var indexPage = 1; // represents a number of page
    var linesOfPageLimitLetter = 33; // represents the quantity lines (+ or -) of a letter size page
    var linesOfPageLimitA4 = 36; // represents the quantity lines (+ or -) of a a4 size page
    var limitLinesOfPage = 0; // helps to measure the actual height of content on page
    var pageSizeParam = "a4" // passed with param to html2pdf for define a size of page on printing
    if (undefined !== pageSize && pageSize.toLowerCase() === "a4") {
      limitLinesOfPage = linesOfPageLimitA4; // defines a4 with a size of page based on param pageSize received
    }
    else if (undefined !== pageSize && pageSize.toLowerCase() === "letter") {
      limitLinesOfPage = linesOfPageLimitLetter; // defines letter with a size of page based on param pageSize received
      pageSizeParam = "letter"; // defines letter with a size of page passed to html2pdf
    }
    else {
      limitLinesOfPage = linesOfPageLimitA4; // defines a4 with a size of page by default
    }
    var orientation = "portrait"; // defines orientation of page with portrait value by default
    if (portraitLandscape) {
      if (portraitLandscape.toLowerCase() === "l") {
        orientation = "landscape"; // defines orientation of page with landscape based param received
        limitLinesOfPage = 30; // defines the limit of linhes of the page for landscape orientation
      }
    }
    var lForm = currentForm.data;
    var currentPanel = "";
    var flagKeyTableInsideDataGrid = "";
    // var element represents the htmo page thats became pdf document
    // we use styles directly on dom elements
    var element = "";
    // the construction of the page
    element += "<html>";
    element += "<head>";
    element += "<title>Survey</title>";
    element += "<head>";
    element += "<body>";
    element += "<div id='printableSurvey' style='font-family:Helvetica,Verdana,Sans-serif;'>";
    element += "<div  style='text-align: center;'>";
    element +=
      "<br><br><img src='statics/faoHeader.jpg' width='275' height='112'></div>";
    if (orientation !== "landscape") {
      element += "<br><br><br><br><br><br>";
    }
    element +=
      "<div style='text-align: center; font-family: Helvetica; font-size: 40px;color: #b3b3ff;text-shadow: 1px 1px 1px #000000;'>GIPB Planning and Assessment Tool</div>";
    element +=
      "<div style='text-align: center; font-family: Helvetica; font-size: 40px;color: #b3b3ff;text-shadow: 1px 1px 1px #000000;'>(PAT) for Plant Breeding Capacity</div>";
    element +=
      "<div style='text-align: center; font-family: Helvetica; font-size: 40px;color: #b3b3ff;text-shadow: 1px 1px 1px #000000;'>OUTPUT</div>";
    if (orientation !== "landscape") {
      element += "<br><br><br><br><br><br>";
    }
    if (orientation === "landscape") {
      element += "<br><br><br>";
    }
    element +=
      "<table width='100%' style='font-family:verdana;font-size: 16px;'><tr><td width='40%'>Assessment undertaken by</td><td>&nbsp;Country:</td></tr>";
    element += "<tr><td width='40%'></td><td>&nbsp;Organization:</td></tr>";
    element +=
      "<tr><td width='40%'></td><td>&nbsp;Information team:</td></tr>";
    element += "<tr><td width='40%'>&nbsp;</td><td></td></tr>";
    element += "<tr><td width='40%'></td><td>&nbsp;</td></tr>";
    element += "<tr><td width='40%'>&nbsp;</td><td></td></tr>";
    element += "<tr><td width='40%'>Date:</td><td></td></tr>";
    element += "</table>";

    if (orientation !== "landscape") {
      element += "<br><br><br><br><br><br><br><br>";
    }
    else {
      element += "<br><br><br><br>";
    }
    element +=
      "<div style='text-align: right; font-family: Helvetica; font-size: 19px;color: #b3b3ff;text-shadow: 1px 1px 1px #000000;'>A framework to support Building Plant Breeding Capacity for</div>";
    element +=
      "<div style='text-align: right; font-family: Helvetica; font-size: 19px;color: #b3b3ff;text-shadow: 1px 1px 1px #000000;'>Sustainable Crop Improvement</div>";
    element += "<br><br><br>";
    element += "<table width='100%' border='0'>";
    // we using tables because is a requisite from client
    FormioUtils.eachComponent(
      lForm.components,
      component => {
        // console.log(component.type);
        if (
          component.title !== undefined &&
          currentPanel.toLowerCase() !== component.title.toLowerCase()
        ) {
          currentPanel = component.title;
          element += "<tr>";
          element += "<td colspan='3'>";
          element += "&nbsp;";
          if (linesOfPage >= limitLinesOfPage) {
            element += "<div class='html2pdf__page-break'></div>";
            linesOfPage = 1;
          }
          element += "</td></tr>";
          element += "<tr>";
          element +=
            "<td style='font-weight: bold;font-family: Verdana;font-size: 18px;color: #b3b3ff;' colspan='3'>";
          element += currentPanel;
          element += "</td></tr>";
          element += "<tr>";
          element += "<td colspan='3' valign='top'>";
          element += "<hr>";
          element += "</td></tr>";
          linesOfPage += 2;
        }
        // the loop eachComponent just render the fields filled and not render buttons
        if (
          FormioUtils.getValue(currentSubmission, component.key) &&
          component.type !== "button" &&
          component.type !== "resource"
        ) {
          if (linesOfPage < limitLinesOfPage) { // verify if the lines of a page are on limit
            // total of lines of one page based on size defined on variabes and params
            // ========================================================================================================
            // those if's above working with each type of objects
            // ========================================================================================================
            if (component.type === "datetime") { // if componente are a datetime use to string for cut the full datetime in a simple date with year, month and day
              element += "<tr>";
              element +=
                "<td style='font-family: Verdana;font-size: 13px' colspan='3'><strong>";
              element += component.label;
              element += "</strong><ul><li><i>";
              element += FormioUtils.getValue(
                currentSubmission,
                component.key
              ).substring(0, 10);
              element += "</i></li></ul></td></tr>";
              linesOfPage += 2;
            }
            // ========================================================================================================
            /* else if (component.type === "resource") { // verify is document is a select type
              let resourceData = FormioUtils.getValue(currentSubmission, component.key).data;
              for (let d in resourceData) {
                console.log(d)
                console.log(resourceData[1]);
              }
            } */
            // ========================================================================================================
            else if (component.type === "select") { // verify is document is a select type
              var valueObject = FormioUtils.getValue(
                currentSubmission,
                component.key
              ).toString();
              var list = [];
              if (undefined !== valueObject && valueObject.indexOf(",") > 0) { // if select component are multiple values convert the values with split
                list = valueObject.split(",");
              } else {
                list = [valueObject];
              }
              element += "<tr>";
              element +=
                "<td style='font-family: Verdana;font-size: 13px' colspan='3'><strong>";
              element += component.label;
              element += "</strong><ul>";
              linesOfPage += 1;
              for (var i = 0; i < list.length; i++) {
                element += "<li><i>&nbsp;-&nbsp;";
                element += list[i];
                element += "</i></li>";
                linesOfPage += 1;
              }
              element += "</ul>";
              element += "</td></tr>";
            }
            // ========================================================================================================
            else if (component.type === "datagrid") { // verify if the component is a datagrid and print in a table
              console.log(JSON.stringify(component.components));
              element += "<tr><td>";
              element += "<table border='0' width='100%'><tr><td colspan='2'>";
              element += component.label;
              element += "</td></tr><tr><td colspan='2'>&nbsp;</td></tr></table>";
              var listValues = FormioUtils.getValue(currentSubmission, component.key);
              // listValues represents the values of datagrid
              var listComps = component.components;
              // listComps represents the array of componentes in datagrid
              var labels = [];
              // labels is an array to store all labels of components of the datagrid
              var names = [];
              // name is an array to store all values of components of the datagrid
              // those var's are used to make a simple table possibiliting the print
              listComps.forEach((listCompsEl, indexGrid) => { // get the array of json object from component
                if (listCompsEl.type === "table") {
                  flagKeyTableInsideDataGrid = listCompsEl.key;
                }
                if (listCompsEl.rows && listCompsEl.rows.length > 0) {
                  listCompsEl.rows.forEach((tableRowArray) => { // iterate the all key:value of the json object
                    let components = tableRowArray.filter((c) => {
                      return (c.components[0].content) && (c.components[0].tag === "p")
                    })
                    if (components.length > 0) {
                      components.forEach((tComp, index) => {
                        let parsedString = String(this.strip(tComp.components[0].content))
                        let label = parsedString.substring(0, 110);
                        label = parsedString === label ? label : (label + '...')
                        labels.push(label); // gets the value of json object by index
                      });
                    }
                    let anotherComponents = tableRowArray.filter(ac => {
                      return !(ac.components[0].content) && !(ac.components[0].tag === "p")
                    });
                    if (anotherComponents.length > 0) {
                      anotherComponents.forEach((taComp, index) => {
                        var label = "";
                        var n = 0;
                        while (taComp.components[n]) {
                          label += taComp.components[n].label;
                          listValues.forEach(lValue => {
                            label += "&nbsp;<i>" + this.getValueFromJsonObject(lValue, taComp.components[n].key) + "</i>&nbsp;&nbsp;";
                          });
                          label += "<br>";
                          n++;
                        }
                        names.push(label);
                      });
                    }
                  });
                  if (names.length > 0) {
                    element += "<table border='0' width='100%'>";
                    for (var x = 0; x < labels.length; x++) {
                      var bgcolor = (x % 2 === 0 ? "#f2f2f2" : "#ffffff");
                      if (linesOfPage >= limitLinesOfPage) {
                        element += "<tr><td colspan='2'>";
                        element += "<div class='html2pdf__page-break'></div>";
                        linesOfPage = 1;
                        element += "</td></tr>";
                      }
                      element += "<tr bgcolor='" + bgcolor + "'><td width='60%'><strong>";
                      element += labels[x];
                      element += "</strong></td><td>";
                      element += names[x];
                      element += "</td></tr>";
                      element += "<tr><td colspan='2'>&nbsp;</td></tr>";
                      linesOfPage += 2
                    }
                    element += "</table>";
                  }
                }
                else {
                  if (linesOfPage >= limitLinesOfPage) {
                    element += "<div class='html2pdf__page-break'></div>";
                    linesOfPage = 1;
                  }
                  element += "<table border='0' width='100%'>";
                  let values = FormioUtils.getValue(currentSubmission, component.key);
                  var bgcolor2 = (indexGrid % 2 === 0 ? "#f2f2f2" : "#ffffff");
                  element += "<tr bgcolor='" + bgcolor2 + "'><td width='40%'><strong>";
                  element += listCompsEl.label;
                  element += "</strong></td>";
                  for (var v = 0; v < values.length; v++) {
                    element += "<td width='" + (60 / values.length) + "%'>";
                    if (listCompsEl.type === "select") {
                      element += this.getLabelFromJsonArray(listCompsEl.data.values, this.getValueFromJsonObject(values[v], listCompsEl.key));
                    }
                    else {
                      element += this.getValueFromJsonObject(values[v], listCompsEl.key);
                    }
                    element += "</td>";
                    linesOfPage += 2;
                    // element += "<tr><td colspan='2'>&nbsp;</td></tr>";
                  }
                  element += "</tr></table><br>";
                }
              });
              element += "</td></tr>";
            }
            // ========================================================================================================
            else if (component.type === "survey") {
              var answers = FormioUtils.getValue(currentSubmission, component.key);
              if (this.countKeysInJsonObject(answers) > 0) {
                element += "<tr><td>";
                // element += "<div class='html2pdf__page-break'></div>";
                element += "<table border='0' cellspadding='0' cellspacing='0' width='100%'>";
                component.questions.forEach((question, index) => {
                  var backRow = (index % 2 === 0 ? "#f2f2f2" : "#ffffff");
                  if (linesOfPage >= limitLinesOfPage) {
                    element += "<tr><td colspan='2'>";
                    element += "<div class='html2pdf__page-break'></div>";
                    linesOfPage = 1;
                    element += "</td></tr>";
                  }
                  element += "<tr  bgcolor='" + backRow + "'><td style='font-size: 13px' width='80%'><strong>";
                  element += question.label;
                  element += "</strong></td><td style='font-size: 13px' align='center'>";
                  element += this.getLabelFromJsonArray(component.values, this.getValueFromJsonObject(answers, question.value));
                  element += " </td></tr><tr><td colspan='2'>&nbsp;</td></tr>";
                  linesOfPage += 1;
                });
                element += "</table></td></tr>";
              }
            }
            // ========================================================================================================
            else if (component.type === "selectboxes") {
              // console.log(JSON.stringify(component));
              // console.log(JSON.stringify(FormioUtils.getValue(currentSubmission, component.key)));
              var boxes = FormioUtils.getValue(currentSubmission, component.key);
              if (this.countKeysInJsonObject(boxes) > 0) {
                element += "<tr><td>";
                // element += "<div class='html2pdf__page-break'></div>";
                element += "<table border='0' cellspadding='0' cellspacing='0' width='100%'>";

                element += "<tr><td style='font-size: 13px' width='60%'><strong>";
                element += component.label;
                element += "</strong></td>";
                element += "<td style='font-size: 13px'>";
                for (let box in boxes) {
                  if (boxes[box] === true) {
                    element += this.getLabelFromJsonArray(component.values, box);
                    element += "<br>"
                  }
                  linesOfPage += 1;
                }
                element += " </td></tr><tr><td colspan='2'>&nbsp;</td></tr>";
                element += "</table></td></tr>";
              }
            }
            // ========================================================================================================
            else { // this block is for all others type of formio components
              if (component.label) {
                element += "<tr>";
                element +=
                  "<td colspan='3'><strong>";
                element += component.label;
                element += "</strong><ul><li><i>";
                element += FormioUtils.getValue(currentSubmission, component.key);
                element += "</i></li></ul></td></tr>";
                linesOfPage += 2;
              }
            }
            // indexr++;
          } else {
            // this else block prints the footer of page with page number and starts a new page
            // it's commented because we do not have time to develop a eficient way to misure the size of page and put page numbers using html table and the component html2pdf
            /* element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            element += " <tr><td colspan='2' > <hr></td></tr>";
            element +=
              " <tr><td>PAT Survey</td><td align='right'> Page " +
              indexPage +
              "</td></tr>";
            element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            element += " <tr><td colspan='2' > &nbsp; </td></tr>";
            */
            element += " <tr><td colspan='3' > &nbsp; </td></tr>";
            element += "<tr>";
            element += "<td style='font-family: Verdana;font-size: 15px'><strong>";
            element += component.label;
            element += "</strong><ul><li><i>";
            element += FormioUtils.getValue(
              currentSubmission,
              component.key
            );
            element += "</i></li></ul></td></tr>";
            // indexr = 1;
            linesOfPage = 1;
            // indexPage++; // increase page numbers
            element += " <tr><td colspan='3' > &nbsp; </td></tr>";
          }
        }
        // ========== tables ===================================================================
        if (component.type === "table" && component.key !== flagKeyTableInsideDataGrid) {
          element += "<tr><td colspan='3'><br><br><table border='0' cellspadding='0' cellspacing='0' width='100%'>";
          component.rows.forEach((row, indexTable) => {
            var backRow = (indexTable % 2 === 0 ? "#f2f2f2" : "#ffffff");
            if (linesOfPage >= limitLinesOfPage) {
              element += "<tr><td colspan='3'>";
              element += "<div class='html2pdf__page-break'></div>";
              linesOfPage = 1;
              element += "</td></tr>";
            }
            element += "<tr  bgcolor='" + backRow + "'><td style='font-size: 15px' width='80%'><strong>";
            if (row[0].components[1]) {
              if (row[0].components[1].content) {
                element += row[0].components[1].content;
              }
            }
            element += " </strong></td><td style='font-size: 15px' align='center'>";
            element += (FormioUtils.getValue(currentSubmission, row[1].components[0].key) !== null ? FormioUtils.getValue(currentSubmission, row[1].components[0].key) : row[1].components[0].content);
            element += " </td><td style='font-size: 15px' align='center'>";
            element += (FormioUtils.getValue(currentSubmission, row[1].components[0].key) !== null ? FormioUtils.getValue(currentSubmission, row[1].components[0].key) : row[2].components[0].content);
            element += "</td></tr>";
            linesOfPage += 1;
          });
          element += "</table><br><br></td></tr>";
        }
        // ========== tables ===================================================================
      }, true //  this boolean parameter defines includeall components
    );
    // this block above make a calc of rest part of last page to puts the footer on bottom
    // it's commented because we do not have time to develop a eficient way to misure the size of page and put page numbers using html table and the component html2pdf
    /* if (linesOfPage < limitLinesOfPage) {
      var diferenceLines = limitLinesOfPage - linesOfPage;
      for (var x = 0; x < diferenceLines; x++) {
        element += " <tr><td colspan='2' > &nbsp; </td></tr>";
      }
    }
    element += " <tr><td colspan='2' > &nbsp; </td></tr>";
    element += " <tr><td colspan='2' > <hr></td></tr>"; */
    // element +=
    //  " <tr><td>PAT Survey</td><td align='right'> Page " +
    //  indexPage +
    //  "</td></tr>";
    element += "</table>";
    element += "</div>";
    element += "</body>";
    element += "</html>";
    // console.log(pageSizeParam, element);
    this.printpdf(element, orientation, pageSizeParam);
    element = undefined; // var element became undefined for the case when de user generate another report  on the same session
  }
  // this function is by strip the content of some components of the datagrid
  static strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  // this function gets one value from a json array
  static getValueFromJsonArray(array, key) {
    var found = "";
    array.forEach(obj => {
      if (obj[key]) {
        found = obj[key];
      }
    });
    return found;
  }
  // this function gets one label from a json array
  static getLabelFromJsonArray(array, value) {
    var found = "";
    array.forEach(obj => {
      if (obj["value"] === value) {
        found = obj["label"];
      }
    });
    return found;
  }
  // this function gets one value from a json object
  static getValueFromJsonObject(obj, key) {
    var found = "";
    if (obj[key]) {
      found = obj[key];
    }
    return found;
  }
  // this function really prints the pdf
  static printpdf(element, orientation, pageSizeParam) {
    // use of the html2pdf component for generate the pdf
    html2pdf(element, {
      margin: 1,
      filename: "export.pdf",
      html2canvas: {
        dpi: 192,
        letterRendering: true
      },
      jsPDF: {
        orientation: orientation,
        unit: "cm",
        format: pageSizeParam
      }
    });
  }

  static cutLabels(valueOfLabel) {
    let parsedString = String(this.strip(valueOfLabel));
    let label = parsedString.substring(0, 110);
    label = parsedString === label ? label : (label + '...');
    return label;
  }
  static countKeysInJsonObject(obj) {
    var count = 0;
    for (let key in obj) { // eslint-disable-line
      count++;
    }
    return count;
  }
}
export default PdfExport
// element += "<div class='html2pdf__page-break'></div>";
