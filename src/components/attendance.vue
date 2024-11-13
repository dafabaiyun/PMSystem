<template>
    <div>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">  
            <el-tab-pane label="考勤记录" name="records">
        <div class="search">
            <el-form :model="searchForm" label-width="auto" style="max-width: 1200px">
                <el-form-item label="员工姓名">
                    <el-input v-model="searchForm.name" placeholder="请输入员工姓名" />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="searchForm.department" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item label="日期范围">
                    <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item class="footer">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="filteredData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="100" />
                <el-table-column prop="employeeId" label="工号" width="100" />
                <el-table-column prop="department" label="部门" width="150" />
                <el-table-column label="所属月份" width="120">
                    <template #default="scope">{{ getMonth(scope.row.date) }}</template>
                </el-table-column>
                <el-table-column prop="checkInCount" label="签到次数" width="100" />
                <el-table-column prop="lateCount" label="迟到次数" width="100" />
                <el-table-column prop="leaveEarlyCount" label="早退次数" width="100" />
                <el-table-column prop="absentCount" label="矿工次数" width="100" />
                <el-table-column prop="leaveCount" label="请假次数" width="100" />
                <el-table-column label="操作" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="showDetails(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" total="100" class="pagination" />
        </div>
    </el-tab-pane>  
      <el-tab-pane label="考勤图表" name="chart">  
        <AttendanceChart :attendanceData="chartData" />  
      </el-tab-pane>  
    </el-tabs>  
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed,ref } from 'vue';
import AttendanceChart from './AttendanceChart.vue';
const searchForm = reactive({
    name: '',
    department: '',
    dateRange: [] // 用于存储日期范围 [开始日期, 结束日期]  
});

const attendanceData = [
    // 更新数据以包含新字段，例如 employeeId, checkInCount, lateCount, etc.  
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    {
        date: '2023-10-01',
        name: '李华',
        employeeId: '001',
        department: 'HR',
        checkInCount: 5,
        lateCount: 1,
        leaveEarlyCount: 0,
        absentCount: 0,
        leaveCount: 0,
        // ... 其他字段  
    },
    // 更多数据...  
];
const activeTab = ref('records'); // 默认显示考勤记录  
 
// 辅助函数，用于从日期中提取月份  
const getMonth = (date: string) => {
    const d = new Date(date);
    const month = d.getMonth() + 1; // 月份从0开始，需要加1  
    return `${d.getFullYear()}-${month < 10 ? '0' : ''}${month}`;
};

const filteredData = computed(() => {
    const [startDate, endDate] = searchForm.dateRange || ['', ''];
    return attendanceData.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return (!searchForm.name || item.name.includes(searchForm.name)) &&
            (!searchForm.department || item.department.includes(searchForm.department)) &&
            (!startDate || new Date(itemDate) >= new Date(startDate)) &&
            (!endDate || new Date(itemDate) <= new Date(endDate));
    });
});

const searchAttendance = () => {
    // 无需额外操作，因为 filteredData 是 computed 属性  
};

const showDetails = (row: any) => {
    // 实现显示详情的逻辑，例如打开一个对话框或导航到另一个页面  
    console.log('Show details for:', row);
    // 这里可以添加打开详情页面的逻辑，例如使用 router.push  
};  
// 处理标签点击事件（可选）  
const handleTabClick = (tab: any) => {  
  console.log('Tab clicked:', tab.label);  
};  
</script>

<style scoped>
.search {
    margin-top: 20px;
}

.el-form{
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(390px,460px)) !important;
    padding: 16px;
    border-radius: 8px 0px 0px 0px;
    border-bottom: 1px solid #e8eaee;
}
.el-form-item{
    width: 340px;
}
/deep/ .el-form-item__content {
    justify-content: flex-end;

}
.is-active{

}
</style>