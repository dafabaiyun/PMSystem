<template>
    <div>
        <div class="search">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="岗位名称" prop="请选择面试状态">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="面试官编号">
                    <el-input v-model="form.interviewerId" />
                </el-form-item>
                <el-form-item label="面试日期">
                    <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="面试状态">
                    <el-select v-model="form.state" placeholder="请选择面试状态">
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
                <el-table-column prop="resSex" label="性别" width="120" />
                <el-table-column prop="resPhone" label="联系方式" width="120" />
                <el-table-column prop="resEdu" label="最高学历" width="120" />
                <el-table-column prop="recJob" label="应聘岗位" width="100" />
                <el-table-column prop="recDep" label="部门" width="150" />
                <el-table-column prop="resStatus" label="状态" width="120">
                    <template #default="scope">
                        <span>{{ Status[scope.row.resStatus] }}</span>
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
                    v-if="user.role === ['应聘者'] && recruitForm.resStatus === Status['面试意愿确认']">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="agree(scope.row.resNo, true)">同意</el-button>
                        <el-button type="primary" size="small" @click="agree(scope.row.resNo, false)">拒绝</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="审核结果" min-width="200" v-if="user.role !== ['应聘者']">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="pass(scope.row.resNo, true)">通过</el-button>
                        <el-button type="primary" size="small" @click="pass(scope.row.resNo, false)">不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="tableData.length" class="pagination" />
        </div>

        <el-dialog v-model="dialogVisible" title="简历信息" width="500" :before-close="CloseDialog">
            <el-form :model="recruitForm"
                :disabled="(user.role === ['应聘者'] && recruitForm.resStatus === Status['审核未通过']) ? false : true"
                label-width="80px" style="max-width: 1200px" class="resumeDialog">
                <el-form-item label="姓名">
                    <el-input v-model="recruitForm.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model.number="recruitForm.age" type="number" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="recruitForm.gender" placeholder="请选择性别">
                        <el-option label="男" value="male" />
                        <el-option label="女" value="female" />
                    </el-select>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="recruitForm.hometown" placeholder="请输入籍贯" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="recruitForm.contact" placeholder="请输入联系方式" />
                </el-form-item>
                <el-form-item label="最高学历">
                    <el-select v-model="recruitForm.education" placeholder="请选择最高学历">
                        <el-option label="专科" value="high_school" />
                        <el-option label="本科" value="bachelor" />
                        <el-option label="硕士" value="master" />
                        <el-option label="博士" value="doctorate" />
                    </el-select>
                </el-form-item>
                <el-form-item label="实习经历">
                    <el-input type="textarea" v-model="recruitForm.internship" placeholder="请输入实习经历" />
                </el-form-item>
                <el-form-item label="证书技能">
                    <el-input type="textarea" v-model="recruitForm.certificatesSkills" placeholder="请输入证书和技能" />
                </el-form-item>
                <template #footer v-if="user.role === ['应聘者'] && recruitForm.resStatus === Status['审核未通过']">
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
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
const { user } = useUserStore()
const form = reactive({
    name: '',
    interviewerId: '',
    date: '',
    state: '',
});

const tableData = reactive([
    // 更新所有姓名为李华，并保留其他字段  
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },

    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },
    // ... 其他数据，同样更新姓名  
    {
        interviewNumber: '006',
        date: '2021-10-11',
        name: '李华',
        state: 'pending',
        location: '广州',
        interviewStage: 'first_round',
        interviewType: 'offline',
        interviewerId: '006',
        resumeId: 'A006',
        city: '旧金山',
        address: '旧金山市场街123号',
        zip: 'CA 94103',
        education: '硕士',
        position: '数据科学家',
    },   // ... 更多数据  
]);
// 计算属性，用于根据搜索表单筛选数据  
const filteredTableData = computed(() => {
    const { name, interviewerId, date, state } = form;
    return tableData.filter(row => {
        return (
            (!name || row.name.includes(name)) &&
            (!interviewerId || row.interviewerId.includes(interviewerId)) &&
            (!date || new Date(row.date).toDateString() === new Date(date).toDateString()) &&
            (!state || row.state === state)
        );
    });
});
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
    // 实现查看简历详情的逻辑  
    // alert(`查看简历详情: ${JSON.stringify(row)}`);查看简历
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
    // tableData.value=await 
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
    name: '',
    age: null, // 使用null表示未输入年龄
    gender: '',
    hometown: '',
    contact: '',
    education: '',
    internship: '',
    certificatesSkills: ''
})
const resumeStatus = ref();
function getStatus(row) {
    resumeStatus.value = row.resStatus;
}
async function pass(resNo, passFlag) {
    loading.value = true;
    if (user.role === Role['招聘助理']) {
        // 调用审核接口
        passFlag ? await sh({ resNo, resStatus: Status['待筛选'] }) : await sh({ resNo, resStatus: Status['审核未通过'] })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        passFlag ? await sh({ resNo, resStatus: Status['面试意愿确认'] }) : await sh({ resNo, resStatus: Status['筛选未通过'] })
    }
    tableData.value = await getData();
}
async function agree(resNo, agreeFlag) {
    loading.value = true;
    agreeFlag ? await sh({ resNo, resStatus: Status['已同意面试'] }) : await sh({ resNo, resStatus: Status['已拒绝面试'] })
    tableData.value = await getData();
}
function submit() {
    // await submitResume(recruitForm) //提交简历接口
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