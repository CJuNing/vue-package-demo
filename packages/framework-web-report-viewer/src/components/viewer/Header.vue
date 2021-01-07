<template>
<div class="MsiteHeaderOutter" @mouseleave="showHeader=false" @mouseenter="showHeader=true">
    <div v-show="showHeader" v-for="(tab,index) in tabs" :key="tab.id" :title="tab.text"
    @click="selectMode(tab.mode)"
    class="HeaderButton">
       <span>{{tab.text}}</span>
    </div>
    <i v-show="!showHeader" class="el-icon-setting"></i>
</div>
</template>

<script>
export default {
    name: "",
    components: {},
    // extends: null,
    // minxins: [],
    props: [],
    data() {
        return {
            showHeader:false,
            tabs:[
                {
                    text:"冻结/取消冻结",
                    id:'1',
                    icon:'el-icon-s-tools',
                    mode:'fixed' //模式
                },
                {
                    text:"显示/隐藏标尺",
                    id:'8',
                    icon:'el-icon-s-tools',
                    mode:'showRule'
                },
                {
                    text:"高亮/取消高亮标尺",
                    id:'9',
                    icon:'el-icon-s-tools',
                    mode:'activeRule'
                },
                {
                    text:"保存填报数据",
                    id:'12',
                    icon:'el-icon-s-tools',
                    mode:'saveFillingData'
                },
                {
                    text:"加载填报数据",
                    id:'13',
                    icon:'el-icon-s-tools',
                    mode:'loadFillingData'
                },
                {
                    text:"是否居中显示报表",
                    id:'14',
                    icon:'el-icon-s-tools',
                    mode:'center'
                },

            ]
        };
    },
    computed: {},
    watch: {},
    beforeCreate() {},
    created() {
        
    },
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    methods: {
        /* 选择模式 */
        selectMode(mode){
            switch (mode) {
                case 'fixed':
                    this.$emit('fixed')
                    break;
                case 'floatRowBefore':
                    this.$emit('floatRow', 'before');
                    break;
                case 'floatRowAfter':
                    this.$emit('floatRow', 'after');
                    break;
                case 'floatRowDelete':
                    this.$emit('floatRow', 'delete');
                    break;
                case 'numbering':
                    this.$emit('mode', 'numbering');
                    break;
                case 'norm':
                    this.$emit('mode', 'norm');
                    break;
                case 'normal':
                    this.$emit('mode', 'normal');
                    break;
                case 'showRule':
                    this.$emit('rule', 'showRule');
                    break;
                case 'activeRule':
                    this.$emit('rule', 'activeRule');
                    break;
                case 'out':
                    this.$emit('changeData', 'out');
                    break;
                case 'inner':
                    this.$emit('changeData', 'inner');
                    break;
                case 'saveFillingData':
                    this.$emit('changeData', 'saveFillingData');
                    break;
                case 'loadFillingData':
                    this.$emit('createMix');
                    break;
                case 'center':
                    this.$emit('isCenter');
                    break;
                default:
                    break;
            }
        },
        
    }
};
</script>

<style lang="less" scoped>
.MsiteHeaderOutter{
    display: flex;
    color: #666666;
    flex-wrap: wrap;
    align-items: left;
    background-color: #f8f9fb;
    flex-direction: column;
    &:hover{
        box-shadow: 5px 2px 19px #666, 2px 2px 5px #666;
    }
    .HeaderButton{
        background-color: #F5F5F5;
        border: 1px solid #E1E1E1;
        border-radius: 4px;
        height: 25px;
        padding: 0 5px;
        margin: 2px 2px;
        cursor: pointer;
        i,span{
            line-height: 25px;
            font-size: 14px;
            font-weight: 700;
            vertical-align: middle;
        }
        i{
            font-size: 16px;
        }
        &:hover{
            background-color: rgb(253,170,34)
        }
    }
}
</style>