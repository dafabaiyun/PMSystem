<template>
    <div>
        <el-container>
            <el-aside width="200px" class="aside">
                <div class="logo">
                    <h2 class="mb-2">人事管理系统</h2>
                </div>
                <el-menu active-text-color="#ffd04b" :router="true"
                    :default-active="$route.path"
                    background-color="#1155bc" class="menu" router text-color="#fff">
                    <el-menu-item index="/directory/index">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/recruit" v-if="user.role === Role['应聘者']">
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>招聘信息</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/resume" v-if="user.role === Role['应聘者']||user.role === Role['招聘助理']||user.role === Role['人事专员']">
                        <el-icon>
                            <Collection />
                        </el-icon>
                        <span>简历管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/interview" v-if="user.role === Role['技术部主管']||user.role === Role['人事经理']||user.role === Role['人事专员']">
                        <el-icon>
                            <Message />
                        </el-icon>
                        <span>面试管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/staffLeave"  v-if="user.role === Role['员工']||user.role === Role['技术部主管']||user.role === Role['人事专员']">
                        <el-icon>
                            <Watch />
                        </el-icon>
                        <span>请假管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/salary"  v-if="user.role === Role['员工']||user.role === Role['财政专员']||user.role === Role['人事专员']">
                        <el-icon>
                            <Money />
                        </el-icon>
                        <span>薪资管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/userManage" v-if="user.role === Role['系统管理员']">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="left">
                        <el-button type="primary" @click="attend" :disabled="disabled" v-if="user.role!==Role['应聘者']">签到</el-button>
                        <span class="roleName">当前角色：{{ Role[user.role] }}</span>
                    </div>
                    <div class="right">

                        <img src="../assets/index.webp" alt="用户头像" class="avatar">
                        <span class="name">用户名称</span>
                    </div>
                </el-header>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { Role } from '@/api/user';
import { insertAttend } from '@/api/salary';
import { ElMessage } from 'element-plus'

const { user } = useUserStore()
const disabled = ref(false);
async function attend() {
    console.log(attendDate.value,signIn.value);
    
    const res = await insertAttend({
        sno: user.userid,
        attendDate:attendDate.value,
        signIn:signIn.value,
    }) // 签到接口

    if (res.success) {
        ElMessage({
            message: '签到成功！',
            type: 'success',
        });

        disabled.value = true;
    } else {
        ElMessage({
            message: res.errMsg||'签到失败！请重试',
            type: 'error',
        });
    }
}
const attendDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并确保是两位数
    const day = String(now.getDate()).padStart(2, '0'); // 确保是两位数
    return `${year}-${month}-${day}`;
})
const signIn = computed(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // 确保是两位数
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 确保是两位数
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 确保是两位数
    return `${hours}:${minutes}:${seconds}`;
})
</script>

<style scoped>
.logo {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    background-color: #1d69db;
}

.menu {
    height: 100vh;
}

.el-header {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
}

.right {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.el-header .avatar {
    width: 40px;
    /* 根据需要调整头像大小 */
    height: 40px;
    border-radius: 50%;
    /* 圆形头像 */
    margin-right: 10px;
    /* 头像和名称之间的间距 */
}

.el-header .name {
    font-size: 16px;
    /* 根据需要调整名称字体大小 */
    color: #000;
    /* 根据需要调整名称颜色 */
}

/deep/ .el-main {
    background-color: #f5f6f7;
}

/deep/ .el-menu-item.is-active {
    background-color: #0e4496;
}

.roleName {
    margin: 0 10px;
}
.aside{
    height: 100%;
}
</style>