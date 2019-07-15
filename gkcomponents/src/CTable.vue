<template>
  <div :class="'c-table-wrapper level-'+level">
    <div :class="'level-titile level-'+level">{{covertoRoman(level)}}</div>
    <el-table
      class="c-table"
      style="width: 100%"
      :data="tableData"
      :height="500"
      border
      stripe
      :highlight-current-row="true"
      @current-change="handleCurrentRowChange"
      @expand-change="handleExpandChange"
    >
      <!-- 根据type显示不同的组件 -->
      <!-- 可下拉的表格 -->
      <template v-if="isType('table-expand')">
        <el-table-column type="expand" class="expand-content-warpper">
          <template slot-scope="props">
            <div class="expand-row">
              <div v-if="isType('table-expand')">
                <c-table :prefix="collectionKey" :tableid="getTableIdFrom(props)" :level="level+1"/>
              </div>
              <div v-else>{{getColumnValueFrom(props)}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          class="table-expand"
          :label="tbHeader.label"
          :prop="tbHeader.prop"
          :width="getColumnAttributesFrom(tbHeader)"
          v-for="(tbHeader, index) in tableHeader"
          :key="index"
        >
          <!-- header -->
          <template slot="header" slot-scope="scope">
            <template v-if="tbHeader.type==='checkbox'">
              <div class="check-box-wrapper">
                <el-checkbox
                  :indeterminate="dataCollection[collectionKey].checkedCollection[tbHeader.prop+'_indeterminate']"
                  v-model="dataCollection[collectionKey].checkedCollection[tbHeader.prop+'_all']"
                  @change="handleCheckToggle(dataCollection[collectionKey],tbHeader)"
                ></el-checkbox>
              </div>
            </template>
            <template v-else>{{tbHeader.label}}{{tbHeader.type}}</template>
          </template>
          <!--  -->
          <template slot-scope="scope">
            <template v-if="tbHeader.type==='checkbox'">
              <div class="check-box-wrapper">
                <el-checkbox
                  v-model="dataCollection[collectionKey].checkedCollection[tbHeader.prop][scope.row[idName]]"
                  @change="handleCheckAll(dataCollection[collectionKey],tbHeader,scope.row)"
                ></el-checkbox>
              </div>
            </template>
            <template v-else>{{scope.row[tbHeader.prop]}}</template>
          </template>
          <!--  -->
        </el-table-column>
      </template>

      <!-- 最普通的表格，如果最后没有匹配的type -->
      <template v-else>
        <el-table-column
          class="table-expand"
          :label="tbHeader.label"
          :prop="tbHeader.prop"
          :width="getColumnAttributesFrom(tbHeader)"
          v-for="(tbHeader, index) in tableHeader"
          :key="index"
        >
          <!-- header -->
          <template slot="header" slot-scope="scope">
            <template v-if="tbHeader.type==='checkbox'">
              <div class="check-box-wrapper">
                <el-checkbox
                  :indeterminate="dataCollection[collectionKey].checkedCollection[tbHeader.prop+'_indeterminate']"
                  v-model="dataCollection[collectionKey].checkedCollection[tbHeader.prop+'_all']"
                  @change="handleCheckToggle(dataCollection[collectionKey],tbHeader)"
                ></el-checkbox>
              </div>
            </template>
            <template v-else>{{tbHeader.label}}{{tbHeader.type}}</template>
          </template>
          <!--  -->
          <template slot-scope="scope">
            <template v-if="tbHeader.type==='checkbox'">
              <div class="check-box-wrapper">
                <el-checkbox
                  v-model="dataCollection[collectionKey].checkedCollection[tbHeader.prop][scope.row[idName]]"
                  @change="handleCheckAll(dataCollection[collectionKey],tbHeader,scope.row)"
                ></el-checkbox>
              </div>
            </template>
            <template v-else>{{scope.row[tbHeader.prop]}}</template>
          </template>
          <!--  -->
        </el-table-column>
      </template>
    </el-table>

    <el-pagination
      v-if="isPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="dataCollection[collectionKey].currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="dataCollection[collectionKey].pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>


<script>
define(() => {
  return {
    template: "#template",
    props: {
      /* 当前为行，行下有表 */
      tableid: {
        type: String,
        required: true
      },
      level: {
        type: Number,
        default: 1
      },
      prefix: {
        type: String,
        required: true
      }
    },
    inject: ["dataCollection", "functionCollection"],
    created() {
      let currentState =
        this.dataCollection && this.dataCollection[this.collectionKey];
      this.initComponent(currentState);
    },
    mounted() {},
    computed: {
      /* 行下表的每行的主键的id名字 */
      idName() {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        return (currentState && currentState.idName) || "applyid";
      },
      /* 在dataCollection里面能索引到当前行 */
      collectionKey() {
        return this.prefix + "_" + this.tableid;
      },
      tableData() {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        return (currentState && currentState.tabledata) || [];
      },
      tableHeader() {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        return (
          (currentState && currentState.tableheader) || [
            { label: "", prop: "" }
          ]
        );
      },
      isPagination() {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        return (currentState && currentState.isPagination) || false;
      },
      total() {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        return (currentState && currentState.total) || 0;
      }
    },
    data() {
      return {};
    },
    methods: {
      covertoRoman: function(num) {
        let Roman = [
          ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
          ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
          ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
          ["", "M", "MM", "MMM", "  ", " ", "  ", "   ", "    ", "  "]
        ];
        // 只能转换 4000 以下的正整数阿拉伯数字
        return (num => {
          if (isNaN(num)) return num;
          let ReverseArr = num
            .toString()
            .split("")
            .reverse();
          let CorrectArr = [];
          for (let i = 0; i < ReverseArr.length; i++) {
            CorrectArr.unshift(Roman[i][ReverseArr[i]]);
          }
          return CorrectArr.join("");
        })(num);
      },
      initComponent(currentState) {
        let vm = this;
        if (currentState) {
          /* 初始化 */
          vm.$set(currentState, "currentPage", currentState.currentPage || 1);
          vm.$set(currentState, "pageSize", currentState.pageSize || 10);
          /* 初始化 checkedCollection*/
          if (currentState.checkedCollection) {
            let checkedCollection = currentState.checkedCollection;
            checkedCollection.getCheckedRow = columnProp => {
              let rows = {};
              currentState.tabledata.forEach(data => {
                rows[data[vm.idName]] = data;
              });
              let isCheckedAll = checkedCollection[columnProp + "_all"];

              if (isCheckedAll) {
                return rows;
              } else {
                /* 如果一个都没有选就直接返回false，所以拿到数据需要判断一下 */
                if (!checkedCollection[columnProp + "_indeterminate"])
                  return false;
              }
              /* 用来绑定checkbox所以只有基本类型值 */
              let targetCollection = checkedCollection[columnProp];
              let targetRows = {};
              for (const key in targetCollection) {
                if (targetCollection.hasOwnProperty(key)) {
                  if (targetCollection[key]) {
                    targetRows[key] = rows[key];
                  }
                }
              }
              console.log(vm.collectionKey, "cheked rows", targetRows);
              return targetRows;
            };
          }
        } else {
          this.$notify({
            title: "提示",
            message: "CTable 初始化失败"
          });
          return false;
        }
      },
      /* getColumnAttributes */
      getColumnAttributesFrom(header) {
        return header && header.width;
      },
      /* column type */
      /* 全选CheckBox点击 */
      handleCheckToggle(currentState, tbHeader) {
        let isSingle = (tbHeader.options && tbHeader.options.isSingle) || false;
        let checkedCollection = currentState.checkedCollection;
        if (isSingle) {
          checkedCollection[tbHeader.prop + "_all"] = false;
          return false;
        }

        let isCheckedAll = checkedCollection[tbHeader.prop + "_all"];
        let target = {};
        if (isCheckedAll) {
          currentState.tabledata.forEach(item => {
            target[item[this.idName]] = true;
          });
        } else {
          currentState.tabledata.forEach(item => {
            target[item[this.idName]] = false;
          });
        }
        this.$set(checkedCollection, tbHeader.prop, target);
        checkedCollection[tbHeader.prop + "_indeterminate"] = false;
      },
      /* 单行checkbox点击 */
      handleCheckAll(currentState, tbHeader, rows) {
        let isSingle = (tbHeader.options && tbHeader.options.isSingle) || false;
        let currentCollection = currentState.checkedCollection[tbHeader.prop];
        let tableData = currentState.tabledata;
        let count = 0;
        let isCurrentChecked = false;
        if (isSingle) {
          for (const key in currentCollection) {
            if (currentCollection.hasOwnProperty(key)) {
              if (String(key) === String(rows[currentState.idName])) {
                console.log("isCurrentChecked", currentCollection[key]);
                isCurrentChecked = !!currentCollection[key];
                continue;
              } else {
                currentCollection[key] = false;
                console.log("false", currentCollection[key]);
              }
            }
          }
          console.log("rows[currentState.idName]", rows[currentState.idName]);
          count = isCurrentChecked ? 1 : 0;
        } else {
          for (const key in currentCollection) {
            if (currentCollection.hasOwnProperty(key)) {
              if (currentCollection[key]) {
                count++;
              }
            }
          }
        }
        let isCheckedAll = count === tableData.length;

        currentState.checkedCollection[tbHeader.prop + "_all"] = isCheckedAll;
        currentState.checkedCollection[tbHeader.prop + "_indeterminate"] =
          count === 0 || isCheckedAll ? false : true;
      },
      isType(typeName) {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        if (currentState) return currentState.type === typeName;
        return false;
      },
      handleExpandChange(row, expandedRows, ...args) {
        /* TODO:理论上应该是在外部定义一个handleExpandChange，再在handleExpandChange里面调用getData */
        let currentState =
          this.dataCollection &&
          this.dataCollection[this.collectionKey + "_" + row[this.idName]];
        this.initComponent(currentState);
        if (!row.isCache) currentState.getData(row, row[this.idName]);
        row.isCache = true;
        console.log("handleExpandChange:\t", args);
      },
      handleCurrentRowChange(newValue, oldValue) {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        if (currentState) {
          this.$set(currentState, "currentRow", newValue, oldValue);
          /* functionGetData：字符串，getData对应自定义函数的名字 */
          let functionHandleCurrentRowChange =
            currentState.functionHandleCurrentRowChange;
          if (functionHandleCurrentRowChange) {
            let handleCurrentRowChange = this.functionCollection[
              functionHandleCurrentRowChange
            ];
            if (handleCurrentRowChange) {
              currentState.handleCurrentRowChange = handleCurrentRowChange;
            } else {
              /* 默认方法 */
              currentState.handleCurrentRowChange = () => {
                this.$notify({
                  title: "提示",
                  message: "获取数据的方法未定义"
                });
              };
            }
            currentState.handleCurrentRowChange(newValue, oldValue);
          }
        }
      },
      handleSizeChange(val) {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        console.log(`每页 ${val} 条`);
        this.$set(currentState, "pageSize", val);
        /* 变更分页信息之后再获取信息 */
        currentState.getData();
      },
      handleCurrentChange(val) {
        let currentState =
          this.dataCollection && this.dataCollection[this.collectionKey];
        this.$set(currentState, "currentPage", val);
        /* 变更分页信息之后再获取信息 */
        currentState.getData();
      },
      getColumnValueFrom(props) {
        let prop = props.column.property;
        let data = props.row;
        return data[prop] || "no data";
      },
      getTableIdFrom(props) {
        let data = props.row;
        return String(data && data[this.idName]) || "no data";
      },
      c(...args) {
        console.log.apply(console, args);
      }
    }
  };
});
</script>

<style lang="scss">
.c-table-wrapper {
  position: relative;
  .level-titile {
    position: relative;
    padding: 0 16px;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 10px 0 10px 10px;
  }
  .el-table td,
  .el-table th {
    padding: 6px 0;
  }
  .check-box-wrapper {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .level-2 {
    border-left: 2px solid #009688;
    thead > tr th {
      background-color: #0096872d;
    }
  }
  .level-3 {
    border-left: 2px solid #1e9fff;
    thead > tr th {
      background-color: rgba(30, 158, 255, 0.329);
    }
  }
}
</style>

