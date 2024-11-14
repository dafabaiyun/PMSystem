<template>
    <div>
        <div class="search" v-if="user.role !== Role['员工']">
            <el-form :model="searchForm" label-width="auto" style="max-width: 1200px">
                <el-form-item label="请假状态">
                    <el-input v-model="searchForm.appStatus" placeholder="请输入请假状态" />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="searchForm.recDep" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item class="footer">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <el-button type="primary" @click="create">创建请假申请</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="sno" label="工号" width="100" />
                <el-table-column prop="resName" label="姓名" width="100" />
                <el-table-column prop="recDep" label="部门" width="150" />
                <el-table-column prop="startDate" label="开始时间" width="100" />
                <el-table-column prop="endDate" label="结束时间" width="100" />
                <el-table-column prop="leaveType" label="请假类型" width="100" />
                <el-table-column prop="reason" label="请假事由" width="100" />
                <el-table-column prop="appStatus" label="请假状态" width="100">
                    <template #default="scope">
                        <span>{{ leave[scope.row.appStatus] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="appTime" label="申请时间" width="100" />
                <el-table-column label="操作" fixed="right"
                    v-if="user.role === Role['员工']">
                    <template #default="scope">
                        <el-button v-if="scope.row.appStatus === leave['未通过']" type="primary" size="small" @click="fix(scope.row)">修改请假信息</el-button>
                        <el-button v-else type="primary" size="small" @click="cancel(scope.row.leaveNo)">取消请假</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" v-else>
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="pass(scope.row.leaveNo, true)">通过</el-button>
                        <el-button type="primary" size="small" @click="pass(scope.row.leaveNo, false)">不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" total="100" class="pagination" />
        </div>
        <el-dialog v-model="dialogVisible" title="请假信息" width="500" :before-close="dialogVisible = false">
            <el-form :model="leaveForm" label-width="80px" style="max-width: 1200px" class="resumeDialog">
                <el-form-item label="起止时间">
                    <el-date-picker v-model="leaveForm.date" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请假类型">
                    <el-input v-model="leaveForm.leaveType" placeholder="请输入请假类型" />
                </el-form-item>
                <el-form-item label="请假事由">
                    <el-input v-model="leaveForm.reason" placeholder="请输入请假事由" type="textarea" />
                </el-form-item>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="submit">
                            确认
                        </el-button>
                    </div>
                </template>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue';
import AttendanceChart from './AttendanceChart.vue';
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { Role, Status } from '@/api/user';
const { user } = useUserStore()
const searchForm = reactive({
    appStatus: '',
    recDep: '',  
});
enum leave {
    待审核 = 1,
    待审批,
    未通过,
    已通过,
    取消请假
}
const tableData = ref([]);
const leaveForm = reactive({
    ...leaveFun()
})
function leaveFun() {
    return {
        date: '',
        leaveType: '',
        reason: '',
    }
}
function search(){

}
function reset(){
    
}
const loading = ref(true)
onMounted(async () => {
    await getData();
})
async function getData() {
    // await 
    loading.value = false;
}
async function pass(leaveNo, passFlag) {
    loading.value = true;
    if (user.role === Role['部门主管']) {
        // 调用审核接口
        // passFlag ? await sh({ leaveNo, appStatus: leave['待审批'] }) : await sh({ leaveNo, appStatus: Status['未通过'] })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        // passFlag ? await sh({ leaveNo, appStatus: leave['已通过'] }) : await sh({ leaveNo, appStatus: Status['未通过'] })
    }
    await getData();
}
const dialogVisible = ref(false);
const creating = ref(false)
function create() {
    creating.value = true;
    dialogVisible.value = true;
}
async function submit() {
    if (creating) {
        // 创建请假信息

    }
    else {
        // 修改


    }
    creating.value = false;
    dialogVisible.value = false;
    await getData()
}
function fix(row) {
    Object.assign(leaveForm, ...row);
    dialogVisible.value = true;

}
function cancel(leaveNo) {
    dialogVisible.value = false;
    Object.assign(leaveForm, leaveFun());
    
}
</script>

<style scoped>
.search {
    margin-top: 20px;
}

.el-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(390px, 460px)) !important;
    padding: 16px;
    border-radius: 8px 0px 0px 0px;
    border-bottom: 1px solid #e8eaee;
}

.el-form-item {
    width: 340px;
}

/deep/ .el-form-item__content {
    justify-content: flex-end;

}

/* 
/deep/ .resumeDialog .el-form-item__content {
    width: 100%;
}

/deep/ .el-dialog__footer {
    padding-top: 0;
}

/deep/ .el-form-item {
    width: 100%;
} */
</style>