<template>
<div>
    <div name="floatOperate" class="report-sheet-operate" tabindex="0" 
    :style="{
        height: '16px',
        width: '100px',
        left: floatPosition.left+'px',
        top: floatPosition.top-16+'px',
    }">
        <i class="el-icon-plus" @click='addFloatAfter'></i>
        <i class="el-icon-minus" @click='deleteFloat'></i>
        <!-- <i class="el-icon-bottom" @click='moveFloatBottom'></i>
        <i class="el-icon-top" @click='moveFloatTop'></i> -->
    </div>
</div>
</template>
<script>
    export default {
        name: "floatOperate",
        components: {},
        props: ["floatPosition"],
        data() {
            return {};
        },
        computed: {},
        watch: {},
        beforeCreate() {
        },
        created() {
        },
        beforeMount() {
        },
        mounted() {},
        beforeUpdate() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        destroyed() {
        },
        methods: {
            /**
             *  @description 向前添加一行浮动
             */
            addFloatAfter(){
                this.$emit("setOperateType","addFloatafter");
            },
             /**
             *  @description 删除当前浮动
             */
            deleteFloat(){
                this.$emit("setOperateType","deleteFloat");
            },
             /**
             *  @description 浮动行下移
             */
            moveFloatBottom(){
                this.$emit("setOperateType","moveFloatBottom");
            },
             /**
             *  @description 浮动行上移
             */
            moveFloatTop(){
                this.$emit("setOperateType","moveFloatTop");
            }
        }
    };
</script>

<style lang="less" scoped>
// 输入框样式
.report-sheet-operate{
    position:absolute;
    outline: none;
    pointer-events: none;
}
i{
    pointer-events: visible;
}
i:hover{
    color: rgb(58,140,255);
    cursor: pointer;
}
</style>