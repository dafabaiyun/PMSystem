<template>
    <div>
        <div class="search" v-if="user.role===Role['人事专员']">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <!-- <el-form-item label="部门" prop="请输入部门">
                    <el-input v-model="form.recDep" />
                </el-form-item> -->
                <!-- <el-form-item label="面试阶段" prop="请输入面试阶段">
                    <el-input v-model="form.interPeriod" />
                </el-form-item> -->
                <el-form-item label="面试状态">
                    <el-select v-model="form.interStatus" placeholder="请选择面试状态">
                        <el-option label="待面试" value="1" />
                        <el-option label="未通过" value="2" />
                        <el-option label="已通过面试" value="3" />
                        <el-option label="已发录用函" value="4" />
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
                <el-table-column fixed prop="name" label="姓名" width="120" />
                <el-table-column prop="resPhone" label="面试电话" width="100" />
                <el-table-column prop="interTime" label="面试时间" width="150" />
                <el-table-column prop="interDest" label="面试地点" width="120" />
                <el-table-column prop="interPeriod" label="面试阶段" width="120">
                    <template #default="scope">
                        <span>{{ Period[scope.row.interPeriod] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interStatus" label="面试状态" width="120">
                    <template #default="scope">
                        <span>{{ InterStatus[scope.row.interStatus] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interType" label="面试类型" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="200" v-if="scope.row.interStatus===Status['已通过面试']">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="send(scope.row.interNo)">发送录用通知</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="200" v-else>
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="pass(scope.row.interNo, true)">通过</el-button>
                        <el-button type="primary" size="small" @click="pass(scope.row.interNo, false)">不通过</el-button>
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
import { Role,Period,InterStatus } from '@/api/user';
const { user } = useUserStore()
const form = reactive({
    interStatus: '',
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
const reviewOptions = ['待筛选', '审核未通过']
const selectOptions = ['面试意愿确认', '筛选未通过']

const handleDetail = (resNo: any) => {
    // 实现查看简历详情的逻辑  
    // alert(`查看简历详情: ${JSON.stringify(row)}`);查看简历
    dialogVisible.value = true;
};

const handleEdit = (row: any) => {
    // 实现修改简历的逻辑  
    // alert(`修改简历: ${JSON.stringify(row)}`);
};

async function pass(interNo, passFlag) {
    loading.value = true;
    if (user.role === Role['部门主管']) {
        // 调用审核接口
        passFlag ? await sh({ interNo, interPeriod: Period['三面'] }) : await sh({ interNo, interStatus: Status['未通过'] })
    }
    else if (user.role === Role['人事专员']) {
        // 调用筛选接口
        passFlag ? await sh({ interNo, interPeriod: Period['二面'] }) : await sh({ interNo, interStatus: Status['未通过'] })
    }
    else{
        passFlag ? await sh({ interNo, interStatus: Status['已通过面试'] }) : await sh({ interNo, interStatus: Status['未通过'] })

    }
    tableData.value = await getData();
}
const loading = ref(true);
onMounted(async () => {

    await getData();
})
async function getData() {
    const roleId = user.role;
    // await 
    loading.value = true
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
function send(interNo){
    loading.value=true;
    await sh({ interNo, interStatus: Status['已发录用函'] })
    tableData.value = await getData();
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