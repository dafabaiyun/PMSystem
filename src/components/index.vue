<template>
    <div class="banner">
        <span>欢迎来到人事管理系统！</span>
        <h2>您当前的角色是：{{ Role[user.role] }}</h2>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { Role } from '@/api/user';

const { user } = useUserStore();
</script>

<style>
.banner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative; /* 确保伪元素相对于这个元素定位 */
    overflow: hidden;   /* 防止伪元素超出容器范围 */
    z-index: 0;         /* 确保伪元素在内容下方 */
}

.banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(/src/assets/index.webp);
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.6; /* 调整这个值来改变透明度 */
    z-index: -1;  /* 确保伪元素在内容下方 */
}

.banner > span {
    margin-bottom: 20px;
    font-size: 40px;
}

/* 如果你想要确保文本和其他内容不被透明度影响，你可以给它们设置更高的 z-index */
.banner > h2,
.banner > span {
    position: relative;
    z-index: 1;
}
</style>