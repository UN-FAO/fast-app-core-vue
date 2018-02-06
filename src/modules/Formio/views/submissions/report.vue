<template>
    <q-card color="white">
        <q-card-title>
            Card Title
            <q-btn icon="create" @click="changeData">Change Data</q-btn>
        </q-card-title>
        <q-card-separator />
        <q-card-main>
            Card Content
           
<div class="layout-padding">
    <q-data-table
      :data="table"
      :config="config"
      :columns="columns"
    >
  
    </q-data-table>
</div>



            <mybar :chartData="_chartComputedInfo" :options="reportOptions"></mybar>
        </q-card-main>
    </q-card>
</template>

<script>
import {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,

    QDataTable,
    QField,
    QInput,
    QCheckbox,
    QSelect,
    QSlider,
    QBtn,
    QIcon,
    QTooltip,
    QCollapsible,
    clone
} from "quasar";
import Submission from "database/models/Submission";
import mybar from './bar'
import table from './table.json'
export default {
    components: {
        QCard,
        QCardTitle,
        QCardSeparator,
        QCardMain,
        mybar,
        QDataTable,
        QField,
        QInput,
        QCheckbox,
        QSelect,
        QSlider,
        QBtn,
        QIcon,
        QTooltip,
        QCollapsible
    },
    async mounted() {
      //  let id = this.$route.params.idForm;
     // this.submission = await Submission.local().get(id);
     // this.submission = await Submission.local().sFind(this, {
     //   "data.formio.formId": this.$route.params.idForm
     // });
     this.submissions = await Submission.local().get(this.$route.params.idSubmission);
     var field = this.submissions.data.data;
     var element = field['S0-info-name'];
     console.log("submissions", field, element);
    },
    datas: function() {
        return {
            ourData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            reportOptions: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    },
    methods: {
        changeData() {
            this.ourData = this.ourData.map((v) => {
                return v + Math.random()
            })
        },
        getIndividualScore() {
            this.ourData = this.ourData.map((v) => {
                return v + Math.random()
            })
        },
        changeMessage (props) {
        props.rows.forEach(row => {
            row.data.message = 'Gogu'
        })
        },
        deleteRow (props) {
        props.rows.forEach(row => {
            this.table.splice(row.index, 1)
        })
        },
        refresh (done) {
        this.timeout = setTimeout(() => {
            done()
        }, 5000)
        },
        selection (number, rows) {
        console.log(`selected ${number}: ${rows}`)
        },
        rowClick (row) {
        console.log('clicked on a row', row)
        }
    },
    computed: {
        _chartComputedInfo() {
            return {
                labels: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                datasets: [
                    {
                        label: 'GitHub Commits',
                        backgroundColor: '#f87979',
                        data: this.ourData
                    }
                ]
            }
        },
    getRelativeResilience() {
      let submission = this.submissions;
      if (submission && submission.data && submission.data.data) {
		 let data = [
		  {
			id: 1,
			source: '21-10-2016',
			message: 'Some message'
		  }
		]
        return data;
      } else {
        return "";
      }
    }
    },
data2: function() {
     // this.submissions = await Submission.local().get(this.$route.params.idSubmission);
     // var element = this.submissions.data.data['S0-info-name'];
return {
data2: [{
  "content": "Test",
  "flow_no": "FW201601010001",
  "flow_type": "Repair",
  "flow_type_code": "repair"
  }, {
  "content": "Lock broken",
  "flow_no": "FW201601010002",
  "flow_type": "Repair",
  "flow_type_code": "repair"
  }, {
  "content": "Help to buy some drinks",
  "flow_no": "FW201601010003",
  "flow_type": "Help",
  "flow_type_code": "help"
}],
titles: [{
  prop: "flow_no",
  label: "Module"
  }, {
  prop: "content",
  label: "Average score (individual)"
  }]
    }
  },
  data () {
    return {
      table: table,
      config: {
        title: 'Data Table',
        refresh: true,
        noHeader: false,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 2,
        bodyStyle: {
          maxHeight: '500px'
        },
        rowHeight: '50px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        selection: 'multiple'
      },
      columns: [
        {
          label: 'Date',
          field: 'isodate',
          width: '140px',
          classes: 'bg-orange-2',
          filter: true,
          sort (a, b) {
            return (new Date(a)) - (new Date(b))
          },
          format (value) {
            return new Date(value).toLocaleString()
          }
        },
        {
          label: 'Service',
          field: 'serviceable',
          format (value) {
            if (value === 'Informational') {
              return '<i class="material-icons text-positive" style="font-size: 22px">info</i>'
            }
            return value
          },
          width: '70px'
        },
        {
          label: 'Time Range',
          field: 'timerange',
          width: '80px',
          sort: true,
          type: 'number'
        },
        {
          label: 'Message',
          field: 'message',
          filter: true,
          sort: true,
          type: 'string',
          width: '500px'
        },
        {
          label: 'Source',
          field: 'source',
          filter: true,
          sort: true,
          type: 'string',
          width: '120px'
        },
        {
          label: 'Log Number',
          field: 'log_number',
          sort: true,
          type: 'string',
          width: '100px'
        }
      ],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 500
    }
  },
  watch: {
    pagination (value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination)
        this.config.pagination = false
        return
      }
      this.config.pagination = this.oldPagination
    },
    rowHeight (value) {
      this.config.rowHeight = value + 'px'
    },
    bodyHeight (value) {
      let style = {}
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = value + 'px'
      }
      this.config.bodyStyle = style
    },
    bodyHeightProp (value) {
      let style = {}
      if (value !== 'auto') {
        style[value] = this.bodyHeight + 'px'
      }
      this.config.bodyStyle = style
    }
  }
}
</script>
<style SCOPED>
.q-card-title {
    color: red;
}
</style>
<style lang="stylus">
.my-label
  padding 5px
  border-radius 3px
  display inline-block
</style>
