<script type="text/jsx">
import PageSearch from "./PageSearch"
export default {
  name: "el-page-table",
  props: {
    /**
     * interface ColumnsProps: {
     *      prop: string
     *      label: string
     *      width?: number
     *      render?: () => Vnode
     * }
     *
     * 列表项数组
     * columns: Arrary<ColumnsProps>
     *
     * **/
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    /**
     *  静态列表参数  ================ S ===============
     */
    /** 列表数据
     * dataSource: Array<any>
     * **/
    dataSource: Array,
    /** 列表总数
     * total: Number
     * **/
    total: Number,
    /** 列表当前页数
     * currentPage: Number
     * **/
    currentPage: Number,
    loading: Boolean,
    /**
     *  静态列表参数  ================ E ===============
     */

    /**
     *  组件内请求数据参数  =============== S ==============
     */
    /**
     * 请求数据方法
     * query?: Function
     */
    query: Function,
    /**
     * 请求成功之后的回调
     * querySuccess?: Function
     */
    querySuccess: Function,
    /**
     * 查询参数
     * searchData?: Object || null
     *
     */
    searchData: Object,
    /**
     *  组件内请求数据参数  =============== E ==============
     */
    /** 是否显示分页
     * showPagination: boolean
     * **/
    showPagination: {
      type: Boolean,
      default: () => true,
    },
    // 对应列的类型
    type: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ["selection", "index", "expand"].indexOf(value) !== -1;
      },
    },
    // 多选框参数集合
    rowSelection: [Object, undefined],

    /**
     * 搜索表单参数 （自定义布局）
     */
    formProps: [Object, undefined],
    /**
     * 列表头部左侧VNode
     */
    middleSlot: undefined,
    /**
     * 列表头部右侧VNode
     */
    middleButton: undefined,
  },
  data() {
    return {
      tableData: [],
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableLoading: false,
    };
  },
  mounted() {
    this.queryTableData();
  },
  computed: {
    isStaticTable() {
      return !!this.dataSource;
    },
    tableSource() {
      return this.dataSource || this.tableData;
    },
  },
  methods: {
    async queryTableData({ pageIndex, pageSize, ...restProps } = {}) {
      if (!this.searchData) {
        return;
      }
      if (this.dataSource) {
        return;
      }
      this.tableLoading = true;
      const searchData =
        (this.$refs.pageSearch && this.$refs.pageSearch.computedSearchData) ||
        {};
      const currentPageIndex =
        pageIndex || this.searchData.pageIndex || this.queryParams.pageIndex;
      const currentPageSize =
        pageSize || this.searchData.pageSize || this.queryParams.pageSize;
      try {
        const res = await this.query({
          ...searchData,
          ...restProps,
          currentPage: currentPageIndex,
          pageSize: currentPageSize
        });
        if (res.bizCode === "SUCCESS") {
          this.tableData = res.respData.list;
          this.queryParams = {
            ...this.queryParams,
            total: res.respData.total,
          };
          this.tableLoading = false;
          this.querySuccess && this.querySuccess();
        }
      } catch (error) {
        this.tableLoading = false;
      }
    },
    handleCurrentChange(val) {
      if (this.isStaticTable) {
        this.$emit("handleCurrentChange", val);
      } else {
        this.queryParams.pageIndex = val;
        this.queryTableData({ pageIndex: val });
      }
    },
    // Table Methods
    /**
     * @description: 用于多选表格，清空用户的选择
     */
    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    /**
     * @description: 用于多选表格，切换所有行的选中状态
     */
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection();
    },
    /**
     * @description: 搜索组件切换
     */
    singleSearchChange(key, value) {
      this.$refs.pageSearch.changeSearchData(key, value);
    },
    searchCallback(searchData) {
      if (this.isStaticTable) {
        this.$emit("searchCallback", searchData);
      } else {
        this.queryParams.pageIndex = 1;
        this.queryTableData(searchData);
      }
    },
    getSearchData() {
      return this.$refs.pageSearch.computedSearchData;
    },
  },
  render() {
    // 指令
    /**
     * modifiers指定修饰符，如果使用某一个修饰符，则指定这个修饰符的值为 true
     * 不使用可以设置为false或者直接删掉
     */
    const directives = [
      {
        name: "loading",
        value: this.isStaticTable ? this.loading : this.tableLoading,
        modifiers: { fullscreen: false },
      },
    ];
    return (
      <div>
        {
          <PageSearch
            formProps={this.formProps}
            on-searchCallback={this.searchCallback}
            ref="pageSearch"
            columns={this.columns}
            searchParams={this.searchData}
          />
        }
        {(this.middleSlot || this.middleButton) && (
          <div class="table-middle-wrap">
            <div>{this.middleSlot && this.middleSlot()}</div>
            <div>{this.middleButton && this.middleButton()}</div>
          </div>
        )}
        <div class="table-wrap">
          <el-table
            ref="elTable"
            class="page-table"
            data={this.tableSource}
            {...{
              on:
                (this.rowSelection && {
                  "selection-change": this.rowSelection.selectionChange,
                }) ||
                {},
              directives,
            }}
            row-key={
              (this.rowSelection && this.rowSelection.rowKey) || undefined
            }
          >
            {this.type &&
              ((this.type === "selection" && (
                <el-table-column
                  type={this.type}
                  reserve-selection={
                    this.rowSelection.reserveSelection || false
                  }
                  selectable={this.rowSelection.selectable}
                ></el-table-column>
              )) || <el-table-column type={this.type}></el-table-column>)}
            {this.columns.map(
              ({ render, ...restProps }, index) =>
                (!!render && (
                  <el-table-column
                    key={index}
                    props={{ ...restProps }}
                    {...{
                      scopedSlots: {
                        default: (scope) => {
                          return render(scope);
                        },
                      },
                    }}
                  ></el-table-column>
                )) || (
                  <el-table-column props={{ ...restProps }}></el-table-column>
                )
            )}
          </el-table>
          {this.showPagination && (
            <el-pagination
              on-current-change={this.handleCurrentChange}
              current-page={
                (this.isStaticTable && this.currentPage) ||
                this.queryParams.pageIndex
              }
              page-sizes={[10, 20, 30, 50]}
              layout="total, prev, pager, next, jumper"
              total={
                (this.isStaticTable && this.total) || this.queryParams.total
              }
              style="margin-top: 20px;text-align:right;"
            />
          )}
        </div>
      </div>
    );
  },
};
</script>

<style scoped>
.table-middle-wrap {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #efefef;
  background: #fff;
}
.table-wrap {
  padding: 18px 30px 48px;
  background: #fff;
}
</style>
