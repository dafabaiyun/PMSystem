<template>
    <div>
        <div class="search" v-if="user.role !== Role['应聘者']">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="部门" prop="请选择部门">
                    <el-input v-model="form.recDep" />
                </el-form-item>
                <el-form-item label="面试状态">
                    <el-select v-model="form.resStatus" placeholder="请选择面试状态">
                        <el-option label="待面试" value="pending" />
                        <el-option label="面试中" value="in_progress" />
                        <el-option label="已通过" value="passed" />
                        <el-option label="未通过" value="failed" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="resName" label="姓名" width="120" />
                <el-table-column prop="resAge" label="年龄" width="120" />
                <el-table-column prop="resPhone" label="联系方式" width="120" />
                <el-table-column prop="job" label="应聘岗位" width="100" />
                <el-table-column prop="dep" label="部门" width="150" />
                <el-table-column prop="resStatus" label="状态" width="120">
                    <template #default="scope">
                        <span>{{ Status[scope.row.resStatus] || '-' }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column fixed="right" prop="resStatus" label="状态" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.resStatus" placeholder="请修改简历状态" size="small" @change="changeStatus">
                            <el-option v-for="item in options[user.role] || []" :label="item.val" :value="item.id" />
                        </el-select>
                    </template>
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" min-width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看简历</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="审核结果" min-width="200"
                    v-if="user.role === Role['应聘者'] && recruitForm.resStatus === Status['面试意愿确认']">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="agree(true)">同意</el-button>
                        <el-button type="primary" size="small" @click="agree(false)">拒绝</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="审核结果" min-width="200" v-if="user.role !== Role['应聘者']">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="pass(true)">通过</el-button>
                        <el-button type="primary" size="small" @click="pass(false)">不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="tableData.length" class="pagination" />
        </div>

        <el-dialog v-model="dialogVisible" title="简历信息" width="500" :before-close="CloseDialog">
            <el-form :model="recruitForm"
                :disabled="(user.role === Role['应聘者'] && recruitForm.resStatus === Status['审核未通过']) ? false : true"
                label-width="80px" style="max-width: 1200px" class="resumeDialog">
                <el-form-item label="姓名">
                    <el-input v-model="recruitForm.resName" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model.number="recruitForm.resAge" type="number" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="recruitForm.resSex" placeholder="请选择性别">
                        <el-option label="男" value="male" />
                        <el-option label="女" value="female" />
                    </el-select>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="recruitForm.rnative" placeholder="请输入籍贯" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="recruitForm.resPhone" placeholder="请输入联系方式" />
                </el-form-item>
                <el-form-item label="最高学历">
                    <el-select v-model="recruitForm.resEdu" placeholder="请选择最高学历">
                        <el-option label="专科" value="high_school" />
                        <el-option label="本科" value="bachelor" />
                        <el-option label="硕士" value="master" />
                        <el-option label="博士" value="doctorate" />
                    </el-select>
                </el-form-item>
                <el-form-item label="实习经历">
                    <el-input type="textarea" v-model="recruitForm.experience" placeholder="请输入实习经历" />
                </el-form-item>
                <el-form-item label="证书技能">
                    <el-input type="textarea" v-model="recruitForm.skill" placeholder="请输入证书和技能" />
                </el-form-item>
                <template #footer v-if="user.role === Role['应聘者'] && recruitForm.resStatus === Status['审核未通过']">
                    <div class="dialog-footer">
                        <el-button @click="cancel">取消</el-button>
                        <el-button type="primary" @click="submit">
                            确认修改
                        </el-button>
                    </div>
                </template>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, ref } from 'vue';

import { useUserStore } from '../stores/user';
import { Role, Status } from '@/api/user';
import { getAllRecruit, getResumeByDep, getResumeByStatus, getResumeByUserid, updateResume } from '@/api/resume';
const { user } = useUserStore()
import { ElMessage } from 'element-plus'
const form = reactive({
    recDep: '',
    resStatus: ''
});

const tableData = ref([]);
// 计算属性，用于根据搜索表单筛选数据  
// const filteredTableData = computed(() => {
//     const { name, interviewerId, date, state } = form;
//     return tableData.filter(row => {
//         return (
//             (!name || row.name.includes(name)) &&
//             (!interviewerId || row.interviewerId.includes(interviewerId)) &&
//             (!date || new Date(row.date).toDateString() === new Date(date).toDateString()) &&
//             (!state || row.state === state)
//         );
//     });
// });
// const options=ref({} as {[key:string]:[]})
// options[6]= [
//     { id: 3, val: '待筛选' },
//     { id: 2, val: '审核未通过' }
// ]
// options[3] = [
//     { id: 5, val: '面试意愿确认' },
//     { id: 4, val: '筛选未通过' }
// ]

const handleDetail = (row: any) => {
    Object.assign(recruitForm, row)
    console.log(recruitForm);
    dialogVisible.value = true;
};

const handleEdit = (row: any) => {
    // 实现修改简历的逻辑  
    // alert(`修改简历: ${JSON.stringify(row)}`);
};
const loading = ref(true);
onMounted(async () => {

    await getData();
})
async function getData() {
    const roleId = user.role;
    if (roleId === Role['应聘者']) {
        tableData.value = await getResumeByUserid(user.userid);
    }
    else if (roleId === Role['招聘助理']) {
        tableData.value = await getResumeByStatus(Status['待审核'])
    }
    else {
        tableData.value = await getResumeByStatus(Status['待筛选'])
    }
    loading.value = false
}

const dialogVisible = ref(false);
function openDialog() {
    dialogVisible.value = true;
}
function CloseDialog() {
    dialogVisible.value = false;
}

const recruitForm = reactive({
    ...getRecruit()
})
function getRecruit() {
    return {
        resNo: null,
        resName: '',
        resAge: null, // 使用null表示未输入年龄
        resSex: '',
        rnative: '',
        resPhone: '',
        resEdu: '',
        experience: '',
        skill: '',
        resStatus: '',
    }
}
const resumeStatus = ref();
function getStatus(row) {
    resumeStatus.value = row.resStatus;
}
async function pass(passFlag) {
    loading.value = true;
    if (user.role === Role['招聘助理']) {
        // 调用审核接口
        passFlag ? await updateResume({ ...recruitForm, resStatus: Status['待筛选'] }) : await updateResume({ ...recruitForm, resStatus: Status['审核未通过'] })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        passFlag ? await updateResume({ ...recruitForm, resStatus: Status['面试意愿确认'] }) : await updateResume({ ...recruitForm, resStatus: Status['筛选未通过'] })
    }
    await getData();
}
async function agree(agreeFlag) {
    loading.value = true;
    agreeFlag ? await updateResume({ ...recruitForm, resStatus: Status['已同意面试'] }) : await updateResume({ ...recruitForm, resStatus: Status['已拒绝面试'] })
    await getData();
}
async function submit() {
    const res = await updateResume(recruitForm) //提交简历接口
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
    Object.assign(recruitForm, getRecruit());
    console.log("recruitForm:" + recruitForm);

    dialogVisible.value = false;
}
async function search() {
    if (form.recDep) {
        tableData.value = await getResumeByDep(form.recDep);
    }
    else if (form.resStatus) {
        tableData.value = await getResumeByStatus(form.resStatus);
    }
    else {
        await reset();
    }
}
async function reset() {
    await getData();
}
function cancel() {
    Object.assign(recruitForm, getRecruit());
    dialogVisible.value = false;

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
</style>