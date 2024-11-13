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
            <el-table :data="filteredTableData" style="width: 100%">
                <el-table-column fixed prop="name" label="姓名" width="120" />
                <el-table-column prop="interviewNumber" label="面试编号" width="100" />
                <el-table-column prop="date" label="面试日期" width="150" />
                <el-table-column prop="location" label="面试地点" width="120" />
                <el-table-column prop="education" label="最高学历" width="120">
                    <template #default="scope">
                        <el-input v-model="scope.row.education" size="small" placeholder="请输入学历" readonly />
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="应聘岗位" width="150">
                    <template #default="scope">
                        <el-input v-model="scope.row.position" size="small" placeholder="请输入岗位" readonly />
                    </template>
                </el-table-column>
                <el-table-column prop="interviewStage" label="面试阶段" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.interviewStage" placeholder="请选择面试阶段" size="small" disabled>
                            <el-option label="初试" value="first_round" />
                            <el-option label="复试" value="second_round" />
                            <el-option label="终试" value="final_round" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="面试状态" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.state" placeholder="请选择面试状态" size="small" disabled>
                            <el-option label="待面试" value="pending" />
                            <el-option label="面试中" value="in_progress" />
                            <el-option label="已通过" value="passed" />
                            <el-option label="未通过" value="failed" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="interviewType" label="面试类型" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.interviewType" placeholder="请选择面试类型" size="small" disabled>
                            <el-option label="线下面试" value="offline" />
                            <el-option label="视频面试" value="video" />
                            <el-option label="电话面试" value="phone" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="interviewerId" label="面试官编号" width="120" />
                <el-table-column prop="resumeId" label="简历编号" width="120" />
                <el-table-column prop="city" label="城市" width="120" />
                <el-table-column prop="address" label="地址" width="600" />
                <el-table-column prop="zip" label="邮编" width="120" />
                <el-table-column fixed="right" label="操作" min-width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看简历</el-button>
                        <!-- <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="filteredTableData.length" class="pagination" />
        </div>
        
        <el-dialog v-model="dialogVisible" title="简历信息" width="500" :before-close="CloseDialog">
            <el-form :model="recruitForm" disabled label-width="80px" style="max-width: 1200px" class="resumeDialog">
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
                    <el-input v-model="recruitForm.hometown"  placeholder="请输入籍贯"/>
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
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, ref } from 'vue';

import { useUserStore } from '../stores/user';
import { Role } from '@/api/user';
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
const reviewOptions=['待筛选','审核未通过']
const selectOptions=['面试意愿确认','筛选未通过']

const handleDetail = (row: any) => {
    // 实现查看简历详情的逻辑  
    // alert(`查看简历详情: ${JSON.stringify(row)}`);查看简历
    dialogVisible.value = true;
};

const handleEdit = (row: any) => {
    // 实现修改简历的逻辑  
    // alert(`修改简历: ${JSON.stringify(row)}`);
};
const loading=ref(true);
onMounted(async() => {

    await getData();
})
async function getData() {
    const roleId=user.role;
    // await 
    loading.value=true
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
/deep/ .resumeDialog .el-form-item__content{
  width: 100%;
}
/deep/ .el-dialog__footer{
    padding-top: 0;
}
/deep/ .el-form-item{
    width: 100%;
}
</style>