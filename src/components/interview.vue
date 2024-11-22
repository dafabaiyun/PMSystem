<template>
    <div>
        <div class="search">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="部门">
                    <el-input v-model="form.recDep" placeholder="请输入部门"/>
                </el-form-item>
                <!-- <el-form-item label="面试阶段" prop="请输入面试阶段">
                    <el-input v-model="form.interPeriod" />
                </el-form-item> -->
                <el-form-item label="面试状态" v-if="user.role === Role['人事专员']">
                    <el-select v-model="form.interStatus" placeholder="请选择面试状态" clearable >
                        <!-- <el-option label="待面试" value="1" /> -->
                        <el-option label="已通过面试" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="面试阶段" v-if="user.role === Role['人事专员']">
                    <el-select v-model="form.interPeriod" placeholder="请选择面试阶段" clearable >
                        <el-option label="一面" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="resName" label="姓名" width="80" />
                <el-table-column prop="resPhone" label="电话" width="120" />
                <el-table-column prop="recDep" label="部门" width="80" />
                <el-table-column prop="interTime" label="面试时间" width="180" />
                <el-table-column prop="interDest" label="面试地点" width="100" />
                <el-table-column prop="interPeriod" label="面试阶段" width="100">
                    <template #default="scope">
                        <span>{{ Period[Number(scope.row.interPeriod)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interStatus" label="面试状态" width="120">
                    <template #default="scope">
                        <span>{{ InterStatus[Number(scope.row.interStatus)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interType" label="面试类型" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="250">
                    <template #default="scope">
                        <el-button v-if="scope.row.interStatus === InterStatus['已通过面试'].toString()" type="primary" size="small"
                            @click="send(scope.row)">发送录用通知</el-button>
                        <div v-else>
                            <el-button type="primary" size="small" @click="pass(scope.row, true)">通过</el-button>
                            <el-button type="primary" size="small" @click="pass(scope.row, false)">不通过</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="tableData.length" class="pagination" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, ref } from 'vue';

import { useUserStore } from '../stores/user';
import { Role, Period, InterStatus } from '@/api/user';
import { updateinterview, getInterviewByStatus, getInterviewByPeriod, getInterviewByDep } from '@/api/interview';
import { ElMessage } from 'element-plus'
const { user } = useUserStore()
const form = reactive({
    interStatus: '',
    recDep: '',
    interPeriod: '',
});

const tableData = ref([]);

async function pass(row, passFlag) {
    loading.value = true;
    let res;
    if (user.role === Role['技术部主管']) {
        // 调用审核接口
        res = passFlag ? await updateinterview({ ...row, interPeriod: Period['三面'].toString() }) : await updateinterview({ ...row, interStatus: InterStatus['未通过'].toString() })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        res = passFlag ? await updateinterview({ ...row, interPeriod: Period['二面'].toString() }) : await updateinterview({ ...row, interStatus: InterStatus['未通过'].toString() })
    }
    else {
        res = passFlag ? await updateinterview({ ...row, interStatus: InterStatus['已通过面试'].toString() }) : await updateinterview({ ...row, interStatus: InterStatus['未通过'].toString() })

    }
    if (res.success) {
        ElMessage({
            message: '操作成功！',
            type: 'success',
        });
    } else {
        ElMessage({
            message: res.errMsg || '操作失败！请重试',
            type: 'error',
        });
    }
    await getData();
}
const loading = ref(true);
onMounted(async () => {
    await getData();
})
async function getData() {
    loading.value = true
    const roleId = user.role;
    if (roleId === Role['人事专员']) {
        tableData.value = await getInterviewByPeriod(Period['一面'].toString())
    }
    else if (roleId === Role['技术部主管']) {
        tableData.value = await getInterviewByPeriod(Period['二面'].toString())
        tableData.value=tableData.value.filter(item=>item.recDep==='技术部')
    }
    else {
        tableData.value = await getInterviewByPeriod(Period['三面'].toString())
    }
    loading.value = false;
}

async function send(row) {
    loading.value = true;
    const res = await updateinterview({ ...row, interStatus: InterStatus['已发录用函'].toString() })
    if (res.success) {
        ElMessage({
            message: '操作成功！',
            type: 'success',
        });
    } else {
        ElMessage({
            message: res.errMsg || '操作失败！请重试',
            type: 'error',
        });
    }
    await getData();
}
async function search(){
    loading.value=true;
    if(form.recDep){
        tableData.value=await getInterviewByDep(form.recDep)
    }
    else if(form.interStatus){
        tableData.value=await getInterviewByStatus(form.interStatus)
    }
    else{
        tableData.value=await getInterviewByPeriod(form.interPeriod)
    }
    loading.value=false;
}
async function reset() {
    await getData()
}
</script>

<style scoped>
.search {
    margin-top: 20px;
}

.el-form {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 20px;
}

/deep/ .el-date-editor--date {
    width: 100%;
}

/* /deep/ .el-form .el-button {
    margin-left: 310px;
} */

/deep/ .el-form-item__content {
    width: 370px;
    margin-right: 20px;
}

.buttons {
    margin-bottom: 20px;
    text-align: right;
}

.pagination {
    float: right;
    margin-top: 20px;
}

/deep/ .resumeDialog .el-form-item__content {
    width: 100%;
}

/deep/ .el-dialog__footer {
    padding-top: 0;
}

/deep/ .el-form-item {
    width: 100%;
}
.search .el-form-item{
    width: 420px;
}
</style>