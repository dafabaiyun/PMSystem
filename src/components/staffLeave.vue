<template>
    <div>
        <div class="search">
            <el-form :model="searchForm" label-width="auto" style="max-width: 1200px">
                <el-form-item label="部门">
                    <el-input v-model="searchForm.recDep" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item class="footer">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="user.role === Role['员工']">
            <el-button type="primary" @click="create">创建请假申请</el-button>
        </div>
        <div class="table">
            <el-table :data="attendanceData" style="width: 100%" v-loading="loading">
                <el-table-column prop="sno" label="工号" width="100" />
                <el-table-column prop="sname" label="姓名" width="100" />
                <el-table-column prop="sdep" label="部门" width="150" />
                <el-table-column prop="startDate" label="开始时间" width="100" />
                <el-table-column prop="endDate" label="结束时间" width="100" />
                <el-table-column prop="leaveType" label="请假类型" width="100" />
                <el-table-column prop="reason" label="请假事由" width="100" />
                <el-table-column prop="appStatus" label="请假状态" width="100">
                    <template #default="scope">
                        <span>{{ Leave[Number(scope.row.appStatus)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="appTime" label="申请时间" width="100" />
                <el-table-column label="操作" fixed="right" v-if="user.role === Role['员工']">
                    <template #default="scope">
                        <el-button v-if="scope.row.appStatus === Leave['未通过'].toString()" type="primary" size="small"
                            @click="fix(scope.row)">修改请假信息</el-button>
                        <el-button v-else type="primary" size="small"
                            @click="cancel(scope.row.leaveNo)">取消请假</el-button>
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
        <el-dialog v-model="dialogVisible" title="请假信息" width="500">
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
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelCreate">取消</el-button>
                    <el-button type="primary" @click="submit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { Role, Status } from '@/api/user';
import { getStaffLeaveByDep, getStaffLeaveBySno, getStaffLeaveByStatus, insertStaffLeave, Leave, updateStaffLeave, updateStaffLeaveStatus } from '@/api/staffLeave';
import { ElMessage } from 'element-plus'
const { user } = useUserStore()
const searchForm = reactive({
    recDep: '',
});

const attendanceData = ref([]);
const leaveForm = reactive({
    ...leaveFun()
})
function leaveFun() {
    return {
        date: '',
        leaveType: '',
        reason: '',
        leaveNo:'',
    }
}
async function search() {
    loading.value = true;
    if (searchForm.recDep) {
        attendanceData.value = await getStaffLeaveByDep(searchForm.recDep)
    }
    else {
        attendanceData.value = await getStaffLeaveBySno(searchForm.appStatus)
    }
    loading.value = false;
}
async function reset() {
    await getData();
}
const loading = ref(false)
onMounted(async () => {
    await getData();
})
async function getData() {
    loading.value = true;
    if (user.role === Role['员工']) {
        attendanceData.value = await getStaffLeaveBySno(user.userid);
    }
    else if (user.role === Role['技术部主管']) {
        attendanceData.value = await getStaffLeaveByStatus(Leave['待审核'].toString())
        attendanceData.value = attendanceData.value.filter(item => item.sdep === '技术部')
    }
    else {
        attendanceData.value = await getStaffLeaveByStatus(Leave['待审批'].toString())
    }
    loading.value = false;
}
async function pass(leaveNo, passFlag) {
    loading.value = true;
    if (user.role === Role['技术部主管']) {
        // 调用审核接口
        passFlag ? await updateStaffLeaveStatus({ leaveNo, appStatus: Leave['待审核'].toString() }) : await updateStaffLeaveStatus({ leaveNo, appStatus: Leave['未通过'].toString() })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        passFlag ? await updateStaffLeaveStatus({ leaveNo, appStatus: Leave['已通过'].toString() }) : await updateStaffLeaveStatus({ leaveNo, appStatus: Leave['未通过'].toString() })
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
    const { leaveType, reason, date, leaveNo } = leaveForm;
    console.log(date);
    if (creating) {
        // 创建请假信息

        const res = await insertStaffLeave({
            sno: user.userid,
            startDate: date[0],
            endDate: date[1],
            leaveType,
            reason,
        })
        if (res.success) {
            ElMessage({
                message: '创建成功！',
                type: 'success',
            });
        } else {
            ElMessage({
                message: res.errMsg || '创建失败！请重试',
                type: 'error',
            });
        }
    }
    else {
        // 修改
        const res = await updateStaffLeave({
            startDate: date[0],
            endDate: date[1],
            leaveType,
            reason,
            leaveNo
        })
        if (res.success) {
            ElMessage({
                message: '修改成功！',
                type: 'success',
            });
        } else {
            ElMessage({
                message: res.errMsg || '修改失败！请重试',
                type: 'error',
            });
        }
    }
    cancelCreate()
    await getData()
}
function cancelCreate() {
    Object.assign(leaveForm, leaveFun());
    creating.value = false;
    dialogVisible.value = false;
}
function fix(row) {
    Object.assign(leaveForm, row);
    dialogVisible.value = true;

}
async function cancel(leaveNo) {
    const res = await updateStaffLeaveStatus({
        leaveNo,
        appStatus: Leave['取消请假'].toString()
    })
    if (res.success) {
        ElMessage({
            message: '取消成功！',
            type: 'success',
        });
    } else {
        ElMessage({
            message: res.errMsg || '取消失败！请重试',
            type: 'error',
        });
    }
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