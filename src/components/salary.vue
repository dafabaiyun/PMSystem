<template>
    <div>
        <div class="search" v-if="user.role !== Role['员工']">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="月份">
                    <el-input v-model="form.salaryNo" placeholder="请输入月份，例：2024-10" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select clearable v-if="user.role === Role['财政专员']" v-model="form.paystatus" placeholder="请选择发放状态">
                        <el-option label="待审核" :value="SalaryStatus['待审核'].toString()" />
                        <el-option label="待发放" :value="SalaryStatus['待发放'].toString()" />
                    </el-select>
                    <el-select clearable v-else v-model="form.paystatus" placeholder="请选择发放状态">
                        <el-option label="待核算" :value="SalaryStatus['待核算'].toString()" />
                        <el-option label="有异议" :value="SalaryStatus['有异议'].toString()" />
                        <el-option label="审核未通过" :value="SalaryStatus['审核未通过'].toString()" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttons">
            <el-button type="primary" v-if="user.role === Role['人事专员'] && currentStatus === SalaryStatus['待核算'].toString()"
                @click="calculate">一键核算</el-button>
            <!-- <el-button type="primary" v-if="user.role===Role['财政专员'] && currentStatus===SalaryStatus['待发放']" @click="send">一键发放</el-button> -->
        </div>
        <el-divider />
        <div class="table">
            <el-table :data="salaryData" style="width: 100%" v-loading="loading">
                <el-table-column prop="salaryNo" label="薪资日期" width="120" />
                <el-table-column prop="sno" label="员工编号" width="120" />
                <el-table-column prop="baseSal" label="基本工资" width="120" />
                <el-table-column prop="jobSal" label="岗位工资" width="120" />
                <el-table-column prop="attendSal" label="考勤奖金" width="120" />
                <el-table-column prop="bonus" label="津贴补贴" width="120" />
                <el-table-column prop="socialSec" label="社保缴纳" width="120" />
                <el-table-column prop="totalSal" label="总工资" width="120" />
                <el-table-column prop="actualSal" label="应发工资" width="120" />
                <el-table-column prop="paystatus" label="发放状态" width="120">
                    <template #default="scope">
                        <span>{{ SalaryStatus[Number(scope.row.paystatus)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payTime" label="发放日期" width="120" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button v-if="user.role === Role['人事专员'] && scope.row.paystatus === SalaryStatus['待核算'].toString()"
                            type="primary" size="small" @click="openDialog(scope.row)">
                            填写薪资
                        </el-button>
                        <el-button v-if="user.role === Role['财政专员'] && scope.row.paystatus === SalaryStatus['待审核'].toString()"
                            type="primary" size="small" @click="pass(scope.row, true)">
                            审核通过
                        </el-button>
                        <el-button v-if="user.role === Role['财政专员'] && scope.row.paystatus === SalaryStatus['待审核'].toString()"
                            type="primary" size="small" @click="pass(scope.row, false)">
                            审核不通过
                        </el-button>
                        <el-button v-if="user.role === Role['财政专员'] && scope.row.paystatus === SalaryStatus['待发放'].toString()"
                            type="primary" size="small" @click="send(scope.row)">
                            审核不通过
                        </el-button>
                        <el-button v-if="user.role === Role['员工'] && scope.row.paystatus === SalaryStatus['待确认'].toString()"
                            type="primary" size="small" @click="pass(scope.row, true)">
                            确认薪资
                        </el-button>
                        <el-button v-if="user.role === Role['员工'] && scope.row.paystatus === SalaryStatus['待确认'].toString()"
                            type="primary" size="small" @click="pass(scope.row, false)">
                            有异议
                        </el-button>

                        <span v-if="user.role === Role['员工'] && scope.row.paystatus !== SalaryStatus['待确认'].toString()" type="primary"
                            size="small">
                            审核中...
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" total="100" class="pagination" />
        </div>
        <el-dialog v-model="dialogVisible" title="请输入薪资信息" width="500" :before-close="cancel">
            <el-form :model="salaryForm" label-width="70px" style="max-width: 1200px" class="resumeDialog">
                <el-form-item label="基本工资">
                    <el-input v-model="salaryForm.baseSal" placeholder="请输入基本工资" />
                </el-form-item>
                <el-form-item label="岗位工资">
                    <el-input v-model.number="salaryForm.jobSal" type="number" placeholder="请输入岗位工资" />
                </el-form-item>
                <el-form-item label="津贴补贴">
                    <el-input v-model.number="salaryForm.bonus" type="number" placeholder="请输入津贴补贴" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import { calculateSalary, getSalaryByDate, getSalaryBySno, getSalaryByStatus, SalaryStatus, updateSalary, updateSalaryStatus } from '@/api/salary';
import { useUserStore } from '../stores/user';
import { Role } from '@/api/user';
const { user } = useUserStore()
// 初始化薪资数据  
const salaryData = ref([])
const currentStatus = ref('1')
// 搜索筛选表单的数据模型  
const form = reactive({
    salaryNo: '',
    paystatus: user.role === Role['人事专员'] ? '1' : '2',
});
async function search() {
    if (form.paystatus) {
        currentStatus.value = form.paystatus;
        salaryData.value = await getSalaryByStatus(form.paystatus)
        console.log(form.paystatus)
    } else if (form.salaryNo) {
        salaryData.value = await getSalaryByDate(form.salaryNo)
    } else {
        await getData()
    }
}
const loading = ref(false);
async function getData() {
    loading.value = true
    if (user.role === Role['人事专员']) {
        salaryData.value = await getSalaryByStatus(SalaryStatus['待核算'].toString())
    }
    else if (user.role === Role['财政专员']) {
        salaryData.value = await getSalaryByStatus(SalaryStatus['待审核'].toString())
    }
    else {
        console.log(user.userid)
        salaryData.value = await getSalaryBySno(user.userid);
    }
    loading.value = false;
}
async function reset() {
    await getData()
}
async function calculate() {
    const res = await calculateSalary();
    if (res.success) {
        ElMessage({
            message: '核算成功！',
            type: 'success',
        });
        await getData();
    } else {
        ElMessage({
            message: res.errMsg || '核算失败！请重试',
            type: 'error',
        });
    }
}
onMounted(async () => {
    await getData()
})
const salaryForm = reactive({
    ...getSalaryForm()
})
function getSalaryForm() {
    return {
        salaryNo: '',
        sNo: '',
        baseSal: null,
        jobSal: null,
        bonus: null,
        // payTime:null

    }
}
const dialogVisible = ref(false);
function openDialog(row) {
    // const { sNo, salaryNo,baseSal,jobSal,bonus } = row
    // salaryForm.sNo = sNo;
    // salaryForm.salaryNo = salaryNo;
    Object.assign(salaryForm, row)
    dialogVisible.value = true;
}
function cancel() {
    Object.assign(salaryForm, getSalaryForm());
    dialogVisible.value = false;
}
async function submit() {
    const res = await updateSalary(salaryForm)
    if (res.success) {
        ElMessage({
            message: '填写成功！',
            type: 'success',
        });
        cancel()
        await getData();
    } else {
        ElMessage({
            message: res.errMsg || '填写失败！请重试',
            type: 'error',
        });
    }
}
async function pass(row, flag) {
    let res;
    const { sno, salaryNo } = row
    if (user.role === Role['员工']) {
        res = flag ? await updateSalaryStatus({ sno, salaryNo, paystatus: SalaryStatus['待发放'].toString() }) : await updateSalaryStatus({ sno, salaryNo, paystatus: SalaryStatus['有异议'].toString() })
    }
    else {
        res = flag ? await updateSalaryStatus({ sno, salaryNo, paystatus: SalaryStatus['待确认'].toString() }) : await updateSalaryStatus({ sno, salaryNo, paystatus: SalaryStatus['审核未通过'].toString() })
    }
    if (res.success) {
        ElMessage({
            message: '操作成功！',
            type: 'success',
        });
        cancel()
        await getData();
    } else {
        ElMessage({
            message: res.errMsg || '操作失败！请重试',
            type: 'error',
        });
    }

}
async function send(row) {
    const { sno, salaryNo } = row
    const res = await updateSalaryStatus({ sno, salaryNo, paystatus: SalaryStatus['已发放'].toString() })
    if (res.success) {
        ElMessage({
            message: '操作成功！',
            type: 'success',
        });
        cancel()
        await getData();
    } else {
        ElMessage({
            message: res.errMsg || '操作失败！请重试',
            type: 'error',
        });
    }
}
</script>

<style scoped>
.tit {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    width: 180px;
}

.search {
    margin-top: 20px;
}

.el-form {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;


}

/deep/ .el-form-item__content {
    width: 250px;
    margin-right: 20px;
}

/deep/ .tit .el-icon {
    width: 25px;
    height: 25px;
    color: #1d69db;
    margin-left: 6px;
}

/deep/ .tit .el-icon svg {
    height: 25px;
    width: 25px;
}

/deep/ .el-form-item__label-wrap {
    margin-left: 0;
}
</style>