
<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <div class="logo">
                    <h2 class="mb-2">人事管理系统</h2>
                </div>
                <el-menu active-text-color="#ffd04b" :router="true" :default-active="user.role===Role['应聘者']?'/directory/recruit':'/directory/attendance'" background-color="#1155bc" class="menu" router text-color="#fff">
                    <el-menu-item index="/directory/recruit" v-if="user.role===Role['应聘者']">
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>招聘信息</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/resume">
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>简历管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/interview">
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>面试管理</span>
                    </el-menu-item>
                    <!-- <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>培训管理</span>
                        </template>
                        <el-menu-item index="/directory/plan">培训计划</el-menu-item>
                        <el-menu-item index="/directory/edit">培训记录</el-menu-item>
                    </el-sub-menu> -->
                    <el-menu-item index="/directory/attendance" v-if="user.role!==Role['应聘者']">
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>假勤管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/salary">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <span>薪资管理</span>
                    </el-menu-item>
                    <el-menu-item index="/directory/userManage" v-if="user.role!==Role['系统管理员']">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <el-button type="primary" @click="attend" :disabled="disabled">签到</el-button>
                    <div class="user-info">
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
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { Role } from '@/api/user';
const { user } = useUserStore()
const disabled=ref(false);
async function attend() {
    // await // 签到接口
    disabled.value=true;
}

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

.el-header .user-info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: end;
    align-items: center;
    height: 100%;
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
</style>