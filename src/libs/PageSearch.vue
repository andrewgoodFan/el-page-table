<!--
 * @Autor: Foley Fan
 * @Date: 2021-05-14 18:31:53
 * @LastEditTime: 2021-05-18 11:02:55
 * @Description: 
-->
<script type='text/jsx'>
export default {
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        searchParams: [Object, undefined],
        formProps: [Object, undefined]
    },
    data () {
        return {
            searchData: {},
            rules: {}
        }
    },
    computed: {
        searchList () {
            return this.columns.filter((item) => !!item.showSearch)
        },
        computedSearchData () {
            return {...this.searchParams, ...this.searchData}
        }
    },
    methods: {
        changeSearchData (key, value) {
            this.$set(this.searchData, key, value)
            this.$nextTick(() => {
                this.search()
            })
        },
        search () {
            this.$emit('searchCallback', this.computedSearchData)
        }
    },
    render () {
        return (
            <div>{this.searchList.length && <el-form class='table-form' props={{model: this.computedSearchData, rules: this.rules, ...this.formProps}}
            labelWidth={this.formProps && this.formProps.labelWidth || '100px'}
            labelPosition={this.formProps && this.formProps.labelPosition || 'right'}
            >
            {
                this.searchList.map((item, index) => (
                    <el-form-item key={index} class='table-form-item' label={item.label}>
                        {
                            item.searchRender && (
                                item.searchRender(this.computedSearchData, item.prop)
                            ) || (
                            <el-input value={this.computedSearchData[item.prop]} onInput={value => this.$set(this.searchData, item.prop, value)} clearable placeholder={item.showSearch.placeholder || '请输入'} class="w200"></el-input>
                            )
                        }
                    </el-form-item>
                ))
            }
            <el-form-item class='table-form-item bottom-search'>
                <el-button onClick={this.search} type="primary" class="search-btn">搜&nbsp;索</el-button>
            </el-form-item>
			
		</el-form> || null}</div>
        )
    }
}
</script>
<style scoped>
    .table-form {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        margin-bottom: 24px;
        padding: 30px 30px 0;
        background: #fff;
    }
    .table-form .table-form-item {
        margin-bottom: 30px;
    }
    .table-form .bottom-search {
        flex: 1;
        text-align: right;
    }
</style>