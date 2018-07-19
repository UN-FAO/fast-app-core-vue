<template>
  <div style='font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;'>
     Write your custom R script
                  <editor v-model="content" @init="editorInit" lang="r" theme="chrome" width="100%" height="50vh"></editor>

                  <q-btn loader @click="executeScript">
                    Test script
                    <!--
                      Notice slot="loading". This is optional.
                      If missing, the default theme spinner will be used.
                    -->
                    <span slot="loading">Loading...</span>
                  </q-btn>
                  <q-btn @click="stdout = ''; valout=''; consoleout=''">
                    Clear output
                  </q-btn>
                  <q-btn color="primary" @click="submitForm">
                    Submit
                  </q-btn>
                  <q-input :min-rows="5" v-model="stdout" disable type="textarea" float-label="Std Output" />
                  <q-input :min-rows="5" v-model="valout" disable type="textarea" float-label="Value Output" />
                  <q-input :min-rows="5" v-model="consoleout" disable type="textarea" float-label="Console Output" />

  </div>
</template>
<script>
import { QBtn, QInput } from 'quasar';
import { Event } from 'fast-fastjs';
import axios from 'axios';
export default {
  name: 'rexecutor',
  components: {
    QBtn,
    QInput,
    editor: require('vue2-ace-editor')
  },
  props: {
    submission: {
      required: true
    },
    openCpuUrl: {
      required: true
    },
    formioUrl: {
      required: true
    },
    token: {
      required: true
    }
  },
  watch: {
    openCpuUrl: function(url) {},
    formioUrl: function(url) {},
    token: function(url) {},
    submission: function(submission) {
      if (submission) {
        let data = JSON.parse(submission);
        this.onSubmissionChange(data);
      }
    }
  },
  data() {
    return {
      content: '',
      response: null,
      stdout: null,
      valout: null,
      consoleout: null,
      firstLoad: true
    };
  },
  methods: {
    submitForm() {
      Event.emit({
        name: 'FAST:SUBMISSION:SUBMIT',
        data: {
          isScript: true,
          script: this.getUserTypedScript(),
          field: 'script'
        },
        text: 'Submitting'
      });
    },
    editorInit: function() {
      require('brace/ext/language_tools'); // language extension prerequsite...
      require('brace/mode/r');
      require('brace/snippets/r');
      require('brace/theme/chrome');
    },
    onSubmissionChange(data) {
      let variables = data.variables;

      let rScript = this.getInitialText();
      if (variables) {
        variables.forEach((variable) => {
          if (variable.name && variable.path && variable.name !== '') {
            let fullUrl =
              "'" + this.formioUrl + '/' + variable.path + "/submission'";
            rScript = rScript + variable.name + '_url <- ' + fullUrl + ' ; \n';
          }
        });
      }
      rScript = rScript + this.getExampleText();

      if (this.firstLoad && data.script) {
        this.content = rScript + data.script;
        this.firstLoad = false;
      } else {
        this.content = rScript + this.getUserTypedScript();
      }
    },
    getFullScript() {
      let fullScript = "token <- '" + this.token + "' ; \n";
      fullScript = fullScript + this.getRLibrary() + '; \n';
      let classInit = '';

      JSON.parse(this.submission).variables.forEach((variable) => {
        if (variable.name && variable.path && variable.name !== '') {
          classInit =
            classInit +
            variable.name +
            ' <- Formior$new("' +
            this.formioUrl +
            '/", "' +
            variable.path +
            '", token); \n';
        }
      });

      fullScript = fullScript + classInit + this.content;
      return fullScript;
    },
    getUserTypedScript() {
      return this.content.substring(
        this.content.indexOf('!!#') + 4,
        this.content.length
      );
    },
    executeScript(event, done) {
      var bodyFormData = new FormData();
      let fullScript = this.getFullScript();
      bodyFormData.set('x', fullScript);
      let url = '';
      axios({
        method: 'post',
        url: this.openCpuUrl + '/ocpu/library/base/R/identity',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then((response) => {
          url = response.data.split('/ocpu/').map((r) => {
            r = r.replace(/\n/g, '');
            return r;
          });
          let sdtoutUrl = url.find((o) => {
            return o.indexOf('/stdout') > -1;
          });
          let valUrl = url.find((o) => {
            return o.indexOf('/.val') > -1;
          });

          let consoleUrl = url.find((o) => {
            return o.indexOf('/.val') > -1;
          });

          if (sdtoutUrl) {
            axios
              .get(this.openCpuUrl + '/ocpu/' + sdtoutUrl + '/text')
              .then((response) => {
                this.stdout = response.data;
                done();
              })
              .catch((error) => {
                error = error.response.data
                  ? error.response.data
                  : error.response;
                this.stdout = JSON.stringify(error);
                done();
              });
          }
          if (valUrl) {
            axios
              .get(this.openCpuUrl + '/ocpu/' + valUrl)
              .then((response) => {
                this.valout = response.data;
                done();
              })
              .catch((error) => {
                error = error.response.data
                  ? error.response.data
                  : error.response;
                this.valout = JSON.stringify(error);
                done();
              });
          }

          if (consoleUrl) {
            axios
              .get(this.openCpuUrl + '/ocpu/' + consoleUrl)
              .then((response) => {
                this.consoleout = response.data;
                done();
              })
              .catch((error) => {
                error = error.response.data
                  ? error.response.data
                  : error.response;
                this.consoleout = JSON.stringify(error);
                done();
              });
          }
        })
        .catch((error) => {
          error = error.response.data ? error.response.data : error.response;
          this.valout = JSON.stringify(error);
          this.stdout = JSON.stringify(error);
          this.consoleout = JSON.stringify(error);
          done();
        });
    },
    getInitialText() {
      return `#################################################################
#
# The "token" variable will contain your Formio x-token
#
# You can use these URLs to request data from the DB
# \n`;
    },
    getExampleText() {
      return `# Direct call Example: Replace <myVariable> with your variable Name
#
# httpCall <- httr::GET(<myVariable>_url, httr::add_headers('x-jwt-token' = token), httr::accept_json())
# text_result <- httr::content(httpCall, as = "text", encoding = "UTF-8")
# json_result <- jsonlite::fromJSON(text_result, flatten = TRUE)
#
# Fast Library Example: Replace <myVariable> with your variable Name
#
# filter <- list(list('_id','!=','5a65acec16987c0001f3d246'), list('owner','!=','2342342344'))
# select <- list('data.a', 'owner', '_id')
# chunk_size <- 15
# limit <- 150
# populate <- list('owner')
# <myVariable>$select(select)$filter(filter)$limit(limit)$populate(populate)$chunks(chunk_size)
# data <- <myVariable>$get()
################################################################!!#\n`;
    },
    getRLibrary() {
      return `#' Extract all results of a given resource or form
      #'
      #' This function allows you to express your love of cats.
      #' @param base_url Base formio URL
      #' @param resource_path Name of the path of the form ie: 'user'.
      #' @param token The formio token to allow access
      #' @export
      #' @examples
      #' Formior()
      Formior <-  R6::R6Class("Formior",
          public = list(
          # Class properties
          base_url = NULL,
          resource_path = NULL,
          token = NULL,
          filter_string = NULL,
          select_string = NULL,
          limit_string = NULL,
          populate_string = NULL,
          chunk_size_string = NULL,
          first_chunk = NULL,

          # Class constructor
          initialize = function(base_url = NA, resource_path = NA, token = NA) {
            self$base_url <- base_url
            self$resource_path <- resource_path
            self$token <- token
          },

          #Methods

          #' Sets the proper Filter URL for the GET CALL
          #'
          #' Parses the list of filters to a single string
          #' @param filter The list of filters
          #' @keywords filter
          #' @examples
          #' filterToString()
          filterToString = function(filters) {
            filterString <- ''
            for(filter in filters){
              element <- filter[[1]]
              query <- filter[[2]]
              value <- filter[[3]]

              if(query == "="){
                filterString <- paste(filterString, element, '=', value, '&', sep ='')
              }
              else if(query == "!="){
                filterString <- paste(filterString, element, '__ne=', value, '&', sep ='')
              }
              else if(query == ">"){
                filterString <- paste(filterString, element, '__gt=', value, '&', sep ='')
              }
              else if(query == ">="){
                filterString <- paste(filterString, element, '__gte=', value, '&', sep ='')
              }
              else if(query == "<"){
                filterString <- paste(filterString, element, '__lt=', value, '&', sep ='')
              }
              else if(query == "<="){
                filterString <- paste(filterString, element, '__lte=', value, '&', sep ='')
              }
              else if(query == "in"){
                filterString <- paste(filterString, element, '__in=', value, '&', sep ='')
              }
              else if(query == "nin"){
                filterString <- paste(filterString, element, '__nin=', value, '&', sep ='')
              }
              else if(query == "exists"){
                filterString <- paste(filterString, element, '__exists=', TRUE, '&', sep ='')
              }
              else if(query == "!exists"){
                filterString <- paste(filterString, element, '__exists=', FALSE, '&', sep ='')
              }
              else if(query == "regex"){
                filterString <- paste(filterString, element, '__regex=', value, '&', sep ='')
              }
            }
            filterString <- substr(filterString, 1, nchar(filterString)-1)
            return(filterString)
          },

          #' Sets the proper Select URL for the GET CALL
          #'
          #' Parses the list of select elements to a single string
          #' @param filter The list of items to include in the select
          #' @keywords filter
          #' @examples
          #' selectToString()
          selectToString = function(select){
            selectString <- '_id,'
            for(attribute in select){
              selectString = paste(selectString,attribute,',',sep='')
            }
            selectString <- substr(selectString, 1, nchar(selectString)-1)
            return(selectString)
          },
          #' Sets the proper Populate URL for the GET CALL
          #'
          #' Parses the list of select elements to a single string
          #' @param filter The list of items to include in the select
          #' @keywords filter
          #' @examples
          #' selectToString()
          populateToString = function(resources){
            populateString <- ''
            for(resource in resources){
              populateString = paste(populateString,resource,',',sep='')
            }
            populateString <- substr(populateString, 1, nchar(populateString)-1)
            return(populateString)
          },

          #' Gets the first Query String
          #'
          #' Returns the first query string given all the filters, select and limit
          #' @examples
          #' getChunkSize()
          getQueryString = function(){

            url <- paste(self$base_url, self$resource_path, "/submission?", sep='')
            first_chunk <- NULL

            # Sets the final queryString
            # Adds the filterString
            if(is.character(self$filter_string)) {
              url <- paste(url, self$filter_string, '&', sep="")
            }
            # Adds the selectString
            if(is.character(self$select_string)) {
              url <- paste(url,'select=', self$select_string, '&', sep="")
            }
            # Adds the populateString
            if(is.character(self$populate_string)) {
              url <- paste(url,'populate=', self$populate_string, '&', sep="")
            }
            return(url)

          },

          #' Gets the first chunk size
          #'
          #' Returns the first chunk size depending on the limit and chunks defined
          #' @examples
          #' getChunkSize()
          getChunkSize = function(){
            first_chunk <- NULL
            url <- ''
            if(is.character(self$limit_string) && is.character(self$chunk_size_string))
            {
              if(as.numeric(self$chunk_size_string) >= as.numeric(self$limit_string)) {
                first_chunk <- self$limit_string
              } else {
                first_chunk <- self$chunk_size_string
              }
            }
            if(is.character(self$limit_string) && !is.character(self$chunk_size_string)) {
              first_chunk <- self$limit_string
            }
            if(!is.character(self$limit_string) && is.character(self$chunk_size_string)) {
              first_chunk <- self$chunk_size_string
            }
            if(is.character(first_chunk)) {
              url <- paste(url,'limit=', first_chunk, '&', sep="")
            }
            self$first_chunk <- first_chunk
            return(url)
          },
          getTokenType = function(){
            if(nchar(self$token) > 32) {
              return('x-jwt-token')
            }
            return('x-token')
          },

          #' Extract all results of a given resource or form
          #'
          #' This function pulls the records
          #' @keywords formio
          #' @export
          #' @examples
          #' get()
          get = function() {
            url <- paste(self$getQueryString(), self$getChunkSize(), sep="")
            url <- substr(url, 1, nchar(url)-1)
            last_iteration_limit <- NULL
            tokenType = self$getTokenType()

            # GET and Parse the content
            if(tokenType == 'x-token') {
              firstResult <- httr::GET(url, httr::add_headers('x-token' = self$token), httr::accept_json())
            } else {
              firstResult <- httr::GET(url, httr::add_headers('x-jwt-token' = self$token), httr::accept_json())
            }


            error <- httr::http_error(firstResult)
            if(error){
              print('The query has an error or no results')
              el <- list()
              return(el)
            }
            text_content <- httr::content(firstResult, as = "text", encoding = "UTF-8")
            json_content <- jsonlite::fromJSON(text_content, flatten = TRUE)

            # Calculate iterations
            total <- strsplit(firstResult$headers$'content-range', "/")[[1]][[2]]
            iterations_needed <- 0
            iterations_left <- 0
            if(!is.character(self$limit_string) && is.character(self$chunk_size_string)){
              iterations_needed <- ceiling(as.numeric(total) / as.numeric(self$chunk_size_string))
              iterations_left <- as.numeric(iterations_needed) -1
            }
            # Most complicated case
            else if(is.character(self$limit_string) && is.character(self$chunk_size_string)){
              if(as.numeric(total) >= as.numeric(self$limit_string)){
                possible_results = 0
                if(as.numeric(total) >= as.numeric(self$limit_string)) {
                  possible_results <- as.numeric(self$limit_string)
                } else {
                  possible_results <- as.numeric(total)
                }
                if(possible_results == 0) {
                  iterations_needed <- 0
                  iterations_left <- 0
                }
                else{
                  iterations_needed <- ceiling( possible_results / as.numeric(self$first_chunk))
                  last_iteration_limit <- possible_results / as.numeric(self$first_chunk)
                  last_iteration_limit <- (as.numeric(last_iteration_limit) - floor(last_iteration_limit)) * as.numeric(self$first_chunk)
                  if(as.numeric(last_iteration_limit) == 0) {
                    last_iteration_limit <- as.numeric(self$first_chunk)
                  }
                  iterations_left <- as.numeric(iterations_needed) -1
                }

              }
            }


            chunks <- list()
            chunks[[1]] = json_content
            i <- 1
            while( as.numeric(iterations_left) > 0){
              # Calculate the next URL
              skip_amount <- as.character(as.numeric(self$chunk_size_string) * (as.numeric(iterations_needed) - as.numeric(iterations_left) ))
              limit <- self$chunk_size_string
              if(as.numeric(iterations_left) == 1){
                if(is.numeric(last_iteration_limit)) {
                  limit <- last_iteration_limit
                }
              }
              it_url <- paste(self$getQueryString(), "&limit=", limit, "&skip=", skip_amount, sep="");
              # GET and Parse the content
              if(tokenType == 'x-token') {
                more_result <- httr::GET(it_url, httr::add_headers("x-token" = self$token), httr::accept_json())
              } else {
                more_result <- httr::GET(it_url, httr::add_headers("x-jwt-token" = self$token), httr::accept_json())
              }

              more_content <- httr::content(more_result, as = "text", encoding = "UTF-8")
              more_json <- jsonlite::fromJSON(more_content, flatten = TRUE)

              # Merge with previous results
              #total_results = rbind_pages(total_results, more_json)
              chunks[[i+1]] <- more_json

              # Next iteration
              iterations_left <- (as.numeric(iterations_left) - 1 )
              i <- i + 1
            }

            final_result <- jsonlite::rbind_pages(chunks)
            return(final_result)
          },

          #' Applies the filters
          #'
          #' @param filters the list of filters
          #' @export
          #' @examples
          #' filter()
          filter = function(filters){
            self$filter_string = self$filterToString(filters)
            return(self)
          },

          #' Applies the select
          #'
          #' @param select the list of select
          #' @export
          #' @examples
          #' select()
          select = function(select){
            self$select_string = self$selectToString(select)
            return(self)
          },

          #' Applies the limit to the Query
          #'
          #' @param limit the limit for the query
          #' @export
          #' @examples
          #' limit()
          limit = function(limit){
            self$limit_string = as.character(limit)
            return(self)
          },

          #' Applies the populate to the Query
          #'
          #' @param resources the populate resources for the query
          #' @export
          #' @examples
          #' limit()
          populate = function(resources){
            self$populate_string = self$populateToString(resources)
            return(self)
          },

          #' Defines how many elements to call each time
          #'
          #' @param size Number of elements on each call
          #' @export
          #' @examples
          #' limit()
          chunks = function(size){
            self$chunk_size_string = as.character(size)
            return(self)
          }
        )
        )`;
    }
  }
};
</script>
