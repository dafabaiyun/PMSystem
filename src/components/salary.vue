<template>
    <div>
        <!-- <div class="tit">
            <h1>薪资管理</h1>
            <el-icon>
                <WalletFilled />
            </el-icon>
        </div> -->
        <div class="buttons">
            <!-- 这里可以添加一个发放所有薪资的按钮，但出于安全考虑，通常会在后端处理批量发放 -->
            <!-- <el-button type="primary" @click="distributeSalaries">发放所有薪资</el-button> -->
        </div>
        <div class="search">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="部门">
                    <el-input v-model="form.department" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item label="发放状态">
                    <el-select v-model="form.distributionStatus" placeholder="请选择发放状态">
                        <el-option label="未发放" value="pending" />
                        <el-option label="已发放" value="distributed" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-divider />
        <div class="table">
            <el-table :data="salaryData" style="width: 100%">
                <el-table-column prop="employeeName" label="员工姓名" width="120" />
                <el-table-column prop="employeeId" label="员工编号" width="120" />
                <el-table-column prop="baseSalary" label="基本工资" width="120" />
                <el-table-column prop="positionSalary" label="岗位工资" width="120" />
                <el-table-column prop="attendanceBonus" label="全勤奖金" width="120" />
                <el-table-column prop="allowance" label="津贴补贴" width="120" />
                <el-table-column prop="socialSecurity" label="社保缴纳" width="120" />
                <el-table-column prop="grossSalary" label="应发工资" width="120" />
                <el-table-column prop="distributionStatus" label="发放状态" width="120">
                    <template #default="scope">
                        <el-tag :type="scope.row.distributionStatus === 'distributed' ? 'success' : 'warning'">{{
                            scope.row.distributionStatus === 'distributed' ? '已发放' : '未发放' }}</el-tag>
                        <el-button type="text" size="small" @click="distributeSalary(scope.row)"
                            :disabled="scope.row.distributionStatus === 'distributed'">发放</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" total="100" class="pagination" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus'

// 初始化薪资数据  
const salaryData = reactive([
    {
        employeeName: '李华',
        employeeId: 'E001',
        baseSalary: 5000,
        positionSalary: 2000,
        attendanceBonus: 500,
        allowance: 1000,
        socialSecurity: 800,
        grossSalary: 9300,
        distributionStatus: 'pending', // 发放状态  
    },
    {
        employeeName: '李华',
        employeeId: 'E001',
        baseSalary: 5000,
        positionSalary: 2000,
        attendanceBonus: 500,
        allowance: 1000,
        socialSecurity: 800,
        grossSalary: 9300,
        distributionStatus: 'pending', // 发放状态  
    },
    {
        employeeName: '李华',
        employeeId: 'E001',
        baseSalary: 5000,
        positionSalary: 2000,
        attendanceBonus: 500,
        allowance: 1000,
        socialSecurity: 800,
        grossSalary: 9300,
        distributionStatus: 'pending', // 发放状态  
    },
    {
        employeeName: '李华',
        employeeId: 'E001',
        baseSalary: 5000,
        positionSalary: 2000,
        attendanceBonus: 500,
        allowance: 1000,
        socialSecurity: 800,
        grossSalary: 9300,
        distributionStatus: 'pending', // 发放状态  
    },
    {
        employeeName: '李华',
        employeeId: 'E001',
        baseSalary: 5000,
        positionSalary: 2000,
        attendanceBonus: 500,
        allowance: 1000,
        socialSecurity: 800,
        grossSalary: 9300,
        distributionStatus: 'pending', // 发放状态  
    },
    {
        employeeName: '乐乐',
        employeeId: 'E002',
        baseSalary: 6000,
        positionSalary: 2500,
        attendanceBonus: 500,
        allowance: 1200,
        socialSecurity: 900,
        grossSalary: 11100,
        distributionStatus: 'pending', // 发放状态  
    },
    // 继续添加...  
]);

// 搜索筛选表单的数据模型  
const form = reactive({
    department: '',
    distributionStatus: '',
});

// 筛选薪资数据的函数  
function filterSalaries() {
    // 这里应该实现筛选逻辑，但由于示例简单，我们直接清空筛选条件  
    // 在实际应用中，你应该根据form中的值来过滤salaryData  
    // 例如：salaryData = salaryData.filter(salary => salary.department.includes(form.department) && salary.distributionStatus === form.distributionStatus);  
    // 注意：上面的代码片段仅作为示例，实际使用时需要根据你的数据结构进行调整  
    // 出于简化考虑，我们这里不实现真正的筛选逻辑  
}

// 发放薪资的函数  
function distributeSalary(salaryRow: { distributionStatus: string }) {
    if (salaryRow.distributionStatus === 'pending') {
        salaryRow.distributionStatus = 'distributed';
        // 在这里可以添加发放薪资的逻辑，比如调用API更新数据库中的记录  
        // 注意：这里的修改是本地的，不会反映到服务器上，除非你实现了相应的后端逻辑  
    }
    ElMessage({
        message: '薪资已发放',
        type: 'success',
    })
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
/deep/ .el-form-item__label-wrap{
    margin-left: 0;
}
</style>