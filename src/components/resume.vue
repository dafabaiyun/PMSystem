<template>
    <div>
        <div class="search" v-if="user.role !== Role['应聘者']">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="部门">
                    <el-input v-model="form.recDep" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item label="简历状态">
                    <el-select v-model="form.resStatus" placeholder="请选择简历状态">
                        <el-option label="待筛选" value="3" />
                        <el-option label="面试意向确认" value="5" />
                        <el-option label="待面试" value="6" />
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
                <el-table-column prop="resName" label="姓名" width="120" />
                <el-table-column prop="resAge" label="年龄" width="120" />
                <el-table-column prop="resPhone" label="联系方式" width="120" />
                <el-table-column prop="job" label="应聘岗位" width="100" />
                <el-table-column prop="dep" label="部门" width="150" />
                <el-table-column prop="resStatus" label="状态" width="120">
                    <template #default="scope">
                        <span>{{ Status[Number(scope.row.resStatus)] || Status[1] }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="100">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看简历</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="面试回复" min-width="200" v-if="user.role === Role['应聘者']">
                    <template #default="scope">
                        <el-button :disabled="Number(scope.row.resStatus) !== Status['面试意愿确认']" type="primary"
                            size="small" @click="agree(true, scope.row)">同意</el-button>
                        <el-button :disabled="Number(scope.row.resStatus) !== Status['面试意愿确认']" type="primary"
                            size="small" @click="agree(false, scope.row)">拒绝</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="审核结果" min-width="200" v-if="user.role !== Role['应聘者']">
                    <template #default="scope">
                        <el-button
                            v-if="Number(scope.row.resStatus) === Status['待审核'] || Number(scope.row.resStatus) === Status['待筛选']"
                            type="primary" size="small" @click="pass(true, scope.row)">通过</el-button>
                        <el-button
                            v-if="Number(scope.row.resStatus) === Status['待审核'] || Number(scope.row.resStatus) === Status['待筛选']"
                            type="primary" size="small" @click="pass(false, scope.row)">不通过</el-button>
                        <el-button v-if="user.role === Role['人事专员'] && Number(scope.row.resStatus) === Status['已同意面试']"
                            type="primary" size="small" @click="createInter(scope.row.resNo)">创建面试</el-button>
                        <span v-if="user.role === Role['人事专员'] && Number(scope.row.resStatus) === Status['面试意愿确认']"
                            type="primary" size="small">等待回复中</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="tableData.length" class="pagination" />
        </div>

        <el-dialog v-model="dialogVisible" title="简历信息" width="500" :before-close="CloseDialog">
            <el-form :model="recruitForm"
                :disabled="(user.role === Role['应聘者'] && Number(recruitForm.resStatus) === Status['审核未通过']) ? false : true"
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
                        <el-option label="专科" value="专科" />
                        <el-option label="本科" value="本科" />
                        <el-option label="硕士" value="硕士" />
                        <el-option label="博士" value="博士" />
                    </el-select>
                </el-form-item>
                <el-form-item label="实习经历">
                    <el-input type="textarea" v-model="recruitForm.experience" placeholder="请输入实习经历" />
                </el-form-item>
                <el-form-item label="证书技能">
                    <el-input type="textarea" v-model="recruitForm.skill" placeholder="请输入证书和技能" />
                </el-form-item>
            </el-form>
            <template #footer v-if="user.role === Role['应聘者'] && Number(recruitForm.resStatus) === Status['审核未通过']">
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submit">
                        确认修改
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="interVisible" title="创建面试信息" width="500" :before-close="CloseInter">
            <el-form :model="interForm" label-width="80px" style="max-width: 1200px" class="interDialog">
                <el-form-item label="面试地点">
                    <el-config-provider :locale="zhCn">
                        <el-date-picker :locale="zhCn" v-model="interForm.interTime" type="datetime" placeholder="请选择面试时间"
                            value-format="YYYY-MM-DDTHH:MM:ss" />
                    </el-config-provider>
                </el-form-item>
                <el-form-item label="面试地点">
                    <el-input v-model.number="interForm.interDest" placeholder="请输入面试地点" />
                </el-form-item>
                <el-form-item label="面试类型">
                    <el-select v-model="interForm.interType" placeholder="请选择面试类型">
                        <el-option label="线下面试" value="线下面试" />
                        <el-option label="视频面试" value="视频面试" />
                        <el-option label="电话面试" value="电话面试" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="CloseInter">取消</el-button>
                    <el-button type="primary" @click="submitInter">
                        确认
                    </el-button>
                </div>
            </template>
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
import { insertInterview } from '@/api/interview';
import { zhCn } from 'element-plus/es/locales.mjs';
const form = reactive({
    recDep: '',
    resStatus: '3'
});

const tableData = ref([]);
const handleDetail = (row: any) => {
    Object.assign(recruitForm, row)
    console.log(recruitForm);
    dialogVisible.value = true;
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
async function pass(passFlag, row) {
    loading.value = true;
    Object.assign(recruitForm, row)
    if (user.role === Role['招聘助理']) {
        // 调用审核接口
        const res = passFlag ? await updateResume({ ...recruitForm, resStatus: Status['待筛选'] }) : await updateResume({ ...recruitForm, resStatus: Status['审核未通过'] })
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
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        const res = passFlag ? await updateResume({ ...recruitForm, resStatus: Status['面试意愿确认'] }) : await updateResume({ ...recruitForm, resStatus: Status['筛选未通过'] });
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
    }
    await getData();
}
async function agree(agreeFlag, row) {
    loading.value = true;
    Object.assign(recruitForm, row)
    const res = agreeFlag ? await updateResume({ ...recruitForm, resStatus: Status['已同意面试'] }) : await updateResume({ ...recruitForm, resStatus: Status['已拒绝面试'] })
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
    await getData();
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
function CloseInter() {
    Object.assign(interForm, getInterForm());
    interVisible.value = false;
}
const interVisible = ref(false);
function getInterForm() {
    return {
        interTime: '',
        interDest: '',
        interType: '',
        resNo: null,
    }
}
const interForm = reactive({
    ...getInterForm()
})
function createInter(resNo) {
    interForm.resNo = resNo;
    interVisible.value = true;
}
function cancel() {
    Object.assign(recruitForm, getRecruit());
    dialogVisible.value = false;

}
async function submitInter() {
    const res = await insertInterview(interForm)
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

/deep/ .resumeDialog .el-form-item {
    width: 100%;
}

/deep/ .el-dialog__footer {
    padding-top: 0;
}

/deep/ .interDialog .el-date-editor {
    width: 100%;
}

/deep/ .interDialog .el-form-item {
    width: 100%;
}
</style>