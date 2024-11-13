<template>
    <div>
        <!-- <div class="search">
            <el-form :model="form" label-width="auto">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="form.department" placeholder="请输入部门" />
                </el-form-item>
                <el-form-item class="footer">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <!-- <div class="buttons">
            <el-button type="primary" @click="createUser">添加用户</el-button>
        </div> -->
        <div class="table">
            <el-table :data="tableData" style="width: 100%" v-loading="load">
                <el-table-column prop="userid" label="账号" width="120" />
                <el-table-column prop="sname" label="姓名" width="120" />
                <el-table-column prop="sdep" label="所属部门" width="150">
                    <template #default="scope">
                        {{ scope.row.sdep || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sphone" label="联系电话" width="150">
                    <template #default="scope">
                        {{ scope.row.sphone || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sentryDate" label="入职日期" width="150">
                    <template #default="scope">
                        {{ scope.row.sentryDate || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="角色" width="280">
                    <template #default="scope">
                        <div>
                            <el-tag v-for="item in scope.row.roleList" :key="item" :disable-transitions="false">
                                {{ Role[item] }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="250">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="addRole(scope.row)">增加角色</el-button>

                        <el-button type="primary" size="small" @click="deleteRole(scope.row)">删除角色</el-button>

                        <el-button type="primary" size="small" @click="deleteUser(scope.row)">删除该用户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="100" class="pagination" />
        </div>
        <el-dialog v-model="edit.addRoleVisible" title="添加角色" width="450">
            <el-select v-model="edit.addRoleList" multiple placeholder="请选择要添加的角色" style="width: 240px">
                <el-option v-for="item in edit.addRoleOptions" :key="item.roleId" :label="item.roleName"
                    :value="item.roleId" />
            </el-select>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel()">取消</el-button>
                    <el-button type="primary" @click="confirmAddRole()">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="edit.deleteRoleVisible" title="删除角色" width="450">
            <el-select v-model="edit.deleteRoleList" multiple placeholder="请选择要添加的角色" style="width: 240px">
                <el-option v-for="item in edit.deleteRoleOptions" :key="item.roleId" :label="item.roleName"
                    :value="item.roleId" />
            </el-select>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel()">取消</el-button>
                    <el-button type="primary" @click="confirmDeleteRole()">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        
        <el-dialog v-model="deleteUserVisible" title="" width="300" class="deleteUser">
            <span style="font-size: 16px;text-align: center;">你确认删除该用户吗?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelDelete()">取消</el-button>
                    <el-button type="primary" @click="confirmDeleteUser()">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { addUserRole, deleteUserByUserid, deleteUserRole, Role, showAllUsers } from '@/api/user';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElInput } from 'element-plus'
import type { InputInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const load = ref(false)

const form = reactive({
    name: '',
    department: '',
})
const tableData = ref([])
function editUserRole() {
    return {
        editUser: '',
        deleteRoleVisible: false,
        addRoleVisible: false,
        addRoleList: [],
        deleteRoleList: [],
        addRoleOptions: [] as Array<{
            roleId: number,
            roleName: string
        }>,
        deleteRoleOptions: [] as Array<{
            roleId: number,
            roleName: string
        }>
    }
}
const edit = reactive({
    ...editUserRole()
})

onMounted(async () => {
    await fetchData();
})

function createUser() {

}
async function fetchData() {
    load.value = true;
    tableData.value = await showAllUsers();
    load.value = false;

}
function search() {

}
async function reset() {
    form.name = '';
    form.department = '';
    await fetchData();
}
const roleOptions = [
    { roleId: 0, roleName: "系统管理员" },
    { roleId: 1, roleName: "员工" },
    { roleId: 2, roleName: "人事专员" },
    { roleId: 3, roleName: "财政专员" },
    { roleId: 4, roleName: "技术部主管" },
    { roleId: 5, roleName: "人事经理" },
    { roleId: 6, roleName: "招聘助理" },
    { roleId: 7, roleName: "应聘者" },
]
const dynamicTags = ref([] as Array<{
    roleId: string,
    roleName: string
}>);
function addRole(row) {
    // 编辑逻辑
    // dynamicTags.value = roleList;
    const { roleList, userid } = row;
    edit.editUser = userid;
    edit.addRoleOptions = roleOptions.filter(item => !roleList.includes(item.roleId));
    edit.addRoleVisible = true;
}
async function confirmAddRole() {
    const res = await addUserRole({
        userid: edit.editUser,
        roleList: edit.addRoleList
    });
    if (res.success) {
        ElMessage({
            message: '添加成功！',
            type: 'success',
        })
        await fetchData()
    }
    else {
        ElMessage({
            message: '添加失败！请重试',
            type: 'error',
        })
    }
    cancel();
}
function deleteRole(row) {
    const { roleList, userid } = row
    edit.editUser = userid
    edit.deleteRoleOptions = roleOptions.filter(item => roleList.includes(item.roleId));
    edit.deleteRoleVisible = true;
}
const deleteUserVisible=ref(false);
const deletedUser=ref({} as {userid:string})
async function confirmDeleteRole() {
    const res = await deleteUserRole({
        userid: edit.editUser,
        roleList: edit.deleteRoleList
    });
    if (res.success) {
        ElMessage({
            message: '删除成功！',
            type: 'success',
        })
        
        await fetchData()
    }
    else {
        ElMessage({
            message: '删除失败！请重试',
            type: 'error',
        })
    }
    cancel();
}
function deleteUser(row){
    const {userid}=row;
    deletedUser.value=userid
    deleteUserVisible.value=true;
}
function cancelDelete(){
    deleteUserVisible.value=false;

}
async function confirmDeleteUser(){
    const res=await deleteUserByUserid(deletedUser.value)
    console.log('deleteUSer:'+JSON.stringify(res));
    
    if (res.success) {
        ElMessage({
            message: '删除成功！',
            type: 'success',
        })
        await fetchData()
    }
    else {
        ElMessage({
            message: '删除失败！请重试',
            type: 'error',
        })
    }
    deleteUserVisible.value=false;
}
function cancel() {
    Object.assign(edit, editUserRole()); // 重置 userEdit 对象
    console.log('edd:' + JSON.stringify(edit));

}

</script>

<style scoped>
.search {
    margin-bottom: 20px;
}

.pagination {
    text-align: right;
    margin-top: 20px;
    float: right;
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

.footer {
    width: 340px;
    display: flex;
    justify-content: flex-end;
    grid-column-end: -1;
}

/deep/ .el-table__cell {
    text-align: center;
}

/deep/ .el-button--small {
    margin-left: 4px;
    width: auto;
    padding: 3px;
}
.el-tag{
    margin-right: 2px;
}
/deep/ .deleteUser .el-dialog__body{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
</style>